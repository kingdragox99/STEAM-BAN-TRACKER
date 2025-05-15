//TODO Review translation

// text = text send by bot to discord
// console = text print in console
// command = input command on discord

const lang = {
  command: {
    text_lang_fr: "Votre bot est maintenant en français",
    text_lang_fr_be: "Votre bot est maintenant en français belge",
    text_lang_en: "Your bot is now in English",
    text_lang_es: "Tu bot está ahora en español",
    text_lang_de: "Ihr Bot ist jetzt auf Deutsch",
    text_lang_de_at: "Ihr Bot ist jetzt auf Österreichischem Deutsch",
    text_lang_pl: "Twój bot jest teraz w języku polskim",
    text_lang_da: "Din bot er nu på dansk",
    text_lang_tr: "Botunuz artık Türkçe",
    text_lang_nl: "Je bot is nu in het Nederlands",
    text_lang_nl_be: "Je bot is nu in het Belgisch Nederlands",
    text_lang_ru: "Ваш бот теперь на русском языке",
    text_lang_zh: "您的机器人现在使用中文",
    text_lang_ja: "ボットが日本語になりました",
    text_lang_ko: "봇이 이제 한국어로 설정되었습니다",
    text_lang_th: "บอทของคุณตอนนี้เป็นภาษาไทยแล้ว",
    text_lang_sv: "Din bot är nu på svenska",
    text_lang_fi: "Bottisi on nyt suomeksi",
    text_lang_pt: "O seu bot está agora em português",
    text_lang_pt_br: "Seu bot agora está em português do Brasil",
    text_lang_ar_sa: "الروبوت الخاص بك الآن باللغة العربية السعودية",
    text_lang_ar_ma: "الروبوت الخاص بك الآن باللغة العربية المغربية",
    text_lang_ar_ae: "الروبوت الخاص بك الآن باللغة العربية الإماراتية",
    text_lang_he: "הבוט שלך כעת בעברית",
    text_lang_error:
      "Your language is not yet implemented, we put you in English for the moment",
  },
  setup: {
    fr_FR: {
      input_channel_set: "Le canal d'entrée a été défini sur {channel}",
      output_channel_set: "Le canal de sortie a été défini sur {channel}",
      language_set: "La langue a été définie sur {language}",
      setup_error: "Une erreur est survenue lors de la configuration.",
      input_error:
        "Une erreur est survenue lors de la configuration du canal d'entrée.",
      output_error:
        "Une erreur est survenue lors de la configuration du canal de sortie.",
      language_error:
        "Une erreur est survenue lors de la configuration de la langue.",
      command_error:
        "Une erreur est survenue lors de l'exécution de la commande.",
    },
    fr_BE: {
      input_channel_set: "Le canal d'entrée a été défini sur {channel}",
      output_channel_set: "Le canal de sortie a été défini sur {channel}",
      language_set: "La langue a été définie sur {language}",
      setup_error: "Une erreur est survenue lors de la configuration.",
      input_error:
        "Une erreur est survenue lors de la configuration du canal d'entrée.",
      output_error:
        "Une erreur est survenue lors de la configuration du canal de sortie.",
      language_error:
        "Une erreur est survenue lors de la configuration de la langue.",
      command_error:
        "Une erreur est survenue lors de l'exécution de la commande.",
    },
    en_EN: {
      input_channel_set: "The input channel has been set to {channel}",
      output_channel_set: "The output channel has been set to {channel}",
      language_set: "The language has been set to {language}",
      setup_error: "An error occurred during configuration.",
      input_error: "An error occurred while configuring the input channel.",
      output_error: "An error occurred while configuring the output channel.",
      language_error: "An error occurred while configuring the language.",
      command_error: "An error occurred while executing the command.",
    },
    es_ES: {
      input_channel_set: "El canal de entrada se ha establecido en {channel}",
      output_channel_set: "El canal de salida se ha establecido en {channel}",
      language_set: "El idioma se ha establecido en {language}",
      setup_error: "Ocurrió un error durante la configuración.",
      input_error: "Ocurrió un error al configurar el canal de entrada.",
      output_error: "Ocurrió un error al configurar el canal de salida.",
      language_error: "Ocurrió un error al configurar el idioma.",
      command_error: "Ocurrió un error al ejecutar el comando.",
    },
    de_DE: {
      input_channel_set: "Der Eingabekanal wurde auf {channel} eingestellt",
      output_channel_set: "Der Ausgabekanal wurde auf {channel} eingestellt",
      language_set: "Die Sprache wurde auf {language} eingestellt",
      setup_error: "Bei der Konfiguration ist ein Fehler aufgetreten.",
      input_error:
        "Bei der Konfiguration des Eingabekanals ist ein Fehler aufgetreten.",
      output_error:
        "Bei der Konfiguration des Ausgabekanals ist ein Fehler aufgetreten.",
      language_error:
        "Bei der Konfiguration der Sprache ist ein Fehler aufgetreten.",
      command_error:
        "Bei der Ausführung des Befehls ist ein Fehler aufgetreten.",
    },
    de_AT: {
      input_channel_set: "Der Eingabekanal wurde auf {channel} eingestellt",
      output_channel_set: "Der Ausgabekanal wurde auf {channel} eingestellt",
      language_set: "Die Sprache wurde auf {language} eingestellt",
      setup_error: "Bei der Konfiguration ist ein Fehler aufgetreten.",
      input_error:
        "Bei der Konfiguration des Eingabekanals ist ein Fehler aufgetreten.",
      output_error:
        "Bei der Konfiguration des Ausgabekanals ist ein Fehler aufgetreten.",
      language_error:
        "Bei der Konfiguration der Sprache ist ein Fehler aufgetreten.",
      command_error:
        "Bei der Ausführung des Befehls ist ein Fehler aufgetreten.",
    },
    pl_PL: {
      input_channel_set: "Kanał wejściowy został ustawiony na {channel}",
      output_channel_set: "Kanał wyjściowy został ustawiony na {channel}",
      language_set: "Język został ustawiony na {language}",
      setup_error: "Wystąpił błąd podczas konfiguracji.",
      input_error: "Wystąpił błąd podczas konfigurowania kanału wejściowego.",
      output_error: "Wystąpił błąd podczas konfigurowania kanału wyjściowego.",
      language_error: "Wystąpił błąd podczas konfigurowania języka.",
      command_error: "Wystąpił błąd podczas wykonywania polecenia.",
    },
    ru_RU: {
      input_channel_set: "Входной канал установлен на {channel}",
      output_channel_set: "Выходной канал установлен на {channel}",
      language_set: "Язык установлен на {language}",
      setup_error: "Произошла ошибка во время настройки.",
      input_error: "Произошла ошибка при настройке входного канала.",
      output_error: "Произошла ошибка при настройке выходного канала.",
      language_error: "Произошла ошибка при настройке языка.",
      command_error: "Произошла ошибка при выполнении команды.",
    },
    zh_CN: {
      input_channel_set: "输入频道已设置为 {channel}",
      output_channel_set: "输出频道已设置为 {channel}",
      language_set: "语言已设置为 {language}",
      setup_error: "配置过程中发生错误。",
      input_error: "配置输入频道时发生错误。",
      output_error: "配置输出频道时发生错误。",
      language_error: "配置语言时发生错误。",
      command_error: "执行命令时发生错误。",
    },
    ja_JP: {
      input_channel_set: "入力チャンネルが {channel} に設定されました",
      output_channel_set: "出力チャンネルが {channel} に設定されました",
      language_set: "言語が {language} に設定されました",
      setup_error: "設定中にエラーが発生しました。",
      input_error: "入力チャンネルの設定中にエラーが発生しました。",
      output_error: "出力チャンネルの設定中にエラーが発生しました。",
      language_error: "言語の設定中にエラーが発生しました。",
      command_error: "コマンドの実行中にエラーが発生しました。",
    },
    pt_PT: {
      input_channel_set: "O canal de entrada foi definido para {channel}",
      output_channel_set: "O canal de saída foi definido para {channel}",
      language_set: "O idioma foi definido para {language}",
      setup_error: "Ocorreu um erro durante a configuração.",
      input_error: "Ocorreu um erro ao configurar o canal de entrada.",
      output_error: "Ocorreu um erro ao configurar o canal de saída.",
      language_error: "Ocorreu um erro ao configurar o idioma.",
      command_error: "Ocorreu um erro ao executar o comando.",
    },
  },
  notifications: {
    fr_FR: {
      profile_already_registered: "Profil déjà enregistré",
      profile_already_registered_desc:
        "Le profil {url} est déjà dans la base de données.",
      error: "Erreur",
      profile_fetch_error:
        "Impossible de récupérer les données pour le profil {url}",
      processing_error: "Une erreur est survenue lors du traitement du profil.",
      profile_added: "Profil ajouté avec succès",
      profile_added_desc:
        "Le profil **{name}** a été ajouté à la base de données.",
      status_banned: "🚫 Banni",
      status_clean: "✅ Propre",
      ban_type: "Type de ban",
      ban_type_none: "Aucun",
    },
    en_EN: {
      profile_already_registered: "Profile already registered",
      profile_already_registered_desc:
        "The profile {url} is already in the database.",
      error: "Error",
      profile_fetch_error: "Unable to fetch profile data for {url}",
      processing_error: "An error occurred while processing the profile.",
      profile_added: "Profile added successfully",
      profile_added_desc: "Profile **{name}** has been added to the database.",
      status_banned: "🚫 Banned",
      status_clean: "✅ Clean",
      ban_type: "Ban Type",
      ban_type_none: "None",
    },
    es_ES: {
      profile_already_registered: "Perfil ya registrado",
      profile_already_registered_desc:
        "El perfil {url} ya está en la base de datos.",
      error: "Error",
      profile_fetch_error: "No se pueden obtener datos para el perfil {url}",
      processing_error: "Se produjo un error al procesar el perfil.",
      profile_added: "Perfil añadido con éxito",
      profile_added_desc:
        "El perfil **{name}** ha sido añadido a la base de datos.",
      status_banned: "🚫 Prohibido",
      status_clean: "✅ Limpio",
      ban_type: "Tipo de prohibición",
      ban_type_none: "Ninguno",
    },
    de_DE: {
      profile_already_registered: "Profil bereits registriert",
      profile_already_registered_desc:
        "Das Profil {url} ist bereits in der Datenbank.",
      error: "Fehler",
      profile_fetch_error:
        "Profildaten für {url} können nicht abgerufen werden",
      processing_error:
        "Bei der Verarbeitung des Profils ist ein Fehler aufgetreten.",
      profile_added: "Profil erfolgreich hinzugefügt",
      profile_added_desc: "Profil **{name}** wurde zur Datenbank hinzugefügt.",
      status_banned: "🚫 Gesperrt",
      status_clean: "✅ Sauber",
      ban_type: "Sperrtyp",
      ban_type_none: "Keine",
    },
  },
  error_messages: {
    fr_FR: {
      command_execution_error:
        "Une erreur est survenue lors de l'exécution de cette commande !",
      discord_client_error: "Erreur du client Discord :",
      discord_client_warning: "Avertissement du client Discord :",
      bot_disconnected: "Bot déconnecté de Discord",
      bot_reconnecting: "Bot en cours de reconnexion à Discord",
      connection_attempt_failed:
        "Tentative de connexion {attempt} échouée, nouvelle tentative dans 5s...",
      failed_connect_after_attempts:
        "Échec de la connexion après {maxAttempts} tentatives :",
      command_missing_properties:
        "La commande à {filePath} manque de propriétés requises.",
    },
    en_EN: {
      command_execution_error: "There was an error executing this command!",
      discord_client_error: "Discord client error:",
      discord_client_warning: "Discord client warning:",
      bot_disconnected: "Bot disconnected from Discord",
      bot_reconnecting: "Bot reconnecting to Discord",
      connection_attempt_failed:
        "Connection attempt {attempt} failed, retrying in 5s...",
      failed_connect_after_attempts:
        "Failed to connect after {maxAttempts} attempts:",
      command_missing_properties:
        "The command at {filePath} is missing required properties.",
    },
    es_ES: {
      command_execution_error: "¡Hubo un error al ejecutar este comando!",
      discord_client_error: "Error del cliente Discord:",
      discord_client_warning: "Advertencia del cliente Discord:",
      bot_disconnected: "Bot desconectado de Discord",
      bot_reconnecting: "Bot reconectando a Discord",
      connection_attempt_failed:
        "Intento de conexión {attempt} fallido, reintentando en 5s...",
      failed_connect_after_attempts:
        "No se pudo conectar después de {maxAttempts} intentos:",
      command_missing_properties:
        "Al comando en {filePath} le faltan propiedades requeridas.",
    },
    de_DE: {
      command_execution_error:
        "Bei der Ausführung dieses Befehls ist ein Fehler aufgetreten!",
      discord_client_error: "Discord-Client-Fehler:",
      discord_client_warning: "Discord-Client-Warnung:",
      bot_disconnected: "Bot von Discord getrennt",
      bot_reconnecting: "Bot verbindet sich wieder mit Discord",
      connection_attempt_failed:
        "Verbindungsversuch {attempt} fehlgeschlagen, neuer Versuch in 5s...",
      failed_connect_after_attempts:
        "Verbindung nach {maxAttempts} Versuchen fehlgeschlagen:",
      command_missing_properties:
        "Dem Befehl unter {filePath} fehlen erforderliche Eigenschaften.",
    },
  },
  console_messages: {
    fr_FR: {
      success_logged_in: "Connecté en tant que {tag}",
      info_starting_ban_check: "Démarrage de la vérification des bans",
      warn_no_servers: "Aucun serveur configuré",
      ban_detected: "BAN DÉTECTÉ: {name} ({url}) - Type: {banType}",
      notify_sending_notification:
        "Envoi d'une notification de ban au serveur {serverId} ({lang})",
      success_notification_sent:
        "Notification de ban envoyée au serveur {serverId}",
      warn_output_channel_not_found:
        "Impossible de trouver le canal de sortie pour le serveur {serverId}",
      info_processed_batch:
        "Lot traité de {length} profils (Dernier ID: {lastId})",
      success_ban_check_completed: "Vérification des bans terminée !",
      error_ban_check_failed: "Échec de la vérification des bans :",
    },
    en_EN: {
      success_logged_in: "Logged in as {tag}",
      info_starting_ban_check: "Starting ban check",
      warn_no_servers: "No servers configured",
      ban_detected: "BAN DETECTED: {name} ({url}) - Type: {banType}",
      notify_sending_notification:
        "Sending ban notification to server {serverId} ({lang})",
      success_notification_sent: "Ban notification sent to server {serverId}",
      warn_output_channel_not_found:
        "Could not find output channel for server {serverId}",
      info_processed_batch:
        "Processed batch of {length} profiles (Last ID: {lastId})",
      success_ban_check_completed: "Ban check completed!",
      error_ban_check_failed: "Ban check failed:",
    },
    es_ES: {
      success_logged_in: "Conectado como {tag}",
      info_starting_ban_check: "Iniciando verificación de prohibiciones",
      warn_no_servers: "No hay servidores configurados",
      ban_detected: "PROHIBICIÓN DETECTADA: {name} ({url}) - Tipo: {banType}",
      notify_sending_notification:
        "Enviando notificación de prohibición al servidor {serverId} ({lang})",
      success_notification_sent:
        "Notificación de prohibición enviada al servidor {serverId}",
      warn_output_channel_not_found:
        "No se pudo encontrar el canal de salida para el servidor {serverId}",
      info_processed_batch:
        "Lote procesado de {length} perfiles (Último ID: {lastId})",
      success_ban_check_completed: "¡Verificación de prohibiciones completada!",
      error_ban_check_failed: "Falló la verificación de prohibiciones:",
    },
    de_DE: {
      success_logged_in: "Angemeldet als {tag}",
      info_starting_ban_check: "Starte Bann-Überprüfung",
      warn_no_servers: "Keine Server konfiguriert",
      ban_detected: "BANN ERKANNT: {name} ({url}) - Typ: {banType}",
      notify_sending_notification:
        "Sende Bann-Benachrichtigung an Server {serverId} ({lang})",
      success_notification_sent:
        "Bann-Benachrichtigung an Server {serverId} gesendet",
      warn_output_channel_not_found:
        "Ausgabekanal für Server {serverId} konnte nicht gefunden werden",
      info_processed_batch:
        "Batch von {length} Profilen verarbeitet (Letzte ID: {lastId})",
      success_ban_check_completed: "Bann-Überprüfung abgeschlossen!",
      error_ban_check_failed: "Bann-Überprüfung fehlgeschlagen:",
    },
  },
  commands: {
    fr_FR: {
      ping_measuring: "Mesure de la latence...",
      ping_result: "🏓 Pong!",
      ping_bot: "Bot",
      ping_database: "Base de données",
      ping_error: "Une erreur est survenue lors de la mesure de la latence.",
    },
    en_EN: {
      ping_measuring: "Measuring latency...",
      ping_result: "🏓 Pong!",
      ping_bot: "Bot",
      ping_database: "Database",
      ping_error: "An error occurred while measuring latency.",
    },
    es_ES: {
      ping_measuring: "Midiendo latencia...",
      ping_result: "🏓 Pong!",
      ping_bot: "Bot",
      ping_database: "Base de datos",
      ping_error: "Ocurrió un error al medir la latencia.",
    },
    de_DE: {
      ping_measuring: "Latenz wird gemessen...",
      ping_result: "🏓 Pong!",
      ping_bot: "Bot",
      ping_database: "Datenbank",
      ping_error: "Bei der Messung der Latenz ist ein Fehler aufgetreten.",
    },
  },
  fr_FR: {
    url1: "https://steamcommunity.com/id/",
    url2: "https://steamcommunity.com/profiles/",
    response_watch: "VBC Bot surveille :",
    error_command: "Votre message n'est pas un URL valide",
    response_ban: "🚨 Nouveau ban détecté !",
    response_type: "Type de ban",
    response_date: "Date du ban",
  },
  fr_BE: {
    url1: "https://steamcommunity.com/id/",
    url2: "https://steamcommunity.com/profiles/",
    response_watch: "VBC Bot surveille :",
    error_command: "Votre message n'est pas un URL valide",
    response_ban: "🚨 Nouveau ban détecté ! une fois",
    response_type: "Type de ban",
    response_date: "Date du ban",
  },
  en_EN: {
    url1: "https://steamcommunity.com/id/",
    url2: "https://steamcommunity.com/profiles/",
    response_watch: "VBC Bot watches:",
    error_command: "Your message is not a valid URL",
    response_ban: "🚨 New ban detected!",
    response_type: "Ban type",
    response_date: "Ban date",
  },
  es_ES: {
    url1: "https://steamcommunity.com/id/",
    url2: "https://steamcommunity.com/profiles/",
    response_watch: "VBC Bot monitor:",
    error_command: "Su mensaje no es una URL válida",
    response_ban: "🚨 ¡Nueva prohibición detectada!",
    response_type: "Tipo de prohibición",
    response_date: "Fecha de prohibición",
  },
  de_DE: {
    url1: "https://steamcommunity.com/id/",
    url2: "https://steamcommunity.com/profiles/",
    response_watch: "VBC Bot überwacht:",
    error_command: "Ihre Nachricht ist keine gültige URL",
    response_ban: "🚨 Neuer Bann entdeckt!",
    response_type: "Bann-Typ",
    response_date: "Bann-Datum",
  },
  de_AT: {
    url1: "https://steamcommunity.com/id/",
    url2: "https://steamcommunity.com/profiles/",
    response_watch: "VBC Bot überwacht:",
    error_command: "Ihre Nachricht ist keine gültige URL",
    response_ban: "🚨 Neuer Bann entdeckt!",
    response_type: "Bann-Typ",
    response_date: "Bann-Datum",
  },
  pl_PL: {
    url1: "https://steamcommunity.com/id/",
    url2: "https://steamcommunity.com/profiles/",
    response_watch: "VBC Bot monitoruje:",
    error_command: "Twoja wiadomość nie jest prawidłowym adresem URL",
    response_ban: "🚨 Wykryto nowy ban!",
    response_type: "Typ bana",
    response_date: "Data bana",
  },
  da_DK: {
    url1: "https://steamcommunity.com/id/",
    url2: "https://steamcommunity.com/profiles/",
    response_watch: "VBC Bot overvåger:",
    error_command: "Din besked er ikke en gyldig URL",
    response_ban: "🚨 Ny ban opdaget!",
    response_type: "Ban type",
    response_date: "Ban dato",
  },
  tr_TR: {
    url1: "https://steamcommunity.com/id/",
    url2: "https://steamcommunity.com/profiles/",
    response_watch: "VBC Bot izliyor:",
    error_command: "Mesajınız geçerli bir URL değil",
    response_ban: "🚨 Yeni yasak tespit edildi!",
    response_type: "Yasak türü",
    response_date: "Yasak tarihi",
  },
  nl_NL: {
    url1: "https://steamcommunity.com/id/",
    url2: "https://steamcommunity.com/profiles/",
    response_watch: "VBC Bot bekijkt:",
    error_command: "Uw bericht is geen geldige URL",
    response_ban: "🚨 Nieuwe ban gedetecteerd!",
    response_type: "Ban type",
    response_date: "Ban datum",
  },
  nl_BE: {
    url1: "https://steamcommunity.com/id/",
    url2: "https://steamcommunity.com/profiles/",
    response_watch: "VBC Bot bekijkt:",
    error_command: "Uw bericht is geen geldige URL",
    response_ban: "🚨 Nieuwe ban gedetecteerd!",
    response_type: "Ban type",
    response_date: "Ban datum",
  },
  ru_RU: {
    url1: "https://steamcommunity.com/id/",
    url2: "https://steamcommunity.com/profiles/",
    response_watch: "VBC Bot следит за:",
    error_command: "Ваше сообщение не является действительным URL",
    response_ban: "🚨 Обнаружен новый бан!",
    response_type: "Тип бана",
    response_date: "Дата бана",
  },
  zh_CN: {
    url1: "https://steamcommunity.com/id/",
    url2: "https://steamcommunity.com/profiles/",
    response_watch: "VBC Bot 监视:",
    error_command: "您的消息不是有效的URL",
    response_ban: "🚨 检测到新的封禁！",
    response_type: "封禁类型",
    response_date: "封禁日期",
  },
  ja_JP: {
    url1: "https://steamcommunity.com/id/",
    url2: "https://steamcommunity.com/profiles/",
    response_watch: "VBC Bot が監視中:",
    error_command: "メッセージは有効なURLではありません",
    response_ban: "🚨 新しいBANが検出されました！",
    response_type: "BANタイプ",
    response_date: "BAN日付",
  },
  ko_KR: {
    url1: "https://steamcommunity.com/id/",
    url2: "https://steamcommunity.com/profiles/",
    response_watch: "VBC Bot 감시 중:",
    error_command: "메시지가 유효한 URL이 아닙니다",
    response_ban: "🚨 새로운 밴이 감지되었습니다!",
    response_type: "밴 유형",
    response_date: "밴 날짜",
  },
  th_TH: {
    url1: "https://steamcommunity.com/id/",
    url2: "https://steamcommunity.com/profiles/",
    response_watch: "VBC Bot กำลังเฝ้าดู:",
    error_command: "ข้อความของคุณไม่ใช่ URL ที่ถูกต้อง",
    response_ban: "🚨 ตรวจพบการแบนใหม่!",
    response_type: "ประเภทการแบน",
    response_date: "วันที่แบน",
  },
  sv_SE: {
    url1: "https://steamcommunity.com/id/",
    url2: "https://steamcommunity.com/profiles/",
    response_watch: "VBC Bot övervakar:",
    error_command: "Ditt meddelande är inte en giltig URL",
    response_ban: "🚨 Nytt ban upptäckt!",
    response_type: "Ban typ",
    response_date: "Ban datum",
  },
  fi_FI: {
    url1: "https://steamcommunity.com/id/",
    url2: "https://steamcommunity.com/profiles/",
    response_watch: "VBC Bot seuraa:",
    error_command: "Viestisi ei ole kelvollinen URL",
    response_ban: "🚨 Uusi porttikielto havaittu!",
    response_type: "Porttikiellon tyyppi",
    response_date: "Porttikiellon päivämäärä",
  },
  pt_PT: {
    url1: "https://steamcommunity.com/id/",
    url2: "https://steamcommunity.com/profiles/",
    response_watch: "VBC Bot monitoriza:",
    error_command: "A sua mensagem não é um URL válido",
    response_ban: "🚨 Nova proibição detectada!",
    response_type: "Tipo de proibição",
    response_date: "Data da proibição",
  },
  pt_BR: {
    url1: "https://steamcommunity.com/id/",
    url2: "https://steamcommunity.com/profiles/",
    response_watch: "VBC Bot monitora:",
    error_command: "Sua mensagem não é uma URL válida",
    response_ban: "🚨 Novo banimento detectado!",
    response_type: "Tipo de banimento",
    response_date: "Data do banimento",
  },
  ar_SA: {
    url1: "https://steamcommunity.com/id/",
    url2: "https://steamcommunity.com/profiles/",
    response_watch: "VBC Bot يراقب:",
    error_command: "رسالتك ليست عنوان URL صالحًا",
    response_ban: "🚨 تم اكتشاف حظر جديد!",
    response_type: "نوع الحظر",
    response_date: "تاريخ الحظر",
  },
  ar_MA: {
    url1: "https://steamcommunity.com/id/",
    url2: "https://steamcommunity.com/profiles/",
    response_watch: "VBC Bot يراقب:",
    error_command: "رسالتك ليست عنوان URL صالحًا",
    response_ban: "🚨 تم اكتشاف حظر جديد!",
    response_type: "نوع الحظر",
    response_date: "تاريخ الحظر",
  },
  ar_AE: {
    url1: "https://steamcommunity.com/id/",
    url2: "https://steamcommunity.com/profiles/",
    response_watch: "VBC Bot يراقب:",
    error_command: "رسالتك ليست عنوان URL صالحًا",
    response_ban: "🚨 تم اكتشاف حظر جديد!",
    response_type: "نوع الحظر",
    response_date: "تاريخ الحظر",
  },
  he_IL: {
    url1: "https://steamcommunity.com/id/",
    url2: "https://steamcommunity.com/profiles/",
    response_watch: "VBC Bot עוקב אחר:",
    error_command: "ההודעה שלך אינה כתובת URL תקינה",
    response_ban: "🚨 התגלה באן חדש!",
    response_type: "סוג באן",
    response_date: "תאריך באן",
  },
};

module.exports = lang;
