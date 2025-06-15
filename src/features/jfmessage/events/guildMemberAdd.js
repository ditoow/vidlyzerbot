const WelcomeManager = require('../welcome-manager');

// Initialize Welcome Manager
const welcomeManager = new WelcomeManager();

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        try {
            console.log(`New member joined: ${member.user.tag} in ${member.guild.name}`);
            
            // Send welcome message
            await welcomeManager.sendWelcomeMessage(member, 'welcome');
            
        } catch (error) {
            console.error('Error in guildMemberAdd event:', error);
        }
    },
    
    // Export welcome manager for external access
    welcomeManager
};