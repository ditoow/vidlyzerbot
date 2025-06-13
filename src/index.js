// Load environment variables first
require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Load Handlers
require('./handlers/commandhandler')(client);
require('./handlers/eventhandler')(client);

// Login dengan token dari environment variables atau config
console.log('🚀 Starting VidlyzerBot...');
client.login(config.token);
