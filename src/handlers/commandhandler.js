const fs = require('fs');
const path = require('path');
const { Collection } = require('discord.js');

module.exports = (client) => {
    client.commands = new Collection();

    const commandsPath = path.join(__dirname, '../commands');
    
    // Load commands from all categories
    fs.readdirSync(commandsPath).forEach(category => {
        const categoryPath = path.join(commandsPath, category);
        
        if (fs.lstatSync(categoryPath).isDirectory()) {
            const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));
            
            for (const file of commandFiles) {
                const filePath = path.join(categoryPath, file);
                const command = require(filePath);
                
                // Set a new item in the Collection with the key as the command name and the value as the exported module
                if ('data' in command && 'execute' in command) {
                    client.commands.set(command.data.name, command);
                    console.log(`[COMMAND] Loaded ${command.data.name} from ${category} category`);
                } else {
                    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                }
            }
        }
    });
    
    console.log(`[COMMAND HANDLER] Loaded ${client.commands.size} commands`);
};