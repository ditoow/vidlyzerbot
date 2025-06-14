#!/usr/bin/env node

// Simple startup script for Pterodactyl
// Handles auto-deploy and bot startup

require('dotenv').config();

async function startBot() {
    // Check if deploy on startup is enabled
    const deployOnStartup = process.env.DEPLOY_ON_STARTUP === 'true' || process.env.DEPLOY_ON_STARTUP === '1';
    const deployType = process.env.AUTO_DEPLOY_TYPE || 'guild';
    
    if (deployOnStartup) {
        console.log('deploying commands on startup...');
        
        try {
            const AutoDeploy = require('./src/utils/auto-deploy');
            const autoDeploy = new AutoDeploy();
            const success = await autoDeploy.manualDeploy(deployType);
            
            if (success) {
                console.log('startup deploy completed');
            } else {
                console.log('startup deploy failed');
            }
        } catch (error) {
            console.log('deploy error, continuing startup...');
        }
    }
    
    // Start the main bot
    require('./src/index.js');
}

startBot().catch(error => {
    console.error('startup failed:', error);
    process.exit(1);
});