const axios = require("axios");
const cheerio = require("cheerio");
const { scrapSteamProfile } = require("./modules/steamScraper");
const { supabase } = require("./modules/supabBaseConnect");
const Bottleneck = require("bottleneck");
require("dotenv").config();

// Gestion des arguments de ligne de commande
const DEBUG_MODE = process.argv.includes("--debug");

// Nouveaux arguments pour personnaliser les performances
const PERFORMANCE_MODE = process.argv.includes("--performance");
const ULTRA_MODE = process.argv.includes("--ultra");
const LOW_MEMORY_MODE = process.argv.includes("--low-memory");
const WORKERS = parseInt(
  process.argv.find((arg) => arg.startsWith("--workers="))?.split("=")[1] ||
    "1",
  10
);

// Constants avec ajustement dynamique selon les modes
const CONSTANTS = {
  DAILY_LIMIT: ULTRA_MODE ? 200000 : PERFORMANCE_MODE ? 100000 : 40000,
  DAY_IN_MS: 24 * 60 * 60 * 1000,
  MAX_CACHE_SIZE: LOW_MEMORY_MODE ? 50000 : ULTRA_MODE ? 500000 : 250000,
  RATE_LIMIT_CACHE_DURATION: ULTRA_MODE ? 90000 : 120000,
  BATCH_SIZE: {
    PROFILES: ULTRA_MODE ? 150 : PERFORMANCE_MODE ? 100 : 50,
    DB_INSERT: ULTRA_MODE ? 300 : PERFORMANCE_MODE ? 200 : 100,
  },
  RETRY: {
    MAX_ATTEMPTS: 3,
    BASE_DELAY: ULTRA_MODE ? 1000 : PERFORMANCE_MODE ? 1500 : 2000,
  },
  HTTP: {
    TIMEOUT: ULTRA_MODE ? 6000 : PERFORMANCE_MODE ? 8000 : 10000,
    MAX_REDIRECTS: 5,
  },
  COLORS: {
    ERROR: "\x1b[41m\x1b[1m",
    WARNING: "\x1b[43m\x1b[1m",
    SUCCESS: "\x1b[42m\x1b[1m",
    INFO: "\x1b[45m\x1b[1m",
    RESET: "\x1b[0m",
  },
};

// Utilitaires de logging
const Logger = {
  error: (message, ...args) =>
    console.error(
      `${CONSTANTS.COLORS.ERROR}ERROR${CONSTANTS.COLORS.RESET}: ${message}`,
      ...args
    ),
  warning: (message, ...args) =>
    console.log(
      `${CONSTANTS.COLORS.WARNING}WARNING${CONSTANTS.COLORS.RESET}: ${message}`,
      ...args
    ),
  success: (message, ...args) =>
    console.log(
      `${CONSTANTS.COLORS.SUCCESS}SUCCESS${CONSTANTS.COLORS.RESET}: ${message}`,
      ...args
    ),
  info: (message, ...args) =>
    console.log(
      `${CONSTANTS.COLORS.INFO}INFO${CONSTANTS.COLORS.RESET}: ${message}`,
      ...args
    ),
  debug: (...args) =>
    DEBUG_MODE &&
    console.log(
      `${CONSTANTS.COLORS.WARNING}DEBUG${CONSTANTS.COLORS.RESET}:`,
      ...args
    ),
};

// Configuration HTTP
const HTTP_CONFIG = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
    "Accept-Encoding": "gzip, deflate, br",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Connection: "keep-alive",
    DNT: "1",
  },
  timeout: CONSTANTS.HTTP.TIMEOUT,
  maxRedirects: CONSTANTS.HTTP.MAX_REDIRECTS,
  validateStatus: (status) => status < 500,
  decompress: true,
};

// Configuration de Bottleneck optimisée basée sur le mode
const limiter = new Bottleneck({
  maxConcurrent: ULTRA_MODE ? 1000 : PERFORMANCE_MODE ? 750 : 500,
  minTime: ULTRA_MODE ? 1 : PERFORMANCE_MODE ? 2 : 5,
  reservoir: ULTRA_MODE ? 10000 : PERFORMANCE_MODE ? 7500 : 5000,
  reservoirRefreshAmount: ULTRA_MODE ? 10000 : PERFORMANCE_MODE ? 7500 : 5000,
  reservoirRefreshInterval: ULTRA_MODE
    ? 5 * 1000
    : PERFORMANCE_MODE
    ? 8 * 1000
    : 10 * 1000,
});

