#!/usr/bin/env node

// Simple deploy script for startup
require('dotenv').config();

const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

async function deployCommands() {
    try {
        // Load config
        const config = require('./src/config');
        
        // Validate config
        if (!config.token || !config.clientId) {
            console.log('startup deploy failed - missing config');
            return false;
        }
        
        const deployType = process.env.AUTO_DEPLOY_TYPE || 'guild';
        
        if (deployType === 'guild' && !config.guildId) {
            console.log('startup deploy failed - missing guild id');
            return false;
        }
        
        // Load commands
        const commands = [];
        const commandsPath = path.join(__dirname, 'src/commands');
        
        const categories = fs.readdirSync(commandsPath);
        
        for (const category of categories) {
            const categoryPath = path.join(commandsPath, category);
            if (fs.lstatSync(categoryPath).isDirectory()) {
                const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));
                
                for (const file of commandFiles) {
                    const filePath = path.join(categoryPath, file);
                    try {
                        const command = require(filePath);
                        if ('data' in command && 'execute' in command) {
                            commands.push(command.data.toJSON());
                        }
                    } catch (error) {
                        // Skip invalid command files
                    }
                }
            }
        }
        
        if (commands.length === 0) {
            console.log('startup deploy failed - no commands found');
            return false;
        }
        
        // Deploy commands
        const rest = new REST().setToken(config.token);
        
        if (deployType === 'guild') {
            await rest.put(
                Routes.applicationGuildCommands(config.clientId, config.guildId),
                { body: commands }
            );
        } else {
            await rest.put(
                Routes.applicationCommands(config.clientId),
                { body: commands }
            );
        }
        
        console.log('startup deploy completed');
        return true;
        
    } catch (error) {
        console.log('startup deploy failed');
        return false;
    }
}

// Run if called directly
if (require.main === module) {
    deployCommands().then(success => {
        process.exit(success ? 0 : 1);
    });
}

module.exports = deployCommands;