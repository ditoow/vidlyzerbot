#!/usr/bin/env node

// Simple startup script for Pterodactyl
// Handles auto-deploy and bot startup

require('dotenv').config();

async function startBot() {
    // Check if deploy on startup is enabled
    const deployOnStartup = process.env.DEPLOY_ON_STARTUP === 'true' || process.env.DEPLOY_ON_STARTUP === '1';
    
    if (deployOnStartup) {
        console.log('deploying commands on startup...');
        
        try {
            const deployCommands = require('./deploy-simple');
            const success = await deployCommands();
            
            if (!success) {
                console.log('startup deploy failed - continuing anyway');
            }
        } catch (error) {
            console.log('startup deploy failed - continuing anyway');
        }
    }
    
    // Start the main bot
    require('./src/index.js');
}

startBot().catch(error => {
    console.error('startup failed:', error);
    process.exit(1);
});