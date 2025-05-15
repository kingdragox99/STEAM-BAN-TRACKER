const {
  Client,
  GatewayIntentBits,
  ChannelType,
  Collection,
} = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const languageChecker = require("./languageChecker");
const languageSeter = require("./languageSeter");
require("dotenv").config();

// Configuration optimisée du client Discord
const client = new Client({
  shards: "auto",
  allowedMentions: {
    parse: ["users", "roles"],
    repliedUser: true,
  },
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
  presence: {
    status: "online",
    activities: [
      {
        name: "Steam Ban Tracker",
        type: 3,
      },
    ],
  },
  // Optimisation des ressources
  restTimeOffset: 0,
  restRequestTimeout: 15000,
  retryLimit: 3,
  failIfNotExists: false,
});

// Chargement des commandes
client.commands = new Collection();
const commandsPath = path.join(__dirname, "..", "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    // Utiliser une traduction par défaut pour les messages de console
    const defaultLang = languageSeter("en_EN").error_messages;
    console.warn(
      `\x1b[43m\x1b[1mWARN\x1b[0m: ${defaultLang.command_missing_properties.replace(
        "{filePath}",
        filePath
      )}`
    );
  }
}

// Gestion des commandes
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(
      `\x1b[41m\x1b[1mERROR\x1b[0m: Error executing command:`,
      error
    );

    // Récupérer la langue configurée pour ce serveur
    const langData = await languageChecker(interaction.guildId);
    const langCode = langData?.lang || "en_EN";
    const language = languageSeter(langCode);
    const errorLang = language.error_messages
      ? language.error_messages
      : languageSeter("en_EN").error_messages;

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: errorLang.command_execution_error,
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: errorLang.command_execution_error,
        ephemeral: true,
      });
    }
  }
});

// Gestion optimisée des événements
client.on("ready", () => {
  const consoleLang = languageSeter("en_EN").console_messages;
  console.log(
    `\x1b[42m\x1b[1mSUCCESS\x1b[0m: ${consoleLang.success_logged_in.replace(
      "{tag}",
      client.user.tag
    )}`
  );

  // Optimisation de la mémoire du cache
  client.guilds.cache.forEach((guild) => {
    guild.members.cache.clear();
    guild.channels.cache.sweep(
      (channel) =>
        ![ChannelType.GuildText, ChannelType.GuildAnnouncement].includes(
          channel.type
        )
    );
  });
});

// Gestion des erreurs
client.on("error", (error) => {
  const errorLang = languageSeter("en_EN").error_messages;
  console.error(
    `\x1b[41m\x1b[1mERROR\x1b[0m: ${errorLang.discord_client_error}`,
    error
  );
});

client.on("warn", (warning) => {
  const errorLang = languageSeter("en_EN").error_messages;
  console.warn(
    `\x1b[43m\x1b[1mWARN\x1b[0m: ${errorLang.discord_client_warning}`,
    warning
  );
});

// Gestion de la déconnexion
client.on("disconnect", () => {
  const errorLang = languageSeter("en_EN").error_messages;
  console.warn(`\x1b[43m\x1b[1mWARN\x1b[0m: ${errorLang.bot_disconnected}`);
});

// Gestion de la reconnexion
client.on("reconnecting", () => {
  const errorLang = languageSeter("en_EN").error_messages;
  console.log(`\x1b[43m\x1b[1mINFO\x1b[0m: ${errorLang.bot_reconnecting}`);
});

// Connexion avec retry
async function connectWithRetry(maxAttempts = 5) {
  const errorLang = languageSeter("en_EN").error_messages;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await client.login(process.env.CLIENT_TOKEN);
      break;
    } catch (error) {
      if (attempt === maxAttempts) {
        console.error(
          `\x1b[41m\x1b[1mERROR\x1b[0m: ${errorLang.failed_connect_after_attempts.replace(
            "{maxAttempts}",
            maxAttempts
          )}`,
          error
        );
        process.exit(1);
      }
      console.warn(
        `\x1b[43m\x1b[1mWARN\x1b[0m: ${errorLang.connection_attempt_failed.replace(
          "{attempt}",
          attempt
        )}`
      );
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

// Démarrer la connexion
connectWithRetry();

module.exports = client;
