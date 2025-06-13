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
                console.log(`[DEPLOY] Loaded command: ${command.data.name}`);
            } else {
                console.log(`[WARNING] Command at ${filePath} is missing "data" or "execute" property.`);
            }
        }
    }
});

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(config.token);

// Fungsi untuk deploy guild commands
async function deployGuildCommands() {
    try {
        console.log(`[GUILD DEPLOY] Started refreshing ${commands.length} guild application (/) commands.`);
        
        const data = await rest.put(
            Routes.applicationGuildCommands(config.clientId, config.guildId),
            { body: commands },
        );
        
        console.log(`[GUILD DEPLOY] Successfully reloaded ${data.length} guild application (/) commands.`);
        console.log(`[GUILD DEPLOY] Commands will be available immediately in your server.`);
        return true;
    } catch (error) {
        console.error('[GUILD DEPLOY ERROR]', error);
        return false;
    }
}

// Fungsi untuk deploy global commands
async function deployGlobalCommands() {
    try {
        console.log(`[GLOBAL DEPLOY] Started refreshing ${commands.length} global application (/) commands.`);
        
        const data = await rest.put(
            Routes.applicationCommands(config.clientId),
            { body: commands },
        );
        
        console.log(`[GLOBAL DEPLOY] Successfully reloaded ${data.length} global application (/) commands.`);
        console.log(`[GLOBAL DEPLOY] Commands will be available globally in up to 1 hour.`);
        return true;
    } catch (error) {
        console.error('[GLOBAL DEPLOY ERROR]', error);
        return false;
    }
}

// Main deployment logic
(async () => {
    console.log('='.repeat(50));
    console.log('🚀 DISCORD BOT COMMAND DEPLOYMENT');
    console.log('='.repeat(50));
    
    // Cek apakah ada argument command line
    const args = process.argv.slice(2);
    const deployType = args[0];
    
    if (deployType === 'global') {
        console.log('📡 Deploying GLOBAL commands...');
        await deployGlobalCommands();
    } else if (deployType === 'guild') {
        console.log('🏠 Deploying GUILD commands...');
        
        // Validasi guild ID
        if (!config.guildId || config.guildId === 'YOUR_GUILD_ID_HERE' || config.guildId === 'MASUKKAN_GUILD_ID_ANDA_DISINI') {
            console.error('❌ Guild ID tidak valid! Silakan isi guildId di config.json dengan ID server Discord Anda.');
            console.log('💡 Cara mendapatkan Guild ID:');
            console.log('   1. Aktifkan Developer Mode di Discord (User Settings > Advanced > Developer Mode)');
            console.log('   2. Klik kanan pada server Anda dan pilih "Copy Server ID"');
            console.log('   3. Paste ID tersebut ke config.json');
            return;
        }
        
        await deployGuildCommands();
    } else {
        console.log('🤔 Pilih metode deployment:');
        console.log('');
        console.log('1️⃣  GUILD COMMANDS (Recommended for testing)');
        console.log('   ✅ Tersedia langsung setelah deploy');
        console.log('   ✅ Cocok untuk development dan testing');
        console.log('   ❌ Hanya tersedia di server tertentu');
        console.log('');
        console.log('2️⃣  GLOBAL COMMANDS (For production)');
        console.log('   ✅ Tersedia di semua server');
        console.log('   ✅ Cocok untuk bot production');
        console.log('   ❌ Butuh waktu hingga 1 jam untuk update');
        console.log('');
        
        // Auto-deploy berdasarkan kondisi
        if (config.guildId && config.guildId !== 'YOUR_GUILD_ID_HERE' && config.guildId !== 'MASUKKAN_GUILD_ID_ANDA_DISINI') {
            console.log('🏠 Guild ID terdeteksi, deploying guild commands...');
            const guildSuccess = await deployGuildCommands();
            
            if (guildSuccess) {
                console.log('');
                console.log('💡 Tips: Untuk deploy global commands, gunakan: npm run deploy global');
            }
        } else {
            console.log('📡 Guild ID tidak valid, deploying global commands...');
            await deployGlobalCommands();
            console.log('');
            console.log('💡 Tips: Untuk deploy guild commands yang lebih cepat:');
            console.log('   1. Isi guildId di config.json');
            console.log('   2. Jalankan: npm run deploy guild');
        }
    }
    
    console.log('');
    console.log('='.repeat(50));
    console.log('✨ Deployment selesai!');
    console.log('='.repeat(50));
})();