# 🦕 Pterodactyl Setup Guide

Panduan lengkap untuk menjalankan VidlyzerBot di Pterodactyl Panel dengan auto-deploy.

## 🚀 Quick Setup

### 1. **Environment Variables**

Set environment variables berikut di Pterodactyl Panel:

```bash
# Discord Bot Configuration
BOT_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_guild_id_here

# Auto-Deploy Configuration
DEPLOY_ON_STARTUP=true
AUTO_DEPLOY_TYPE=guild
AUTO_DEPLOY=false
```

### 2. **Startup Command**

Gunakan salah satu startup command berikut:

#### **Opsi A: Auto-Deploy on Startup (Recommended)**
```bash
npm run start:pterodactyl
```

#### **Opsi B: Regular Start**
```bash
npm start
```

## ⚙️ Konfigurasi Environment Variables

### **Required Variables:**
- `BOT_TOKEN` - Token bot Discord Anda
- `CLIENT_ID` - Client ID aplikasi Discord
- `GUILD_ID` - ID server Discord untuk guild commands

### **Auto-Deploy Variables:**
- `DEPLOY_ON_STARTUP` - Deploy commands saat startup (`true`/`false`)
- `AUTO_DEPLOY_TYPE` - Tipe deployment (`guild`/`global`)
- `AUTO_DEPLOY` - Enable file watching auto-deploy (`true`/`false`)

## 🔄 Cara Kerja Auto-Deploy

### **Deploy on Startup**
Ketika `DEPLOY_ON_STARTUP=true`:
1. Bot akan deploy commands sebelum start
2. Jika deploy gagal, bot tetap akan start
3. Log akan menunjukkan status deploy

### **File Watching Auto-Deploy**
Ketika `AUTO_DEPLOY=true`:
1. Bot akan monitor perubahan file command
2. Otomatis deploy saat ada perubahan
3. Cocok untuk development

## 📋 Startup Options

### **1. Pterodactyl Script (`start:pterodactyl`)**
```bash
npm run start:pterodactyl
```
**Fitur:**
- ✅ Auto-deploy on startup
- ✅ Graceful shutdown handling
- ✅ Error handling
- ✅ Detailed logging

### **2. Regular Start (`start`)**
```bash
npm start
```
**Fitur:**
- ✅ Deploy on startup (jika enabled)
- ✅ File watching (jika enabled)
- ✅ Standard bot startup

## 🛠️ Manual Deploy Options

Folder `deploy/` tetap tersedia untuk manual deployment:

```bash
# Guild commands (fast)
npm run deploy:guild

# Global commands (slow, up to 1 hour)
npm run deploy:global

# Auto-detect
npm run deploy
```

## 📊 Recommended Settings

### **Production Setup:**
```bash
DEPLOY_ON_STARTUP=true
AUTO_DEPLOY_TYPE=guild
AUTO_DEPLOY=false
```

### **Development Setup:**
```bash
DEPLOY_ON_STARTUP=true
AUTO_DEPLOY_TYPE=guild
AUTO_DEPLOY=true
```

## 🔍 Troubleshooting

### **Commands Not Updating**
1. Check `DEPLOY_ON_STARTUP` is `true`
2. Verify `CLIENT_ID` and `GUILD_ID` are correct
3. Check bot permissions in Discord server
4. Try manual deploy: `npm run deploy:guild`

### **Bot Not Starting**
1. Verify `BOT_TOKEN` is correct
2. Check console logs for errors
3. Ensure all dependencies are installed
4. Try regular start: `npm start`

### **Deploy Failures**
1. Check bot permissions
2. Verify Discord API connectivity
3. Check rate limits
4. Try different deploy type

## 📝 Logs to Monitor

Saat startup, perhatikan log berikut:
```
loaded token ✓
loaded clientid ✓
loaded guildid ✓
deploying commands on startup...
startup deploy completed
bot aktif BotName#1234
```

## 🎯 Best Practices

1. **Always use guild commands** untuk development/testing
2. **Set DEPLOY_ON_STARTUP=true** untuk Pterodactyl
3. **Keep deploy/ folder** untuk manual deployment
4. **Monitor startup logs** untuk memastikan deploy berhasil
5. **Use global commands** hanya untuk production

## 🚨 Important Notes

- **Guild commands** tersedia langsung setelah deploy
- **Global commands** butuh waktu hingga 1 jam
- **Auto-deploy** hanya berfungsi jika bot memiliki write access
- **Manual deploy** selalu tersedia sebagai backup

---

**Happy Hosting! 🎉**