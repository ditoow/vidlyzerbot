# 🔧 Solusi Error Audio VidlyzerBot

## 🚨 **Errors yang Terjadi**

### **1. Opus Encoding Error:**
```
TypeError: Cannot convert "undefined" to int
at Object.toWireType (/home/container/node_modules/opusscript/build/opusscript_native_wasm.js:54:55)
at OpusScriptHandler$_encode [as _encode] (eval at Db (/home/container/node_modules/opusscript/build/opusscript_native_wasm.js:36:242), <anonymous>:11:26)
```

### **2. Node.js Version Warning:**
```
npm WARN EBADENGINE Unsupported engine {
npm WARN EBADENGINE   package: 'undici@7.10.0',
npm WARN EBADENGINE   required: { node: '>=20.18.1' },
npm WARN EBADENGINE   current: { node: 'v18.20.8', npm: '10.9.2' }
npm WARN EBADENGINE }
```

## 🎯 **Penyebab Masalah**

1. **Dependencies audio yang bermasalah**: `opusscript`, `node-opus`, `sodium`, `libsodium-wrappers`
2. **Konfigurasi audio yang tidak optimal**
3. **Konflik antara berbagai library Opus encoding**
4. **Node.js version compatibility**: Package `undici` memerlukan Node.js >=20.18.1

## ✅ **Solusi Lengkap**

### **Metode 1: Automatic Fix (Recommended)**

#### **Windows:**
```powershell
# Jalankan sebagai Administrator
.\fix-audio.ps1
```

#### **Linux/Mac:**
```bash
node fix-audio.js
```

#### **Fix Node.js Warnings Only:**
```bash
node fix-node-warnings.js
```

### **Metode 2: Manual Fix**

#### **Step 1: Bersihkan Dependencies Lama**
```bash
# Hapus node_modules dan package-lock.json
rm -rf node_modules package-lock.json

# Atau di Windows:
rmdir /s node_modules
del package-lock.json
```

#### **Step 2: Install Dependencies Baru**
```bash
npm install
```

#### **Step 3: Verifikasi Installation**
```bash
npm list @discordjs/opus
npm list @discordjs/voice
npm list discord-player
```

## 📦 **Dependencies yang Diperbaiki**

### **Sebelum (Bermasalah):**
```json
{
  "opusscript": "^0.0.8",
  "node-opus": "^0.3.3", 
  "sodium": "^3.0.2",
  "libsodium-wrappers": "^0.7.11"
}
```

### **Sesudah (Fixed):**
```json
{
  "@discordjs/opus": "^0.9.0",
  "prism-media": "^1.3.5"
}
```

## 🔧 **Perubahan Konfigurasi**

### **MusicSystem Configuration:**
```javascript
// Konfigurasi Player yang diperbaiki
this.musicPlayer = new Player(client, {
    ytdlOptions: {
        quality: 'highestaudio',
        highWaterMark: 1 << 25,
        filter: 'audioonly'  // ← Ditambahkan
    },
    skipFFmpeg: false,       // ← Diperbaiki
    useLegacyFFmpeg: false   // ← Diperbaiki
});

// Konfigurasi Radio yang diperbaiki
const resource = createAudioResource(station.url, {
    metadata: { title: station.name, station: station },
    inputType: 'arbitrary',  // ← Ditambahkan
    inlineVolume: true       // ← Ditambahkan
});
```

## 🧪 **Testing**

Setelah fix, test dengan commands berikut:

```bash
# 1. Start bot
npm run bot

# 2. Test music
/play test song

# 3. Test radio  
/radio start lofi

# 4. Test controls
.stop
.status
/pause
/resume
/skip
```

## 🔍 **Troubleshooting**

### **Jika masih error:**

1. **Cek FFmpeg installation:**
   ```bash
   ffmpeg -version
   ```

2. **Reinstall dengan force:**
   ```bash
   npm install --force
   ```

3. **Clear npm cache:**
   ```bash
   npm cache clean --force
   ```

4. **Check Node.js version:**
   ```bash
   node --version  # Should be >= 16.x
   ```

### **Error Alternatif:**

**"Cannot find module '@discordjs/opus'":**
```bash
npm install @discordjs/opus --save
```

**"FFmpeg not found":**
```bash
# Windows (dengan chocolatey):
choco install ffmpeg

# Linux:
sudo apt install ffmpeg

# Mac:
brew install ffmpeg
```

## 📊 **Verification Checklist**

- [ ] ✅ Dependencies installed correctly
- [ ] ✅ No Opus encoding errors in logs
- [ ] ✅ Music commands work (`/play`)
- [ ] ✅ Radio commands work (`/radio start`)
- [ ] ✅ Audio playback is stable
- [ ] ✅ No crashes during audio streaming

## 🎉 **Expected Results**

Setelah fix berhasil:
- ✅ **No more Opus encoding errors**
- ✅ **Stable music playback**
- ✅ **Radio streaming works perfectly**
- ✅ **All audio commands functional**
- ✅ **No bot crashes during audio operations**

## 📞 **Support**

Jika masih mengalami masalah:
1. Check logs untuk error messages
2. Pastikan bot permissions sudah benar
3. Verify voice channel permissions
4. Test dengan audio file yang berbeda

---

**🎵 Happy Music Streaming!** 🎶