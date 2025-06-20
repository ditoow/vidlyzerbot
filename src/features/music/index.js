const { Player } = require('discord-player');
const { YoutubeiExtractor } = require('discord-player-youtubei');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const Logger = require('../../utils/logger');
const { getStation, getAllStations } = require('./utils/stations');

class MusicSystem {
    constructor(client) {
        this.client = client;
        this.logger = new Logger('MusicSystem');
        
        // Music player for on-demand music
        this.musicPlayer = new Player(client, {
            ytdlOptions: {
                quality: 'highestaudio',
                highWaterMark: 1 << 25
            }
        });

        // Radio player for 24/7 streaming
        this.radioPlayer = createAudioPlayer();
        this.radioConnection = null;
        this.currentRadioStation = null;
        this.radioReconnectAttempts = 0;
        this.isRadioReconnecting = false;

        // System state
        this.currentMode = null; // 'music' or 'radio'
        this.currentGuild = null;
        this.currentChannel = null;

        this.setupMusicPlayer();
        this.setupRadioPlayer();
    }

    setupMusicPlayer() {
        // Register extractors
        this.musicPlayer.extractors.register(YoutubeiExtractor, {});

        // Music player events
        this.musicPlayer.events.on('playerStart', (queue, track) => {
            this.logger.info(`🎵 Started playing: ${track.title} by ${track.author}`);
            this.currentMode = 'music';
            this.currentGuild = queue.guild;
            this.currentChannel = queue.metadata.channel;
        });

        this.musicPlayer.events.on('audioTrackAdd', (queue, track) => {
            this.logger.info(`🎵 Track added to queue: ${track.title}`);
        });

        this.musicPlayer.events.on('playerSkip', (queue, track) => {
            this.logger.info(`🎵 Track skipped: ${track.title}`);
        });

        this.musicPlayer.events.on('disconnect', (queue) => {
            this.logger.info('🎵 Music player disconnected');
            this.currentMode = null;
            this.currentGuild = null;
            this.currentChannel = null;
        });

        this.musicPlayer.events.on('emptyQueue', (queue) => {
            this.logger.info('🎵 Queue finished');
            this.currentMode = null;
        });

        this.musicPlayer.events.on('error', (queue, error) => {
            this.logger.error('🎵 Music player error:', error);
        });
    }

    setupRadioPlayer() {
        this.radioPlayer.on(AudioPlayerStatus.Playing, () => {
            this.logger.info(`📻 Radio started: ${this.currentRadioStation?.name || 'Unknown'}`);
            this.currentMode = 'radio';
        });

        this.radioPlayer.on(AudioPlayerStatus.Idle, () => {
            this.logger.info('📻 Radio stopped');
            if (this.currentRadioStation && !this.isRadioReconnecting) {
                this.handleRadioReconnect();
            }
        });

        this.radioPlayer.on('error', (error) => {
            this.logger.error('📻 Radio player error:', error);
            if (this.currentRadioStation && !this.isRadioReconnecting) {
                this.handleRadioReconnect();
            }
        });
    }

    // Check if system is busy with another mode
    isBusy(requestedMode) {
        if (!this.currentMode) return false;
        return this.currentMode !== requestedMode;
    }

    // Get current mode status
    getCurrentStatus() {
        if (!this.currentMode) {
            return { mode: null, status: 'idle' };
        }

        if (this.currentMode === 'music') {
            const queue = this.musicPlayer.nodes.get(this.currentGuild);
            return {
                mode: 'music',
                status: queue?.isPlaying() ? 'playing' : 'paused',
                currentTrack: queue?.currentTrack,
                queueSize: queue?.tracks?.data?.length || 0
            };
        }

        if (this.currentMode === 'radio') {
            return {
                mode: 'radio',
                status: 'streaming',
                currentStation: this.currentRadioStation,
                channel: this.currentChannel
            };
        }
    }

    // Stop current activity (music or radio)
    async stopCurrent() {
        if (this.currentMode === 'music') {
            const queue = this.musicPlayer.nodes.get(this.currentGuild);
            if (queue) {
                queue.delete();
            }
        } else if (this.currentMode === 'radio') {
            await this.stopRadio();
        }

        this.currentMode = null;
        this.currentGuild = null;
        this.currentChannel = null;
    }

    // Music functions
    async playMusic(interaction, query) {
        const member = interaction.member;
        const guild = interaction.guild;

        // Check if radio is active
        if (this.isBusy('music')) {
            return {
                success: false,
                error: 'RADIO_ACTIVE',
                message: `📻 Radio is currently active! Use \`.stop\` or \`/stop\` to stop radio first.`
            };
        }

        try {
            // Search for track
            const searchResult = await this.musicPlayer.search(query, {
                requestedBy: interaction.user
            });

            if (!searchResult || !searchResult.tracks.length) {
                return {
                    success: false,
                    error: 'NO_RESULTS',
                    message: `No results found for **${query}**`
                };
            }

            // Create or get queue
            const queue = this.musicPlayer.nodes.create(guild, {
                metadata: {
                    channel: interaction.channel,
                    client: guild.members.me,
                    requestedBy: interaction.user
                },
                selfDeaf: true,
                volume: 50,
                leaveOnEmpty: true,
                leaveOnEmptyCooldown: 300000,
                leaveOnEnd: true,
                leaveOnEndCooldown: 300000,
            });

            // Connect to voice channel
            if (!queue.connection) {
                await queue.connect(member.voice.channel);
            }

            // Add track(s)
            if (searchResult.playlist) {
                queue.addTrack(searchResult.tracks);
                if (!queue.isPlaying()) await queue.node.play();
                
                return {
                    success: true,
                    type: 'playlist',
                    playlist: searchResult.playlist,
                    tracksAdded: searchResult.tracks.length
                };
            } else {
                const track = searchResult.tracks[0];
                queue.addTrack(track);
                
                if (!queue.isPlaying()) {
                    await queue.node.play();
                    return {
                        success: true,
                        type: 'now_playing',
                        track: track
                    };
                } else {
                    return {
                        success: true,
                        type: 'added_to_queue',
                        track: track,
                        position: queue.tracks.data.length
                    };
                }
            }

        } catch (error) {
            this.logger.error('Error playing music:', error);
            return {
                success: false,
                error: 'PLAYBACK_ERROR',
                message: 'Failed to play the requested track'
            };
        }
    }

