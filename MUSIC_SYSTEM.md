# 🎵 VidlyzerBot - Integrated Music System

Sistem musik terintegrasi dengan mode switching antara Music (on-demand) dan Radio (24/7 streaming).

## 🎯 **Konsep Utama**

### **Mode Switching System**
- **Hanya satu mode yang bisa aktif** pada satu waktu
- **Music Mode**: Untuk memutar lagu on-demand dengan queue
- **Radio Mode**: Untuk streaming radio 24/7
- **Switching**: Harus stop mode saat ini sebelum menggunakan mode lain

### **Command Structure**
- **Slash Commands** (`/`): Untuk semua fitur utama
- **Prefix Commands** (`.`): Untuk quick actions

## 🎵 **Music Mode Commands**

### **Slash Commands**
```
/play <song>        - Play music from YouTube/Spotify
/pause              - Pause current song
/resume             - Resume playback
/skip               - Skip to next song
/stop               - Stop music and clear queue
/queue [page]       - Show current queue
/nowplaying         - Show current song
/volume <1-100>     - Set volume
/shuffle            - Shuffle queue
```

### **Features**
- ✅ YouTube & Spotify support
- ✅ Queue management (add, skip, shuffle)
- ✅ Playback controls (pause, resume, volume)
- ✅ Auto-disconnect when empty
- ✅ Rich embeds with thumbnails

## 📻 **Radio Mode Commands**

### **Slash Commands**
```
/radio start <station>  - Start 24/7 radio streaming
/radio stop            - Stop radio
/radio list            - List available stations
/radio current         - Show current station info
```

### **Available Stations**
- 🎵 **Lofi Hip Hop** - Chill beats for studying
- 🎷 **Smooth Jazz** - Relaxing jazz music
- 🎤 **Top Pop Hits** - Latest pop songs
- 🎸 **Classic Rock** - Rock classics
- 🎧 **Electronic/EDM** - Electronic dance music
- 🎼 **Classical Music** - Classical compositions
- 🌊 **Ambient Sounds** - Peaceful soundscapes
- 🌆 **Synthwave** - Retro synthwave music

### **Features**
- ✅ 24/7 continuous streaming
- ✅ Auto-reconnect on disconnect
- ✅ 8 pre-configured stations
- ✅ Live status indicators

## ⚡ **Quick Commands (Prefix: `.`)**

```
.stop     - Stop current music or radio
.status   - Show current bot status
.help     - Show help information
```

## 🔄 **Mode Switching Examples**

### **Scenario 1: Music → Radio**
```
User: /play "some song"
Bot: 🎵 Now playing "some song"

User: /radio start lofi
Bot: 📻 Music is playing! Use .stop or /stop to stop music first.

User: .stop
Bot: ✅ Music stopped and queue cleared!

User: /radio start lofi
Bot: 📻 Radio started - Lofi Hip Hop 24/7
```

### **Scenario 2: Radio → Music**
```
User: /radio start jazz
Bot: 📻 Radio started - Smooth Jazz Radio

User: /play "another song"
Bot: 📻 Radio is active! Use .stop or /stop to stop radio first.

User: /stop
Bot: ✅ Radio stopped and disconnected

User: /play "another song"
Bot: 🎵 Now playing "another song"
```

## 🛠️ **Technical Implementation**

### **File Structure**
```
src/
├── features/
│   └── music/
│       ├── index.js              # Main MusicSystem class
│       └── utils/
│           └── stations.js       # Radio station configs
├── commands/
│   └── music/
│       ├── play.js              # Music commands
│       ├── radio.js             # Radio commands
│       ├── stop.js              # Universal stop
│       ├── pause.js, resume.js  # Playback controls
│       ├── skip.js, queue.js    # Queue management
│       ├── nowplaying.js        # Status display
│       ├── volume.js            # Volume control
│       └── shuffle.js           # Queue shuffle
├── handlers/
│   └── messageHandler.js        # Prefix command handler
└── utils/
    └── logger.js                # Logging utility
```

