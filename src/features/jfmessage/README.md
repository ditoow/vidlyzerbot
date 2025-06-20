# 🎉 JF Message - Welcome & Goodbye System

Sistem welcome dan goodbye message sederhana dengan embed yang menarik dan customizable melalui file JSON.

## 🚀 Fitur

### ✅ **Welcome Messages**
- Embed yang menarik dengan informasi lengkap
- Avatar user sebagai thumbnail
- Informasi user (tag, ID, tanggal join)
- Statistik server (jumlah member)
- Tips untuk member baru
- Template dapat diubah melalui file JSON

### ✅ **Goodbye Messages**
- Embed farewell yang elegan
- Informasi user yang keluar
- Lama waktu di server
- Statistik member yang tersisa
- Template dapat diubah melalui file JSON

## 📋 Commands

### `/welcome test`
Test welcome message dengan user saat ini

**Contoh penggunaan:**
```
/welcome test
```

### `/goodbye test`
Test goodbye message dengan user saat ini

**Contoh penggunaan:**
```
/goodbye test
```

## 🎨 Placeholder Variables

Gunakan placeholder berikut dalam template JSON:

- `{user}` - Mention user (@username)
- `{username}` - Username tanpa mention
- `{user_id}` - ID user
- `{server}` - Nama server
- `{membercount}` - Jumlah total member
- `{account_created}` - Tanggal akun dibuat (Discord timestamp)
- `{joined_date}` - Tanggal join server (Discord timestamp)
- `{time_in_server}` - Lama waktu di server (dalam hari)
- `{date}` - Tanggal saat ini
- `{user_avatar}` - URL avatar user
- `{server_icon}` - URL icon server

## 📁 File Structure

```
src/features/jfmessage/
├── welcome-embed.json     # Template embed untuk welcome message
├── goodbye-embed.json     # Template embed untuk goodbye message
├── commands/
│   ├── welcome.js         # Command /welcome test
│   └── goodbye.js         # Command /goodbye test
├── events/
│   ├── guildMemberAdd.js  # Event handler ketika user join
│   └── guildMemberRemove.js # Event handler ketika user leave
└── README.md              # Documentation
```

## 🎨 Kustomisasi Template

### Welcome Template
Edit file `welcome-embed.json` untuk mengubah template welcome message:
```json
{
  "title": "🎉 Selamat Datang di {server}!",
  "description": "Pesan welcome custom...",
  "color": "#00ff88",
  "thumbnail": "{user_avatar}",
  "fields": [...],
  "footer": {...},
  "timestamp": true
}
```

### Goodbye Template
Edit file `goodbye-embed.json` untuk mengubah template goodbye message:
```json
{
  "title": "👋 Selamat Tinggal dari {server}",
  "description": "Pesan goodbye custom...",
  "color": "#ff4444",
  "thumbnail": "{user_avatar}",
  "fields": [...],
  "footer": {...},
  "timestamp": true
}
```

## 🔧 Setup Guide

### 1. Test Messages
```
/welcome test
/goodbye test
```

### 2. Kustomisasi Template
Edit file `src/features/jfmessage/welcome-embed.json` dan `goodbye-embed.json` sesuai kebutuhan

### 3. Channel Detection
Bot akan otomatis mencari channel dengan nama:
- **Welcome:** `welcome`, `general`, `chat`
- **Goodbye:** `goodbye`, `farewell`, `general`, `chat`

## 🎊 Cara Kerja

1. **User Join:** Event `guildMemberAdd` akan trigger dan mengirim welcome message
2. **User Leave:** Event `guildMemberRemove` akan trigger dan mengirim goodbye message
3. **Test Commands:** `/welcome test` dan `/goodbye test` untuk preview message tanpa perlu user join/leave

## 🛠️ Technical Notes

- Events otomatis loaded oleh enhanced event handler
- Commands otomatis loaded oleh enhanced command handler
- Template disimpan dalam file JSON untuk kemudahan editing
- Automatic channel detection berdasarkan nama channel
- Error handling untuk missing channels/permissions

**Sistem welcome message siap digunakan!** 🚀