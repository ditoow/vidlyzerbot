# 🔧 Audio System Fix - VidlyzerBot

## 🚨 **Problem Identified**

Error yang terjadi:
```
TypeError: Cannot convert "undefined" to int
at Object.toWireType (/home/container/node_modules/opusscript/build/opusscript_native_wasm.js:54:55)
at OpusScriptHandler$_encode [as _encode] (eval at Db (/home/container/node_modules/opusscript/build/opusscript_native_wasm.js:36:242), <anonymous>:11:26)
```

**Root Cause**: Masalah dengan Opus encoding dependencies dan konfigurasi audio stream.

## 🛠️ **Solution Steps**

### **Step 1: Update Dependencies**

Ganti dependencies audio yang bermasalah:

```bash
# Remove problematic packages
npm uninstall opusscript node-opus sodium libsodium-wrappers

# Install better alternatives
npm install @discordjs/opus prism-media
```

### **Step 2: Update package.json**

Dependencies yang direkomendasikan:
```json
{
  "dependencies": {
    "discord.js": "^14.19.3",
    "@discordjs/voice": "^0.16.1",
    "@discordjs/opus": "^0.9.0",
    "discord-player": "^6.6.6",
    "discord-player-youtubei": "^1.2.4",
    "ytdl-core": "^4.11.5",
    "play-dl": "^1.9.7",
    "ffmpeg-static": "^5.2.0",
    "prism-media": "^1.3.5"
  }
}
```

### **Step 3: Fix Audio Configuration**

Update MusicSystem dengan konfigurasi audio yang lebih stabil.

### **Step 4: Add Audio Error Handling**

Tambahkan error handling yang lebih robust untuk audio streams.

## 🎯 **Implementation**

Jalankan commands berikut:

```bash
# 1. Clean install
rm -rf node_modules package-lock.json
npm install

# 2. Install fixed dependencies
npm install @discordjs/opus prism-media --save

# 3. Remove problematic packages
npm uninstall opusscript node-opus sodium libsodium-wrappers

# 4. Restart bot
npm run bot
```

## ✅ **Expected Result**

Setelah fix:
- ✅ Audio encoding errors resolved
- ✅ Music playback stable
- ✅ Radio streaming works properly
- ✅ No more Opus conversion errors

## 🔍 **Verification**

Test dengan commands:
```
/play test song
/radio start lofi
.stop
.status
```

Semua harus berjalan tanpa error Opus encoding.