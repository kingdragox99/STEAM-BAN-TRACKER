const fs = require("fs");
const language = require("../lang/langs.js");

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

// Examiner les clés de commande
console.log("Clés de commande disponibles:");

const commandKeys = Object.keys(language.command);
commandKeys.forEach((key) => {
  console.log(`  - ${key}: ${language.command[key]}`);
});

// Compter les clés de traduction des commandes
const commandLangKeys = commandKeys.filter((key) =>
  key.startsWith("text_lang_")
);
console.log(`\nNombre de langues supportées: ${supportedLangs.length}`);
console.log(`Nombre de clés text_lang_: ${commandLangKeys.length}`);

// Vérifier s'il y a une clé supplémentaire
if (commandLangKeys.length > supportedLangs.length) {
  console.log("\nClés de commande supplémentaires:");

  // Convertir les codes de langue supportés dans le format des clés de commande
  const supportedCommandKeyFormats = supportedLangs.map((lang) => {
    const [main, sub] = lang.split("_");
    return `text_lang_${main.toLowerCase()}${
      sub ? "_" + sub.toLowerCase() : ""
    }`;
  });

  // Filtrer les clés qui ne sont pas dans le format attendu
  const unexpectedKeys = commandLangKeys.filter(
    (key) =>
      !supportedCommandKeyFormats.includes(key) &&
      !supportedCommandKeyFormats.includes(key.replace("_be", ""))
  );

  unexpectedKeys.forEach((key) => {
    console.log(`  - ${key}: ${language.command[key]}`);
  });
}

// Créer une correspondance entre codes de langue et clés de commande
console.log("\nCorrespondance entre codes de langue et clés de commande:");
supportedLangs.forEach((lang) => {
  const [main, sub] = lang.split("_");
  const expectedKey = `text_lang_${main.toLowerCase()}${
    sub ? "_" + sub.toLowerCase() : ""
  }`;
  const alternativeKey = `text_lang_${main.toLowerCase()}`;

  const commandKey = commandKeys.find(
    (key) => key === expectedKey || key === alternativeKey
  );

  if (commandKey) {
    console.log(
      `  - ${lang} -> ${commandKey} : ${language.command[commandKey]}`
    );
  } else {
    console.log(`  - ${lang} -> MANQUANT`);
  }
});

// Sauvegarder le résultat dans un fichier
fs.writeFileSync(
  "commandes.txt",
  commandKeys.map((key) => `${key}: ${language.command[key]}`).join("\n"),
  "utf8"
);
console.log(
  "\nLa liste des clés de commande a été sauvegardée dans 'commandes.txt'."
);
