const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const welcomeTemplate = require('../welcome-embed.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('welcome')
        .setDescription('Test welcome message')
        .addSubcommand(subcommand =>
            subcommand
                .setName('test')
                .setDescription('Test welcome message dengan user saat ini')
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
                .replace(/{joined_date}/g, member.joinedAt ? `<t:${Math.floor(member.joinedAt.getTime() / 1000)}:D>` : 'Unknown')
                .replace(/{date}/g, new Date().toLocaleDateString('id-ID'))
                .replace(/{user_avatar}/g, user.displayAvatarURL({ dynamic: true, size: 256 }))
                .replace(/{server_icon}/g, guild.iconURL({ dynamic: true, size: 256 }) || '');
        };

        // Create embed
        const embed = new EmbedBuilder()
            .setTitle(replacePlaceholders(welcomeTemplate.title))
            .setDescription(replacePlaceholders(welcomeTemplate.description))
            .setColor(welcomeTemplate.color);

        // Set thumbnail
        if (welcomeTemplate.thumbnail) {
            const thumbnailUrl = replacePlaceholders(welcomeTemplate.thumbnail);
            if (thumbnailUrl && thumbnailUrl !== '{user_avatar}') {
                embed.setThumbnail(thumbnailUrl);
            }
        }

        // Add fields
        if (welcomeTemplate.fields && Array.isArray(welcomeTemplate.fields)) {
            welcomeTemplate.fields.forEach(field => {
                embed.addFields({
                    name: replacePlaceholders(field.name),
                    value: replacePlaceholders(field.value),
                    inline: field.inline || false
                });
            });
        }

        // Set footer
        if (welcomeTemplate.footer) {
            const footerText = replacePlaceholders(welcomeTemplate.footer.text);
            const footerIcon = replacePlaceholders(welcomeTemplate.footer.icon_url);
            
            embed.setFooter({
                text: footerText,
                iconURL: footerIcon && footerIcon !== '{server_icon}' ? footerIcon : undefined
            });
        }

        // Set timestamp
        if (welcomeTemplate.timestamp) {
            embed.setTimestamp();
        }

        // Send the embed
        await interaction.reply({
            content: `🧪 **Test Welcome Message:**`,
            embeds: [embed]
        });

    } catch (error) {
        console.error('Error in welcome test:', error);
        await interaction.reply({
            content: `❌ Error saat mengirim test welcome message: ${error.message}`,
            ephemeral: true
        });
    }
}