// Gestionnaire d'état global
const State = {
  stats: {
    totalProfiles: 0,
    processedProfiles: 0,
    bannedProfiles: 0,
    queueSize: 0,
    startTime: Date.now(),
    lastUpdateTime: Date.now(),
    rateLimit403: 0,
    errors: 0,
    currentBatch: 0,
    debugMode: DEBUG_MODE,
    dailyProcessed: 0,
    lastDayReset: Date.now(),
  },
  cache: {
    processedProfiles: new Set(),
    rateLimit: new Map(),
  },
};

// Utilitaires de validation
const Validator = {
  isSteam64Id: (id) => /^\d{17}$/.test(id),
  isValidUrl: (url) => url && typeof url === "string" && url.trim().length > 0,
  cleanUrl: (url) => url.trim().replace(/\/$/, ""),
};

// Gestionnaire de base de données
const DbManager = {
  updateProfileStatus: async (url, status) => {
    try {
      const { error } = await supabase
        .from("profil")
        .update({ status })
        .eq("url", url);

      if (error) {
        Logger.error(`Failed to update profile status to ${status}:`, error);
      } else {
        if (status === "done") {
          Logger.success(`Profile marked as completed: ${url}`);
        }
      }
    } catch (error) {
      Logger.error(`Failed to update profile status to ${status}:`, error);
    }
  },

  insertProfiles: async (profiles) => {
    const batchSize = CONSTANTS.BATCH_SIZE.DB_INSERT;
    for (let i = 0; i < profiles.length; i += batchSize) {
      const batch = profiles.slice(i, i + batchSize);
      const { error } = await supabase.from("profil").insert(batch);

      if (error) {
        Logger.error("Failed to insert profiles:", error);
        State.stats.errors++;
        continue;
      }

      State.stats.processedProfiles += batch.length;
      State.stats.dailyProcessed += batch.length;

      batch.forEach((profile) => {
        if (profile.ban) {
          State.stats.bannedProfiles++;
          Logger.success(
            `Found banned profile ${profile.url}\n` +
              `Name: ${profile.steam_name}\n` +
              `Ban Type: ${profile.ban_type || "unknown"}\n` +
              `Ban Date: ${profile.ban_date || "N/A"}`
          );
        } else {
          Logger.debug(`Successfully added profile: ${profile.url}`);
        }
      });
    }
  },

  getFirstPendingProfile: async () => {
    try {
      const { data: pendingProfile, error } = await supabase
        .from("profil")
        .select("*")
        .eq("status", "pending")
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") {
        Logger.error("Failed to get pending profile:", error);
        return null;
      }

      if (!pendingProfile) {
        Logger.info("No pending profiles found.");
        return null;
      }

      return pendingProfile.url;
    } catch (error) {
      Logger.error("Failed to get pending profile:", error);
      return null;
    }
  },

  checkProfileExists: async (urls) => {
    try {
      const batchSize = 500;
      const existingUrls = new Set();

      for (let i = 0; i < urls.length; i += batchSize) {
        const batch = urls.slice(i, i + batchSize);
        const { data: existingProfiles, error } = await supabase
          .from("profil")
          .select("url")
          .in("url", batch);

        if (error) {
          Logger.error("Failed to check profiles:", error);
          continue;
        }

        existingProfiles?.forEach((p) => existingUrls.add(p.url));
      }

      return existingUrls;
    } catch (error) {
      Logger.error("Failed to check profiles:", error);
      return new Set();
    }
  },
};

