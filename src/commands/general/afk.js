const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

// Map untuk menyimpan nickname asli user
const afkUsers = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('afk')
        .setDescription('Toggle status AFK - ubah nickname menjadi AFK atau kembali ke nama asli')
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Alasan AFK (opsional)')
                .setRequired(false)
                .setMaxLength(100)
        ),
    async execute(interaction) {
        const reason = interaction.options.getString('reason') || 'AFK';
        const userId = interaction.user.id;
        const member = interaction.member;
        
        try {
            // Check if user is currently AFK
            if (afkUsers.has(userId)) {
                // User is AFK, remove AFK status
                const originalNickname = afkUsers.get(userId);
                
                // Restore original nickname
                await member.setNickname(originalNickname);
                
                // Remove from AFK map
                afkUsers.delete(userId);
                
                await interaction.reply({
                    content: `✅ Status AFK dihapus! Nickname dikembalikan ke: **${originalNickname || interaction.user.username}**`,
                    ephemeral: true
                });
            } else {
                // User is not AFK, set AFK status
                const currentNickname = member.nickname || interaction.user.username;
                
                // Store original nickname
                afkUsers.set(userId, currentNickname);
                
                // Set AFK nickname
                const afkNickname = `AFK - ${currentNickname}`;
                await member.setNickname(afkNickname);
                
                await interaction.reply({
                    content: `💤 Status AFK diaktifkan!\n**Alasan:** ${reason}\n**Nickname diubah menjadi:** ${afkNickname}`,
                    ephemeral: true
                });
            }
        } catch (error) {
            if (error.code === 50013) {
                await interaction.reply({
                    content: '❌ Bot tidak memiliki permission untuk mengganti nickname!',
                    ephemeral: true
                });
            } else if (error.code === 50035) {
                await interaction.reply({
                    content: '❌ Nickname terlalu panjang! Coba dengan nama yang lebih pendek.',
                    ephemeral: true
                });
            } else {
                await interaction.reply({
                    content: '❌ Terjadi error saat mengubah status AFK. Silakan coba lagi nanti.',
                    ephemeral: true
                });
            }
        }
    },
};