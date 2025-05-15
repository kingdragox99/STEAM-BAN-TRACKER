const fs = require("fs");
const language = require("../lang/langs.js");
const languageSeter = require("../modules/languageSeter");

// Liste des langues supportées
const supportedLangs = [
  "fr_FR",
  "fr_BE",
  "en_EN",
  "es_ES",
  "de_DE",
  "de_AT",
  "pl_PL",
  "da_DK",
  "tr_TR",
  "nl_NL",
  "nl_BE",
  "ru_RU",
  "zh_CN",
  "ja_JP",
  "ko_KR",
  "th_TH",
  "sv_SE",
  "fi_FI",
  "pt_PT",
  "pt_BR",
  "ar_SA",
  "ar_MA",
  "ar_AE",
  "he_IL",
];

// Champs de traduction requis pour chaque langue
const requiredTranslationKeys = [
  "url1",
  "url2",
  "response_watch",
  "error_command",
  "response_ban",
  "response_type",
  "response_date",
];

// Résultats de la vérification
let results = [];
results.push("=== VERIFICATION DES TRADUCTIONS ===\n");

// 1. Vérifier que toutes les langues sont présentes dans le fichier langs.js
results.push("1. Verification de la presence des langues dans langs.js:");
let missingLangs = [];

supportedLangs.forEach((lang) => {
  if (!language[lang]) {
    missingLangs.push(lang);
    results.push(`[ERREUR] La langue ${lang} est manquante`);
  } else {
    results.push(`[OK] La langue ${lang} est presente`);
  }
});

// 2. Vérifier que toutes les langues ont tous les champs requis
results.push("\n2. Verification des champs de traduction pour chaque langue:");
const languagesWithMissingFields = [];

supportedLangs.forEach((lang) => {
  if (!language[lang]) return;

  const langObj = language[lang];
  const missingFields = [];

  requiredTranslationKeys.forEach((key) => {
    if (!langObj[key]) {
      missingFields.push(key);
    }
  });

  if (missingFields.length > 0) {
    languagesWithMissingFields.push({ lang, missingFields });
    results.push(
      `[ERREUR] ${lang} : champs manquants : ${missingFields.join(", ")}`
    );
  } else {
    results.push(`[OK] ${lang} : tous les champs sont presents`);
  }
});

// 3. Vérifier que languageSeter prend en charge toutes les langues
results.push("\n3. Verification du support des langues dans languageSeter.js:");
let langSetterMissingLangs = [];

supportedLangs.forEach((lang) => {
  const langSet = languageSeter(lang);
  const defaultLang = languageSeter("en_EN");

  if (!langSet || (langSet === defaultLang && lang !== "en_EN")) {
    langSetterMissingLangs.push(lang);
    results.push(
      `[ERREUR] ${lang} n'est pas correctement pris en charge par languageSeter`
    );
  } else {
    results.push(
      `[OK] ${lang} est correctement pris en charge par languageSeter`
    );
  }
});

// 4. Vérifier les traductions des commandes
results.push("\n4. Verification des traductions pour les commandes:");
const commandStrings = Object.keys(language.command).filter((key) =>
  key.startsWith("text_lang_")
);

if (commandStrings.length === supportedLangs.length) {
  results.push(
    `[OK] Toutes les commandes ont les traductions pour toutes les langues`
  );
} else {
  results.push(`[ERREUR] Certaines traductions de commandes sont manquantes`);
  results.push(`  Langues supportees: ${supportedLangs.length}`);
  results.push(`  Traductions de commandes: ${commandStrings.length}`);
}

// 5. Vérifier la présence de texte français codé en dur dans setup.js
results.push("\n5. Remarque concernant le fichier setup.js:");
results.push(
  `[AVERTISSEMENT] Le fichier setup.js contient du texte en francais code en dur dans les reponses.`
);
results.push(
  `  Il faudrait idealement utiliser le systeme de langues pour ces messages egalement.`
);

// Résumé
results.push("\n=== RESUME DE LA VERIFICATION ===");

if (
  missingLangs.length === 0 &&
  languagesWithMissingFields.length === 0 &&
  langSetterMissingLangs.length === 0 &&
  commandStrings.length === supportedLangs.length
) {
  results.push("[OK] Toutes les traductions sont correctement configurees!");
} else {
  results.push("[ERREUR] Des problemes ont ete detectes dans les traductions:");

  if (missingLangs.length > 0) {
    results.push(`  - ${missingLangs.length} langues manquantes dans langs.js`);
  }

  if (languagesWithMissingFields.length > 0) {
    results.push(
      `  - ${languagesWithMissingFields.length} langues avec des champs manquants`
    );
  }

  if (langSetterMissingLangs.length > 0) {
    results.push(
      `  - ${langSetterMissingLangs.length} langues non prises en charge par languageSeter`
    );
  }

  if (commandStrings.length !== supportedLangs.length) {
    results.push(`  - Des traductions de commandes sont manquantes`);
  }
}

// Recommandations pour améliorer les traductions
results.push("\nRecommandations:");
results.push(
  "1. Ajouter les langues et champs manquants dans le fichier langs.js"
);
results.push("2. Localiser les messages codes en dur dans setup.js");
results.push("3. Verifier la coherence des traductions existantes");
results.push(
  "4. Envisager l'ajout d'un mecanisme de validation automatique des traductions"
);

// Écrire les résultats dans un fichier
fs.writeFileSync("rapport_traductions.txt", results.join("\n"), "utf8");
console.log(
  "Le rapport de verification des traductions a ete ecrit dans 'rapport_traductions.txt'"
);
