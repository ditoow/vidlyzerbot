const AFKManager = require('../utils/afk-manager');
const GeminiAI = require('../utils/gemini');

// Initialize AFK Manager and Gemini AI
const afkManager = new AFKManager();
const geminiAI = new GeminiAI();

// Gemini AI channel ID
const GEMINI_CHANNEL_ID = '1383709247686181006';

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        // Ignore bot messages
        if (message.author.bot) return;
        
        // Handle Gemini AI in specific channel
        if (message.channel.id === GEMINI_CHANNEL_ID) {
            await handleGeminiAI(message);
            return;
        }
        
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

// Handle Gemini AI interactions
async function handleGeminiAI(message) {
    // Check for special commands
    if (message.content.toLowerCase() === '!clear' || message.content.toLowerCase() === '!reset') {
        geminiAI.clearHistory(message.author.id);
        await message.reply('🗑️ Riwayat percakapan telah dihapus!');
        return;
    }
    
    if (message.content.toLowerCase() === '!stats') {
        const stats = geminiAI.getStats();
        await message.reply(`📊 **Gemini AI Stats:**\n🗣️ Percakapan aktif: ${stats.activeConversations}\n💬 Total pesan: ${stats.totalMessages}`);
        return;
    }
    
    // Check if Gemini AI is configured
    if (!geminiAI.isConfigured()) {
        await message.reply('❌ Gemini AI belum dikonfigurasi. Admin perlu mengatur `GEMINI_API_KEY` di environment variables.');
        return;
    }
    
    // Show typing indicator
    await message.channel.sendTyping();
    
    try {
        // Get AI response
        const response = await geminiAI.sendMessage(
            message.content, 
            message.author.id, 
            message.author.username
        );
        
        // Split long messages if needed (Discord has 2000 character limit)
        if (response.length <= 2000) {
            await message.reply(response);
        } else {
            // Split message into chunks
            const chunks = splitMessage(response, 2000);
            for (let i = 0; i < chunks.length; i++) {
                if (i === 0) {
                    await message.reply(chunks[i]);
                } else {
                    await message.channel.send(chunks[i]);
                }
            }
        }
        
    } catch (error) {
        console.error('Gemini AI Error:', error);
        await message.reply(`❌ **Error:** ${error.message}`);
    }
}

// Helper function to split long messages
function splitMessage(text, maxLength) {
    const chunks = [];
    let currentChunk = '';
    
    const lines = text.split('\n');
    
    for (const line of lines) {
        if (currentChunk.length + line.length + 1 <= maxLength) {
            currentChunk += (currentChunk ? '\n' : '') + line;
        } else {
            if (currentChunk) {
                chunks.push(currentChunk);
                currentChunk = line;
            } else {
                // Line is too long, split it by words
                const words = line.split(' ');
                for (const word of words) {
                    if (currentChunk.length + word.length + 1 <= maxLength) {
                        currentChunk += (currentChunk ? ' ' : '') + word;
                    } else {
                        if (currentChunk) {
                            chunks.push(currentChunk);
                            currentChunk = word;
                        } else {
                            // Word is too long, split it by characters
                            chunks.push(word.substring(0, maxLength));
                            currentChunk = word.substring(maxLength);
                        }
                    }
                }
            }
        }
    }
    
    if (currentChunk) {
        chunks.push(currentChunk);
    }
    
    return chunks;
}