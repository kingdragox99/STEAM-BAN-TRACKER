# STEAM BAN TRACKER

Steam Ban Tracker is a project composed of two main elements:

1. **A crawler** that automatically discovers and explores Steam profiles
2. **A Discord bot** that allows users to monitor suspicious players

## Data Visualization

You can view data visualizations here: [SBT Web UI](https://steam-ban-tracker-web-ui.vercel.app/)

[SBT Web UI GitHub Repository](https://github.com/kingdragox99/STEAM-BAN-TRACKER-WEB-UI)

## The Discord Bot

The Discord bot serves as a user interface and allows you to:

- Manually add suspicious Steam profiles to monitor
- Receive real-time notifications when a player gets banned
- View statistics on monitored profiles and bans
- Configure input/output channels and bot language
- Manage settings via intuitive slash commands

The bot supports 24 different languages and easily adapts to any gaming community.

## The Crawler

The crawler works according to these principles:

- It starts from a "seed" profile defined in the .env file
- It explores friends of each discovered profile, then friends of their friends
- Discovered profiles are automatically added to the database
- The exploration process continues permanently to enrich the database
- Exploration algorithms are optimized to avoid duplicates and respect Steam API limits

This approach allows for progressively building a vast database of Steam profiles that will be monitored to detect potential bans.

## Crawler Modes

The crawler can operate in different optimization modes that can be activated via command line arguments:

- **Standard Mode** (default): balanced for normal daily use

  - Daily limit: 40,000 profiles
  - Optimized for moderate resource usage

- **Performance Mode** (`--performance`): optimized for more powerful systems

  - Daily limit: 100,000 profiles
  - Increased batch processing and concurrent requests
  - Ideal for dedicated servers with good internet connection

- **Ultra Mode** (`--ultra`): maximum performance for high-end systems

  - Daily limit: 200,000 profiles
  - Reduced delays and highly parallelized processing
  - Requires excellent internet connection and significant system resources

- **Low Memory Mode** (`--low-memory`): optimized for systems with limited RAM

  - Reduces in-memory cache size
  - Can be combined with other modes according to your needs

- **Debug Mode** (`--debug`): displays detailed information for troubleshooting

  - Includes detailed logs of crawler operations
  - Useful for identifying issues or understanding crawler behavior

- **Custom Workers** (`--workers=N`): sets the number of concurrent workers
  - Example: `--workers=4` to use 4 workers
  - Allows fine-tuning performance according to your configuration

These modes can be combined. Example for a powerful system:

```bash
node crawler.js --performance --workers=8
```

## Installation

Please read all instructions carefully!

You need to create an account and get an API key from the following websites:

[Discord API](https://discord.com/developers/applications)
[SUPABASE](https://www.supabase.com/)
[Steam API](https://steamcommunity.com/dev/apikey)

I strongly recommend not running the bot on a root profile!

```bash
adduser steam-ban-tracker
```

Run the following commands in terminal:

```bash
# System update
sudo apt update
sudo apt upgrade

# Dependencies installation
sudo apt install curl git
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs
sudo apt install npm
sudo npm install --global yarn
sudo npm install pm2 -g

# Project installation
git clone https://github.com/kingdragox99/STEAM-BAN-TRACKER.git
cd STEAM-BAN-TRACKER
cp .env.example .env
nano .env  # Configure your API keys here
yarn install

# Starting with PM2
pm2 start index.js --name "steam-ban-tracker"
pm2 save
pm2 startup  # To auto-start on reboot
```

Create a .env file in the "STEAM-BAN-TRACKER" folder with:

```bash
SUPABASE_URL = "SUPABASE API URL"
SUPABASE_KEY = "SUPABASE API KEY"
CLIENT_TOKEN = "DISCORD BOT API KEY"
STEAM_API = "STEAM API KEY"
CRAWLER_SEED = "https://steamcommunity.com/id/El_Papite/" # Initial Steam profile URL
DEBUG = false or true
```

Supabase database structure:

```sql
CREATE TABLE profil (
    id SERIAL PRIMARY KEY,
    status TEXT,
    url VARCHAR,
    steam_name TEXT,
    ban BOOLEAN NOT NULL DEFAULT FALSE,
    ban_type TEXT,
    ban_date TIMESTAMP,
    last_checked TIMESTAMP
);

CREATE TABLE discord (
    id SERIAL PRIMARY KEY,
    id_server TEXT,
    input TEXT,
    output TEXT,
    lang TEXT
);
```

On Discord, use these commands in your channels:

Example channels:

- Suspected cheaters
- Confirmed cheaters

```bash
  /setup input // In your input channel where you put URLs of suspicious players
  /setup output // If a cheater is detected, they will be reported here
  /setup lang (fr/en/es) // Change language FR EN ES etc.
```

## Supported Languages

The bot is available in the following languages:

- 🇫🇷 French (fr_FR)
- 🇧🇪 French (Belgium) (fr_BE)
- 🇬🇧 English (en_EN)
- 🇪🇸 Spanish (es_ES)
- 🇩🇪 German (de_DE)
- 🇦🇹 German (Austria) (de_AT)
- 🇵🇱 Polish (pl_PL)
- 🇩🇰 Danish (da_DK)
- 🇹🇷 Turkish (tr_TR)
- 🇳🇱 Dutch (nl_NL)
- 🇧🇪 Dutch (Belgium) (nl_BE)
- 🇷🇺 Russian (ru_RU)
- 🇨🇳 Chinese (zh_CN)
- 🇯🇵 Japanese (ja_JP)
- 🇰🇷 Korean (ko_KR)
- 🇹🇭 Thai (th_TH)
- 🇸🇪 Swedish (sv_SE)
- 🇫🇮 Finnish (fi_FI)
- 🇵🇹 Portuguese (pt_PT)
- 🇧🇷 Portuguese (Brazil) (pt_BR)
- 🇸🇦 Arabic (Saudi Arabia) (ar_SA)
- 🇲🇦 Arabic (Morocco) (ar_MA)
- 🇦🇪 Arabic (UAE) (ar_AE)
- 🇮🇱 Hebrew (he_IL)

## Features

- Automatic detection of VAC, Game, and Trade bans
- Real-time Discord notifications
- Multilingual support
- Unlimited Steam profile monitoring
- Simple and intuitive interface
- Discord slash commands
- Automatic daily updates
- Continuous exploration of new profiles

## Configuration

Create a `.env` file at the root of the project with the following variables:

```env
CLIENT_TOKEN=your_discord_token
CLIENT_ID=your_client_id
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
STEAM_API=your_steam_api_key
CRAWLER_SEED=initial_profile_url
DEBUG=false
```

## Commands

- `/setup lang` - Change bot language
- `/setup` - Configure input/output channels
- `/stats` - Display statistics

## Maintenance Scripts

You can find scripts in the "script" folder to help you debug or fix the database.

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.
