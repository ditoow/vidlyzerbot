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
        console.warn('Warning: Could not load config.json file');
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
    defaultStatus: {
        type: process.env.DEFAULT_STATUS_TYPE || fileConfig.defaultStatus?.type || 'watching',
        activity: process.env.DEFAULT_STATUS_ACTIVITY || fileConfig.defaultStatus?.activity || 'server ini'
    }
};

// Validasi konfigurasi penting (warning saja, tidak exit)
if (!config.token) {
    console.warn('⚠️  BOT_TOKEN tidak ditemukan!');
    console.log('💡 Cara setup:');
    console.log('   1. Buat file .env dan isi BOT_TOKEN=your_token_here');
    console.log('   2. Atau isi token di src/config/config.json');
    console.log('   3. Atau set environment variable BOT_TOKEN');
}

if (!config.clientId) {
    console.warn('⚠️  CLIENT_ID tidak ditemukan!');
    console.log('💡 Cara setup:');
    console.log('   1. Buat file .env dan isi CLIENT_ID=your_client_id_here');
    console.log('   2. Atau isi clientId di src/config/config.json');
    console.log('   3. Atau set environment variable CLIENT_ID');
}

// Log sumber konfigurasi untuk debugging
console.log('📋 Konfigurasi dimuat dari:');
console.log(`   Token: ${process.env.BOT_TOKEN ? 'Environment Variable' : 'config.json'}`);
console.log(`   Client ID: ${process.env.CLIENT_ID ? 'Environment Variable' : 'config.json'}`);
console.log(`   Guild ID: ${process.env.GUILD_ID ? 'Environment Variable' : config.guildId ? 'config.json' : 'Not set'}`);

module.exports = config;