const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const AFKManager = require('../../utils/afk-manager');

// Initialize AFK Manager
const afkManager = new AFKManager();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('afkmanage')
        .setDescription('Kelola sistem AFK (Admin only)')
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Hapus status AFK user tertentu')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('User yang akan dihapus status AFK-nya')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('cleanup')
                .setDescription('Bersihkan data AFK lama (lebih dari 7 hari)')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('stats')
                .setDescription('Lihat statistik sistem AFK')
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

        const subcommand = interaction.options.getSubcommand();

        try {
            if (subcommand === 'remove') {
                const targetUser = interaction.options.getUser('user');
                
                if (!afkManager.isAFK(targetUser.id)) {
                    return await interaction.reply({
                        content: `❌ **${targetUser.username}** tidak sedang AFK.`,
                        ephemeral: true
                    });
                }
                
                const afkData = afkManager.removeAFK(targetUser.id);
                
                // Try to restore nickname if user is in the guild
                const member = interaction.guild.members.cache.get(targetUser.id);
                if (member) {
                    try {
                        await member.setNickname(afkData.originalNickname === targetUser.username ? null : afkData.originalNickname);
                    } catch (error) {
                        // Couldn't change nickname
                    }
                }
                
                await interaction.reply({
                    content: `✅ Status AFK **${targetUser.username}** berhasil dihapus oleh admin.`,
                    ephemeral: true
                });
                
            } else if (subcommand === 'cleanup') {
                const cleaned = afkManager.cleanupOldAFK();
                
                await interaction.reply({
                    content: `🧹 Cleanup selesai! **${cleaned}** data AFK lama berhasil dihapus.`,
                    ephemeral: true
                });
                
            } else if (subcommand === 'stats') {
                const afkUsers = afkManager.getAllAFKUsers();
                const totalAFK = afkUsers.length;
                
                let oldestAFK = null;
                let newestAFK = null;
                
                if (totalAFK > 0) {
                    let oldestTime = Date.now();
                    let newestTime = 0;
                    
                    for (const userId of afkUsers) {
                        const afkData = afkManager.getAFKData(userId);
                        if (afkData.timestamp < oldestTime) {
                            oldestTime = afkData.timestamp;
                            oldestAFK = userId;
                        }
                        if (afkData.timestamp > newestTime) {
                            newestTime = afkData.timestamp;
                            newestAFK = userId;
                        }
                    }
                }
                
                let statsMessage = `📊 **Statistik Sistem AFK**\n\n`;
                statsMessage += `👥 Total user AFK: **${totalAFK}**\n`;
                
                if (oldestAFK) {
                    const oldestUser = await interaction.client.users.fetch(oldestAFK).catch(() => null);
                    const oldestData = afkManager.getAFKData(oldestAFK);
                    const oldestDuration = formatDuration(Date.now() - oldestData.timestamp);
                    
                    if (oldestUser) {
                        statsMessage += `⏰ AFK terlama: **${oldestUser.username}** (${oldestDuration})\n`;
                    }
                }
                
                if (newestAFK && newestAFK !== oldestAFK) {
                    const newestUser = await interaction.client.users.fetch(newestAFK).catch(() => null);
                    const newestData = afkManager.getAFKData(newestAFK);
                    const newestDuration = formatDuration(Date.now() - newestData.timestamp);
                    
                    if (newestUser) {
                        statsMessage += `🆕 AFK terbaru: **${newestUser.username}** (${newestDuration})\n`;
                    }
                }
                
                await interaction.reply({
                    content: statsMessage,
                    ephemeral: true
                });
            }
            
        } catch (error) {
            await interaction.reply({
                content: '❌ Terjadi error saat menjalankan command AFK manage.',
                ephemeral: true
            });
        }
    },
};

// Helper function to format duration
function formatDuration(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
        return `${days} hari ${hours % 24} jam`;
    } else if (hours > 0) {
        return `${hours} jam ${minutes % 60} menit`;
    } else if (minutes > 0) {
        return `${minutes} menit ${seconds % 60} detik`;
    } else {
        return `${seconds} detik`;
    }
}