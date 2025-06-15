# 🦕 Pterodactyl Setup Guide

Panduan lengkap untuk setup VidlyzerBot di Pterodactyl Panel.

## 🚀 Quick Setup

### 1. **Upload Files**
Upload semua file bot ke server Pterodactyl.

### 2. **Environment Variables**
Set di Pterodactyl Panel → Environment:

```bash
BOT_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_guild_id_here
DEPLOY_ON_STARTUP=true
AUTO_DEPLOY_TYPE=guild
```

### 3. **Startup Command**
Set di Pterodactyl Panel → Startup:

```bash
npm start
```

### 4. **Start Server**
Klik "Start" di panel Pterodactyl.

## ⚙️ Advanced Setup

### **Alternative Startup Commands:**

#### **Simple Pterodactyl Start:**
```bash
node pterodactyl/start-simple.js
```

#### **Advanced Pterodactyl Start:**
```bash
node pterodactyl/start-advanced.js
```

#### **Bash Script:**
```bash
bash pterodactyl/start.sh
```

### **Environment Variables Detail:**

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `BOT_TOKEN` | ✅ | - | Discord bot token |
| `CLIENT_ID` | ✅ | - | Discord application ID |
| `GUILD_ID` | ✅ | - | Discord server ID |
| `DEPLOY_ON_STARTUP` | ❌ | `false` | Auto-deploy saat startup |
| `AUTO_DEPLOY_TYPE` | ❌ | `guild` | Tipe deployment |
| `AUTO_DEPLOY` | ❌ | `false` | File watching auto-deploy |

## 📋 Expected Logs

Saat startup berhasil:

```
loaded token ✓
loaded clientid ✓
loaded guildid ✓
hanlder loaded (commandhandler.js, eventhandler.js)
admin commands loaded (deploy.js)
general commands loaded (ping.js)
slash commands loaded
events loaded (ready.js)
deploying commands on startup...
startup deploy completed
bot aktif BotName#1234
status bot watching server
```

## 🔧 Manual Deploy

Jika perlu deploy manual:

```bash
# Guild commands (fast)
node deploy/deploy-unified.js guild

# Global commands (slow)
node deploy/deploy-unified.js global

# Auto-detect
node deploy/deploy-unified.js

# Clear commands
node deploy/deploy-unified.js clear-guild
node deploy/deploy-unified.js clear-global
```

## 🚨 Troubleshooting

### **Deploy Failed**
1. Check environment variables
2. Verify bot permissions di Discord
3. Check network connectivity
4. Try manual deploy

### **Bot Won't Start**
1. Check BOT_TOKEN validity
2. Verify file permissions
3. Check console logs
4. Try different startup command

### **Commands Not Working**
1. Check bot permissions di server
2. Verify GUILD_ID correct
3. Try manual deploy
4. Check slash command permissions

### **Permission Errors**
1. Invite bot dengan proper permissions
2. Check role hierarchy
3. Enable "Manage Nicknames" permission
4. Use `/permissions` command untuk check

## 💡 Tips

### **Development:**
- Use `AUTO_DEPLOY_TYPE=guild` untuk testing
- Enable `DEPLOY_ON_STARTUP=true`
- Monitor logs untuk errors

### **Production:**
- Use `AUTO_DEPLOY_TYPE=global` untuk production
- Keep `DEPLOY_ON_STARTUP=true`
- Set proper bot permissions

### **Performance:**
- Guild commands update instantly
- Global commands take up to 1 hour
- Auto-deploy adds ~2-3 seconds to startup

## 🎯 Best Practices

1. **Always use guild commands** untuk development
2. **Set DEPLOY_ON_STARTUP=true** untuk Pterodactyl
3. **Monitor startup logs** untuk errors
4. **Keep manual deploy available** sebagai backup
5. **Test commands** setelah deployment

---

**Happy Hosting! 🎉**