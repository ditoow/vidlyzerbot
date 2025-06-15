const AutoDeploy = require('../utils/auto-deploy');

/**
 * Sets up auto-deploy functionality for the bot
 * @param {Client} client - Discord client instance
 * @returns {AutoDeploy} AutoDeploy instance
 */
function setupAutoDeploy(client) {
    const autoDeploy = new AutoDeploy();
    
    // Export autoDeploy untuk manual trigger
    client.autoDeploy = autoDeploy;
    
    return autoDeploy;
}

/**
 * Handles auto-deploy logic when bot is ready
 * @param {AutoDeploy} autoDeploy - AutoDeploy instance
 */
function handleAutoDeployOnReady(autoDeploy) {
    // Check environment variable untuk auto-deploy
    const enableAutoDeploy = process.env.AUTO_DEPLOY === 'true' || process.env.AUTO_DEPLOY === '1';
    const deployOnStartup = process.env.DEPLOY_ON_STARTUP === 'true' || process.env.DEPLOY_ON_STARTUP === '1';
    const deployType = process.env.AUTO_DEPLOY_TYPE || 'guild';
    
    // Deploy on startup if enabled
    if (deployOnStartup) {
        console.log('deploying commands on startup...');
        autoDeploy.manualDeploy(deployType).then(success => {
            if (success) {
                console.log('startup deploy completed');
            } else {
                console.log('startup deploy failed');
            }
        });
    }
    
    if (enableAutoDeploy) {
        console.log('script autodeploy berjalan');
        autoDeploy.startWatching(deployType);
    }
}

module.exports = { 
    setupAutoDeploy, 
    handleAutoDeployOnReady 
};