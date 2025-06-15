const fs = require('fs');
const path = require('path');
const { Collection } = require('discord.js');

function loadCommandsFromDirectory(client, directory, prefix = '') {
    if (!fs.existsSync(directory)) return;
    
    const items = fs.readdirSync(directory);
    
    for (const item of items) {
        const itemPath = path.join(directory, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
            // Recursively load commands from subdirectories
            loadCommandsFromDirectory(client, itemPath, `${prefix}${item}/`);
        } else if (item.endsWith('.js')) {
            try {
                const command = require(itemPath);
                
                if ('data' in command && 'execute' in command) {
                    client.commands.set(command.data.name, command);
                    console.log(`${prefix}commands loaded (${item})`);
                } else {
                    console.warn(`Command file ${prefix}${item} is missing data or execute function`);
                }
            } catch (error) {
                console.error(`Error loading command ${prefix}${item}:`, error);
            }
        }
    }
}

module.exports = (client) => {
    client.commands = new Collection();

    // Load commands from main commands directory
    const commandsPath = path.join(__dirname, '../commands');
    loadCommandsFromDirectory(client, commandsPath);
    
    // Load commands from features directory
    const featuresPath = path.join(__dirname, '../features');
    if (fs.existsSync(featuresPath)) {
        const featureDirectories = fs.readdirSync(featuresPath);
        
        for (const featureDir of featureDirectories) {
            const featurePath = path.join(featuresPath, featureDir);
            const featureCommandsPath = path.join(featurePath, 'commands');
            
            if (fs.existsSync(featureCommandsPath)) {
                loadCommandsFromDirectory(client, featureCommandsPath, `features/${featureDir}/commands/`);
            }
        }
    }
    
    console.log(`slash commands loaded`);
};