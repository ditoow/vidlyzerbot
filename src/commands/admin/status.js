const { SlashCommandBuilder, ActivityType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Mengatur status bot')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Jenis aktivitas')
                .setRequired(true)
                .addChoices(
                    { name: 'Playing', value: 'playing' },
                    { name: 'Watching', value: 'watching' },
                    { name: 'Listening', value: 'listening' },
                    { name: 'Competing', value: 'competing' }
                ))
        .addStringOption(option =>
            option.setName('activity')
                .setDescription('Nama aktivitas')
                .setRequired(true)),
    
    async execute(interaction) {
        const type = interaction.options.getString('type');
        const activity = interaction.options.getString('activity');
        
        // Mapping tipe aktivitas
        const activityTypes = {
            'playing': ActivityType.Playing,
            'watching': ActivityType.Watching,
            'listening': ActivityType.Listening,
            'competing': ActivityType.Competing
        };
        
        try {
            // Set status bot
            interaction.client.user.setActivity(activity, { type: activityTypes[type] });
            
            await interaction.reply({
                content: `✅ Status bot berhasil diubah menjadi **${type.charAt(0).toUpperCase() + type.slice(1)} ${activity}**`,
                ephemeral: true
            });
        } catch (error) {
            console.error('Error setting status:', error);
            await interaction.reply({
                content: '❌ Terjadi kesalahan saat mengatur status bot.',
                ephemeral: true
            });
        }
    },
};