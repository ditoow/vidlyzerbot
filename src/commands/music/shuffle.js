const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffle the current queue')
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
                .setTitle('❌ No Music Queue')
                .setDescription('There is no music queue to shuffle!')
                .setTimestamp();
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const queue = musicSystem.getQueue(interaction.guild);

        if (!queue || queue.tracks.data.length === 0) {
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Empty Queue')
                .setDescription('There are no songs in the queue to shuffle!')
                .setTimestamp();
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (queue.tracks.data.length < 2) {
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Not Enough Songs')
                .setDescription('You need at least 2 songs in the queue to shuffle!')
                .setTimestamp();
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        try {
            const trackCount = queue.tracks.data.length;
            const success = await musicSystem.shuffleQueue(interaction.guild);
            
            if (success) {
                const embed = new EmbedBuilder()
                    .setColor('#00ff00')
                    .setTitle('✅ Queue Shuffled')
                    .setDescription(`🔀 Shuffled **${trackCount}** songs in the queue!`)
                    .addFields(
                        { name: 'Shuffled by', value: interaction.user.toString(), inline: true },
                        { name: 'Next Song', value: queue.tracks.data[0]?.title || 'None', inline: true }
                    )
                    .setTimestamp();
                
                await interaction.reply({ embeds: [embed] });
            } else {
                throw new Error('Failed to shuffle queue');
            }
            
        } catch (error) {
            console.error('Error shuffling queue:', error);
            
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Shuffle Failed')
                .setDescription('Failed to shuffle the queue. Please try again.')
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};