// Gestionnaire de requêtes HTTP
const HttpClient = {
  async makeRequest(url, options = {}) {
    const lastError = State.cache.rateLimit.get(url);
    if (
      lastError &&
      Date.now() - lastError < CONSTANTS.RATE_LIMIT_CACHE_DURATION
    ) {
      return null;
    }

    try {
      const config = {
        ...HTTP_CONFIG,
        ...options,
        headers: { ...HTTP_CONFIG.headers, ...options.headers },
      };

      const response = await retryWithBackoff(() =>
        limiter.schedule(() => axios.get(url, config))
      );

      if (!response.data) {
        throw new Error("Empty response received");
      }

      return response;
    } catch (error) {
      this.handleRequestError(url, error);
      throw error;
    }
  },

  handleRequestError(url, error) {
    if (error.response) {
      const status = error.response.status;
      if (status === 403 || status === 429) {
        State.cache.rateLimit.set(url, Date.now());
        Logger.warning(`Rate limit reached: ${url} (${status})`);
      } else if (status === 404) {
        Logger.warning(`Not found: ${url}`);
      } else if (status >= 500) {
        Logger.error(`Server error: ${url} (${status})`);
      }
    } else if (error.code) {
      Logger.error(`Network error: ${url} (${error.code})`);
    }
    State.stats.errors++;
  },
};

// Fonction de log conditionnelle
function debugLog(...args) {
  if (DEBUG_MODE) {
    console.log("\x1b[43m\x1b[1mDEBUG\x1b[0m:", ...args);
  }
}

// Optimisation de la fonction convertToSteam64Url avec un cache
const urlConversionCache = new Map();

async function convertToSteam64Url(url) {
  try {
    url = Validator.cleanUrl(url);

    // Vérifier dans le cache
    if (urlConversionCache.has(url)) {
      return urlConversionCache.get(url);
    }

    // Détection directe des URLs de profil (optimisation)
    if (url.includes("/profiles/")) {
      const steam64Match = url.match(/\/profiles\/(\d{17})/);
      if (steam64Match && Validator.isSteam64Id(steam64Match[1])) {
        const result = `https://steamcommunity.com/profiles/${steam64Match[1]}`;
        urlConversionCache.set(url, result);
        return result;
      }
    }

    // Reste de la fonction inchangé...
    const response = await HttpClient.makeRequest(url);
    if (!response) throw new Error("Failed to fetch profile page");

    const $ = cheerio.load(response.data);

    // Méthode 1: data-steamid attribute
    let steamId = $("[data-steamid]").attr("data-steamid");

    // Méthode 2: recherche dans les scripts (plus fiable que miniprofile)
    if (!steamId) {
      const scripts = $("script")
        .map((_, el) => $(el).html())
        .get();
      for (const script of scripts) {
        const match = script.match(
          /g_steamID\s*=\s*"(\d{17})"|steamid"\s*:\s*"(\d{17})"|"steamid":(\d{17})|profileID=(\d{17})/
        );
        if (match) {
          steamId = match[1] || match[2] || match[3] || match[4];
          break;
        }
      }
    }

    // Méthode 3: recherche dans les liens de profil
    if (!steamId) {
      const profileLinks = $('a[href*="/profiles/"]')
        .map((_, el) => $(el).attr("href"))
        .get();
      for (const link of profileLinks) {
        const match = link.match(/\/profiles\/(\d{17})/);
        if (match && match[1].length === 17) {
          steamId = match[1];
          break;
        }
      }
    }

    // Méthode 4: miniprofile attribute
    if (!steamId) {
      const miniProfile = $("[data-miniprofile]").attr("data-miniprofile");
      if (miniProfile) {
        try {
          const apiUrl = `https://steamcommunity.com/miniprofile/${miniProfile}/json`;
          const response = await HttpClient.makeRequest(apiUrl);
          if (response?.data?.steamid) {
            steamId = response.data.steamid;
          }
        } catch (error) {
          Logger.debug(
            `Miniprofile fetch failed for ${miniProfile}:`,
            error.message
          );
        }
      }
    }

    // Méthode 5: API Steam
    if (!steamId && process.env.STEAM_API_KEY && url.includes("/id/")) {
      const vanityUrl = url.split("/id/")[1].split("/")[0];
      if (vanityUrl) {
        try {
          const apiUrl = `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${process.env.STEAM_API_KEY}&vanityurl=${vanityUrl}`;
          const apiResponse = await HttpClient.makeRequest(apiUrl);
          if (apiResponse?.data?.response?.success === 1) {
            steamId = apiResponse.data.response.steamid;
          }
        } catch (error) {
          Logger.debug(`Steam API error for ${vanityUrl}:`, error.message);
        }
      }
    }

    // Vérification finale du Steam64 ID
    if (steamId && /^\d{17}$/.test(steamId)) {
      const result = `https://steamcommunity.com/profiles/${steamId}`;
      // Stocker dans le cache
      urlConversionCache.set(url, result);
      return result;
    }

    throw new Error("Could not find valid Steam64 ID");
  } catch (error) {
    // Gestion spécifique des erreurs
    if (error.response?.status === 500) {
      console.error(
        `\x1b[41m\x1b[1mSERVER ERROR\x1b[0m: ${url} - Retrying with alternative methods...`
      );
      // On pourrait ajouter ici des méthodes alternatives de récupération
    }

    console.error(
      `\x1b[41m\x1b[1mERROR\x1b[0m: Failed to convert URL ${url}:`,
      error.message
    );
    throw error;
  }
}

