const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current song')
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

        try {
            const currentTrack = status.currentTrack;
            const success = await musicSystem.skipMusic(interaction.guild);
            
            if (success) {
                const queue = musicSystem.getQueue(interaction.guild);
                
                const embed = new EmbedBuilder()
                    .setColor('#00ff00')
                    .setTitle('✅ Song Skipped')
                    .setDescription(`⏭️ Skipped **${currentTrack.title}**`)
                    .addFields(
                        { name: 'Skipped by', value: interaction.user.toString(), inline: true }
                    )
                    .setTimestamp();
                
                if (queue && queue.tracks.data.length > 0) {
                    embed.addFields(
                        { name: 'Next Song', value: queue.tracks.data[0].title, inline: true }
                    );
                }
                
                await interaction.reply({ embeds: [embed] });
            } else {
                const embed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('❌ Skip Failed')
                    .setDescription('Failed to skip the current song.')
                    .setTimestamp();
                
                await interaction.reply({ embeds: [embed], ephemeral: true });
            }
            
        } catch (error) {
            console.error('Error skipping song:', error);
            
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Skip Failed')
                .setDescription('Failed to skip the song. Please try again.')
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};