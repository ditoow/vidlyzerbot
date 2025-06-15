#!/usr/bin/env node

// Advanced Pterodactyl startup script with auto-deploy
// This script will deploy commands and then start the bot

require('dotenv').config();
const { spawn } = require('child_process');
const AutoDeploy = require('../src/utils/auto-deploy');

async function startBot() {
    console.log('='.repeat(50));
    console.log('🚀 PTERODACTYL BOT STARTUP (ADVANCED)');
    console.log('='.repeat(50));
    
    // Check if deploy on startup is enabled
    const deployOnStartup = process.env.DEPLOY_ON_STARTUP === 'true' || process.env.DEPLOY_ON_STARTUP === '1';
    const deployType = process.env.AUTO_DEPLOY_TYPE || 'guild';
    
    if (deployOnStartup) {
        console.log('🔄 Deploying commands before startup...');
        
        try {
            const autoDeploy = new AutoDeploy();
            const success = await autoDeploy.manualDeploy(deployType);
            
            if (success) {
                console.log('✅ Commands deployed successfully!');
            } else {
                console.log('❌ Command deployment failed, but continuing startup...');
            }
        } catch (error) {
            console.log('❌ Deploy error:', error.message);
            console.log('⚠️  Continuing with bot startup...');
        }
        
        console.log('');
    }
    
    console.log('🤖 Starting bot...');
    console.log('='.repeat(50));
    
    // Start the main bot process
    const botProcess = spawn('node', ['src/index.js'], {
        stdio: 'inherit',
        env: process.env
    });
    
    // Handle bot process events
    botProcess.on('close', (code) => {
        console.log(`\n🛑 Bot process exited with code ${code}`);
        process.exit(code);
    });
    
    botProcess.on('error', (error) => {
        console.error('❌ Failed to start bot:', error);
        process.exit(1);
    });
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
        console.log('\n🛑 Received SIGINT, shutting down gracefully...');
        botProcess.kill('SIGINT');
    });
    
    process.on('SIGTERM', () => {
        console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
        botProcess.kill('SIGTERM');
    });
}

// Start the bot
startBot().catch(error => {
    console.error('❌ Startup failed:', error);
    process.exit(1);
});