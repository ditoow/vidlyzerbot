const WelcomeManager = require('../welcome-manager');

// Initialize Welcome Manager
const welcomeManager = new WelcomeManager();

module.exports = {
    name: 'guildMemberRemove',
    async execute(member) {
        try {
            console.log(`Member left: ${member.user.tag} from ${member.guild.name}`);
            
            // Send goodbye message
            await welcomeManager.sendWelcomeMessage(member, 'goodbye');
            
        } catch (error) {
            console.error('Error in guildMemberRemove event:', error);
        }
    },
    
    // Export welcome manager for external access
    welcomeManager
};