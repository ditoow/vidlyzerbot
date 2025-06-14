const AFKManager = require('../utils/afk-manager');

// Initialize AFK Manager
const afkManager = new AFKManager();

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        // Ignore bot messages
        if (message.author.bot) return;
        
        // Check if the message author is AFK
        if (afkManager.isAFK(message.author.id)) {
            try {
                const afkData = afkManager.removeAFK(message.author.id);
                const originalNickname = afkData.originalNickname;
                
                // Restore original nickname
                if (message.member) {
                    await message.member.setNickname(originalNickname === message.author.username ? null : originalNickname);
                }
                
                // Send ephemeral-like message (delete after some time)
                const afkDuration = Date.now() - afkData.timestamp;
                const durationText = formatDuration(afkDuration);
                
                const reply = await message.reply({
                    content: `💤 **${message.author.username}** tidak lagi AFK!\n**Durasi AFK:** ${durationText}\n**Nickname dikembalikan ke:** ${originalNickname}`
                });
                
                // Delete the reply after 10 seconds
                setTimeout(() => {
                    reply.delete().catch(() => {});
                }, 10000);
                
            } catch (error) {
                // Error handling nickname change
            }
        }
        
        // Check if message mentions any AFK users
        if (message.mentions.users.size > 0) {
            const afkMentions = [];
            
            message.mentions.users.forEach(user => {
                if (afkManager.isAFK(user.id)) {
                    const afkData = afkManager.getAFKData(user.id);
                    const afkDuration = Date.now() - afkData.timestamp;
                    const durationText = formatDuration(afkDuration);
                    
                    afkMentions.push(`💤 **${user.username}** sedang AFK\n**Alasan:** ${afkData.reason}\n**Durasi:** ${durationText}`);
                }
            });
            
            if (afkMentions.length > 0) {
                const reply = await message.reply({
                    content: afkMentions.join('\n\n')
                });
                
                // Delete the reply after 15 seconds
                setTimeout(() => {
                    reply.delete().catch(() => {});
                }, 15000);
            }
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