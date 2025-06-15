# ChatGPT Integration Setup

Bot ini sekarang memiliki fitur ChatGPT yang terintegrasi untuk channel tertentu.

## 🚀 Fitur

- **Chat AI**: Percakapan dengan ChatGPT di channel khusus
- **Riwayat Percakapan**: Bot mengingat konteks percakapan per user
- **Perintah Khusus**: Reset percakapan dan lihat statistik
- **Admin Commands**: Kelola pengaturan ChatGPT via slash commands

## ⚙️ Setup

### 1. Dapatkan OpenAI API Key

1. Kunjungi [OpenAI Platform](https://platform.openai.com/)
2. Buat akun atau login
3. Pergi ke [API Keys](https://platform.openai.com/api-keys)
4. Buat API key baru
5. Salin API key tersebut

### 2. Konfigurasi Environment Variables

Tambahkan environment variables berikut:

```bash
# Required - OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Optional - Model Configuration
OPENAI_MODEL=gpt-3.5-turbo          # Default: gpt-3.5-turbo
OPENAI_MAX_TOKENS=1000              # Default: 1000
OPENAI_TEMPERATURE=0.7              # Default: 0.7
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Restart Bot

```bash
npm run bot
```

## 📍 Channel Configuration

ChatGPT aktif di channel dengan ID: `1383709247686181006`

Untuk mengubah channel, edit file `src/events/messageCreate.js`:
```javascript
const CHATGPT_CHANNEL_ID = 'your_channel_id_here';
```

## 🎯 Cara Penggunaan

### User Commands (di ChatGPT channel)

- **Chat biasa**: Ketik pesan apapun untuk berbicara dengan AI
- **`!clear` atau `!reset`**: Hapus riwayat percakapan Anda
- **`!stats`**: Lihat statistik penggunaan ChatGPT

### Admin Commands (Slash Commands)

- **`/chatgpt status`**: Cek status konfigurasi ChatGPT
- **`/chatgpt stats`**: Lihat statistik penggunaan detail
- **`/chatgpt clear-all`**: Hapus semua riwayat percakapan
- **`/chatgpt clear-user @user`**: Hapus riwayat percakapan user tertentu

## 🔧 Konfigurasi Model

### Model Options
- `gpt-3.5-turbo` (Default, lebih murah)
- `gpt-4` (Lebih pintar, lebih mahal)
- `gpt-4-turbo-preview` (Terbaru)

### Temperature (0.0 - 2.0)
- `0.0`: Sangat konsisten, deterministik
- `0.7`: Seimbang (Default)
- `1.0`: Lebih kreatif
- `2.0`: Sangat kreatif, tidak terprediksi

### Max Tokens
- Menentukan panjang maksimum respons
- Default: 1000 tokens
- 1 token ≈ 0.75 kata dalam bahasa Inggris

## 💰 Biaya

- ChatGPT API berbayar berdasarkan penggunaan
- Cek pricing di [OpenAI Pricing](https://openai.com/pricing)
- Set limits di OpenAI dashboard untuk mengontrol biaya

## 🛠️ Troubleshooting

### Error: "ChatGPT belum dikonfigurasi"
- Pastikan `OPENAI_API_KEY` sudah diset
- Restart bot setelah menambah environment variable

### Error: "API key ChatGPT tidak valid"
- Cek kembali API key di OpenAI dashboard
- Pastikan API key masih aktif dan tidak expired

### Error: "Rate limit tercapai"
- Anda mencapai batas penggunaan API
- Tunggu beberapa menit atau upgrade plan OpenAI

### Bot tidak merespons di channel
- Pastikan channel ID benar: `1383709247686181006`
- Cek permission bot di channel tersebut
- Pastikan bot tidak sedang offline

## 🔒 Keamanan

- Jangan share API key OpenAI Anda
- Gunakan environment variables, jangan hardcode di kode
- Monitor penggunaan API secara berkala
- Set spending limits di OpenAI dashboard

## 📝 Catatan

- Riwayat percakapan disimpan di memory (hilang saat restart)
- Setiap user memiliki riwayat percakapan terpisah
- Bot menyimpan maksimal 10 pesan terakhir per user untuk konteks
- Pesan panjang akan dipecah otomatis sesuai limit Discord (2000 karakter)