# 🎉 JF Message - Welcome & Goodbye System

Sistem welcome dan goodbye message yang lengkap dengan embed yang menarik dan customizable.

## 🚀 Fitur

### ✅ **Welcome Messages**
- Embed yang menarik dengan informasi lengkap
- Avatar user sebagai thumbnail
- Informasi user (tag, ID, tanggal join)
- Statistik server (jumlah member)
- Tips untuk member baru
- Customizable message dan warna

### ✅ **Goodbye Messages**
- Embed farewell yang elegan
- Informasi user yang keluar
- Lama waktu di server
- Statistik member yang tersisa
- Customizable message dan warna

### ✅ **Customization**
- Custom welcome/goodbye message dengan placeholder
- Custom warna embed
- Toggle show/hide avatar
- Toggle show/hide member count
- Separate channel untuk welcome dan goodbye

## 📋 Commands

### `/welcome test`
Test welcome atau goodbye message dengan user saat ini
- **Options:**
  - `type`: welcome atau goodbye

### `/welcome setup`
Setup channel untuk welcome/goodbye message
- **Options:**
  - `welcome-channel`: Channel untuk welcome message
  - `goodbye-channel`: Channel untuk goodbye message

### `/welcome toggle`
Enable/disable welcome atau goodbye message
- **Options:**
  - `type`: welcome atau goodbye
  - `enabled`: true/false

### `/welcome message`
Ubah pesan welcome/goodbye
- **Options:**
  - `type`: welcome atau goodbye
  - `message`: Pesan baru dengan placeholder

### `/welcome settings`
Ubah pengaturan tampilan
- **Options:**
  - `welcome-color`: Warna embed welcome (hex)
  - `goodbye-color`: Warna embed goodbye (hex)
  - `show-avatar`: Tampilkan avatar
  - `show-member-count`: Tampilkan jumlah member
  - `show-welcome-image`: Tampilkan gambar welcome (disabled)

### `/welcome status`
Lihat status dan pengaturan welcome system

## 🎨 Placeholder Variables

Gunakan placeholder berikut dalam custom message:

- `{user}` - Mention user (@username)
- `{username}` - Username tanpa mention
- `{server}` - Nama server
- `{membercount}` - Jumlah total member

**Contoh:**
```
Selamat datang {user} di **{server}**! 🎉
Kamu adalah member ke-{membercount}!
```

## 🎯 Default Settings

```javascript
{
    welcomeEnabled: true,
    goodbyeEnabled: true,
    welcomeChannel: null,
    goodbyeChannel: null,
    welcomeMessage: 'Selamat datang {user} di **{server}**! 🎉',
    goodbyeMessage: 'Selamat tinggal {user}! Terima kasih telah bergabung di **{server}** 👋',
    welcomeColor: '#00ff00',
    goodbyeColor: '#ff0000',
    showMemberCount: true,
    showAvatar: true,
    showWelcomeImage: true
}
```

## 🔧 Setup Guide

### 1. Setup Channels
```
/welcome setup welcome-channel:#welcome goodbye-channel:#goodbye
```

### 2. Customize Messages
```
/welcome message type:welcome message:Halo {user}! Selamat datang di {server}! 🎊
/welcome message type:goodbye message:Dadah {user}! Sampai jumpa lagi! 👋
```

### 3. Customize Colors
```
/welcome settings welcome-color:#7289da goodbye-color:#f04747
```

### 4. Test Messages
```
/welcome test type:welcome
/welcome test type:goodbye
```

## 📁 File Structure

```
src/features/jfmessage/
├── welcome-manager.js      # Core welcome system logic
├── commands/
│   └── welcome.js         # Slash command handler
├── events/
│   ├── guildMemberAdd.js  # Welcome event handler
│   └── guildMemberRemove.js # Goodbye event handler
└── README.md              # Documentation
```

## 🎨 Embed Design

### Welcome Embed
- **Title:** 🎉 Welcome to [Server Name]!
- **Author:** Username dengan avatar
- **Thumbnail:** User avatar
- **Color:** Customizable (default: green)
- **Fields:**
  - 👤 User Information
  - 📊 Server Stats
  - 📅 Account Info
  - 💡 Getting Started Tips

### Goodbye Embed
- **Title:** 👋 Goodbye from [Server Name]
- **Author:** Username dengan avatar
- **Thumbnail:** User avatar
- **Color:** Customizable (default: red)
- **Fields:**
  - 👤 User Information
  - 📊 Server Stats
  - ⏰ Time in Server

## 🔮 Future Features

- [ ] Welcome card image generation (canvas)
- [ ] Role assignment on join
- [ ] Welcome DM messages
- [ ] Multiple welcome channels
- [ ] Scheduled welcome messages
- [ ] Welcome message templates
- [ ] Analytics dashboard

## 🛠️ Technical Notes

- Events automatically loaded by enhanced event handler
- Commands automatically loaded by enhanced command handler
- Memory-based settings (consider database for persistence)
- Modular design for easy extension
- Error handling for missing channels/permissions

## 🎊 Usage Examples

### Basic Setup
1. Run `/welcome setup` to set channels
2. Test with `/welcome test type:welcome`
3. Customize messages and colors as needed

### Advanced Customization
1. Create custom messages with placeholders
2. Set different colors for welcome/goodbye
3. Toggle features on/off as needed
4. Monitor with `/welcome status`

**Sistem welcome message siap digunakan!** 🚀