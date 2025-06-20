const config = require('../config');
const { createClient } = require('./client');
const { loadHandlers } = require('./handlers');
const { setupAutoDeploy, handleAutoDeployOnReady } = require('./auto-deploy-setup');
const MusicSystem = require('../features/music');
const MessageHandler = require('../handlers/messageHandler');

/**
 * Initializes and starts the Discord bot
 * @returns {Client} The initialized Discord client
 */
function startBot() {
    // Create client
    const client = createClient();
    
    // Initialize Music System
    console.log('🎵 Initializing Music System...');
    client.musicSystem = new MusicSystem(client);
    
    // Initialize Message Handler for prefix commands
    console.log('💬 Initializing Message Handler...');
    client.messageHandler = new MessageHandler(client);
    
    // Setup message event listener
    client.on('messageCreate', async (message) => {
        try {
            await client.messageHandler.handleMessage(message);
        } catch (error) {
            console.error('Error handling message:', error);
        }
    });
    
    // Setup auto-deploy
    const autoDeploy = setupAutoDeploy(client);
    
    // Load handlers
    loadHandlers(client);
    
    // Setup ready event for auto-deploy and music system
    client.once('ready', () => {
        console.log('✅ Music System ready!');
        console.log('🎵 Music commands: /play, /pause, /resume, /skip, /stop, /queue, /nowplaying, /volume, /shuffle');
        console.log('📻 Radio commands: /radio start, /radio stop, /radio list, /radio current');
        console.log('⚡ Quick commands: .stop, .status, .help');
        console.log('🔄 Mode switching: Only one mode (music/radio) can be active at a time');
        
        handleAutoDeployOnReady(autoDeploy);
    });
    
    // Login dengan token dari environment variables atau config
    client.login(config.token);
    
    return client;
}

module.exports = { startBot };