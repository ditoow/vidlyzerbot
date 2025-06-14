const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('permissions')
        .setDescription('Check bot permissions di server ini')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        // Check if user is admin
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return await interaction.reply({
                content: '❌ Hanya administrator yang bisa menggunakan command ini!',
                ephemeral: true
            });
        }

        try {
            const botMember = interaction.guild.members.me;
            const permissions = botMember.permissions;
            
            // Check specific permissions needed
            const requiredPermissions = [
                { name: 'Manage Nicknames', flag: PermissionFlagsBits.ManageNicknames, required: true },
                { name: 'Send Messages', flag: PermissionFlagsBits.SendMessages, required: true },
                { name: 'Use Slash Commands', flag: PermissionFlagsBits.UseApplicationCommands, required: true },
                { name: 'Embed Links', flag: PermissionFlagsBits.EmbedLinks, required: false },
                { name: 'Read Message History', flag: PermissionFlagsBits.ReadMessageHistory, required: false },
                { name: 'Manage Messages', flag: PermissionFlagsBits.ManageMessages, required: false }
            ];
            
            const embed = new EmbedBuilder()
                .setTitle('🔐 Bot Permissions Check')
                .setColor(0x3498db)
                .setTimestamp();
            
            let description = '';
            let hasAllRequired = true;
            
            for (const perm of requiredPermissions) {
                const hasPermission = permissions.has(perm.flag);
                const status = hasPermission ? '✅' : '❌';
                const required = perm.required ? ' (Required)' : ' (Optional)';
                
                description += `${status} **${perm.name}**${required}\n`;
                
                if (perm.required && !hasPermission) {
                    hasAllRequired = false;
                }
            }
            
            embed.setDescription(description);
            
            if (hasAllRequired) {
                embed.addFields({
                    name: '✅ Status',
                    value: 'Bot memiliki semua permission yang diperlukan!',
                    inline: false
                });
                embed.setColor(0x27ae60);
            } else {
                embed.addFields({
                    name: '❌ Status',
                    value: 'Bot tidak memiliki beberapa permission yang diperlukan!\n\n**Cara memperbaiki:**\n1. Server Settings → Roles\n2. Pilih role bot\n3. Enable permission yang missing\n4. Save changes',
                    inline: false
                });
                embed.setColor(0xe74c3c);
            }
            
            // Add bot role info
            const botRoles = botMember.roles.cache
                .filter(role => role.id !== interaction.guild.id)
                .map(role => role.name)
                .join(', ') || 'No roles';
            
            embed.addFields({
                name: '🎭 Bot Roles',
                value: botRoles,
                inline: false
            });
            
            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
            
        } catch (error) {
            await interaction.reply({
                content: '❌ Terjadi error saat checking permissions.',
                ephemeral: true
            });
        }
    },
};