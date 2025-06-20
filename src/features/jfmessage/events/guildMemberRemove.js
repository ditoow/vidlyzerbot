const { Events, EmbedBuilder } = require('discord.js');
const goodbyeTemplate = require('../goodbye-embed.json');

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member) {
        try {
            // Get goodbye template
            const template = goodbyeTemplate;
            if (!template) return;

            const user = member.user;
            const guild = member.guild;
            
            // Calculate time in server
            const joinedDate = member.joinedAt;
            const now = new Date();
            const timeInServer = joinedDate ? Math.floor((now - joinedDate) / (1000 * 60 * 60 * 24)) : 0;
            
            // Find goodbye channel (you can customize this logic)
            // For now, we'll look for a channel named 'goodbye', 'farewell', or 'general'
            const goodbyeChannel = guild.channels.cache.find(channel => 
                channel.name.includes('goodbye') || 
                channel.name.includes('farewell') ||
                channel.name.includes('general') ||
                channel.name.includes('chat')
            );
            
            if (!goodbyeChannel) {
                console.log(`No goodbye channel found in guild: ${guild.name}`);
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
                    .replace(/{joined_date}/g, joinedDate ? `<t:${Math.floor(joinedDate.getTime() / 1000)}:D>` : 'Unknown')
                    .replace(/{time_in_server}/g, `${timeInServer} hari`)
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

            // Send goodbye message
            await goodbyeChannel.send({
                content: `👋 **${user.username}** telah meninggalkan server.`,
                embeds: [embed]
            });

        } catch (error) {
            console.error('Error sending goodbye message:', error);
        }
    }
};