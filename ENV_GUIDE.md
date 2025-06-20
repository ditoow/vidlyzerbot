# 🔧 Environment Variables Guide

Panduan lengkap untuk konfigurasi environment variables VidlyzerBot system.

## 📁 File Location

**Semua environment variables dikonfigurasi dalam satu file:**
```
📁 vidlyzerbot/
└── 📄 .env  (copy dari .env.example)
```

## 🤖 Bot Tokens Required

### Main Bot (Required)
```env
BOT_TOKEN=your_discord_bot_token_here
CLIENT_ID=your_discord_client_id_here
GUILD_ID=your_discord_guild_id_here
```

### Music & Radio Bots (Optional)
```env
MUSIC_BOT_TOKEN=your_music_bot_token_here
RADIO_BOT_TOKEN=your_radio_bot_token_here
```

## 🎵 Music System Configuration

### Feature Flags
```env
# Enable/Disable entire systems
ENABLE_MUSIC_BOT=true          # Enable music bot
ENABLE_RADIO_BOT=true          # Enable radio bot
ENABLE_SPOTIFY_INTEGRATION=true # Enable Spotify features
ENABLE_YOUTUBE_INTEGRATION=true # Enable YouTube features
```

### Audio Settings
```env
DEFAULT_VOLUME=50              # Default volume (1-100)
MAX_QUEUE_SIZE=100            # Maximum songs in queue
AUDIO_QUALITY=high            # Audio quality (low/medium/high)
MAX_CONCURRENT_STREAMS=2      # Max simultaneous streams
AUDIO_BUFFER_SIZE=1024        # Audio buffer size
VOICE_CONNECTION_TIMEOUT=30000 # Voice connection timeout (ms)
```

### Radio Settings
```env
RADIO_AUTO_RECONNECT=true           # Auto-reconnect on disconnect
RADIO_RECONNECT_DELAY=5000          # Delay before reconnect (ms)
RADIO_MAX_RECONNECT_ATTEMPTS=10     # Max reconnection attempts
```

## 🔑 External API Keys

### Spotify API (Optional)
```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```
**Get from:** https://developer.spotify.com/dashboard/applications

### YouTube API (Optional)
```env
YOUTUBE_API_KEY=your_youtube_api_key
```
**Get from:** https://console.developers.google.com/

### Gemini AI (For main bot)
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
GEMINI_MAX_TOKENS=1000
GEMINI_TEMPERATURE=0.7
```

## ⚙️ System Configuration

### Logging
```env
LOG_LEVEL=info                # Logging level (debug/info/warn/error)
ENABLE_DEBUG_LOGS=false       # Enable debug logging
```

### Performance
```env
MAX_MEMORY_USAGE=512          # Max memory usage (MB)
GARBAGE_COLLECTION_INTERVAL=300000 # GC interval (ms)
HEALTH_CHECK_INTERVAL=60000   # Health check interval (ms)
```

### Development
```env
NODE_ENV=production           # Environment (development/production)
DEBUG_MODE=false             # Debug mode
ENABLE_HOT_RELOAD=false      # Hot reload (development only)
```

### Hosting (Pterodactyl)
```env
PTERODACTYL_MODE=true         # Enable Pterodactyl optimizations
AUTO_RESTART_ON_CRASH=true    # Auto-restart on crash
```

## 🚀 Quick Setup Guide

### 1. Copy Template
```bash
cp .env.example .env
```

### 2. Basic Setup (Main Bot Only)
```env
BOT_TOKEN=your_main_bot_token
CLIENT_ID=your_client_id
GUILD_ID=your_guild_id
GEMINI_API_KEY=your_gemini_key
```

### 3. Music System Setup
```env
# Add to existing .env
MUSIC_BOT_TOKEN=your_music_bot_token
RADIO_BOT_TOKEN=your_radio_bot_token
ENABLE_MUSIC_BOT=true
ENABLE_RADIO_BOT=true
```

### 4. Optional Enhancements
```env
# Spotify integration
SPOTIFY_CLIENT_ID=your_spotify_id
SPOTIFY_CLIENT_SECRET=your_spotify_secret

# YouTube API
YOUTUBE_API_KEY=your_youtube_key
```

## 🔍 Validation

### Check Configuration
```bash
# From botmusic directory
node -e "console.log(require('./shared/config'))"
```

### Test Bot Tokens
```bash
# Start specific bots
cd botmusic
npm run music  # Test music bot only
npm run radio  # Test radio bot only
npm start      # Test both bots
```

## 🐛 Troubleshooting

### Common Issues

#### "No bot tokens found"
- Check `.env` file exists in root directory
- Verify token format (no quotes, no spaces)
- Ensure `ENABLE_MUSIC_BOT=true` or `ENABLE_RADIO_BOT=true`

#### "Invalid token"
- Verify token from Discord Developer Portal
- Check token hasn't expired
- Ensure bot has proper permissions

#### "Module not found"
- Run `npm install` in both root and botmusic directories
- Check Node.js version compatibility

### Debug Mode
```env
DEBUG_MODE=true
LOG_LEVEL=debug
ENABLE_DEBUG_LOGS=true
```

## 📊 Environment Examples

### Development Setup
```env
NODE_ENV=development
DEBUG_MODE=true
LOG_LEVEL=debug
ENABLE_HOT_RELOAD=true
AUTO_RESTART_ON_CRASH=false
```

### Production Setup
```env
NODE_ENV=production
DEBUG_MODE=false
LOG_LEVEL=info
PTERODACTYL_MODE=true
AUTO_RESTART_ON_CRASH=true
MAX_MEMORY_USAGE=512
```

### Testing Setup
```env
ENABLE_MUSIC_BOT=false
ENABLE_RADIO_BOT=false
# Only main bot for testing
```

## 🔒 Security Notes

- **Never commit `.env` file to git**
- Keep API keys secure
- Use different tokens for development/production
- Regularly rotate sensitive keys
- Use environment-specific configurations

## 📝 Template Sections

The `.env.example` file is organized into sections:

1. **Main Bot Configuration** - Core bot settings
2. **Music & Radio Bots** - Music system tokens
3. **External API Configuration** - Third-party APIs
4. **Music System Settings** - Audio and radio settings
5. **System Configuration** - Performance and logging
6. **Feature Flags** - Enable/disable features
7. **Development Settings** - Development options
8. **Hosting Configuration** - Pterodactyl and hosting

---

**💡 Tip:** Start with basic configuration and gradually add features as needed!