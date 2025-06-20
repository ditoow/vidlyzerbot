#!/usr/bin/env node

// Unified deploy script - combines all deployment methods
require('dotenv').config();

const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

class DeployManager {
    constructor() {
        this.commands = [];
        this.config = null;
        this.loadConfig();
        this.loadCommands();
    }

    // Load configuration (supports both env vars and config.json)
    loadConfig() {
        try {
            // Try to load from environment variables first
            this.config = require('../src/config');
        } catch (error) {
            try {
                // Fallback to config.json
                this.config = require('../src/config/config.json');
            } catch (fallbackError) {
                console.log('deploy failed - no config found');
                process.exit(1);
            }
        }
    }

    // Load all commands from src/commands and src/features
    loadCommands() {
        try {
            // Load commands from main commands directory
            this.loadCommandsFromDirectory(path.join(__dirname, '../src/commands'));
            
            // Load commands from features directory
            const featuresPath = path.join(__dirname, '../src/features');
            if (fs.existsSync(featuresPath)) {
                const featureDirectories = fs.readdirSync(featuresPath);
                
                for (const featureDir of featureDirectories) {
                    const featurePath = path.join(featuresPath, featureDir);
                    const featureCommandsPath = path.join(featurePath, 'commands');
                    
                    if (fs.existsSync(featureCommandsPath)) {
                        this.loadCommandsFromDirectory(featureCommandsPath);
                    }
                }
            }
        } catch (error) {
            console.log('deploy failed - cannot load commands');
            process.exit(1);
        }
    }

    // Helper method to load commands from a directory
    loadCommandsFromDirectory(directory) {
        if (!fs.existsSync(directory)) return;
        
        const items = fs.readdirSync(directory);
        
        for (const item of items) {
            const itemPath = path.join(directory, item);
            const stat = fs.statSync(itemPath);
            
            if (stat.isDirectory()) {
                // Recursively load commands from subdirectories
                this.loadCommandsFromDirectory(itemPath);
            } else if (item.endsWith('.js')) {
                try {
                    // Clear require cache for fresh load
                    delete require.cache[require.resolve(itemPath)];
                    
                    const command = require(itemPath);
                    if ('data' in command && 'execute' in command) {
                        this.commands.push(command.data.toJSON());
                        console.log(`loaded command: ${command.data.name}`);
                    }
                } catch (error) {
                    console.log(`warning - failed to load command: ${item} - ${error.message}`);
                }
            }
        }
    }

    // Validate configuration
    validateConfig(deployType) {
        if (!this.config.token) {
            console.log('deploy failed - missing bot token');
            return false;
        }

        if (!this.config.clientId) {
            console.log('deploy failed - missing client id');
            return false;
        }

        if (deployType === 'guild' && !this.config.guildId) {
            console.log('deploy failed - missing guild id for guild deployment');
            return false;
        }

        if (this.commands.length === 0) {
            console.log('deploy failed - no commands found');
            return false;
        }

        return true;
    }

    // Deploy guild commands
    async deployGuild() {
        if (!this.validateConfig('guild')) {
            return false;
        }

        try {
            const rest = new REST().setToken(this.config.token);
            
            const data = await rest.put(
                Routes.applicationGuildCommands(this.config.clientId, this.config.guildId),
                { body: this.commands }
            );
            
            console.log(`guild deploy completed - ${data.length} commands`);
            return true;
        } catch (error) {
            console.log('guild deploy failed');
            return false;
        }
    }

    // Deploy global commands
    async deployGlobal() {
        if (!this.validateConfig('global')) {
            return false;
        }

        try {
            const rest = new REST().setToken(this.config.token);
            
            const data = await rest.put(
                Routes.applicationCommands(this.config.clientId),
                { body: this.commands }
            );
            
            console.log(`global deploy completed - ${data.length} commands`);
            return true;
        } catch (error) {
            console.log('global deploy failed');
            return false;
        }
    }

    // Auto-detect deployment type
    async deployAuto() {
        // Prefer guild deployment if guild ID is available
        if (this.config.guildId && 
            this.config.guildId !== 'YOUR_GUILD_ID_HERE' && 
            this.config.guildId !== 'MASUKKAN_GUILD_ID_ANDA_DISINI') {
            return await this.deployGuild();
        } else {
            return await this.deployGlobal();
        }
    }

    // Clear guild commands
    async clearGuild() {
        if (!this.validateConfig('guild')) {
            return false;
        }

        try {
            const rest = new REST().setToken(this.config.token);
            
            const data = await rest.put(
                Routes.applicationGuildCommands(this.config.clientId, this.config.guildId),
                { body: [] }
            );
            
            console.log('guild commands cleared');
            return true;
        } catch (error) {
            console.log('clear guild commands failed');
            return false;
        }
    }

    // Clear global commands
    async clearGlobal() {
        if (!this.validateConfig('global')) {
            return false;
        }

        try {
            const rest = new REST().setToken(this.config.token);
            
            const data = await rest.put(
                Routes.applicationCommands(this.config.clientId),
                { body: [] }
            );
            
            console.log('global commands cleared');
            return true;
        } catch (error) {
            console.log('clear global commands failed');
            return false;
        }
    }

    // Simple deploy for startup (returns boolean for compatibility)
    async deploySimple(type = null) {
        const deployType = type || process.env.AUTO_DEPLOY_TYPE || 'guild';
        
        if (deployType === 'global') {
            return await this.deployGlobal();
        } else {
            return await this.deployGuild();
        }
    }
}

// Main execution logic
async function main() {
    const deployManager = new DeployManager();
    const args = process.argv.slice(2);
    const command = args[0];
    
    let success = false;
    
    switch (command) {
        case 'guild':
            success = await deployManager.deployGuild();
            break;
        case 'global':
            success = await deployManager.deployGlobal();
            break;
        case 'clear-guild':
            success = await deployManager.clearGuild();
            break;
        case 'clear-global':
            success = await deployManager.clearGlobal();
            break;
        case 'clear-all':
            const guildClear = await deployManager.clearGuild();
            const globalClear = await deployManager.clearGlobal();
            success = guildClear && globalClear;
            break;
        case 'simple':
            success = await deployManager.deploySimple(args[1]);
            break;
        default:
            success = await deployManager.deployAuto();
            break;
    }
    
    process.exit(success ? 0 : 1);
}

// Export for use as module
module.exports = {
    DeployManager,
    deploySimple: async (type) => {
        const deployManager = new DeployManager();
        return await deployManager.deploySimple(type);
    }
};

// Run if called directly
if (require.main === module) {
    main().catch(error => {
        console.log('deploy failed - unexpected error');
        process.exit(1);
    });
}