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

// Champs de traduction spécifiques aux commandes
const requiredCommandKeys = Object.keys(language.command);

console.log("\x1b[45m\x1b[1m=== VÉRIFICATION DES TRADUCTIONS ===\x1b[0m\n");

// 1. Vérifier que toutes les langues sont présentes dans le fichier langs.js
console.log(
  "\x1b[36m1. Vérification de la présence des langues dans langs.js:\x1b[0m"
);
let missingLangs = [];

supportedLangs.forEach((lang) => {
  if (!language[lang]) {
    missingLangs.push(lang);
    console.log(`\x1b[31m✘ La langue ${lang} est manquante\x1b[0m`);
  } else {
    console.log(`\x1b[32m✓ La langue ${lang} est présente\x1b[0m`);
  }
});

// 2. Vérifier que toutes les langues ont tous les champs requis
console.log(
  "\n\x1b[36m2. Vérification des champs de traduction pour chaque langue:\x1b[0m"
);
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
    console.log(
      `\x1b[31m✘ ${lang} : champs manquants : ${missingFields.join(
        ", "
      )}\x1b[0m`
    );
  } else {
    console.log(`\x1b[32m✓ ${lang} : tous les champs sont présents\x1b[0m`);
  }
});

// 3. Vérifier que languageSeter prend en charge toutes les langues
console.log(
  "\n\x1b[36m3. Vérification du support des langues dans languageSeter.js:\x1b[0m"
);
let langSetterMissingLangs = [];

supportedLangs.forEach((lang) => {
  const langSet = languageSeter(lang);
  const defaultLang = languageSeter("en_EN");

  if (!langSet || (langSet === defaultLang && lang !== "en_EN")) {
    langSetterMissingLangs.push(lang);
    console.log(
      `\x1b[31m✘ ${lang} n'est pas correctement pris en charge par languageSeter\x1b[0m`
    );
  } else {
    console.log(
      `\x1b[32m✓ ${lang} est correctement pris en charge par languageSeter\x1b[0m`
    );
  }
});

// 4. Vérifier les traductions des commandes
console.log(
  "\n\x1b[36m4. Vérification des traductions pour les commandes:\x1b[0m"
);
const commandStrings = Object.keys(language.command).filter((key) =>
  key.startsWith("text_lang_")
);

if (commandStrings.length === supportedLangs.length) {
  console.log(
    `\x1b[32m✓ Toutes les commandes ont les traductions pour toutes les langues\x1b[0m`
  );
} else {
  console.log(
    `\x1b[31m✘ Certaines traductions de commandes sont manquantes\x1b[0m`
  );
  console.log(`  Langues supportées: ${supportedLangs.length}`);
  console.log(`  Traductions de commandes: ${commandStrings.length}`);
}

// 5. Vérifier la présence de texte français codé en dur dans setup.js
console.log("\n\x1b[36m5. Remarque concernant le fichier setup.js:\x1b[0m");
console.log(
  `\x1b[33m⚠ Le fichier setup.js contient du texte en français codé en dur dans les réponses.\x1b[0m`
);
console.log(
  `  Il faudrait idéalement utiliser le système de langues pour ces messages également.`
);

// Résumé
console.log("\n\x1b[45m\x1b[1m=== RÉSUMÉ DE LA VÉRIFICATION ===\x1b[0m");

if (
  missingLangs.length === 0 &&
  languagesWithMissingFields.length === 0 &&
  langSetterMissingLangs.length === 0 &&
  commandStrings.length === supportedLangs.length
) {
  console.log(
    "\x1b[32m✓ Toutes les traductions sont correctement configurées!\x1b[0m"
  );
} else {
  console.log(
    "\x1b[31m✘ Des problèmes ont été détectés dans les traductions:\x1b[0m"
  );

  if (missingLangs.length > 0) {
    console.log(`  - ${missingLangs.length} langues manquantes dans langs.js`);
  }

  if (languagesWithMissingFields.length > 0) {
    console.log(
      `  - ${languagesWithMissingFields.length} langues avec des champs manquants`
    );
  }

  if (langSetterMissingLangs.length > 0) {
    console.log(
      `  - ${langSetterMissingLangs.length} langues non prises en charge par languageSeter`
    );
  }

  if (commandStrings.length !== supportedLangs.length) {
    console.log(`  - Des traductions de commandes sont manquantes`);
  }
}

// Recommandations pour améliorer les traductions
console.log("\n\x1b[36mRecommandations:\x1b[0m");
console.log(
  "1. Ajouter les langues et champs manquants dans le fichier langs.js"
);
console.log("2. Localiser les messages codés en dur dans setup.js");
console.log("3. Vérifier la cohérence des traductions existantes");
console.log(
  "4. Envisager l'ajout d'un mécanisme de validation automatique des traductions"
);
 