# 🤖 Gemini AI Integration Setup

Bot ini sekarang memiliki fitur Gemini AI yang terintegrasi untuk channel tertentu dengan **API GRATIS**!

## 🎉 Keunggulan Gemini AI

- ✅ **GRATIS** - Google memberikan kuota gratis yang sangat generous
- ✅ **Cerdas** - Performa setara dengan GPT-3.5/GPT-4
- ✅ **Cepat** - Response time yang baik
- ✅ **Bahasa Indonesia** - Support bahasa Indonesia dengan baik

## 🚀 Fitur

- **Chat AI**: Percakapan dengan Gemini AI di channel khusus
- **Riwayat Percakapan**: Bot mengingat konteks percakapan per user
- **Perintah Khusus**: Reset percakapan dan lihat statistik
- **Admin Commands**: Kelola pengaturan Gemini AI via slash commands

## ⚙️ Setup (MUDAH & GRATIS!)

### 1. Dapatkan Gemini API Key (GRATIS)

1. Kunjungi [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Login dengan akun Google Anda
3. Klik "Create API Key"
4. Pilih project atau buat project baru
5. Salin API key yang dihasilkan

### 2. Konfigurasi Environment Variables

Tambahkan environment variables berikut:

```bash
# Required - Gemini API Key (GRATIS!)
GEMINI_API_KEY=your_gemini_api_key_here

# Optional - Model Configuration
GEMINI_MODEL=gemini-pro                 # Default: gemini-pro
GEMINI_MAX_TOKENS=1000                  # Default: 1000
GEMINI_TEMPERATURE=0.7                  # Default: 0.7
```

### 3. Cara Setup API Key

**Opsi A: File .env (Recommended)**
```bash
# Buat file .env di root project
GEMINI_API_KEY=your_actual_api_key_here
```

**Opsi B: Config JSON**
Edit `src/config/config.json`:
```json
{
  "geminiApiKey": "your_actual_api_key_here"
}
```

### 4. Restart Bot

```bash
npm run bot
```

## 📍 Channel Configuration

Gemini AI aktif di channel dengan ID: `1383709247686181006`

Untuk mengubah channel, edit file `src/events/messageCreate.js`:
```javascript
const GEMINI_CHANNEL_ID = 'your_channel_id_here';
```

## 🎯 Cara Penggunaan

### User Commands (di Gemini AI channel)

- **Chat biasa**: Ketik pesan apapun untuk berbicara dengan AI
- **`!clear` atau `!reset`**: Hapus riwayat percakapan Anda
- **`!stats`**: Lihat statistik penggunaan Gemini AI

### Admin Commands (Slash Commands)

- **`/gemini status`**: Cek status konfigurasi Gemini AI
- **`/gemini stats`**: Lihat statistik penggunaan detail
- **`/gemini clear-all`**: Hapus semua riwayat percakapan
- **`/gemini clear-user @user`**: Hapus riwayat percakapan user tertentu

## 🔧 Konfigurasi Model

### Model Options
- `gemini-pro` (Default, gratis, sangat bagus)
- `gemini-pro-vision` (Untuk gambar, belum diimplementasi)

### Temperature (0.0 - 1.0)
- `0.0`: Sangat konsisten, deterministik
- `0.7`: Seimbang (Default)
- `1.0`: Sangat kreatif

### Max Tokens
- Menentukan panjang maksimum respons
- Default: 1000 tokens
- 1 token ≈ 0.75 kata

## 💰 Biaya (GRATIS!)

### Kuota Gratis Gemini AI:
- **15 requests per menit**
- **1,500 requests per hari**
- **1 juta tokens per bulan**

Ini sangat cukup untuk penggunaan Discord bot normal!

### Estimasi Penggunaan:
- Chat ringan (50 pesan/hari): **100% GRATIS**
- Chat sedang (200 pesan/hari): **100% GRATIS**
- Chat berat (500+ pesan/hari): **Mungkin perlu upgrade**

## 🛠️ Troubleshooting

### Error: "Gemini AI belum dikonfigurasi"
- Pastikan `GEMINI_API_KEY` sudah diset
- Restart bot setelah menambah environment variable

### Error: "API key Gemini tidak valid"
- Cek kembali API key di Google AI Studio
- Pastikan API key masih aktif

### Error: "Rate limit tercapai"
- Anda mencapai batas 15 requests/menit
- Tunggu 1 menit atau kurangi penggunaan

### Bot tidak merespons di channel
- Pastikan channel ID benar: `1383709247686181006`
- Cek permission bot di channel tersebut
- Pastikan bot tidak sedang offline

## 🔒 Keamanan

- Jangan share API key Gemini Anda
- Gunakan environment variables, jangan hardcode di kode
- Monitor penggunaan API secara berkala di Google AI Studio

## 📝 Catatan

- Riwayat percakapan disimpan di memory (hilang saat restart)
- Setiap user memiliki riwayat percakapan terpisah
- Bot menyimpan maksimal 10 pesan terakhir per user untuk konteks
- Pesan panjang akan dipecah otomatis sesuai limit Discord (2000 karakter)

## 🆚 Perbandingan dengan ChatGPT

| Fitur | Gemini AI | ChatGPT |
|-------|-----------|---------|
| **Biaya** | ✅ GRATIS | ❌ Berbayar |
| **Kualitas** | ✅ Sangat Baik | ✅ Sangat Baik |
| **Bahasa Indonesia** | ✅ Bagus | ✅ Bagus |
| **Rate Limit** | 15/menit | Tergantung plan |
| **Setup** | ✅ Mudah | ⚠️ Perlu kartu kredit |

## 🎊 Kesimpulan

Gemini AI adalah pilihan terbaik untuk Discord bot karena:
- **100% GRATIS** untuk penggunaan normal
- **Kualitas setara ChatGPT**
- **Setup mudah tanpa kartu kredit**
- **Kuota yang sangat generous**

Langsung coba sekarang! 🚀