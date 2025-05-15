const language = require("../lang/langs.js");

// Cache pour les langues
const langCache = new Map();

const languageSeter = (data) => {
  // Vérifier le cache d'abord
  if (langCache.has(data)) {
    return langCache.get(data);
  }

  // Cas pour les objets spécifiques
  if (
    data === "console_messages" ||
    data === "error_messages" ||
    data === "setup" ||
    data === "commands" ||
    data === "notifications" ||
    data === "command"
  ) {
    return language[data];
  }

  // Cas pour les langues
  const lang = language[data];
  if (lang) {
    // Ajouter les sous-objets à l'objet de langue
    if (language.console_messages && language.console_messages[data]) {
      lang.console_messages = language.console_messages[data];
    }
    if (language.error_messages && language.error_messages[data]) {
      lang.error_messages = language.error_messages[data];
    }
    if (language.setup && language.setup[data]) {
      lang.setup = language.setup[data];
    }
    if (language.commands && language.commands[data]) {
      lang.commands = language.commands[data];
    }
    if (language.notifications && language.notifications[data]) {
      lang.notifications = language.notifications[data];
    }

    langCache.set(data, lang);
    return lang;
  }

  // Fallback sur l'anglais
  return languageSeter("en_EN");
};

module.exports = languageSeter;
