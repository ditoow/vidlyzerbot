const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play music from YouTube or Spotify')
        .addStringOption(option =>
            option
                .setName('query')
                .setDescription('Song name, YouTube URL, or Spotify URL')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Connect),

    async execute(interaction) {
        const query = interaction.options.getString('query');
        const member = interaction.member;
        const musicSystem = interaction.client.musicSystem;

        // Check if user is in a voice channel
        if (!member.voice.channel) {
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Not in Voice Channel')
                .setDescription('You need to be in a voice channel to play music!')
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
            const result = await musicSystem.playMusic(interaction, query);

            if (!result.success) {
                let embed;
                
                if (result.error === 'RADIO_ACTIVE') {
                    embed = new EmbedBuilder()
                        .setColor('#ffaa00')
                        .setTitle('📻 Radio is Active')
                        .setDescription(result.message)
                        .addFields(
                            { name: 'How to switch to Music Mode:', value: 'Use `.stop` or `/stop` to stop the radio first', inline: false }
                        )
                        .setTimestamp();
                } else if (result.error === 'NO_RESULTS') {
                    embed = new EmbedBuilder()
                        .setColor('#ff0000')
                        .setTitle('❌ No Results Found')
                        .setDescription(result.message)
                        .setTimestamp();
                } else {
                    embed = new EmbedBuilder()
                        .setColor('#ff0000')
                        .setTitle('❌ Playback Error')
                        .setDescription(result.message || 'An error occurred while trying to play the track')
                        .setTimestamp();
                }

                return await interaction.editReply({ embeds: [embed] });
            }

            // Success responses
            let embed;

            if (result.type === 'playlist') {
                embed = new EmbedBuilder()
                    .setColor('#00ff00')
                    .setTitle('✅ Playlist Added')
                    .setDescription(`Added **${result.tracksAdded}** tracks from playlist`)
                    .addFields(
                        { name: 'Playlist', value: result.playlist.title || 'Unknown', inline: true },
                        { name: 'Tracks Added', value: result.tracksAdded.toString(), inline: true },
                        { name: 'Requested by', value: interaction.user.toString(), inline: true }
                    )
                    .setTimestamp();

                if (result.playlist.thumbnail) {
                    embed.setThumbnail(result.playlist.thumbnail);
                }
            } else if (result.type === 'now_playing') {
                embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('🎵 Now Playing')
                    .setDescription(`**[${result.track.title}](${result.track.url})**`)
                    .addFields(
                        { name: 'Artist', value: result.track.author || 'Unknown', inline: true },
                        { name: 'Duration', value: result.track.duration || 'Unknown', inline: true },
                        { name: 'Requested by', value: interaction.user.toString(), inline: true }
                    )
                    .setTimestamp();

                if (result.track.thumbnail) {
                    embed.setThumbnail(result.track.thumbnail);
                }
            } else if (result.type === 'added_to_queue') {
                embed = new EmbedBuilder()
                    .setColor('#00ff00')
                    .setTitle('✅ Added to Queue')
                    .setDescription(`**[${result.track.title}](${result.track.url})**`)
                    .addFields(
                        { name: 'Artist', value: result.track.author || 'Unknown', inline: true },
                        { name: 'Duration', value: result.track.duration || 'Unknown', inline: true },
                        { name: 'Position in Queue', value: result.position.toString(), inline: true },
                        { name: 'Requested by', value: interaction.user.toString(), inline: true }
                    )
                    .setTimestamp();

                if (result.track.thumbnail) {
                    embed.setThumbnail(result.track.thumbnail);
                }
            }

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Error in play command:', error);
            
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('❌ Unexpected Error')
                .setDescription('An unexpected error occurred while processing your request.')
                .setTimestamp();
            
            await interaction.editReply({ embeds: [embed] });
        }
    }
};