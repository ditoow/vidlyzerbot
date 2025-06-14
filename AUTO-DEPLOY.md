# 🚀 Auto-Deploy System

Sistem auto-deploy memungkinkan bot untuk otomatis mendeploy command baru atau yang diubah tanpa perlu manual deployment.

## 🎯 Fitur

- ✅ **Auto-detection** perubahan file command
- ✅ **Hash-based tracking** untuk deteksi perubahan akurat
- ✅ **Cooldown system** untuk mencegah spam deploy
- ✅ **Guild & Global deployment** support
- ✅ **Manual trigger** via slash command
- ✅ **Standalone watcher** script
- ✅ **File system watching** sebagai backup detection

## 🔧 Cara Menggunakan

### 1. **Integrated Auto-Deploy (Dalam Bot)**

Aktifkan auto-deploy dalam bot dengan mengatur environment variable:

```bash
# Di file .env
AUTO_DEPLOY=true
AUTO_DEPLOY_TYPE=guild  # atau 'global'
```

Kemudian jalankan bot:
```bash
npm start
```

Bot akan otomatis mendeteksi dan deploy perubahan command.

### 2. **Standalone Auto-Deploy Watcher**

Jalankan watcher terpisah dari bot:

```bash
# Guild deployment (recommended untuk development)
npm run auto-deploy:guild

# Global deployment (untuk production)
npm run auto-deploy:global

# Default (guild)
npm run auto-deploy
```

### 3. **Development Mode dengan Auto-Deploy**

Jalankan bot dan auto-deploy bersamaan:
```bash
npm run dev:auto
```

### 4. **Manual Deploy via Slash Command**

Gunakan command `/deploy` di Discord (hanya admin):
```
/deploy type:Guild (Fast)
/deploy type:Global (Slow)
```

## ⚙️ Konfigurasi

### Environment Variables

```bash
# Auto-Deploy Settings
AUTO_DEPLOY=true          # Enable/disable auto-deploy
AUTO_DEPLOY_TYPE=guild    # 'guild' atau 'global'
```

### Cooldown & Settings

- **Deploy Cooldown**: 5 detik (mencegah spam deploy)
- **Check Interval**: 3 detik (untuk hash-based detection)
- **File Watch**: Real-time (backup method)

## 📁 Struktur File

```
src/
├── utils/
│   └── auto-deploy.js     # Core auto-deploy logic
├── commands/
│   └── admin/
│       └── deploy.js      # Manual deploy command
└── index.js               # Bot integration

scripts/
└── auto-deploy-standalone.js  # Standalone watcher
```

## 🔍 Cara Kerja

1. **Hash Tracking**: Setiap file command di-track dengan MD5 hash
2. **Change Detection**: Sistem membandingkan hash lama vs baru
3. **Auto Deploy**: Jika ada perubahan, otomatis deploy
4. **Cooldown**: Mencegah deploy berulang dalam waktu singkat
5. **Error Handling**: Log error dan retry mechanism

## 📝 Log Output

```
[AUTO-DEPLOY] Detected change in: changenick.js
[AUTO-DEPLOY] Loaded: changenick
[AUTO-DEPLOY] Deploying 3 commands...
[AUTO-DEPLOY] ✅ Successfully deployed 3 guild commands
```

## 🚨 Tips & Best Practices

### Development
- Gunakan **guild deployment** untuk testing (instant)
- Set `AUTO_DEPLOY=true` untuk development
- Gunakan `npm run dev:auto` untuk development optimal

### Production
- Gunakan **global deployment** untuk production
- Set cooldown lebih tinggi jika perlu
- Monitor logs untuk memastikan deploy berhasil

### Troubleshooting
- Check console logs untuk error details
- Pastikan bot memiliki permission yang cukup
- Verify `CLIENT_ID` dan `GUILD_ID` di config

## 🔄 Migration dari Manual Deploy

Jika sebelumnya menggunakan manual deploy:

1. **Backup** command yang ada
2. **Set** environment variables
3. **Test** dengan guild deployment dulu
4. **Switch** ke auto-deploy mode

## 🛡️ Security

- Command `/deploy` hanya bisa digunakan administrator
- Auto-deploy hanya memantau folder `src/commands/`
- Hash verification mencegah deploy yang tidak perlu

## 📊 Performance

- **Minimal overhead**: Hash checking sangat cepat
- **Efficient**: Hanya deploy saat ada perubahan
- **Scalable**: Bisa handle banyak command files

---

**Happy Coding! 🎉**