# 🚀 Deploy Scripts

Folder ini berisi semua script deployment untuk VidlyzerBot.

## 📁 Files

### **deploy-unified.js** (Recommended)
Script deployment terpadu yang menggabungkan semua metode deployment.

**Usage:**
```bash
node deploy/deploy-unified.js [command]
```

**Commands:**
- `guild` - Deploy guild commands (fast)
- `global` - Deploy global commands (slow)
- `clear-guild` - Clear guild commands
- `clear-global` - Clear global commands
- `clear-all` - Clear all commands
- `simple` - Simple deploy for startup
- (no args) - Auto-detect deployment

**NPM Scripts:**
```bash
npm run deploy         # Auto-detect
npm run deploy:guild   # Guild commands
npm run deploy:global  # Global commands
npm run deploy:simple  # Simple deploy
npm run clear:guild    # Clear guild
npm run clear:global   # Clear global
npm run clear:all      # Clear all
```

### **deploy-commands.js** (Legacy)
Script deployment original yang masih tersedia untuk kompatibilitas.

**Usage:**
```bash
node deploy/deploy-commands.js [guild|global]
```

### **clear-guild-commands.js** (Legacy)
Script untuk clear commands yang masih tersedia untuk kompatibilitas.

**Usage:**
```bash
node deploy/clear-guild-commands.js [guild|global|all]
```

## 🎯 Recommended Usage

### **Development:**
```bash
npm run deploy:guild
```
- ✅ Fast deployment (instant)
- ✅ Perfect untuk testing
- ✅ Easy to update

### **Production:**
```bash
npm run deploy:global
```
- ✅ Available di semua servers
- ✅ Production ready
- ❌ Takes up to 1 hour to update

### **Startup Deploy:**
```bash
npm run deploy:simple
```
- ✅ Used by startup scripts
- ✅ Auto-detect deployment type
- ✅ Error handling

## ⚙️ Configuration

Deploy scripts menggunakan konfigurasi dari:
1. **Environment Variables** (priority)
2. **src/config/index.js** (fallback)
3. **src/config/config.json** (legacy)

**Required Variables:**
- `BOT_TOKEN` - Discord bot token
- `CLIENT_ID` - Discord application ID
- `GUILD_ID` - Discord server ID (untuk guild commands)

## 🔧 Features

### **Unified System:**
- ✅ Single script untuk semua deployment
- ✅ Consistent error handling
- ✅ Support environment variables
- ✅ Auto-detect configuration

### **Error Handling:**
- ✅ Validation sebelum deploy
- ✅ Clear error messages
- ✅ Graceful fallbacks
- ✅ Exit codes untuk automation

### **Compatibility:**
- ✅ Support config.json dan env vars
- ✅ Legacy scripts tetap available
- ✅ NPM scripts untuk convenience
- ✅ Module export untuk programmatic use

## 📝 Examples

### **Basic Deploy:**
```bash
# Deploy to guild (recommended)
npm run deploy:guild

# Deploy globally
npm run deploy:global

# Auto-detect
npm run deploy
```

### **Clear Commands:**
```bash
# Clear guild commands
npm run clear:guild

# Clear global commands
npm run clear:global

# Clear everything
npm run clear:all
```

### **Programmatic Use:**
```javascript
const { deploySimple } = require('./deploy/deploy-unified');

// Deploy with auto-detect
const success = await deploySimple();

// Deploy specific type
const success = await deploySimple('guild');
```

## 🚨 Important Notes

- **Guild commands** are recommended untuk development
- **Global commands** untuk production only
- **Always test** dengan guild commands first
- **Check bot permissions** before deploying
- **Monitor logs** untuk deployment status

## 🔍 Troubleshooting

### **Deploy Failed:**
1. Check environment variables
2. Verify bot permissions
3. Check Discord API status
4. Try different deployment type

### **Commands Not Appearing:**
1. Wait for Discord to update (global: up to 1 hour)
2. Check bot permissions di server
3. Verify guild ID correct
4. Try clearing dan re-deploying

### **Permission Errors:**
1. Check bot token validity
2. Verify application permissions
3. Check server permissions
4. Re-invite bot dengan proper permissions

---

**Deploy with Confidence! 🎉**