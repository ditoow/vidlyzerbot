# 🦕 Pterodactyl Files

Folder ini berisi semua file yang diperlukan untuk menjalankan VidlyzerBot di Pterodactyl Panel.

## 📁 File Structure

```
pterodactyl/
├── start-simple.js     # Simple startup script (recommended)
├── start-advanced.js   # Advanced startup script with detailed logging
├── start.sh           # Bash startup script
├── setup.md           # Setup guide untuk Pterodactyl
└── README.md          # File ini
```

## 🚀 Startup Options

### **1. Simple Start (Recommended)**
```bash
node pterodactyl/start-simple.js
```
- ✅ Minimal dependencies
- ✅ Auto-deploy on startup
- ✅ Clean error handling

### **2. Advanced Start**
```bash
node pterodactyl/start-advanced.js
```
- ✅ Detailed logging
- ✅ Process management
- ✅ Graceful shutdown

### **3. Bash Script**
```bash
bash pterodactyl/start.sh
```
- ✅ Shell-based startup
- ✅ Environment variable handling
- ��� Cross-platform compatible

### **4. Default Start**
```bash
npm start
```
- ✅ Uses main start.js
- ✅ Simple and reliable

## ⚙️ Environment Variables

Set di Pterodactyl Panel:

```bash
# Required
BOT_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_guild_id_here

# Auto-Deploy
DEPLOY_ON_STARTUP=true
AUTO_DEPLOY_TYPE=guild
```

## 🎯 Recommended Setup

**Startup Command:**
```bash
npm start
```

**Environment Variables:**
- Set semua required variables di panel
- Enable `DEPLOY_ON_STARTUP=true`
- Use `AUTO_DEPLOY_TYPE=guild` untuk development

## 🔍 Troubleshooting

### Deploy Failed
- Check environment variables
- Verify bot permissions
- Try manual deploy: `node deploy/deploy-unified.js guild`

### Bot Won't Start
- Check BOT_TOKEN validity
- Verify file permissions
- Check console logs

## 📝 Notes

- Semua script support auto-deploy on startup
- Deploy menggunakan unified deploy system
- Error handling memastikan bot tetap start meski deploy gagal
- Compatible dengan semua hosting providers

---

**Ready for Pterodactyl! 🎉**