    // Radio functions
    async startRadio(interaction, stationKey) {
        const member = interaction.member;
        const guild = interaction.guild;

        // Check if music is active
        if (this.isBusy('radio')) {
            return {
                success: false,
                error: 'MUSIC_ACTIVE',
                message: `🎵 Music is currently playing! Use \`.stop\` or \`/stop\` to stop music first.`
            };
        }

        const station = getStation(stationKey);
        if (!station) {
            return {
                success: false,
                error: 'INVALID_STATION',
                message: 'Invalid radio station selected'
            };
        }

        try {
            // Stop current radio if any
            if (this.currentRadioStation) {
                await this.stopRadio();
            }

            // Join voice channel
            this.radioConnection = joinVoiceChannel({
                channelId: member.voice.channel.id,
                guildId: guild.id,
                adapterCreator: guild.voiceAdapterCreator,
            });

            this.radioConnection.subscribe(this.radioPlayer);
            
            // Setup connection events
            this.radioConnection.on(VoiceConnectionStatus.Ready, () => {
                this.logger.info(`📻 Connected to voice channel: ${member.voice.channel.name}`);
            });

            this.radioConnection.on(VoiceConnectionStatus.Disconnected, () => {
                this.logger.info('📻 Disconnected from voice channel');
                if (this.currentRadioStation && !this.isRadioReconnecting) {
                    this.handleRadioReconnect();
                }
            });

            // Start playing radio
            await this.playRadioStation(station);
            
            this.currentGuild = guild;
            this.currentChannel = interaction.channel;

            return {
                success: true,
                station: station,
                channel: member.voice.channel
            };

        } catch (error) {
            this.logger.error('Error starting radio:', error);
            return {
                success: false,
                error: 'RADIO_START_ERROR',
                message: 'Failed to start radio station'
            };
        }
    }

    async playRadioStation(station) {
        try {
            this.currentRadioStation = station;
            
            const resource = createAudioResource(station.url, {
                metadata: {
                    title: station.name,
                    station: station
                }
            });

            this.radioPlayer.play(resource);
            this.radioReconnectAttempts = 0; // Reset on successful play
            
            return true;
        } catch (error) {
            this.logger.error('Error playing radio station:', error);
            throw error;
        }
    }

    async stopRadio() {
        try {
            this.radioPlayer.stop();
            this.currentRadioStation = null;
            this.radioReconnectAttempts = 0;
            this.isRadioReconnecting = false;
            
            if (this.radioConnection) {
                this.radioConnection.destroy();
                this.radioConnection = null;
            }

            if (this.currentMode === 'radio') {
                this.currentMode = null;
                this.currentGuild = null;
                this.currentChannel = null;
            }

            return true;
        } catch (error) {
            this.logger.error('Error stopping radio:', error);
            throw error;
        }
    }

    async handleRadioReconnect() {
        if (this.isRadioReconnecting) return;
        
        this.isRadioReconnecting = true;
        this.radioReconnectAttempts++;

        if (this.radioReconnectAttempts > 10) {
            this.logger.error('Max radio reconnection attempts reached');
            await this.stopRadio();
            return;
        }

        this.logger.warn(`Attempting radio reconnect (${this.radioReconnectAttempts}/10)`);

        setTimeout(async () => {
            try {
                if (this.currentRadioStation) {
                    await this.playRadioStation(this.currentRadioStation);
                }
            } catch (error) {
                this.logger.error('Radio reconnection failed:', error);
            }
            this.isRadioReconnecting = false;
        }, 5000);
    }

    // Music control functions
    async pauseMusic(guild) {
        const queue = this.musicPlayer.nodes.get(guild);
        if (!queue || !queue.isPlaying()) return false;
        
        queue.node.setPaused(true);
        return true;
    }

    async resumeMusic(guild) {
        const queue = this.musicPlayer.nodes.get(guild);
        if (!queue || !queue.node.isPaused()) return false;
        
        queue.node.setPaused(false);
        return true;
    }

    async skipMusic(guild) {
        const queue = this.musicPlayer.nodes.get(guild);
        if (!queue || !queue.isPlaying()) return false;
        
        return queue.node.skip();
    }

    async setVolume(guild, volume) {
        const queue = this.musicPlayer.nodes.get(guild);
        if (!queue) return false;
        
        queue.node.setVolume(volume);
        return true;
    }

    async shuffleQueue(guild) {
        const queue = this.musicPlayer.nodes.get(guild);
        if (!queue || queue.tracks.data.length < 2) return false;
        
        queue.tracks.shuffle();
        return true;
    }

    getQueue(guild) {
        return this.musicPlayer.nodes.get(guild);
    }

    getAllRadioStations() {
        return getAllStations();
    }
}

module.exports = MusicSystem;