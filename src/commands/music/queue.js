const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Show the current music queue')
        .addIntegerOption(option =>
            option
                .setName('page')
                .setDescription('Page number to display')
                .setMinValue(1)
        ),

    async execute(interaction) {
        const musicSystem = interaction.client.musicSystem;
        const status = musicSystem.getCurrentStatus();

        if (status.mode !== 'music') {
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ No Music Queue')
                .setDescription('There is no music currently playing!')
                .setTimestamp();
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const queue = musicSystem.getQueue(interaction.guild);
        
        if (!queue || (!queue.currentTrack && queue.tracks.data.length === 0)) {
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Empty Queue')
                .setDescription('There are no songs in the queue!')
                .setTimestamp();
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const page = interaction.options.getInteger('page') || 1;
        const tracksPerPage = 10;
        const tracks = queue.tracks.data;
        const totalPages = Math.ceil(tracks.length / tracksPerPage);

        if (page > totalPages && totalPages > 0) {
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Invalid Page')
                .setDescription(`Page ${page} doesn't exist! There are only ${totalPages} pages.`)
                .setTimestamp();
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('🎵 Music Queue')
            .setTimestamp()
            .setFooter({ 
                text: `Page ${page}/${totalPages || 1} • ${tracks.length} songs in queue`,
                iconURL: interaction.client.user.displayAvatarURL()
            });

        // Current track
        if (queue.currentTrack) {
            const current = queue.currentTrack;
            const progress = queue.node.createProgressBar();
            
            embed.addFields({
                name: '▶️ Now Playing',
                value: `**[${current.title}](${current.url})**\n` +
                       `By: ${current.author}\n` +
                       `Duration: ${current.duration}\n` +
                       `Requested by: ${current.requestedBy}\n` +
                       `${progress}`,
                inline: false
            });
        }

        // Queue tracks
        if (tracks.length > 0) {
            const startIndex = (page - 1) * tracksPerPage;
            const endIndex = Math.min(startIndex + tracksPerPage, tracks.length);
            const pageTracksList = tracks.slice(startIndex, endIndex);

            let queueList = '';
            pageTracksList.forEach((track, index) => {
                const position = startIndex + index + 1;
                queueList += `**${position}.** [${track.title}](${track.url})\n`;
                queueList += `└ By: ${track.author} • ${track.duration} • ${track.requestedBy}\n\n`;
            });

            embed.addFields({
                name: '📋 Up Next',
                value: queueList || 'No songs in queue',
                inline: false
            });
        }

        // Queue stats
        if (tracks.length > 0) {
            const totalDuration = tracks.reduce((acc, track) => {
                const duration = track.durationMS || 0;
                return acc + duration;
            }, 0);

            const hours = Math.floor(totalDuration / 3600000);
            const minutes = Math.floor((totalDuration % 3600000) / 60000);
            const seconds = Math.floor((totalDuration % 60000) / 1000);
            
            let durationString = '';
            if (hours > 0) durationString += `${hours}h `;
            if (minutes > 0) durationString += `${minutes}m `;
            durationString += `${seconds}s`;

            embed.addFields({
                name: '📊 Queue Statistics',
                value: `Total Songs: **${tracks.length}**\n` +
                       `Total Duration: **${durationString}**\n` +
                       `Loop Mode: **${queue.repeatMode === 0 ? 'Off' : queue.repeatMode === 1 ? 'Track' : 'Queue'}**\n` +
                       `Volume: **${queue.node.volume}%**`,
                inline: true
            });
        }

        await interaction.reply({ embeds: [embed] });
    }
};