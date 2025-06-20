const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resume the paused song')
        .setDefaultMemberPermissions(PermissionFlagsBits.Connect),

    async execute(interaction) {
        const member = interaction.member;
        const musicSystem = interaction.client.musicSystem;

        // Check if user is in a voice channel
        if (!member.voice.channel) {
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Not in Voice Channel')
                .setDescription('You need to be in a voice channel to use this command!')
                .setTimestamp();
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const status = musicSystem.getCurrentStatus();

        if (status.mode !== 'music') {
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ No Music to Resume')
                .setDescription('There is no music to resume!')
                .setTimestamp();
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (status.status !== 'paused') {
            const embed = new EmbedBuilder()
                .setColor('#ffaa00')
                .setTitle('⚠️ Not Paused')
                .setDescription('The music is not paused!')
                .setTimestamp();
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        try {
            const success = await musicSystem.resumeMusic(interaction.guild);
            
            if (success) {
                const embed = new EmbedBuilder()
                    .setColor('#00ff00')
                    .setTitle('✅ Music Resumed')
                    .setDescription(`▶️ Resumed **${status.currentTrack.title}**`)
                    .addFields(
                        { name: 'Resumed by', value: interaction.user.toString(), inline: true }
                    )
                    .setTimestamp();
                
                await interaction.reply({ embeds: [embed] });
            } else {
                throw new Error('Failed to resume music');
            }
            
        } catch (error) {
            console.error('Error resuming music:', error);
            
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Resume Failed')
                .setDescription('Failed to resume the music. Please try again.')
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};