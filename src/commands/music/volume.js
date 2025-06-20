const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Set the music volume')
        .addIntegerOption(option =>
            option
                .setName('level')
                .setDescription('Volume level (1-100)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Connect),

    async execute(interaction) {
        const member = interaction.member;
        const volume = interaction.options.getInteger('level');
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
            const queue = musicSystem.getQueue(interaction.guild);
            const oldVolume = queue.node.volume;
            
            const success = await musicSystem.setVolume(interaction.guild, volume);
            
            if (success) {
                const embed = new EmbedBuilder()
                    .setColor('#00ff00')
                    .setTitle('✅ Volume Changed')
                    .setDescription(`🔊 Volume changed from **${oldVolume}%** to **${volume}%**`)
                    .addFields(
                        { name: 'Changed by', value: interaction.user.toString(), inline: true }
                    )
                    .setTimestamp();
                
                // Add volume indicator
                const volumeBar = '█'.repeat(Math.floor(volume / 10)) + '░'.repeat(10 - Math.floor(volume / 10));
                embed.addFields(
                    { name: 'Volume Bar', value: `\`${volumeBar}\` ${volume}%`, inline: false }
                );
                
                await interaction.reply({ embeds: [embed] });
            } else {
                throw new Error('Failed to change volume');
            }
            
        } catch (error) {
            console.error('Error changing volume:', error);
            
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Volume Change Failed')
                .setDescription('Failed to change the volume. Please try again.')
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};