const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

class MusicCommandDeployer {
    constructor() {
        this.commands = [];
        this.rest = new REST({ version: '10' });
    }

    loadMusicCommands() {
        console.log('🎵 Loading music commands...\n');

        const musicCommandsPath = path.join(__dirname, '../src/commands/music');
        
        if (!fs.existsSync(musicCommandsPath)) {
            console.error('❌ Music commands directory not found!');
            return false;
        }

        const commandFiles = fs.readdirSync(musicCommandsPath).filter(file => file.endsWith('.js'));
        
        for (const file of commandFiles) {
            const filePath = path.join(musicCommandsPath, file);
            try {
                const command = require(filePath);
                if ('data' in command && 'execute' in command) {
                    this.commands.push(command.data.toJSON());
                    console.log(`✅ Loaded: ${command.data.name} - ${command.data.description}`);
                } else {
                    console.log(`⚠️  ${file} is missing required "data" or "execute" property`);
                }
            } catch (error) {
                console.error(`❌ Error loading ${file}:`, error.message);
            }
        }

        console.log(`\n📊 Total commands loaded: ${this.commands.length}\n`);
        return this.commands.length > 0;
    }

    async deployCommands(scope = 'guild') {
        const token = process.env.BOT_TOKEN;
        const clientId = process.env.CLIENT_ID;
        const guildId = process.env.GUILD_ID;

        if (!token || token === 'your_discord_bot_token_here') {
            console.error('❌ BOT_TOKEN not found or invalid in .env file');
            return false;
        }

        if (!clientId || clientId === 'your_discord_client_id_here') {
            console.error('❌ CLIENT_ID not found or invalid in .env file');
            return false;
        }

        if (scope === 'guild' && (!guildId || guildId === 'your_discord_guild_id_here')) {
            console.error('❌ GUILD_ID required for guild deployment');
            return false;
        }

        this.rest.setToken(token);

        try {
            let route;
            let scopeText;

            if (scope === 'guild') {
                route = Routes.applicationGuildCommands(clientId, guildId);
                scopeText = `guild (${guildId})`;
            } else {
                route = Routes.applicationCommands(clientId);
                scopeText = 'global';
            }

            console.log(`🚀 Deploying ${this.commands.length} music commands to ${scopeText}...`);

            const data = await this.rest.put(route, { body: this.commands });
            
            console.log(`✅ Successfully deployed ${data.length} commands to ${scopeText}!\n`);
            
            // List deployed commands
            console.log('📋 Deployed commands:');
            this.commands.forEach(command => {
                console.log(`   /${command.name} - ${command.description}`);
            });

            return true;

        } catch (error) {
            console.error('❌ Error deploying commands:', error);
            return false;
        }
    }

    async clearCommands(scope = 'guild') {
        const token = process.env.BOT_TOKEN;
        const clientId = process.env.CLIENT_ID;
        const guildId = process.env.GUILD_ID;

        if (!token || !clientId) {
            console.error('❌ BOT_TOKEN and CLIENT_ID required');
            return false;
        }

        if (scope === 'guild' && !guildId) {
            console.error('❌ GUILD_ID required for guild command clearing');
            return false;
        }

        this.rest.setToken(token);

        try {
            let route;
            let scopeText;

            if (scope === 'guild') {
                route = Routes.applicationGuildCommands(clientId, guildId);
                scopeText = `guild (${guildId})`;
            } else {
                route = Routes.applicationCommands(clientId);
                scopeText = 'global';
            }

            console.log(`🗑️  Clearing music commands from ${scopeText}...`);

            await this.rest.put(route, { body: [] });
            
            console.log(`✅ Successfully cleared commands from ${scopeText}!`);
            return true;

        } catch (error) {
            console.error('❌ Error clearing commands:', error);
            return false;
        }
    }

    showHelp() {
        console.log(`
🎵 VidlyzerBot Music Commands Deployer

Usage: node scripts/deploy-music-commands.js [options]

Options:
  --scope <scope>  Deployment scope: guild or global (default: guild)
  --clear          Clear commands instead of deploying
  --help           Show this help message

Examples:
  node scripts/deploy-music-commands.js                    # Deploy to guild
  node scripts/deploy-music-commands.js --scope global     # Deploy globally
  node scripts/deploy-music-commands.js --clear            # Clear guild commands
  node scripts/deploy-music-commands.js --clear --scope global

Environment Variables Required:
  BOT_TOKEN   - Your Discord bot token
  CLIENT_ID   - Your Discord application client ID
  GUILD_ID    - Guild ID for guild deployments (optional for global)

Music Commands:
  /play        - Play music from YouTube/Spotify
  /pause       - Pause current song
  /resume      - Resume playback
  /skip        - Skip to next song
  /stop        - Stop music/radio and clear queue
  /queue       - Show current queue
  /nowplaying  - Show current song/radio
  /volume      - Set volume (1-100)
  /shuffle     - Shuffle queue
  /radio       - Radio commands (start, stop, list, current)

Quick Commands (prefix: .):
  .stop        - Stop current activity
  .status      - Show bot status
  .help        - Show help
        `);
    }
}

// Main execution
async function main() {
    const args = process.argv.slice(2);
    
    // Parse arguments
    const scope = args.includes('--scope') ? args[args.indexOf('--scope') + 1] : 'guild';
    const clear = args.includes('--clear');
    const help = args.includes('--help');

    const deployer = new MusicCommandDeployer();

    if (help) {
        deployer.showHelp();
        return;
    }

    console.log('🎵 VidlyzerBot Music Commands Deployer\n');
    console.log(`Configuration:`);
    console.log(`   Scope: ${scope}`);
    console.log(`   Action: ${clear ? 'Clear' : 'Deploy'}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'production'}\n`);

    // Validate scope
    if (!['guild', 'global'].includes(scope)) {
        console.error('❌ Invalid scope. Use: guild or global');
        return;
    }

    if (clear) {
        const success = await deployer.clearCommands(scope);
        if (success) {
            console.log('\n🎉 Music commands cleared successfully!');
        }
    } else {
        const loaded = deployer.loadMusicCommands();
        if (!loaded) {
            console.error('❌ Failed to load music commands');
            return;
        }

        const success = await deployer.deployCommands(scope);
        if (success) {
            console.log('\n🎉 Music commands deployed successfully!');
            console.log('\n🎵 Your music system is ready to use!');
            console.log('   • Music commands: /play, /pause, /resume, /skip, /stop, etc.');
            console.log('   • Radio commands: /radio start, /radio stop, /radio list');
            console.log('   • Quick commands: .stop, .status, .help');
            console.log('   • Mode switching: Only one mode (music/radio) active at a time');
        }
    }
}

// Run the script
if (require.main === module) {
    main().catch(console.error);
}

module.exports = MusicCommandDeployer;