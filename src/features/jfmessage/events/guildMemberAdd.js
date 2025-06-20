const { Events, EmbedBuilder } = require('discord.js');
const welcomeTemplate = require('../welcome-embed.json');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        try {
            // Get welcome template
            const template = welcomeTemplate;
            if (!template) return;

            const user = member.user;
            const guild = member.guild;
            
            // Find welcome channel (you can customize this logic)
            // For now, we'll look for a channel named 'welcome' or 'general'
            const welcomeChannel = guild.channels.cache.find(channel => 
                channel.name.includes('welcome') || 
                channel.name.includes('general') ||
                channel.name.includes('chat')
            );
            
            if (!welcomeChannel) {
                console.log(`No welcome channel found in guild: ${guild.name}`);
                return;
            }

            // Replace placeholders
            const replacePlaceholders = (text) => {
                if (typeof text !== 'string') return text;
                
                return text
                    .replace(/{user}/g, `<@${user.id}>`)
                    .replace(/{username}/g, user.username)
                    .replace(/{user_id}/g, user.id)
                    .replace(/{server}/g, guild.name)
                    .replace(/{membercount}/g, guild.memberCount.toString())
                    .replace(/{account_created}/g, `<t:${Math.floor(user.createdTimestamp / 1000)}:D>`)
                    .replace(/{joined_date}/g, `<t:${Math.floor(member.joinedTimestamp / 1000)}:D>`)
                    .replace(/{date}/g, new Date().toLocaleDateString('id-ID'))
                    .replace(/{user_avatar}/g, user.displayAvatarURL({ dynamic: true, size: 256 }))
                    .replace(/{server_icon}/g, guild.iconURL({ dynamic: true, size: 256 }) || '');
            };

            // Create embed
            const embed = new EmbedBuilder()
                .setTitle(replacePlaceholders(template.title))
                .setDescription(replacePlaceholders(template.description))
                .setColor(template.color);

            // Set thumbnail
            if (template.thumbnail) {
                const thumbnailUrl = replacePlaceholders(template.thumbnail);
                if (thumbnailUrl && thumbnailUrl !== '{user_avatar}') {
                    embed.setThumbnail(thumbnailUrl);
                }
            }

            // Add fields
            if (template.fields && Array.isArray(template.fields)) {
                template.fields.forEach(field => {
                    embed.addFields({
                        name: replacePlaceholders(field.name),
                        value: replacePlaceholders(field.value),
                        inline: field.inline || false
                    });
                });
            }

            // Set footer
            if (template.footer) {
                const footerText = replacePlaceholders(template.footer.text);
                const footerIcon = replacePlaceholders(template.footer.icon_url);
                
                embed.setFooter({
                    text: footerText,
                    iconURL: footerIcon && footerIcon !== '{server_icon}' ? footerIcon : undefined
                });
            }

            // Set timestamp
            if (template.timestamp) {
                embed.setTimestamp();
            }

            // Send welcome message
            await welcomeChannel.send({
                content: `🎉 ${user} bergabung dengan server!`,
                embeds: [embed]
            });

        } catch (error) {
            console.error('Error sending welcome message:', error);
        }
    }
};