const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../src/config/config.json');

const commands = [];

// Load all commands
const commandsPath = path.join(__dirname, '../src/commands');
fs.readdirSync(commandsPath).forEach(category => {
    const categoryPath = path.join(commandsPath, category);
    if (fs.lstatSync(categoryPath).isDirectory()) {
        const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));
        
        for (const file of commandFiles) {
            const filePath = path.join(categoryPath, file);
            const command = require(filePath);
            
            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());
            }
        }
    }
});

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(config.token);

// Fungsi untuk deploy guild commands
async function deployGuildCommands() {
    try {
        const data = await rest.put(
            Routes.applicationGuildCommands(config.clientId, config.guildId),
            { body: commands },
        );
        
        return true;
    } catch (error) {
        return false;
    }
}

// Fungsi untuk deploy global commands
async function deployGlobalCommands() {
    try {
        const data = await rest.put(
            Routes.applicationCommands(config.clientId),
            { body: commands },
        );
        
        return true;
    } catch (error) {
        return false;
    }
}

// Main deployment logic
(async () => {
    // Cek apakah ada argument command line
    const args = process.argv.slice(2);
    const deployType = args[0];
    
    if (deployType === 'global') {
        await deployGlobalCommands();
    } else if (deployType === 'guild') {
        // Validasi guild ID
        if (!config.guildId || config.guildId === 'YOUR_GUILD_ID_HERE' || config.guildId === 'MASUKKAN_GUILD_ID_ANDA_DISINI') {
            return;
        }
        
        await deployGuildCommands();
    } else {
        // Auto-deploy berdasarkan kondisi
        if (config.guildId && config.guildId !== 'YOUR_GUILD_ID_HERE' && config.guildId !== 'MASUKKAN_GUILD_ID_ANDA_DISINI') {
            const guildSuccess = await deployGuildCommands();
        } else {
            await deployGlobalCommands();
        }
    }
})();