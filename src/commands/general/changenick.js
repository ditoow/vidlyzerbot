const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('changenick')
        .setDescription('Ganti nickname kamu di server')
        .addStringOption(option =>
            option.setName('nickname')
                .setDescription('Nickname baru yang ingin digunakan')
                .setRequired(true)
                .setMaxLength(32)
        ),
    async execute(interaction) {
        const newNickname = interaction.options.getString('nickname');
        
        try {
            // Check if the user has permission to change their nickname
            if (!interaction.member.permissions.has(PermissionFlagsBits.ChangeNickname) && 
                !interaction.member.permissions.has(PermissionFlagsBits.ManageNicknames)) {
                return await interaction.reply({
                    content: '❌ Kamu tidak memiliki permission untuk mengganti nickname!',
                    ephemeral: true
                });
            }

            // Change the user's nickname
            await interaction.member.setNickname(newNickname);
            
            await interaction.reply({
                content: `✅ Nickname berhasil diubah menjadi: **${newNickname}**`,
                ephemeral: true
            });
        } catch (error) {
            console.error('Error changing nickname:', error);
            
            if (error.code === 50013) {
                await interaction.reply({
                    content: '❌ Bot tidak memiliki permission untuk mengganti nickname kamu!',
                    ephemeral: true
                });
            } else {
                await interaction.reply({
                    content: '❌ Terjadi error saat mengganti nickname. Silakan coba lagi nanti.',
                    ephemeral: true
                });
            }
        }
    },
};