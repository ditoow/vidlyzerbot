// Load environment variables first
require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const AutoDeploy = require('./utils/auto-deploy');

const client = new Client({
  intents: Object.values(GatewayIntentBits)
});

// Initialize Auto Deploy
const autoDeploy = new AutoDeploy();

// Load Handlers
console.log('hanlder loaded (commandhandler.js, eventhandler.js)');
require('./handlers/commandhandler')(client);
require('./handlers/eventhandler')(client);

// Start auto-deploy setelah bot ready
client.once('ready', () => {
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
        console.log('script autodploy berjalan');
        autoDeploy.startWatching(deployType);
    }
});

// Export autoDeploy untuk manual trigger
client.autoDeploy = autoDeploy;

// Login dengan token dari environment variables atau config
client.login(config.token);