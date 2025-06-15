require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Fungsi untuk membaca config dari file JSON sebagai fallback
function loadConfigFile() {
    try {
        const configPath = path.join(__dirname, 'config.json');
        if (fs.existsSync(configPath)) {
            return JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }
    } catch (error) {
        // Could not load config.json file
    }
    return {};
}

// Load config dari file sebagai fallback
const fileConfig = loadConfigFile();

// Konfigurasi dengan prioritas: Environment Variables > config.json > default values
const config = {
    token: process.env.BOT_TOKEN || fileConfig.token || '',
    clientId: process.env.CLIENT_ID || fileConfig.clientId || '',
    guildId: process.env.GUILD_ID || fileConfig.guildId || '',
    prefix: process.env.PREFIX || fileConfig.prefix || '!',
    geminiApiKey: process.env.GEMINI_API_KEY || fileConfig.geminiApiKey || '',
    defaultStatus: {
        type: process.env.DEFAULT_STATUS_TYPE || fileConfig.defaultStatus?.type || 'watching',
        activity: process.env.DEFAULT_STATUS_ACTIVITY || fileConfig.defaultStatus?.activity || 'server ini'
    }
};

// Log loaded configuration
console.log(`loaded token ${config.token ? '✓' : '✗'}`);
console.log(`loaded clientid ${config.clientId ? '✓' : '✗'}`);
console.log(`loaded guildid ${config.guildId ? '✓' : '✗'}`);
console.log(`loaded gemini api key ${config.geminiApiKey ? '✓' : '✗'}`);

module.exports = config;