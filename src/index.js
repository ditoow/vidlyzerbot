// Load environment variables first
require('dotenv').config();

const { startBot } = require('./bot/startup');

// Start the bot
const client = startBot();

// Export client for external access if needed
module.exports = client;