const { EmbedBuilder } = require('discord.js');

class MessageHandler {
    constructor(client) {
        this.client = client;
        this.prefix = '.';
    }

    async handleMessage(message) {
        // Ignore bots and messages without prefix
        if (message.author.bot || !message.content.startsWith(this.prefix)) return;

        const args = message.content.slice(this.prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        // Handle .stop command
        if (command === 'stop') {
            await this.handleStopCommand(message);
        }
        // Handle .status command
        else if (command === 'status') {
            await this.handleStatusCommand(message);
        }
        // Handle .help command
        else if (command === 'help') {
            await this.handleHelpCommand(message);
        }
    }

    async handleStopCommand(message) {
        const musicSystem = this.client.musicSystem;
        const member = message.member;

        // Check if user is in a voice channel
        if (!member.voice.channel) {
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Not in Voice Channel')
                .setDescription('You need to be in a voice channel to use this command!')
                .setTimestamp();
            return await message.reply({ embeds: [embed] });
        }

        const status = musicSystem.getCurrentStatus();

        if (!status.mode) {
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Nothing Playing')
                .setDescription('There is no music or radio currently playing!')
                .setTimestamp();
            return await message.reply({ embeds: [embed] });
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
                        { name: 'Stopped by', value: message.author.toString(), inline: true },
                        { name: 'Tracks Cleared', value: (status.queueSize + (status.currentTrack ? 1 : 0)).toString(), inline: true }
                    )
                    .setTimestamp();
            } else if (status.mode === 'radio') {
                embed = new EmbedBuilder()
                    .setColor('#00ff00')
                    .setTitle('✅ Radio Stopped')
                    .setDescription(`📻 Stopped **${status.currentStation.name}** and disconnected from voice channel.`)
                    .addFields(
                        { name: 'Stopped by', value: message.author.toString(), inline: true }
                    )
                    .setTimestamp();
            }

            await message.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error stopping via message command:', error);

            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Stop Failed')
                .setDescription('Failed to stop the current activity. Please try again.')
                .setTimestamp();
            
            await message.reply({ embeds: [embed] });
        }
    }

    async handleStatusCommand(message) {
        const musicSystem = this.client.musicSystem;
        const status = musicSystem.getCurrentStatus();

        if (!status.mode) {
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('ℹ️ Bot Status')
                .setDescription('**Status:** Idle')
                .addFields(
                    { name: 'Current Mode', value: 'None', inline: true },
                    { name: 'Available Commands', value: '`/play` - Start music\n`/radio start` - Start radio', inline: false }
                )
                .setTimestamp();
            return await message.reply({ embeds: [embed] });
        }

        let embed;

        if (status.mode === 'music') {
            const queue = musicSystem.getQueue(message.guild);
            
            embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('🎵 Music Mode Active')
                .setDescription(`**Current Track:** ${status.currentTrack?.title || 'Unknown'}`)
                .addFields(
                    { name: 'Status', value: status.status === 'paused' ? '⏸️ Paused' : '▶️ Playing', inline: true },
                    { name: 'Queue Size', value: `${status.queueSize} songs`, inline: true },
                    { name: 'Volume', value: `${queue?.node?.volume || 50}%`, inline: true }
                )
                .setTimestamp();

            if (status.currentTrack?.thumbnail) {
                embed.setThumbnail(status.currentTrack.thumbnail);
            }

        } else if (status.mode === 'radio') {
            embed = new EmbedBuilder()
                .setColor('#4ecdc4')
                .setTitle('📻 Radio Mode Active')
                .setDescription(`**Station:** ${status.currentStation.name}`)
                .addFields(
                    { name: 'Genre', value: status.currentStation.genre, inline: true },
                    { name: 'Status', value: '🔴 Live Streaming', inline: true },
                    { name: 'Auto-reconnect', value: '✅ Enabled', inline: true }
                )
                .setTimestamp();

            if (status.currentStation.thumbnail) {
                embed.setThumbnail(status.currentStation.thumbnail);
            }
        }

        embed.addFields({
            name: 'Quick Commands',
            value: '`.stop` - Stop current activity\n`.status` - Show this status\n`.help` - Show help',
            inline: false
        });

        await message.reply({ embeds: [embed] });
    }

    async handleHelpCommand(message) {
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('🎵 VidlyzerBot Music System Help')
            .setDescription('Integrated Music & Radio Bot with mode switching')
            .addFields(
                {
                    name: '🎵 Music Commands (On-demand)',
                    value: '`/play <song>` - Play music from YouTube/Spotify\n' +
                           '`/pause` - Pause current song\n' +
                           '`/resume` - Resume playback\n' +
                           '`/skip` - Skip to next song\n' +
                           '`/queue` - Show current queue\n' +
                           '`/nowplaying` - Show current song\n' +
                           '`/volume <1-100>` - Set volume\n' +
                           '`/shuffle` - Shuffle queue',
                    inline: false
                },
                {
                    name: '📻 Radio Commands (24/7 Streaming)',
                    value: '`/radio start <station>` - Start 24/7 radio\n' +
                           '`/radio stop` - Stop radio\n' +
                           '`/radio list` - List available stations\n' +
                           '`/radio current` - Show current station',
                    inline: false
                },
                {
                    name: '⚡ Quick Commands (Prefix: .)',
                    value: '`.stop` - Stop music or radio\n' +
                           '`.status` - Show current status\n' +
                           '`.help` - Show this help',
                    inline: false
                },
                {
                    name: '🔄 Mode Switching',
                    value: '**Important:** You can only use one mode at a time!\n' +
                           '• If radio is playing, use `.stop` or `/stop` before using music commands\n' +
                           '• If music is playing, use `.stop` or `/stop` before using radio commands',
                    inline: false
                },
                {
                    name: '📻 Available Radio Stations',
                    value: '🎵 Lofi Hip Hop • 🎷 Jazz • 🎤 Pop • 🎸 Rock\n' +
                           '🎧 Electronic • 🎼 Classical • 🌊 Ambient • 🌆 Synthwave',
                    inline: false
                }
            )
            .setFooter({ text: 'VidlyzerBot Music System • Integrated Music & Radio' })
            .setTimestamp();

        await message.reply({ embeds: [embed] });
    }
}

module.exports = MessageHandler;