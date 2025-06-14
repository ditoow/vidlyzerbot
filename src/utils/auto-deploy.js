const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');
const config = require('../config/config.json');

class AutoDeploy {
    constructor() {
        this.commandsPath = path.join(__dirname, '../commands');
        this.lastDeployTime = 0;
        this.deployCooldown = 5000; // 5 detik cooldown
        this.isDeploying = false;
        this.commandHashes = new Map();
        
        // Initialize command hashes
        this.updateCommandHashes();
    }

    // Generate hash untuk command file
    generateFileHash(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            return require('crypto').createHash('md5').update(content).digest('hex');
        } catch (error) {
            return null;
        }
    }

    // Update command hashes
    updateCommandHashes() {
        const categories = fs.readdirSync(this.commandsPath);
        
        categories.forEach(category => {
            const categoryPath = path.join(this.commandsPath, category);
            if (fs.lstatSync(categoryPath).isDirectory()) {
                const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));
                
                commandFiles.forEach(file => {
                    const filePath = path.join(categoryPath, file);
                    const hash = this.generateFileHash(filePath);
                    this.commandHashes.set(filePath, hash);
                });
            }
        });
    }

    // Check apakah ada perubahan command
    hasCommandChanges() {
        const categories = fs.readdirSync(this.commandsPath);
        let hasChanges = false;
        
        categories.forEach(category => {
            const categoryPath = path.join(this.commandsPath, category);
            if (fs.lstatSync(categoryPath).isDirectory()) {
                const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));
                
                commandFiles.forEach(file => {
                    const filePath = path.join(categoryPath, file);
                    const currentHash = this.generateFileHash(filePath);
                    const oldHash = this.commandHashes.get(filePath);
                    
                    if (currentHash !== oldHash) {
                        hasChanges = true;
                    }
                });
            }
        });
        
        return hasChanges;
    }

    // Load semua commands
    loadCommands() {
        const commands = [];
        const categories = fs.readdirSync(this.commandsPath);
        
        categories.forEach(category => {
            const categoryPath = path.join(this.commandsPath, category);
            if (fs.lstatSync(categoryPath).isDirectory()) {
                const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));
                
                commandFiles.forEach(file => {
                    const filePath = path.join(categoryPath, file);
                    
                    // Clear require cache untuk reload command
                    delete require.cache[require.resolve(filePath)];
                    
                    try {
                        const command = require(filePath);
                        if ('data' in command && 'execute' in command) {
                            commands.push(command.data.toJSON());
                        }
                    } catch (error) {
                        // Error loading command
                    }
                });
            }
        });
        
        return commands;
    }

    // Deploy commands
    async deployCommands(type = 'guild') {
        if (this.isDeploying) {
            return false;
        }

        const now = Date.now();
        if (now - this.lastDeployTime < this.deployCooldown) {
            return false;
        }

        this.isDeploying = true;
        this.lastDeployTime = now;

        try {
            const commands = this.loadCommands();
            const rest = new REST().setToken(config.token);

            let data;
            if (type === 'guild' && config.guildId) {
                data = await rest.put(
                    Routes.applicationGuildCommands(config.clientId, config.guildId),
                    { body: commands }
                );
            } else {
                data = await rest.put(
                    Routes.applicationCommands(config.clientId),
                    { body: commands }
                );
            }

            // Update command hashes setelah deploy berhasil
            this.updateCommandHashes();
            return true;

        } catch (error) {
            return false;
        } finally {
            this.isDeploying = false;
        }
    }

    // Start watching untuk perubahan
    startWatching(deployType = 'guild') {
        // Check setiap 3 detik
        setInterval(async () => {
            if (this.hasCommandChanges()) {
                await this.deployCommands(deployType);
            }
        }, 3000);

        // Watch file system changes (backup method)
        const categories = fs.readdirSync(this.commandsPath);
        categories.forEach(category => {
            const categoryPath = path.join(this.commandsPath, category);
            if (fs.lstatSync(categoryPath).isDirectory()) {
                fs.watch(categoryPath, { recursive: true }, async (eventType, filename) => {
                    if (filename && filename.endsWith('.js')) {
                        // Delay sedikit untuk memastikan file sudah selesai ditulis
                        setTimeout(async () => {
                            if (this.hasCommandChanges()) {
                                await this.deployCommands(deployType);
                            }
                        }, 1000);
                    }
                });
            }
        });
    }

    // Manual deploy
    async manualDeploy(type = 'guild') {
        return await this.deployCommands(type);
    }
}

module.exports = AutoDeploy;