### **Core Classes**

#### **MusicSystem** (`src/features/music/index.js`)
- Manages both music and radio functionality
- Handles mode switching and state management
- Provides unified API for commands

#### **MessageHandler** (`src/handlers/messageHandler.js`)
- Handles prefix commands (`.stop`, `.status`, `.help`)
- Provides quick access to common functions

### **State Management**
```javascript
// System states
currentMode: null | 'music' | 'radio'
currentGuild: Guild object
currentChannel: TextChannel object

// Music state
musicPlayer: discord-player instance
queue: Current music queue

// Radio state
radioPlayer: @discordjs/voice AudioPlayer
radioConnection: VoiceConnection
currentRadioStation: Station object
```

## 🚀 **Setup & Installation**

### **1. Dependencies**
```bash
npm install discord.js @discordjs/voice discord-player discord-player-youtubei ytdl-core play-dl ffmpeg-static sodium libsodium-wrappers node-opus opusscript
```

### **2. Environment Variables**
```env
# Main bot token (required)
BOT_TOKEN=your_discord_bot_token

# Optional: Enhanced features
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
YOUTUBE_API_KEY=your_youtube_api_key
```

### **3. Bot Permissions**
**Text Permissions:**
- Send Messages
- Use Slash Commands
- Embed Links
- Read Message History

**Voice Permissions:**
- Connect
- Speak
- Use Voice Activity

### **4. Start Bot**
```bash
npm run bot
# or
node src/index.js
```

## 🔧 **Configuration**

### **Adding Radio Stations**
Edit `src/features/music/utils/stations.js`:
```javascript
newstation: {
    name: 'New Station Name',
    url: 'https://stream-url-here',
    genre: 'Genre',
    description: 'Station description',
    thumbnail: 'https://image-url',
    emoji: '🎵'
}
```

### **Audio Quality Settings**
```javascript
// In MusicSystem constructor
this.musicPlayer = new Player(client, {
    ytdlOptions: {
        quality: 'highestaudio',     // Audio quality
        highWaterMark: 1 << 25       // Buffer size
    }
});
```

## 📊 **Status & Monitoring**

### **Status Command Output**
```
🎵 Music Mode Active
Current Track: Song Name
Status: ▶️ Playing
Queue Size: 5 songs
Volume: 75%

📻 Radio Mode Active  
Station: Lofi Hip Hop 24/7
Genre: Lofi Hip Hop
Status: 🔴 Live Streaming
Auto-reconnect: ✅ Enabled
```

### **Error Handling**
- ✅ Graceful mode switching conflicts
- ✅ Voice channel permission checks
- ✅ Auto-reconnect for radio streams
- ✅ User-friendly error messages
- ✅ Fallback for failed operations

## 🎯 **Best Practices**

### **For Users**
1. **Always check current mode** before switching
2. **Use `.status`** to see what's currently active
3. **Use `.stop`** for quick mode switching
4. **Join voice channel** before using commands

### **For Developers**
1. **Check mode conflicts** in all commands
2. **Provide clear error messages** for mode switching
3. **Handle voice disconnections** gracefully
4. **Log all mode changes** for debugging

## 🔍 **Troubleshooting**

### **Common Issues**

**"Radio/Music is active" error:**
- Use `.stop` or `/stop` to stop current mode first

**"Not in voice channel" error:**
- Join a voice channel before using music/radio commands

**"No audio playing" error:**
- Check FFmpeg installation
- Verify voice channel permissions
- Try different audio source

**Radio disconnection:**
- Auto-reconnect is enabled (max 10 attempts)
- Check internet connection stability
- Try different radio station

### **Debug Mode**
```env
DEBUG_MODE=true
```
Enables detailed logging for troubleshooting.

---

**🎵 Enjoy your integrated music system!** 🎶

The system provides seamless switching between on-demand music and 24/7 radio streaming, all within a single bot instance.