# 🎵 VidlyzerBot Music System - Quick Start

Panduan cepat untuk menggunakan sistem musik terintegrasi VidlyzerBot.

## ⚡ **Quick Setup (5 Menit)**

### **1. Install Dependencies**
```bash
npm install
```

### **2. Configure Environment**
Edit file `.env` dan pastikan ada:
```env
BOT_TOKEN=your_discord_bot_token
CLIENT_ID=your_discord_client_id
GUILD_ID=your_discord_guild_id
```

### **3. Deploy Music Commands**
```bash
npm run deploy:music
```

### **4. Start Bot**
```bash
npm run bot
```

## 🎯 **Cara Menggunakan**

### **🎵 Music Mode (On-demand)**
```
/play <song>     - Putar lagu dari YouTube/Spotify
/pause           - Pause lagu
/resume          - Resume lagu
/skip            - Skip ke lagu berikutnya
/queue           - Lihat antrian lagu
/volume 75       - Set volume ke 75%
/shuffle         - Acak antrian
```

### **📻 Radio Mode (24/7 Streaming)**
```
/radio start lofi    - Mulai radio Lofi Hip Hop
/radio start jazz    - Mulai radio Smooth Jazz
/radio start pop     - Mulai radio Top Pop Hits
/radio list          - Lihat semua stasiun radio
/radio current       - Info stasiun saat ini
/radio stop          - Stop radio
```

### **⚡ Quick Commands (Prefix: `.`)**
```
.stop      - Stop musik atau radio
.status    - Lihat status bot
.help      - Bantuan
```

## 🔄 **Mode Switching**

**PENTING:** Hanya satu mode yang bisa aktif!

### **Dari Music ke Radio:**
```
User: /play "lagu favorit"
Bot: 🎵 Now playing "lagu favorit"

User: /radio start lofi
Bot: 🎵 Music is playing! Use .stop first

User: .stop
Bot: ✅ Music stopped

User: /radio start lofi  
Bot: 📻 Radio started - Lofi Hip Hop 24/7
```

### **Dari Radio ke Music:**
```
User: /radio start jazz
Bot: 📻 Radio started - Smooth Jazz

User: /play "lagu baru"
Bot: 📻 Radio is active! Use .stop first

User: .stop
Bot: ✅ Radio stopped

User: /play "lagu baru"
Bot: 🎵 Now playing "lagu baru"
```

## 📻 **Radio Stations Available**

| Station | Command | Genre |
|---------|---------|-------|
| 🎵 Lofi Hip Hop | `lofi` | Chill beats for studying |
| 🎷 Smooth Jazz | `jazz` | Relaxing jazz music |
| 🎤 Top Pop Hits | `pop` | Latest pop songs |
| 🎸 Classic Rock | `rock` | Rock classics |
| 🎧 Electronic/EDM | `electronic` | Electronic dance music |
| 🎼 Classical Music | `classical` | Classical compositions |
| 🌊 Ambient Sounds | `ambient` | Peaceful soundscapes |
| 🌆 Synthwave | `synthwave` | Retro synthwave |

## 🛠️ **Troubleshooting**

### **"Radio/Music is active" error**
```bash
# Gunakan salah satu:
.stop
/stop
```

### **"Not in voice channel" error**
- Join voice channel dulu sebelum menggunakan command

### **Commands tidak muncul**
```bash
# Deploy ulang commands:
npm run deploy:music
```

### **Bot tidak merespon**
- Pastikan bot sudah online
- Check permissions bot di server
- Pastikan BOT_TOKEN benar

## 🎵 **Examples**

### **Play Music**
```
/play never gonna give you up
/play https://www.youtube.com/watch?v=dQw4w9WgXcQ
/play https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC
```

### **Queue Management**
```
/play song1
/play song2
/play song3
/queue        # Lihat antrian
/skip         # Skip song1, play song2
/shuffle      # Acak urutan
```

### **Radio Streaming**
```
/radio start lofi     # Mulai lofi radio
.status               # Cek status
/radio current        # Info stasiun
.stop                 # Stop radio
```

## 📱 **Status Indicators**

### **Music Mode**
```
🎵 Music Mode Active
Current Track: Song Name
Status: ▶️ Playing / ⏸️ Paused
Queue Size: 5 songs
Volume: 75%
```

### **Radio Mode**
```
📻 Radio Mode Active
Station: Lofi Hip Hop 24/7
Genre: Lofi Hip Hop
Status: 🔴 Live Streaming
Auto-reconnect: ✅ Enabled
```

### **Idle**
```
ℹ️ Bot Status
Status: Idle
Current Mode: None
Available: /play or /radio start
```

## 🚀 **Advanced Usage**

### **Playlist Support**
```bash
# YouTube playlist
/play https://www.youtube.com/playlist?list=PLxxxxxx

# Spotify playlist  
/play https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd
```

### **Search Tips**
```bash
# Specific search
/play "artist name - song title"

# Album search
/play "album name by artist"

# Genre search
/play "chill lofi beats"
```

### **Queue Navigation**
```bash
/queue           # Page 1
/queue page:2    # Page 2
/queue page:3    # Page 3
```

## 🎯 **Best Practices**

1. **Always check status** sebelum switch mode
2. **Use .stop** untuk quick switching
3. **Join voice channel** sebelum command
4. **Use /radio list** untuk lihat stasiun
5. **Use .help** kalau lupa command

---

**🎵 Selamat menikmati musik!** 🎶

Sistem terintegrasi untuk musik on-demand dan radio 24/7 dalam satu bot.