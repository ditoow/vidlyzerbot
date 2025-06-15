const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
// const { createCanvas, loadImage } = require('canvas'); // Disabled for now
const path = require('path');

class WelcomeManager {
    constructor() {
        // Default welcome settings
        this.settings = {
            welcomeEnabled: true,
            goodbyeEnabled: true,
            welcomeChannel: null,
            goodbyeChannel: null,
            welcomeMessage: 'Selamat datang {user} di **{server}**! 🎉',
            goodbyeMessage: 'Selamat tinggal {user}! Terima kasih telah bergabung di **{server}** 👋',
            welcomeColor: '#00ff00',
            goodbyeColor: '#ff0000',
            showMemberCount: true,
            showAvatar: true,
            showWelcomeImage: true
        };
    }

    /**
     * Create welcome card image (disabled for now due to canvas dependency issues)
     * @param {GuildMember} member - Discord guild member
     * @param {string} type - 'welcome' or 'goodbye'
     * @returns {Promise<Buffer>} Image buffer
     */
    async createWelcomeCard(member, type = 'welcome') {
        // Canvas functionality disabled for now
        console.log('Welcome card image creation is disabled (canvas dependency not available)');
        return null;
    }

    /**
     * Create welcome embed
     * @param {GuildMember} member - Discord guild member
     * @param {string} type - 'welcome' or 'goodbye'
     * @param {Buffer} imageBuffer - Welcome card image buffer
     * @returns {Object} Embed object
     */
    createWelcomeEmbed(member, type = 'welcome', imageBuffer = null) {
        const isWelcome = type === 'welcome';
        const message = isWelcome ? this.settings.welcomeMessage : this.settings.goodbyeMessage;
        const color = isWelcome ? this.settings.welcomeColor : this.settings.goodbyeColor;
        
        // Replace placeholders
        const formattedMessage = message
            .replace(/{user}/g, `<@${member.user.id}>`)
            .replace(/{username}/g, member.user.username)
            .replace(/{server}/g, member.guild.name)
            .replace(/{membercount}/g, member.guild.memberCount.toString());
        
        // Create decorative title
        const titleEmoji = isWelcome ? '🎉' : '👋';
        const title = isWelcome ? `${titleEmoji} Welcome to ${member.guild.name}!` : `${titleEmoji} Goodbye from ${member.guild.name}`;
        
        const embed = new EmbedBuilder()
            .setTitle(title)
            .setColor(color)
            .setDescription(formattedMessage)
            .setTimestamp()
            .setFooter({
                text: `${member.guild.name} • ${isWelcome ? 'Welcome System' : 'Goodbye System'}`,
                iconURL: member.guild.iconURL()
            });
        
        if (this.settings.showAvatar) {
            embed.setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }));
        }
        
        // Add author field with user info
        embed.setAuthor({
            name: member.user.username,
            iconURL: member.user.displayAvatarURL({ dynamic: true }),
            url: `https://discord.com/users/${member.user.id}`
        });
        
        // Add fields
        const fields = [];
        
        if (isWelcome) {
            fields.push({
                name: '👤 User Information',
                value: `**Tag:** ${member.user.tag}\n**ID:** ${member.user.id}`,
                inline: true
            });
            
            if (this.settings.showMemberCount) {
                fields.push({
                    name: '📊 Server Stats',
                    value: `**Total Members:** ${member.guild.memberCount}\n**You are member #${member.guild.memberCount}**`,
                    inline: true
                });
            }
            
            fields.push({
                name: '📅 Account Info',
                value: `**Created:** <t:${Math.floor(member.user.createdTimestamp / 1000)}:R>\n**Joined:** <t:${Math.floor(Date.now() / 1000)}:R>`,
                inline: true
            });
            
            // Add welcome tips
            fields.push({
                name: '💡 Getting Started',
                value: '• Read the server rules\n• Introduce yourself\n• Check out the channels\n• Have fun and be respectful!',
                inline: false
            });
        } else {
            fields.push({
                name: '👤 User Information',
                value: `**Tag:** ${member.user.tag}\n**ID:** ${member.user.id}`,
                inline: true
            });
            
            if (this.settings.showMemberCount) {
                fields.push({
                    name: '📊 Server Stats',
                    value: `**Members Remaining:** ${member.guild.memberCount}`,
                    inline: true
                });
            }
            
            if (member.joinedTimestamp) {
                const timeInServer = Date.now() - member.joinedTimestamp;
                const days = Math.floor(timeInServer / (1000 * 60 * 60 * 24));
                
                fields.push({
                    name: '⏰ Time in Server',
                    value: `**Joined:** <t:${Math.floor(member.joinedTimestamp / 1000)}:R>\n**Time here:** ${days} days`,
                    inline: true
                });
            }
        }
        
        embed.addFields(fields);
        
        // Add image if available
        if (imageBuffer && this.settings.showWelcomeImage) {
            embed.setImage('attachment://welcome-card.png');
        }
        
        return embed;
    }

    /**
     * Send welcome message
     * @param {GuildMember} member - Discord guild member
     * @param {string} type - 'welcome' or 'goodbye'
     */
    async sendWelcomeMessage(member, type = 'welcome') {
        try {
            const isWelcome = type === 'welcome';
            const channelId = isWelcome ? this.settings.welcomeChannel : this.settings.goodbyeChannel;
            const enabled = isWelcome ? this.settings.welcomeEnabled : this.settings.goodbyeEnabled;
            
            if (!enabled || !channelId) {
                return;
            }
            
            const channel = member.guild.channels.cache.get(channelId);
            if (!channel) {
                console.error(`${type} channel not found:`, channelId);
                return;
            }
            
            // Create welcome card image
            let imageBuffer = null;
            let attachment = null;
            
            if (this.settings.showWelcomeImage) {
                imageBuffer = await this.createWelcomeCard(member, type);
                if (imageBuffer) {
                    attachment = new AttachmentBuilder(imageBuffer, { name: 'welcome-card.png' });
                }
            }
            
            // Create embed
            const embed = this.createWelcomeEmbed(member, type, imageBuffer);
            
            // Send message
            const messageOptions = { embeds: [embed] };
            if (attachment) {
                messageOptions.files = [attachment];
            }
            
            await channel.send(messageOptions);
            
        } catch (error) {
            console.error(`Error sending ${type} message:`, error);
        }
    }

    /**
     * Update welcome settings
     * @param {Object} newSettings - New settings to apply
     */
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
    }

    /**
     * Get current settings
     * @returns {Object} Current settings
     */
    getSettings() {
        return { ...this.settings };
    }

    /**
     * Set welcome channel
     * @param {string} channelId - Channel ID
     */
    setWelcomeChannel(channelId) {
        this.settings.welcomeChannel = channelId;
    }

    /**
     * Set goodbye channel
     * @param {string} channelId - Channel ID
     */
    setGoodbyeChannel(channelId) {
        this.settings.goodbyeChannel = channelId;
    }

    /**
     * Toggle welcome messages
     * @param {boolean} enabled - Enable or disable
     */
    toggleWelcome(enabled) {
        this.settings.welcomeEnabled = enabled;
    }

    /**
     * Toggle goodbye messages
     * @param {boolean} enabled - Enable or disable
     */
    toggleGoodbye(enabled) {
        this.settings.goodbyeEnabled = enabled;
    }
}

module.exports = WelcomeManager;