const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const GeminiAI = require('../../utils/gemini');

const geminiAI = new GeminiAI();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gemini')
        .setDescription('Kelola pengaturan Gemini AI')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('status')
                .setDescription('Cek status konfigurasi Gemini AI')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('stats')
                .setDescription('Lihat statistik penggunaan Gemini AI')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('clear-all')
                .setDescription('Hapus semua riwayat percakapan Gemini AI')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('clear-user')
                .setDescription('Hapus riwayat percakapan user tertentu')
                .addUserOption(option =>
                    option
                        .setName('user')
                        .setDescription('User yang riwayat percakapannya akan dihapus')
                        .setRequired(true)
                )
        ),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case 'status':
                await handleStatus(interaction);
                break;
            case 'stats':
                await handleStats(interaction);
                break;
            case 'clear-all':
                await handleClearAll(interaction);
                break;
            case 'clear-user':
                await handleClearUser(interaction);
                break;
        }
    },
};

async function handleStatus(interaction) {
    const isConfigured = geminiAI.isConfigured();
    const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    const maxTokens = process.env.GEMINI_MAX_TOKENS || '1000';
    const temperature = process.env.GEMINI_TEMPERATURE || '0.7';
    
    const embed = {
        title: '🤖 Status Gemini AI',
        color: isConfigured ? 0x00ff00 : 0xff0000,
        fields: [
            {
                name: '🔑 API Key',
                value: isConfigured ? '✅ Dikonfigurasi' : '❌ Tidak dikonfigurasi',
                inline: true
            },
            {
                name: '🧠 Model',
                value: model,
                inline: true
            },
            {
                name: '📝 Max Tokens',
                value: maxTokens,
                inline: true
            },
            {
                name: '🌡️ Temperature',
                value: temperature,
                inline: true
            },
            {
                name: '📍 Channel ID',
                value: '1383709247686181006',
                inline: true
            }
        ],
        footer: {
            text: isConfigured ? 'Gemini AI siap digunakan!' : 'Set GEMINI_API_KEY untuk mengaktifkan Gemini AI'
        }
    };

    await interaction.reply({ embeds: [embed], ephemeral: true });
}

async function handleStats(interaction) {
    const stats = geminiAI.getStats();
    
    const embed = {
        title: '📊 Statistik Gemini AI',
        color: 0x0099ff,
        fields: [
            {
                name: '🗣️ Percakapan Aktif',
                value: stats.activeConversations.toString(),
                inline: true
            },
            {
                name: '💬 Total Pesan',
                value: stats.totalMessages.toString(),
                inline: true
            },
            {
                name: '📈 Rata-rata Pesan per Percakapan',
                value: stats.activeConversations > 0 ? 
                    Math.round(stats.totalMessages / stats.activeConversations).toString() : '0',
                inline: true
            }
        ],
        timestamp: new Date().toISOString()
    };

    await interaction.reply({ embeds: [embed], ephemeral: true });
}

async function handleClearAll(interaction) {
    const stats = geminiAI.getStats();
    
    // Clear all conversations
    geminiAI.conversations.clear();
    
    const embed = {
        title: '🗑️ Riwayat Percakapan Dihapus',
        description: `Berhasil menghapus ${stats.activeConversations} percakapan dengan total ${stats.totalMessages} pesan.`,
        color: 0xff9900,
        timestamp: new Date().toISOString()
    };

    await interaction.reply({ embeds: [embed], ephemeral: true });
}

async function handleClearUser(interaction) {
    const user = interaction.options.getUser('user');
    const hadConversation = geminiAI.conversations.has(user.id);
    const messageCount = hadConversation ? geminiAI.conversations.get(user.id).length : 0;
    
    geminiAI.clearHistory(user.id);
    
    const embed = {
        title: '🗑️ Riwayat User Dihapus',
        description: hadConversation ? 
            `Berhasil menghapus riwayat percakapan ${user.username} (${messageCount} pesan).` :
            `${user.username} tidak memiliki riwayat percakapan.`,
        color: hadConversation ? 0xff9900 : 0x999999,
        timestamp: new Date().toISOString()
    };

    await interaction.reply({ embeds: [embed], ephemeral: true });
}