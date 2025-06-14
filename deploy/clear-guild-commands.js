const { REST, Routes } = require('discord.js');
const config = require('../src/config/config.json');

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(config.token);

// Fungsi untuk clear guild commands
async function clearGuildCommands() {
    try {
        if (!config.guildId || config.guildId === 'YOUR_GUILD_ID_HERE' || config.guildId === 'MASUKKAN_GUILD_ID_ANDA_DISINI') {
            return false;
        }

        const data = await rest.put(
            Routes.applicationGuildCommands(config.clientId, config.guildId),
            { body: [] },
        );
        
        return true;
    } catch (error) {
        return false;
    }
}

// Fungsi untuk clear global commands
async function clearGlobalCommands() {
    try {
        const data = await rest.put(
            Routes.applicationCommands(config.clientId),
            { body: [] },
        );
        
        return true;
    } catch (error) {
        return false;
    }
}

// Main clearing logic
(async () => {
    const args = process.argv.slice(2);
    const clearType = args[0];
    
    if (clearType === 'global') {
        await clearGlobalCommands();
    } else if (clearType === 'guild') {
        await clearGuildCommands();
    } else if (clearType === 'all') {
        const guildSuccess = await clearGuildCommands();
        const globalSuccess = await clearGlobalCommands();
    } else {
        await clearGuildCommands();
    }
})();