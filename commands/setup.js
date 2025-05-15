const { SlashCommandBuilder } = require("discord.js");
const { setupInput, setupOutput } = require("../modules/setupBot");
const { supabase } = require("../modules/supabBaseConnect");
const languageChecker = require("../modules/languageChecker");
const languageSeter = require("../modules/languageSeter");

// Fonction helper pour obtenir les descriptions traduites des commandes
function getLocalizedCommand() {
  const cmdLang = languageSeter("commands");

  return new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Configure le bot pour ce serveur")
    .setDescriptionLocalizations({
      "en-US": "Configure the bot for this server",
      "es-ES": "Configura el bot para este servidor",
      de: "Konfiguriert den Bot für diesen Server",
    })
    .addSubcommand((subcommand) =>
      subcommand
        .setName("input")
        .setDescription("Définit le canal d'entrée pour les profils Steam")
        .setDescriptionLocalizations({
          "en-US": "Set the input channel for Steam profiles",
          "es-ES": "Establece el canal de entrada para perfiles de Steam",
          de: "Setzt den Eingabekanal für Steam-Profile",
        })
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription(
              "Le canal où les utilisateurs peuvent poster des profils Steam"
            )
            .setDescriptionLocalizations({
              "en-US": "The channel where users can post Steam profiles",
              "es-ES":
                "El canal donde los usuarios pueden publicar perfiles de Steam",
              de: "Der Kanal, in dem Benutzer Steam-Profile posten können",
            })
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("output")
        .setDescription(
          "Définit le canal de sortie pour les notifications de ban"
        )
        .setDescriptionLocalizations({
          "en-US": "Set the output channel for ban notifications",
          "es-ES":
            "Establece el canal de salida para notificaciones de prohibición",
          de: "Setzt den Ausgabekanal für Bann-Benachrichtigungen",
        })
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription(
              "Le canal où seront envoyées les notifications de ban"
            )
            .setDescriptionLocalizations({
              "en-US": "The channel where ban notifications will be sent",
              "es-ES":
                "El canal donde se enviarán las notificaciones de prohibición",
              de: "Der Kanal, in dem Bann-Benachrichtigungen gesendet werden",
            })
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("lang")
        .setDescription("Définit la langue du bot pour ce serveur")
        .setDescriptionLocalizations({
          "en-US": "Set the bot language for this server",
          "es-ES": "Establece el idioma del bot para este servidor",
          de: "Setzt die Sprache des Bots für diesen Server",
        })
        .addStringOption((option) =>
          option
            .setName("language")
            .setDescription("La langue à utiliser")
            .setDescriptionLocalizations({
              "en-US": "The language to use",
              "es-ES": "El idioma a utilizar",
              de: "Die zu verwendende Sprache",
            })
            .setRequired(true)
            .addChoices(
              { name: "English", value: "en_EN" },
              { name: "Français", value: "fr_FR" },
              { name: "Français (Belgique)", value: "fr_BE" },
              { name: "Español", value: "es_ES" },
              { name: "Deutsch", value: "de_DE" },
              { name: "Deutsch (Österreich)", value: "de_AT" },
              { name: "Polski", value: "pl_PL" },
              { name: "Dansk", value: "da_DK" },
              { name: "Türkçe", value: "tr_TR" },
              { name: "Nederlands", value: "nl_NL" },
              { name: "Nederlands (België)", value: "nl_BE" },
              { name: "Русский", value: "ru_RU" },
              { name: "中文", value: "zh_CN" },
              { name: "日本語", value: "ja_JP" },
              { name: "한국어", value: "ko_KR" },
              { name: "ไทย", value: "th_TH" },
              { name: "Svenska", value: "sv_SE" },
              { name: "Suomi", value: "fi_FI" },
              { name: "Português", value: "pt_PT" },
              { name: "Português do Brasil", value: "pt_BR" },
              { name: "العربية (السعودية)", value: "ar_SA" },
              { name: "العربية (المغرب)", value: "ar_MA" },
              { name: "العربية (الإمارات)", value: "ar_AE" },
              { name: "עברית", value: "he_IL" }
            )
        )
    );
}

module.exports = {
  data: getLocalizedCommand(),

  async execute(interaction) {
    try {
      const subcommand = interaction.options.getSubcommand();
      const guildId = interaction.guildId;

      // Récupérer la langue configurée pour ce serveur
      const langData = await languageChecker(guildId);
      // Utiliser en_EN par défaut si aucune langue n'est configurée
      const langCode = langData?.lang || "en_EN";
      // Récupérer les traductions
      const language = languageSeter(langCode);
      // Récupérer les traductions de configuration
      const setupLang = language.setup
        ? language.setup
        : languageSeter("en_EN").setup;

      switch (subcommand) {
        case "input": {
          const channel = interaction.options.getChannel("channel");
          const success = await setupInput(guildId, channel.id);

          if (success) {
            await interaction.reply({
              content: setupLang.input_channel_set.replace(
                "{channel}",
                channel
              ),
              ephemeral: true,
            });
          } else {
            await interaction.reply({
              content: setupLang.input_error,
              ephemeral: true,
            });
          }
          break;
        }

        case "output": {
          const channel = interaction.options.getChannel("channel");
          const success = await setupOutput(guildId, channel.id);

          if (success) {
            await interaction.reply({
              content: setupLang.output_channel_set.replace(
                "{channel}",
                channel
              ),
              ephemeral: true,
            });
          } else {
            await interaction.reply({
              content: setupLang.output_error,
              ephemeral: true,
            });
          }
          break;
        }

        case "lang": {
          const lang = interaction.options.getString("language");
          const langNames = {
            en_EN: "English",
            fr_FR: "Français",
            fr_BE: "Français (Belgique)",
            es_ES: "Español",
            de_DE: "Deutsch",
            de_AT: "Deutsch (Österreich)",
            pl_PL: "Polski",
            da_DK: "Dansk",
            tr_TR: "Türkçe",
            nl_NL: "Nederlands",
            nl_BE: "Nederlands (België)",
            ru_RU: "Русский",
            zh_CN: "中文",
            ja_JP: "日本語",
            ko_KR: "한국어",
            th_TH: "ไทย",
            sv_SE: "Svenska",
            fi_FI: "Suomi",
            pt_PT: "Português",
            pt_BR: "Português do Brasil",
            ar_SA: "العربية (السعودية)",
            ar_MA: "العربية (المغرب)",
            ar_AE: "العربية (الإمارات)",
            he_IL: "עברית",
          };

          try {
            const { error } = await supabase
              .from("discord")
              .update({ lang })
              .eq("id_server", guildId);

            if (error) throw error;

            await interaction.reply({
              content: setupLang.language_set.replace(
                "{language}",
                langNames[lang]
              ),
              ephemeral: true,
            });
          } catch (error) {
            console.error(
              "\x1b[41m\x1b[1mERROR\x1b[0m: Failed to update language:",
              error
            );
            await interaction.reply({
              content: setupLang.language_error,
              ephemeral: true,
            });
          }
          break;
        }
      }
    } catch (error) {
      console.error(
        "\x1b[41m\x1b[1mERROR\x1b[0m: Setup command failed:",
        error
      );

      const langData = await languageChecker(interaction.guildId);
      const langCode = langData?.lang || "en_EN";
      const language = languageSeter(langCode);
      const setupLang = language.setup
        ? language.setup
        : languageSeter("en_EN").setup;

      await interaction.reply({
        content: setupLang.command_error,
        ephemeral: true,
      });
    }
  },
};
