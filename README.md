# 🤖 VidlyzerBot

Discord bot dengan struktur modular dan sistem auto-deploy yang canggih.

## 📁 Struktur Project

```
vidlyzerbot/
├── src/                    # Source code utama
│   ├── commands/          # Slash commands
│   │   ├── admin/         # Admin commands
│   │   └── general/       # General commands
│   ├── events/            # Discord events
│   ├── handlers/          # Command & event handlers
│   ├── utils/             # Utility classes
│   └── config/            # Configuration
├── deploy/                # Deployment scripts
│   ├── deploy-unified.js  # Unified deploy system
│   ├── deploy-commands.js # Original deploy script
│   └── clear-guild-commands.js # Clear commands
├── pterodactyl/           # Pterodactyl hosting files
│   ├── start-simple.js    # Simple startup
│   ├── start-advanced.js  # Advanced startup
│   ├── start.sh          # Bash startup
│   └── setup.md          # Setup guide
├── scripts/               # Utility scripts
└── start.js              # Main entry point
```

## 🚀 Quick Start

### 1. **Environment Setup**
```bash
# Copy environment file
cp .env.example .env

# Edit dengan data bot Anda
BOT_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_guild_id_here
```

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Deploy Commands**
```bash
npm run deploy:guild
```

### 4. **Start Bot**
```bash
npm start
```

## 🎯 Commands Available

### **General Commands:**
- `/ping` - Test latency bot
- `/invite` - Link invite server
- `/changenick <nickname>` - Ganti nickname
- `/afk [reason]` - Toggle AFK status
- `/afklist` - Lihat daftar user AFK

### **Admin Commands:**
- `/deploy [type]` - Manual deploy commands
- `/status <type> <text>` - Ubah status bot
- `/permissions` - Check bot permissions
- `/afkmanage` - Kelola sistem AFK

## 🔧 NPM Scripts

### **Basic:**
```bash
npm start              # Start bot dengan auto-deploy
npm run bot            # Start bot langsung
npm run dev            # Development mode
```

### **Deploy:**
```bash
npm run deploy         # Auto-detect deploy
npm run deploy:guild   # Guild commands (fast)
npm run deploy:global  # Global commands (slow)
npm run deploy:simple  # Simple deploy
```

### **Clear:**
```bash
npm run clear:guild    # Clear guild commands
npm run clear:global   # Clear global commands
npm run clear:all      # Clear all commands
```

### **Pterodactyl:**
```bash
npm run pterodactyl:simple    # Pterodactyl simple start
npm run pterodactyl:advanced  # Pterodactyl advanced start
```

### **Auto-Deploy:**
```bash
npm run auto-deploy           # Standalone auto-deploy
npm run auto-deploy:guild     # Guild auto-deploy
npm run auto-deploy:global    # Global auto-deploy
```

## ⚙️ Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `BOT_TOKEN` | ✅ | - | Discord bot token |
| `CLIENT_ID` | ✅ | - | Discord application ID |
| `GUILD_ID` | ✅ | - | Discord server ID |
| `DEPLOY_ON_STARTUP` | ❌ | `false` | Auto-deploy saat startup |
| `AUTO_DEPLOY_TYPE` | ❌ | `guild` | Tipe deployment |
| `AUTO_DEPLOY` | ❌ | `false` | File watching auto-deploy |

## 🦕 Pterodactyl Hosting

Untuk hosting di Pterodactyl Panel, lihat dokumentasi lengkap di folder `pterodactyl/`:

- **Setup Guide:** `pterodactyl/setup.md`
- **Startup Options:** `pterodactyl/README.md`
- **Advanced Config:** `pterodactyl/PTERODACTYL-SETUP.md`

**Quick Pterodactyl Setup:**
```bash
# Startup Command di Pterodactyl Panel:
npm start

# Environment Variables:
BOT_TOKEN=your_token
CLIENT_ID=your_client_id
GUILD_ID=your_guild_id
DEPLOY_ON_STARTUP=true
```

## 🔄 Auto-Deploy System

Bot memiliki sistem auto-deploy yang canggih:

### **Deploy on Startup:**
- Set `DEPLOY_ON_STARTUP=true`
- Commands auto-deploy saat bot restart
- Perfect untuk Pterodactyl hosting

### **File Watching:**
- Set `AUTO_DEPLOY=true`
- Monitor perubahan file command
- Auto-deploy saat ada perubahan

### **Manual Deploy:**
- Gunakan `/deploy` command di Discord
- Atau `npm run deploy` di terminal
- Unified deploy system

## 🎨 Features

### **AFK System:**
- ✅ Persistent data (survive bot restart)
- ✅ Auto-remove saat user chat
- ✅ Mention detection
- ✅ Admin management

### **Nickname Management:**
- ✅ Change user nicknames
- ✅ Permission validation
- ✅ Error handling

### **Auto-Deploy:**
- ✅ Startup deployment
- ✅ File watching
- ✅ Manual triggers
- ✅ Unified system

### **Admin Tools:**
- ✅ Permission checker
- ✅ Status management
- ✅ Deploy controls
- ✅ AFK management

## 🔍 Troubleshooting

### **Bot Won't Start:**
1. Check `BOT_TOKEN` validity
2. Verify environment variables
3. Check console logs
4. Try `npm run bot` (skip deploy)

### **Commands Not Working:**
1. Check bot permissions
2. Verify `GUILD_ID` correct
3. Try manual deploy: `npm run deploy:guild`
4. Use `/permissions` command

### **Deploy Failed:**
1. Check environment variables
2. Verify Discord API connectivity
3. Check bot permissions
4. Try different deploy type

## 📝 Development

### **Adding New Commands:**
1. Create file di `src/commands/category/`
2. Follow existing command structure
3. Auto-deploy akan detect perubahan
4. Test dengan `/deploy` command

### **File Structure:**
- Commands: `src/commands/`
- Events: `src/events/`
- Utils: `src/utils/`
- Config: `src/config/`

## 🚨 Important Notes

- **Guild commands** update instantly
- **Global commands** take up to 1 hour
- **Auto-deploy** requires write permissions
- **Pterodactyl** files in separate folder
- **Unified deploy** system for all methods

## 📄 License

MIT License - Feel free to use and modify!

---

**Happy Coding! 🎉**