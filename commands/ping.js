const { SlashCommandBuilder } = require("discord.js");
const { supabase } = require("../modules/supabBaseConnect");
const languageChecker = require("../modules/languageChecker");
const languageSeter = require("../modules/languageSeter");

// Fonction helper pour obtenir les descriptions traduites des commandes
function getLocalizedCommand() {
  return new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Vérifie la latence du bot et de la base de données")
    .setDescriptionLocalizations({
      "en-US": "Check the bot and database latency",
      "es-ES": "Comprueba la latencia del bot y de la base de datos",
      de: "Überprüft die Latenz des Bots und der Datenbank",
    });
}

module.exports = {
  data: getLocalizedCommand(),

  async execute(interaction) {
    try {
      // Récupérer la langue configurée pour ce serveur
      const langData = await languageChecker(interaction.guildId);
      const langCode = langData?.lang || "en_EN";
      const language = languageSeter(langCode);

      // Utiliser les traductions pour les commandes, ou fallback sur l'anglais
      const cmdLang = language.commands
        ? language.commands
        : languageSeter("en_EN").commands;

      // Mesurer la latence du bot
      const sent = await interaction.reply({
        content: cmdLang.ping_measuring,
        ephemeral: true,
        fetchReply: true,
      });
      const botLatency = sent.createdTimestamp - interaction.createdTimestamp;

      // Mesurer la latence de la base de données
      const dbStart = Date.now();
      const { error } = await supabase.from("discord").select("id").limit(1);
      const dbLatency = Date.now() - dbStart;

      if (error) throw error;

      await interaction.editReply({
        content:
          `${cmdLang.ping_result}\n` +
          `${cmdLang.ping_bot}: ${botLatency}ms\n` +
          `${cmdLang.ping_database}: ${dbLatency}ms`,
        ephemeral: true,
      });
    } catch (error) {
      console.error("\x1b[41m\x1b[1mERROR\x1b[0m: Ping command failed:", error);

      // Récupérer la langue pour les messages d'erreur
      const langData = await languageChecker(interaction.guildId);
      const langCode = langData?.lang || "en_EN";
      const language = languageSeter(langCode);
      const cmdLang = language.commands
        ? language.commands
        : languageSeter("en_EN").commands;

      await interaction.editReply({
        content: cmdLang.ping_error,
        ephemeral: true,
      });
    }
  },
};
