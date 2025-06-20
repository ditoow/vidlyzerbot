const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop current music or radio and clear queue')
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

        if (!status.mode) {
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Nothing Playing')
                .setDescription('There is no music or radio currently playing!')
                .setTimestamp();
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        try {
            await musicSystem.stopCurrent();

            let embed;
            
            if (status.mode === 'music') {
                embed = new EmbedBuilder()
                    .setColor('#00ff00')
                    .setTitle('✅ Music Stopped')
                    .setDescription('🎵 Music stopped and queue cleared!')
                    .addFields(
                        { name: 'Stopped by', value: interaction.user.toString(), inline: true },
                        { name: 'Tracks Cleared', value: (status.queueSize + (status.currentTrack ? 1 : 0)).toString(), inline: true }
                    )
                    .setTimestamp();
            } else if (status.mode === 'radio') {
                embed = new EmbedBuilder()
                    .setColor('#00ff00')
                    .setTitle('✅ Radio Stopped')
                    .setDescription(`📻 Stopped **${status.currentStation.name}** and disconnected from voice channel.`)
                    .addFields(
                        { name: 'Stopped by', value: interaction.user.toString(), inline: true }
                    )
                    .setTimestamp();
            }

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error stopping:', error);

            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Stop Failed')
                .setDescription('Failed to stop the current activity. Please try again.')
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};