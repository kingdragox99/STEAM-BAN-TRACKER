const language = require("../lang/langs.js");

// Cache pour les langues
const langCache = new Map();

const languageSeter = (data) => {
  // Vérifier le cache d'abord
  if (langCache.has(data)) {
    return langCache.get(data);
  }

  const langMap = {
    fr_FR: language.fr_FR,
    fr_BE: language.fr_BE,
    en_EN: language.en_EN,
    es_ES: language.es_ES,
    de_DE: language.de_DE,
    de_AT: language.de_AT,
    pl_PL: language.pl_PL,
    da_DK: language.da_DK,
    tr_TR: language.tr_TR,
    nl_NL: language.nl_NL,
    nl_BE: language.nl_BE,
    ru_RU: language.ru_RU,
    zh_CN: language.zh_CN,
    ja_JP: language.ja_JP,
    ko_KR: language.ko_KR,
    th_TH: language.th_TH,
    sv_SE: language.sv_SE,
    fi_FI: language.fi_FI,
    pt_PT: language.pt_PT,
    pt_BR: language.pt_BR,
    ar_SA: language.ar_SA,
    ar_MA: language.ar_MA,
    ar_AE: language.ar_AE,
    he_IL: language.he_IL,
    command: language.command,
  };

  const result = langMap[data] || language.en_EN;
  langCache.set(data, result);
  return result;
};

module.exports = languageSeter;