// Gérer la taille du cache d'URL
function cleanUrlCache() {
  if (urlConversionCache.size > 10000) {
    const keysToDelete = Array.from(urlConversionCache.keys()).slice(0, 2000);
    keysToDelete.forEach((key) => urlConversionCache.delete(key));
  }
}

// Nettoyer le cache périodiquement
setInterval(cleanUrlCache, 30 * 60 * 1000); // Toutes les 30 minutes

// Fonction pour vérifier et réinitialiser le compteur quotidien
function checkDailyLimit() {
  const now = Date.now();

  // Réinitialiser le compteur si on est le lendemain
  if (now - State.stats.lastDayReset >= CONSTANTS.DAY_IN_MS) {
    State.stats.dailyProcessed = 0;
    State.stats.lastDayReset = now;
    debugLog("Daily counter reset");
  }

  // Vérifier si on a atteint la limite
  if (State.stats.dailyProcessed >= CONSTANTS.DAILY_LIMIT) {
    debugLog("Daily limit reached, waiting for reset");
    return false;
  }

  return true;
}

// Fonction pour mettre à jour l'interface console
function updateConsole() {
  const now = Date.now();
  if (now - State.stats.lastUpdateTime < 2000) return;

  const runTime = Math.floor((now - State.stats.startTime) / 1000);
  const profilesPerSecond = State.stats.processedProfiles / runTime;
  const remainingProfiles =
    State.stats.totalProfiles - State.stats.processedProfiles;
  const estimatedTimeRemaining = Math.floor(
    remainingProfiles / profilesPerSecond
  );
  const timeToReset = CONSTANTS.DAY_IN_MS - (now - State.stats.lastDayReset);
  const remainingDaily = CONSTANTS.DAILY_LIMIT - State.stats.dailyProcessed;

  // Effacer la console
  console.clear();

  // Afficher le header
  console.log(
    "\x1b[45m\x1b[1m=== STEAM BAN TRACKER - CRAWLER STATUS ===\x1b[0m"
  );

  // Afficher les statistiques sur une seule ligne
  console.log(
    `\x1b[36mQueue:\x1b[0m ${State.stats.queueSize} | ` +
      `\x1b[36mProcessed:\x1b[0m ${State.stats.processedProfiles}/${State.stats.totalProfiles} | ` +
      `\x1b[36mBanned:\x1b[0m ${State.stats.bannedProfiles} | ` +
      `\x1b[36mBatch:\x1b[0m ${State.stats.currentBatch}`
  );

  // Afficher les limites quotidiennes sur une ligne
  console.log(
    `\x1b[36mDaily:\x1b[0m ${State.stats.dailyProcessed}/${CONSTANTS.DAILY_LIMIT} | ` +
      `\x1b[36mRemaining:\x1b[0m ${remainingDaily} | ` +
      `\x1b[36mReset in:\x1b[0m ${formatTime(Math.floor(timeToReset / 1000))}`
  );

  // Afficher les performances sur une ligne
  console.log(
    `\x1b[36mSpeed:\x1b[0m ${profilesPerSecond.toFixed(2)}/s | ` +
      `\x1b[36mRuntime:\x1b[0m ${formatTime(runTime)} | ` +
      `\x1b[36mETA:\x1b[0m ${formatTime(estimatedTimeRemaining)}`
  );

  // Afficher les erreurs sur une ligne
  console.log(
    `\x1b[36m403s:\x1b[0m ${State.stats.rateLimit403} | ` +
      `\x1b[36mErrors:\x1b[0m ${State.stats.errors} | ` +
      `\x1b[36mDebug:\x1b[0m ${DEBUG_MODE ? "ON" : "OFF"}`
  );

  State.stats.lastUpdateTime = now;
}

