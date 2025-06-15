const { Client, GatewayIntentBits } = require('discord.js');

/**
 * Creates and configures the Discord client
 * @returns {Client} Configured Discord client
 */
function createClient() {
    const client = new Client({
        intents: Object.values(GatewayIntentBits)
    });

    return client;
}

module.exports = { createClient };