const { supabase } = require("../modules/supabBaseConnect");

async function checkDatabase() {
  try {
    // Récupérer les entrées de serveur Discord
    console.log("Récupération des données de la table discord...");
    const { data: discordData, error: discordError } = await supabase
      .from("discord")
      .select("*");

    if (discordError) {
      console.error(
        "Erreur lors de la récupération des données:",
        discordError
      );
      return;
    }

    console.log("Données de la table discord:");
    console.log(JSON.stringify(discordData, null, 2));

    // Vérifier le serveur de test
    const testServer = discordData.find(
      (server) => server.id_server === "test_guild_123456789"
    );
    if (testServer) {
      console.log("\nServeur de test trouvé:");
      console.log(JSON.stringify(testServer, null, 2));
      console.log(`\nLangue actuelle du serveur de test: ${testServer.lang}`);
    } else {
      console.log("\nServeur de test non trouvé dans la base de données");
    }

    // Afficher un résumé des langues utilisées
    const languageStats = {};
    discordData.forEach((server) => {
      if (!languageStats[server.lang]) {
        languageStats[server.lang] = 0;
      }
      languageStats[server.lang]++;
    });

    console.log("\nRésumé des langues utilisées:");
    Object.entries(languageStats).forEach(([lang, count]) => {
      console.log(`${lang}: ${count} serveur(s)`);
    });
  } catch (error) {
    console.error("Erreur lors de l'exécution du script:", error);
  }
}

checkDatabase();
