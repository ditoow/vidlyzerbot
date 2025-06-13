# VidlyzerBot - Discord Bot

Bot Discord dengan struktur modular yang mudah dikembangkan dan di-maintenance.

## 📁 Struktur Folder

```
vidlyzerbot/
├── src/
│   ├── handlers/
│   │   ├── commandhandler.js
│   │   └── eventhandler.js
│   ├── commands/
│   │   └── util/
│   │       └── ping.js
│   ├── events/
│   │   └── ready.js
│   ├── config/
│   │   └── config.json
│   └── index.js
├── package.json
└── README.md
```

## 🚀 Cara Menjalankan Bot

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Bot Token
1. Buka file `src/config/config.json`
2. Ganti `YOUR_BOT_TOKEN_HERE` dengan token bot Discord Anda
3. Dapatkan token dari [Discord Developer Portal](https://discord.com/developers/applications)

### 3. Jalankan Bot
```bash
# Production
npm start

# Development (dengan auto-restart)
npm run dev
```

## 🔧 Konfigurasi

Edit file `src/config/config.json`:
```json
{
  "token": "YOUR_BOT_TOKEN_HERE",
  "prefix": "!"
}
```

## 📝 Menambah Command Baru

1. Buat file baru di folder `src/commands/[kategori]/namacommand.js`
2. Gunakan template berikut:

```javascript
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('namacommand')
        .setDescription('Deskripsi command'),
    async execute(interaction) {
        await interaction.reply('Response command');
    },
};
```

## 📝 Menambah Event Baru

1. Buat file baru di folder `src/events/namaevent.js`
2. Gunakan template berikut:

```javascript
module.exports = {
    name: 'eventName',
    once: false, // true jika event hanya dijalankan sekali
    execute(client) {
        // Logic event
    },
};
```

## 🎯 Fitur

- ✅ Struktur modular dan terorganisir
- ✅ Command handler otomatis
- ✅ Event handler otomatis
- ✅ Logging yang informatif
- ✅ Mudah dikembangkan dan di-maintenance

## 📋 Requirements

- Node.js v16.9.0 atau lebih tinggi
- Discord.js v14
- Bot token dari Discord Developer Portal