const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deploy')
        .setDescription('Deploy commands secara manual')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Tipe deployment')
                .setRequired(false)
                .addChoices(
                    { name: 'Guild (Fast)', value: 'guild' },
                    { name: 'Global (Slow)', value: 'global' }
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        // Check if user is admin
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return await interaction.reply({
                content: '❌ Hanya administrator yang bisa menggunakan command ini!',
                ephemeral: true
            });
        }

        const deployType = interaction.options.getString('type') || 'guild';
        
        await interaction.deferReply({ ephemeral: true });

        try {
            const autoDeploy = interaction.client.autoDeploy;
            
            if (!autoDeploy) {
                return await interaction.editReply({
                    content: '❌ Auto-deploy system tidak tersedia!'
                });
            }

            const success = await autoDeploy.manualDeploy(deployType);
            
            if (success) {
                await interaction.editReply({
                    content: `✅ Commands berhasil di-deploy sebagai **${deployType}** commands!\n` +
                            `${deployType === 'guild' ? '⚡ Tersedia langsung' : '⏰ Butuh waktu hingga 1 jam'}`
                });
            } else {
                await interaction.editReply({
                    content: '❌ Deploy gagal! Check console untuk detail error.'
                });
            }
        } catch (error) {
            await interaction.editReply({
                content: '❌ Terjadi error saat deploy commands!'
            });
        }
    },
};