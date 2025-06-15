const config = require('../config');
const { createClient } = require('./client');
const { loadHandlers } = require('./handlers');
const { setupAutoDeploy, handleAutoDeployOnReady } = require('./auto-deploy-setup');

/**
 * Initializes and starts the Discord bot
 * @returns {Client} The initialized Discord client
 */
function startBot() {
    // Create client
    const client = createClient();
    
    // Setup auto-deploy
    const autoDeploy = setupAutoDeploy(client);
    
    // Load handlers
    loadHandlers(client);
    
    // Setup ready event for auto-deploy
    client.once('ready', () => {
        handleAutoDeployOnReady(autoDeploy);
    });
    
    // Login dengan token dari environment variables atau config
    client.login(config.token);
    
    return client;
}

module.exports = { startBot };