// Fonction pour formater le temps en heures:minutes:secondes
function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "∞";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours}h ${minutes}m ${secs}s`;
}

// Mettre à jour la console toutes les 2 secondes
setInterval(updateConsole, 2000);

// Fonction de retry optimisée avec meilleure gestion des erreurs
const retryWithBackoff = async (fn, retries = 3, baseDelay = 2000) => {
  let lastError;

  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Gérer différents types d'erreurs
      if (error.response) {
        const status = error.response.status;

        // Ne pas retenter pour certains codes d'erreur
        if (status === 404) {
          throw new Error("Profile not found");
        }

        // Attendre plus longtemps pour les erreurs de rate limit
        if (status === 403 || status === 429) {
          State.stats.rateLimit403++;
          const delay = baseDelay * Math.pow(2, i) + Math.random() * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        // Retenter pour les erreurs serveur
        if (status >= 500) {
          const delay = baseDelay * Math.pow(1.5, i) + Math.random() * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
      }

      // Retenter pour les erreurs réseau
      if (
        error.code === "ECONNRESET" ||
        error.code === "ETIMEDOUT" ||
        error.code === "ECONNABORTED"
      ) {
        const delay = baseDelay * Math.pow(1.5, i) + Math.random() * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      // Pour les autres erreurs, ne pas retenter
      throw error;
    }
  }

  throw lastError;
};

// Amélioration de la fonction fetchSteamFriends avec une meilleure récupération des données
async function fetchSteamFriends(profileUrl) {
  try {
    if (!Validator.isValidUrl(profileUrl)) {
      throw new Error("Invalid profile URL");
    }

    let steam64Url;
    try {
      steam64Url = await convertToSteam64Url(profileUrl);
    } catch (error) {
      Logger.error(`Failed to convert URL ${profileUrl}:`, error.message);
      return [];
    }

    const friendsUrl = `${steam64Url}/friends/`;
    Logger.debug(`Fetching friends from ${friendsUrl}`);

    const response = await HttpClient.makeRequest(friendsUrl);
    if (!response) return [];

    const $ = cheerio.load(response.data);
    const contacts = new Set();

    // Nouvelle méthode plus rapide: recherche directe d'attributs
    $('a[href*="/profiles/"], a[href*="/id/"]').each((_, element) => {
      let contactUrl = $(element).attr("href");
      if (!contactUrl) return;

      // Nettoyage de l'URL
      contactUrl = contactUrl.trim().replace(/\/$/, "");

      if (contactUrl && !State.cache.processedProfiles.has(contactUrl)) {
        contacts.add(contactUrl);
        State.stats.totalProfiles++;
      }
    });

    return Array.from(contacts);
  } catch (error) {
    State.stats.errors++;
    debugLog(`Error fetching friends:`, error.message);
    return [];
  }
}

// Fonction pour marquer un profil comme "in progress"
async function markProfileAsInProgress(profileUrl) {
  await DbManager.updateProfileStatus(profileUrl, "in_progress");
}

// Fonction pour marquer un profil comme terminé
async function markProfileAsDone(profileUrl) {
  await DbManager.updateProfileStatus(profileUrl, "done");
}

// Optimisation du traitement des profils avec meilleure parallélisation
async function crawlProfile(profileUrl) {
  try {
    debugLog(`Starting to crawl profile: ${profileUrl}`);
    await markProfileAsInProgress(profileUrl);
    const contacts = await fetchSteamFriends(profileUrl);
    State.stats.queueSize = contacts.length;
    debugLog(`Found ${contacts.length} contacts to process`);

    // Traitement par lots avec concurrence améliorée
    const batchSize = CONSTANTS.BATCH_SIZE.PROFILES;
    const batchPromises = [];

    for (let i = 0; i < contacts.length; i += batchSize) {
      State.stats.currentBatch = Math.floor(i / batchSize) + 1;
      const batch = contacts.slice(i, i + batchSize);
      debugLog(
        `Processing batch ${State.stats.currentBatch} (${batch.length} contacts)`
      );

      // Ajouter à la queue de promesses au lieu d'attendre
      batchPromises.push(addContacts(batch));

      // Gérer la mémoire en ne démarrant pas trop de lots en même temps
      if (batchPromises.length >= 5) {
        await Promise.all(batchPromises);
        batchPromises.length = 0;
      }
    }

    // Attendre les derniers lots en cours
    if (batchPromises.length > 0) {
      await Promise.all(batchPromises);
    }

    await markProfileAsDone(profileUrl);
    debugLog(`Profile completed: ${profileUrl}`);
    await crawlFirstPendingProfile();
  } catch (error) {
    State.stats.errors++;
    debugLog(`Error crawling profile:`, error.message);
  }
}

// Optimisation de l'ajout de contact avec traitement par lots
async function addContacts(contactUrls) {
  // Vérifier la limite quotidienne
  if (!checkDailyLimit()) {
    debugLog(`Daily limit reached, skipping batch`);
    return;
  }

  // Validation des URLs en entrée
  if (!Array.isArray(contactUrls) || contactUrls.length === 0) {
    debugLog("No valid contact URLs provided");
    return;
  }

  // Filtrer les URLs déjà traitées et invalides
  const newUrls = contactUrls.filter(
    (url) =>
      url && typeof url === "string" && !State.cache.processedProfiles.has(url)
  );

  if (newUrls.length === 0) return;

  // Ajouter les URLs au cache traité
  newUrls.forEach((url) => {
    State.cache.processedProfiles.add(url);
    if (State.cache.processedProfiles.size > CONSTANTS.MAX_CACHE_SIZE) {
      const iterator = State.cache.processedProfiles.values();
      for (let i = 0; i < 1000; i++) {
        State.cache.processedProfiles.delete(iterator.next().value);
      }
    }
  });

  try {
    // Convertir les URLs en Steam64 avec traitement par lots pour plus de performance
    const batchSize = 50; // Convertir 50 URLs à la fois
    const steam64Urls = [];

    for (let i = 0; i < newUrls.length; i += batchSize) {
      const urlBatch = newUrls.slice(i, i + batchSize);
      const steam64UrlsResults = await Promise.allSettled(
        urlBatch.map((url) => convertToSteam64Url(url))
      );

      // Traiter les résultats de ce lot
      steam64Urls.push(
        ...steam64UrlsResults
          .filter((result) => result.status === "fulfilled")
          .map((result) => result.value)
      );
    }

    if (steam64Urls.length === 0) {
      Logger.debug("No valid Steam64 URLs after conversion");
      return;
    }

    // Utiliser DbManager pour vérifier l'existence des profils
    const existingUrls = await DbManager.checkProfileExists(steam64Urls);

    // Filtrer les URLs qui n'existent pas encore
    const newSteam64Urls = steam64Urls.filter((url) => !existingUrls.has(url));

    if (newSteam64Urls.length === 0) {
      Logger.debug("No new profiles to add");
      return;
    }

    // Récupérer les données des profils en parallèle avec gestion de la mémoire
    const profilesToInsert = [];
    const profileBatchSize = 40; // Traiter 40 profils à la fois

    for (let i = 0; i < newSteam64Urls.length; i += profileBatchSize) {
      const urlBatch = newSteam64Urls.slice(i, i + profileBatchSize);
      const profileDataResults = await Promise.allSettled(
        urlBatch.map((url) => limiter.schedule(() => scrapSteamProfile(url)))
      );

      // Traiter les résultats de ce lot
      const batchProfiles = profileDataResults
        .filter(
          (result, index) =>
            result.status === "fulfilled" && result.value !== null
        )
        .map((result, index) => ({
          url: urlBatch[index],
          steam_name: result.value.name,
          ban: result.value.banStatus,
          ban_type: result.value.banType,
          ban_date: result.value.banDate,
          last_checked: new Date().toISOString(),
          status: "pending",
        }));

      // Ajouter ce lot au tableau principal
      profilesToInsert.push(...batchProfiles);
    }

    if (profilesToInsert.length === 0) {
      Logger.debug("No valid profiles to insert");
      return;
    }

    // Utiliser DbManager pour l'insertion
    await DbManager.insertProfiles(profilesToInsert);
  } catch (error) {
    State.stats.errors++;
    Logger.error("Failed to process contacts:", error);
  }
}

// Amélioration pour paralléliser le traitement de plusieurs profils
let activeCrawls = 0;
const MAX_CONCURRENT_CRAWLS = ULTRA_MODE ? 5 : PERFORMANCE_MODE ? 3 : 1;

async function crawlFirstPendingProfile(startUrl = null) {
  // Limiter le nombre de crawlers actifs simultanément
  if (activeCrawls >= MAX_CONCURRENT_CRAWLS) {
    return;
  }

  const profileUrl = startUrl || (await DbManager.getFirstPendingProfile());

  if (!profileUrl) {
    Logger.success("Crawling completed!");
    return;
  }

  activeCrawls++;

  try {
    await crawlProfile(profileUrl);
  } finally {
    activeCrawls--;

    // Lancer d'autres crawlers si possible
    if (activeCrawls < MAX_CONCURRENT_CRAWLS) {
      setImmediate(() => crawlFirstPendingProfile());
    }
  }
}

// Modifier la fonction de démarrage pour lancer plusieurs crawlers en parallèle
// Lancer le crawler
console.log("\x1b[45m\x1b[1m=== STEAM BAN TRACKER - CRAWLER STATUS ===\x1b[0m");
console.log(
  `Mode: ${ULTRA_MODE ? "ULTRA" : PERFORMANCE_MODE ? "PERFORMANCE" : "NORMAL"}`
);
console.log(`Workers: ${WORKERS}`);
console.log(`Max concurrent crawls: ${MAX_CONCURRENT_CRAWLS}`);
console.log(`Debug mode: ${DEBUG_MODE ? "ON" : "OFF"}`);

// Lancer plusieurs crawlers en fonction du nombre de workers
for (let i = 0; i < WORKERS; i++) {
  setTimeout(() => {
    crawlFirstPendingProfile();
  }, i * 1000); // Décaler le démarrage pour éviter les collisions
}

// Optimisation du nettoyage de la mémoire
const memoryManager = {
  lastGCTime: Date.now(),
  gcInterval: 5 * 60 * 1000, // 5 minutes

  checkMemory() {
    if (!global.gc || Date.now() - this.lastGCTime < this.gcInterval) {
      return;
    }

    try {
      global.gc();
      this.lastGCTime = Date.now();

      if (DEBUG_MODE) {
        const used = process.memoryUsage();
        Logger.debug(
          "Memory usage: ",
          Object.entries(used)
            .map(
              ([key, value]) =>
                `${key}: ${Math.round((value / 1024 / 1024) * 100) / 100} MB`
            )
            .join(", ")
        );
      }
    } catch (e) {
      // Ignore - gc() n'est pas disponible
    }
  },
};

// Exécuter le garbage collector périodiquement si disponible
setInterval(() => memoryManager.checkMemory(), 60 * 1000);

// Amélioration du stockage des statistiques
setInterval(() => {
  // Sauvegarder les statistiques dans un fichier toutes les 5 minutes
  const stats = { ...State.stats, timestamp: new Date().toISOString() };
  try {
    const fs = require("fs");
    fs.writeFileSync("crawler_stats.json", JSON.stringify(stats, null, 2));
  } catch (e) {
    Logger.debug("Impossible d'écrire les statistiques:", e.message);
  }
}, 5 * 60 * 1000);
