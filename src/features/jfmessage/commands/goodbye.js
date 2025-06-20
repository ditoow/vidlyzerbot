const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const goodbyeTemplate = require('../goodbye-embed.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('goodbye')
        .setDescription('Test goodbye message')
        .addSubcommand(subcommand =>
            subcommand
                .setName('test')
                .setDescription('Test goodbye message dengan user saat ini')
        ),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'test') {
            await handleTest(interaction);
        }
    }
};

async function handleTest(interaction) {
    try {
        // Get user and server info
        const user = interaction.user;
        const member = interaction.member;
        const guild = interaction.guild;
        
        // Calculate time in server
        const joinedDate = member.joinedAt;
        const now = new Date();
        const timeInServer = joinedDate ? Math.floor((now - joinedDate) / (1000 * 60 * 60 * 24)) : 0;
        
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
            .setTitle(replacePlaceholders(goodbyeTemplate.title))
            .setDescription(replacePlaceholders(goodbyeTemplate.description))
            .setColor(goodbyeTemplate.color);

        // Set thumbnail
        if (goodbyeTemplate.thumbnail) {
            const thumbnailUrl = replacePlaceholders(goodbyeTemplate.thumbnail);
            if (thumbnailUrl && thumbnailUrl !== '{user_avatar}') {
                embed.setThumbnail(thumbnailUrl);
            }
        }

        // Add fields
        if (goodbyeTemplate.fields && Array.isArray(goodbyeTemplate.fields)) {
            goodbyeTemplate.fields.forEach(field => {
                embed.addFields({
                    name: replacePlaceholders(field.name),
                    value: replacePlaceholders(field.value),
                    inline: field.inline || false
                });
            });
        }

        // Set footer
        if (goodbyeTemplate.footer) {
            const footerText = replacePlaceholders(goodbyeTemplate.footer.text);
            const footerIcon = replacePlaceholders(goodbyeTemplate.footer.icon_url);
            
            embed.setFooter({
                text: footerText,
                iconURL: footerIcon && footerIcon !== '{server_icon}' ? footerIcon : undefined
            });
        }

        // Set timestamp
        if (goodbyeTemplate.timestamp) {
            embed.setTimestamp();
        }

        // Send the embed
        await interaction.reply({
            content: `🧪 **Test Goodbye Message:**`,
            embeds: [embed]
        });

    } catch (error) {
        console.error('Error in goodbye test:', error);
        await interaction.reply({
            content: `❌ Error saat mengirim test goodbye message: ${error.message}`,
            ephemeral: true
        });
    }
}