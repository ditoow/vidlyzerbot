#!/usr/bin/env node

// Standalone auto-deploy script
// Usage: node scripts/auto-deploy-standalone.js [guild|global]

require('dotenv').config();
const AutoDeploy = require('../src/utils/auto-deploy');

const deployType = process.argv[2] || 'guild';

const autoDeploy = new AutoDeploy();

console.log('script autodploy berjalan');

// Initial deploy
autoDeploy.manualDeploy(deployType).then(success => {
    // Start watching
    autoDeploy.startWatching(deployType);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    process.exit(0);
});

process.on('SIGTERM', () => {
    process.exit(0);
});