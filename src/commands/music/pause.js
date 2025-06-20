const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause the current song')
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
                .setTitle('❌ No Music Playing')
                .setDescription('There is no music currently playing!')
                .setTimestamp();
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (status.status === 'paused') {
            const embed = new EmbedBuilder()
                .setColor('#ffaa00')
                .setTitle('⚠️ Already Paused')
                .setDescription('The music is already paused!')
                .setTimestamp();
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        try {
            const success = await musicSystem.pauseMusic(interaction.guild);
            
            if (success) {
                const embed = new EmbedBuilder()
                    .setColor('#00ff00')
                    .setTitle('✅ Music Paused')
                    .setDescription(`⏸️ Paused **${status.currentTrack.title}**`)
                    .addFields(
                        { name: 'Paused by', value: interaction.user.toString(), inline: true }
                    )
                    .setTimestamp();
                
                await interaction.reply({ embeds: [embed] });
            } else {
                throw new Error('Failed to pause music');
            }
            
        } catch (error) {
            console.error('Error pausing music:', error);
            
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Pause Failed')
                .setDescription('Failed to pause the music. Please try again.')
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};