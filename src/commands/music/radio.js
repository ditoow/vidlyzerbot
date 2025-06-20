const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('radio')
        .setDescription('Control 24/7 radio streaming')
        .addSubcommand(subcommand =>
            subcommand
                .setName('start')
                .setDescription('Start a radio station')
                .addStringOption(option =>
                    option
                        .setName('station')
                        .setDescription('Radio station to play')
                        .setRequired(true)
                        .addChoices(
                            { name: '🎵 Lofi Hip Hop', value: 'lofi' },
                            { name: '🎷 Smooth Jazz', value: 'jazz' },
                            { name: '🎤 Top Pop Hits', value: 'pop' },
                            { name: '🎸 Classic Rock', value: 'rock' },
                            { name: '🎧 Electronic/EDM', value: 'electronic' },
                            { name: '🎼 Classical Music', value: 'classical' },
                            { name: '🌊 Ambient Sounds', value: 'ambient' },
                            { name: '🌆 Synthwave', value: 'synthwave' }
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('stop')
                .setDescription('Stop the radio')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('List all available radio stations')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('current')
                .setDescription('Show currently playing radio station')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Connect),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const musicSystem = interaction.client.musicSystem;

        switch (subcommand) {
            case 'start':
                await this.handleStart(interaction, musicSystem);
                break;
            case 'stop':
                await this.handleStop(interaction, musicSystem);
                break;
            case 'list':
                await this.handleList(interaction, musicSystem);
                break;
            case 'current':
                await this.handleCurrent(interaction, musicSystem);
                break;
        }
    },

    async handleStart(interaction, musicSystem) {
        const stationKey = interaction.options.getString('station');
        const member = interaction.member;

        // Check if user is in a voice channel
        if (!member.voice.channel) {
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Not in Voice Channel')
                .setDescription('You need to be in a voice channel to start radio!')
                .setTimestamp();
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        // Check bot permissions
        const permissions = member.voice.channel.permissionsFor(interaction.client.user);
        if (!permissions.has(PermissionFlagsBits.Connect) || !permissions.has(PermissionFlagsBits.Speak)) {
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Missing Permissions')
                .setDescription('I need permission to connect and speak in your voice channel!')
                .setTimestamp();
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        await interaction.deferReply();

        try {
            const result = await musicSystem.startRadio(interaction, stationKey);

            if (!result.success) {
                let embed;
                
                if (result.error === 'MUSIC_ACTIVE') {
                    embed = new EmbedBuilder()
                        .setColor('#ffaa00')
                        .setTitle('🎵 Music is Playing')
                        .setDescription(result.message)
                        .addFields(
                            { name: 'How to switch to Radio Mode:', value: 'Use `.stop` or `/stop` to stop the music first', inline: false }
                        )
                        .setTimestamp();
                } else if (result.error === 'INVALID_STATION') {
                    embed = new EmbedBuilder()
                        .setColor('#ff0000')
                        .setTitle('❌ Invalid Station')
                        .setDescription(result.message)
                        .setTimestamp();
                } else {
                    embed = new EmbedBuilder()
                        .setColor('#ff0000')
                        .setTitle('❌ Radio Start Error')
                        .setDescription(result.message || 'Failed to start radio station')
                        .setTimestamp();
                }

                return await interaction.editReply({ embeds: [embed] });
            }

            // Success response
            const embed = new EmbedBuilder()
                .setColor('#4ecdc4')
                .setTitle('📻 Radio Started')
                .setDescription(`Now streaming **${result.station.name}**`)
                .addFields(
                    { name: 'Genre', value: result.station.genre, inline: true },
                    { name: 'Channel', value: result.channel.name, inline: true },
                    { name: 'Started by', value: interaction.user.toString(), inline: true }
                )
                .setFooter({ text: '24/7 Radio • Auto-reconnect enabled' })
                .setTimestamp();

            if (result.station.thumbnail) {
                embed.setThumbnail(result.station.thumbnail);
            }

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Error starting radio:', error);

            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Unexpected Error')
                .setDescription('An unexpected error occurred while starting the radio.')
                .setTimestamp();
            
            await interaction.editReply({ embeds: [embed] });
        }
    },

    async handleStop(interaction, musicSystem) {
        const status = musicSystem.getCurrentStatus();

        if (status.mode !== 'radio') {
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ No Radio Playing')
                .setDescription('There is no radio currently streaming!')
                .setTimestamp();
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        try {
            await musicSystem.stopRadio();

            const embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('✅ Radio Stopped')
                .setDescription(`📻 Stopped **${status.currentStation.name}** and disconnected from voice channel.`)
                .addFields(
                    { name: 'Stopped by', value: interaction.user.toString(), inline: true }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error stopping radio:', error);

            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Stop Failed')
                .setDescription('Failed to stop the radio. Please try again.')
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },

    async handleList(interaction, musicSystem) {
        const stations = musicSystem.getAllRadioStations();

        const embed = new EmbedBuilder()
            .setColor('#4ecdc4')
            .setTitle('📻 Available Radio Stations')
            .setDescription('Choose from these 24/7 radio stations:')
            .setFooter({ text: `${stations.length} stations available` })
            .setTimestamp();

        let stationList = '';
        stations.forEach(station => {
            stationList += `${station.emoji} **${station.name}**\n`;
            stationList += `└ ${station.description}\n\n`;
        });

        embed.addFields({
            name: 'Stations',
            value: stationList,
            inline: false
        });

        embed.addFields({
            name: 'How to Use',
            value: 'Use `/radio start <station>` to start streaming!',
            inline: false
        });

        await interaction.reply({ embeds: [embed] });
    },

    async handleCurrent(interaction, musicSystem) {
        const status = musicSystem.getCurrentStatus();

        if (status.mode !== 'radio') {
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ No Radio Playing')
                .setDescription('There is no radio station currently streaming!')
                .setTimestamp();
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

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
};