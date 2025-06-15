# 🦕 Pterodactyl Setup - VidlyzerBot

## 🚀 Quick Setup

### 1. Environment Variables
Set di Pterodactyl Panel:

```bash
BOT_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here  
GUILD_ID=your_guild_id_here
DEPLOY_ON_STARTUP=true
AUTO_DEPLOY_TYPE=guild
```

### 2. Startup Command
```bash
npm start
```

## ⚙️ Cara Kerja

1. **npm start** → menjalankan `start.js`
2. **start.js** → cek `DEPLOY_ON_STARTUP`
3. Jika `true` → deploy commands dulu
4. Kemudian start bot normal

## 🔧 Commands Available

```bash
npm start                    # Start dengan auto-deploy
npm run bot                  # Start bot langsung (tanpa deploy)
npm run deploy               # Manual deploy (unified)
npm run deploy:guild         # Deploy guild commands
npm run deploy:global        # Deploy global commands
npm run pterodactyl:simple   # Pterodactyl simple start
npm run pterodactyl:advanced # Pterodactyl advanced start
npm run dev                  # Development mode
```

## 📋 Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `BOT_TOKEN` | `your_token` | Discord bot token |
| `CLIENT_ID` | `your_id` | Discord application ID |
| `GUILD_ID` | `your_guild` | Discord server ID |
| `DEPLOY_ON_STARTUP` | `true/false` | Auto-deploy saat startup |
| `AUTO_DEPLOY_TYPE` | `guild/global` | Tipe deployment |

## 🎯 Recommended Settings

**Pterodactyl Production:**
```bash
DEPLOY_ON_STARTUP=true
AUTO_DEPLOY_TYPE=guild
```

## 🔍 Troubleshooting

### Git Conflict Error
```bash
# Di terminal Pterodactyl
git stash
git pull
```

### NPM Script Error
- Gunakan `npm start` (recommended)
- Semua script sudah unified

### Commands Not Working
1. Check environment variables
2. Verify bot permissions
3. Try manual deploy: `npm run deploy:guild`

## 📝 Logs to Watch

```
deploying commands on startup...
startup deploy completed
loaded token ✓
loaded clientid ✓
loaded guildid ✓
bot aktif BotName#1234
```

## 🚨 Important

- **Unified deploy system** - semua deploy methods digabung
- **Folder deploy/** berisi deploy-unified.js
- **Folder pterodactyl/** berisi semua file pterodactyl
- **Guild commands** update langsung
- **Global commands** butuh 1 jam
- **Auto-deploy** berjalan saat startup saja

---

**Ready for Pterodactyl! 🎉**