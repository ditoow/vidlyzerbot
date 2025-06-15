#!/usr/bin/env node

// Simple Pterodactyl startup script
// Handles auto-deploy and bot startup with minimal dependencies

require('dotenv').config();

async function startBot() {
    // Check if deploy on startup is enabled
    const deployOnStartup = process.env.DEPLOY_ON_STARTUP === 'true' || process.env.DEPLOY_ON_STARTUP === '1';
    
    if (deployOnStartup) {
        console.log('deploying commands on startup...');
        
        try {
            const { deploySimple } = require('../deploy/deploy-unified');
            const success = await deploySimple();
            
            if (!success) {
                console.log('startup deploy failed - continuing anyway');
            }
        } catch (error) {
            console.log('startup deploy failed - continuing anyway');
        }
    }
    
    // Start the main bot
    require('../src/index.js');
}

startBot().catch(error => {
    console.error('startup failed:', error);
    process.exit(1);
});