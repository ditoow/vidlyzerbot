const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Show the currently playing song or radio station'),

    async execute(interaction) {
        const musicSystem = interaction.client.musicSystem;
        const status = musicSystem.getCurrentStatus();

        if (!status.mode) {
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Nothing Playing')
                .setDescription('There is no music or radio currently playing!')
                .setTimestamp();
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (status.mode === 'music') {
            const queue = musicSystem.getQueue(interaction.guild);
            
            if (!queue || !queue.currentTrack) {
                const embed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('❌ No Music Playing')
                    .setDescription('There is no music currently playing!')
                    .setTimestamp();
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const track = queue.currentTrack;
            const progress = queue.node.createProgressBar();
            
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('🎵 Now Playing')
                .setDescription(`**[${track.title}](${track.url})**`)
                .addFields(
                    { name: 'Artist', value: track.author || 'Unknown', inline: true },
                    { name: 'Duration', value: track.duration || 'Unknown', inline: true },
                    { name: 'Requested by', value: track.requestedBy?.toString() || 'Unknown', inline: true },
                    { name: 'Progress', value: progress, inline: false },
                    { name: 'Volume', value: `${queue.node.volume}%`, inline: true },
                    { name: 'Loop Mode', value: queue.repeatMode === 0 ? 'Off' : queue.repeatMode === 1 ? 'Track' : 'Queue', inline: true },
                    { name: 'Queue Length', value: `${queue.tracks.data.length} songs`, inline: true }
                )
                .setTimestamp();

            if (track.thumbnail) {
                embed.setThumbnail(track.thumbnail);
            }

            // Add pause/play status
            if (queue.node.isPaused()) {
                embed.addFields({ name: 'Status', value: '⏸️ Paused', inline: true });
            } else {
                embed.addFields({ name: 'Status', value: '▶️ Playing', inline: true });
            }

            await interaction.reply({ embeds: [embed] });

        } else if (status.mode === 'radio') {
            const station = status.currentStation;

            const embed = new EmbedBuilder()
                .setColor('#4ecdc4')
                .setTitle('📻 Currently Streaming')
                .setDescription(`**${station.name}**`)
                .addFields(
                    { name: 'Genre', value: station.genre, inline: true },
                    { name: 'Status', value: '🔴 Live', inline: true },
                    { name: 'Voice Channel', value: status.channel?.name || 'Unknown', inline: true }
                )
                .setFooter({ text: '24/7 Radio • Auto-reconnect enabled' })
                .setTimestamp();

            if (station.thumbnail) {
                embed.setThumbnail(station.thumbnail);
            }

            embed.addFields({
                name: 'Description',
                value: station.description,
                inline: false
            });

            await interaction.reply({ embeds: [embed] });
        }
    }
};