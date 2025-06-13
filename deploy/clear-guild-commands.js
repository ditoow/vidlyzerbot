const { REST, Routes } = require('discord.js');
const config = require('../src/config/config.json');

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(config.token);

// Fungsi untuk clear guild commands
async function clearGuildCommands() {
    try {
        console.log('[CLEAR GUILD] Started clearing guild application (/) commands...');
        
        // Validasi guild ID
        if (!config.guildId || config.guildId === 'YOUR_GUILD_ID_HERE' || config.guildId === 'MASUKKAN_GUILD_ID_ANDA_DISINI') {
            console.error('❌ Guild ID tidak valid! Silakan isi guildId di config.json dengan ID server Discord Anda.');
            console.log('💡 Cara mendapatkan Guild ID:');
            console.log('   1. Aktifkan Developer Mode di Discord (User Settings > Advanced > Developer Mode)');
            console.log('   2. Klik kanan pada server Anda dan pilih "Copy Server ID"');
            console.log('   3. Paste ID tersebut ke config.json');
            return false;
        }
        
        // Clear all guild commands by setting empty array
        const data = await rest.put(
            Routes.applicationGuildCommands(config.clientId, config.guildId),
            { body: [] },
        );
        
        console.log(`[CLEAR GUILD] Successfully cleared all guild application (/) commands.`);
        console.log(`[CLEAR GUILD] ${data.length} commands remaining (should be 0).`);
        return true;
    } catch (error) {
        console.error('[CLEAR GUILD ERROR]', error);
        return false;
    }
}

// Fungsi untuk clear global commands
async function clearGlobalCommands() {
    try {
        console.log('[CLEAR GLOBAL] Started clearing global application (/) commands...');
        
        // Clear all global commands by setting empty array
        const data = await rest.put(
            Routes.applicationCommands(config.clientId),
            { body: [] },
        );
        
        console.log(`[CLEAR GLOBAL] Successfully cleared all global application (/) commands.`);
        console.log(`[CLEAR GLOBAL] ${data.length} commands remaining (should be 0).`);
        console.log(`[CLEAR GLOBAL] Changes will take effect globally in up to 1 hour.`);
        return true;
    } catch (error) {
        console.error('[CLEAR GLOBAL ERROR]', error);
        return false;
    }
}

// Main clearing logic
(async () => {
    console.log('='.repeat(50));
    console.log('🗑️  DISCORD BOT COMMAND CLEANER');
    console.log('='.repeat(50));
    
    // Cek apakah ada argument command line
    const args = process.argv.slice(2);
    const clearType = args[0];
    
    if (clearType === 'global') {
        console.log('🌍 Clearing GLOBAL commands...');
        console.log('⚠️  WARNING: This will remove ALL global commands!');
        await clearGlobalCommands();
    } else if (clearType === 'guild') {
        console.log('🏠 Clearing GUILD commands...');
        console.log('⚠️  WARNING: This will remove ALL guild commands!');
        await clearGuildCommands();
    } else if (clearType === 'all') {
        console.log('🌍🏠 Clearing ALL commands (both global and guild)...');
        console.log('⚠️  WARNING: This will remove ALL commands everywhere!');
        
        const guildSuccess = await clearGuildCommands();
        console.log('');
        const globalSuccess = await clearGlobalCommands();
        
        if (guildSuccess && globalSuccess) {
            console.log('');
            console.log('✅ All commands cleared successfully!');
        }
    } else {
        console.log('🤔 Pilih metode clearing:');
        console.log('');
        console.log('Available options:');
        console.log('  guild  - Clear guild commands only');
        console.log('  global - Clear global commands only');
        console.log('  all    - Clear both guild and global commands');
        console.log('');
        console.log('Usage examples:');
        console.log('  node clear-guild-commands.js guild');
        console.log('  node clear-guild-commands.js global');
        console.log('  node clear-guild-commands.js all');
        console.log('');
        console.log('⚠️  Default: Clearing GUILD commands only...');
        await clearGuildCommands();
    }
    
    console.log('');
    console.log('='.repeat(50));
    console.log('🧹 Clearing selesai!');
    console.log('='.repeat(50));
})();