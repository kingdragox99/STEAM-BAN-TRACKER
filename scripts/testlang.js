const { supabase } = require("../modules/supabBaseConnect");
const languageChecker = require("../modules/languageChecker");
const languageSeter = require("../modules/languageSeter");

// Fonction simulant le changement de langue
async function simulateLanguageChange(guildId, newLang) {
  try {
    console.log(
      `\x1b[44m\x1b[1mTEST\x1b[0m: Changing language to ${newLang} for server ${guildId}`
    );

    // Vérifier si le serveur existe
    const { data: existingServer, error: checkError } = await supabase
      .from("discord")
      .select("*")
      .eq("id_server", guildId)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      console.error(
        `\x1b[41m\x1b[1mERROR\x1b[0m: Failed to check server: ${checkError.message}`
      );
      return false;
    }

    // Mettre à jour ou insérer selon le cas
    if (existingServer) {
      console.log(
        `\x1b[44m\x1b[1mTEST\x1b[0m: Server exists, updating language`
      );
      const { error: updateError } = await supabase
        .from("discord")
        .update({ lang: newLang })
        .eq("id_server", guildId);

      if (updateError) {
        console.error(
          `\x1b[41m\x1b[1mERROR\x1b[0m: Failed to update language: ${updateError.message}`
        );
        return false;
      }
    } else {
      console.log(
        `\x1b[44m\x1b[1mTEST\x1b[0m: Server does not exist, creating new entry`
      );
      const { error: insertError } = await supabase.from("discord").insert({
        id_server: guildId,
        lang: newLang,
        input: null,
        output: null,
      });

      if (insertError) {
        console.error(
          `\x1b[41m\x1b[1mERROR\x1b[0m: Failed to insert server: ${insertError.message}`
        );
        return false;
      }
    }

    // Vérifier que le changement a été enregistré
    const langServerData = await languageChecker(guildId);
    if (langServerData && langServerData.lang === newLang) {
      console.log(
        `\x1b[42m\x1b[1mSUCCESS\x1b[0m: Language changed and verified for server ${guildId}`
      );

      // Vérifier que le languageSeter fonctionne avec cette langue
      const langSet = languageSeter(newLang);
      console.log(
        `\x1b[44m\x1b[1mTEST\x1b[0m: Testing language setter:`,
        langSet
          ? `Language strings loaded successfully`
          : `Failed to load language strings`
      );

      return true;
    } else {
      console.error(
        `\x1b[41m\x1b[1mERROR\x1b[0m: Language change verification failed`
      );
      console.log(`Expected: ${newLang}, Got:`, langServerData);
      return false;
    }
  } catch (error) {
    console.error(
      `\x1b[41m\x1b[1mERROR\x1b[0m: Test failed with error: ${error.message}`
    );
    return false;
  }
}

// Fonction pour vérifier toutes les langues supportées
async function testAllLanguages(testGuildId) {
  const supportedLangs = [
    "en_EN",
    "fr_FR",
    "fr_BE",
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

  console.log(
    `\x1b[45m\x1b[1mTEST STARTED\x1b[0m: Testing ${supportedLangs.length} languages`
  );

  let successes = 0;
  let failures = 0;

  for (const lang of supportedLangs) {
    const success = await simulateLanguageChange(testGuildId, lang);
    if (success) {
      successes++;
    } else {
      failures++;
    }
    console.log(`---------------------------------------------------`);
  }

  console.log(`\x1b[45m\x1b[1mTEST COMPLETE\x1b[0m:`);
  console.log(`Total languages tested: ${supportedLangs.length}`);
  console.log(`Successes: ${successes}`);
  console.log(`Failures: ${failures}`);

  // Afficher si toutes les langues dans languageSeter.js sont correctement configurées
  console.log(
    `\x1b[44m\x1b[1mINFO\x1b[0m: Checking languageSeter configuration...`
  );

  const missingInSetter = supportedLangs.filter(
    (lang) =>
      !languageSeter(lang) || languageSeter(lang) === languageSeter("en_EN")
  );
  if (missingInSetter.length > 0) {
    console.log(
      `\x1b[43m\x1b[1mWARNING\x1b[0m: The following languages may not be properly configured in languageSeter.js:`
    );
    console.log(missingInSetter.join(", "));
  } else {
    console.log(
      `\x1b[42m\x1b[1mSUCCESS\x1b[0m: All languages appear to be configured in languageSeter.js`
    );
  }
}

// Exécuter le test avec un ID de serveur de test
const TEST_GUILD_ID = "test_guild_123456789";
testAllLanguages(TEST_GUILD_ID);
