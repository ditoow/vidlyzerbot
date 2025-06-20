const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');
const config = require('../config');

class AutoDeploy {
    constructor() {
        this.commandsPath = path.join(__dirname, '../commands');
        this.featuresPath = path.join(__dirname, '../features');
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
        try {
            // Update hashes for main commands directory
            if (fs.existsSync(this.commandsPath)) {
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
            
            // Update hashes for features directory
            if (fs.existsSync(this.featuresPath)) {
                const featureDirectories = fs.readdirSync(this.featuresPath);
                
                featureDirectories.forEach(featureDir => {
                    const featurePath = path.join(this.featuresPath, featureDir);
                    const featureCommandsPath = path.join(featurePath, 'commands');
                    
                    if (fs.existsSync(featureCommandsPath) && fs.lstatSync(featureCommandsPath).isDirectory()) {
                        const commandFiles = fs.readdirSync(featureCommandsPath).filter(file => file.endsWith('.js'));
                        
                        commandFiles.forEach(file => {
                            const filePath = path.join(featureCommandsPath, file);
                            const hash = this.generateFileHash(filePath);
                            this.commandHashes.set(filePath, hash);
                        });
                    }
                });
            }
        } catch (error) {
            // Error updating hashes
        }
    }

    // Check apakah ada perubahan command
    hasCommandChanges() {
        try {
            let hasChanges = false;
            
            // Check main commands directory
            if (fs.existsSync(this.commandsPath)) {
                const categories = fs.readdirSync(this.commandsPath);
                
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
            }
            
            // Check features directory
            if (fs.existsSync(this.featuresPath)) {
                const featureDirectories = fs.readdirSync(this.featuresPath);
                
                featureDirectories.forEach(featureDir => {
                    const featurePath = path.join(this.featuresPath, featureDir);
                    const featureCommandsPath = path.join(featurePath, 'commands');
                    
                    if (fs.existsSync(featureCommandsPath) && fs.lstatSync(featureCommandsPath).isDirectory()) {
                        const commandFiles = fs.readdirSync(featureCommandsPath).filter(file => file.endsWith('.js'));
                        
                        commandFiles.forEach(file => {
                            const filePath = path.join(featureCommandsPath, file);
                            const currentHash = this.generateFileHash(filePath);
                            const oldHash = this.commandHashes.get(filePath);
                            
                            if (currentHash !== oldHash) {
                                hasChanges = true;
                            }
                        });
                    }
                });
            }
            
            return hasChanges;
        } catch (error) {
            return false;
        }
    }

    // Load semua commands
    loadCommands() {
        const commands = [];
        
        try {
            // Load commands from main commands directory
            if (fs.existsSync(this.commandsPath)) {
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
                                console.error(`Error loading command ${filePath}:`, error);
                            }
                        });
                    }
                });
            }
            
            // Load commands from features directory
            if (fs.existsSync(this.featuresPath)) {
                const featureDirectories = fs.readdirSync(this.featuresPath);
                
                featureDirectories.forEach(featureDir => {
                    const featurePath = path.join(this.featuresPath, featureDir);
                    const featureCommandsPath = path.join(featurePath, 'commands');
                    
                    if (fs.existsSync(featureCommandsPath) && fs.lstatSync(featureCommandsPath).isDirectory()) {
                        const commandFiles = fs.readdirSync(featureCommandsPath).filter(file => file.endsWith('.js'));
                        
                        commandFiles.forEach(file => {
                            const filePath = path.join(featureCommandsPath, file);
                            
                            // Clear require cache untuk reload command
                            delete require.cache[require.resolve(filePath)];
                            
                            try {
                                const command = require(filePath);
                                if ('data' in command && 'execute' in command) {
                                    commands.push(command.data.toJSON());
                                }
                            } catch (error) {
                                console.error(`Error loading command ${filePath}:`, error);
                            }
                        });
                    }
                });
            }
        } catch (error) {
            console.error('Error loading commands:', error);
        }
        
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
            // Validate config
            if (!config.token || !config.clientId) {
                return false;
            }

            const commands = this.loadCommands();
            if (commands.length === 0) {
                return false;
            }

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
        try {
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
        } catch (error) {
            // Error starting watcher
        }
    }

    // Manual deploy
    async manualDeploy(type = 'guild') {
        return await this.deployCommands(type);
    }
}

module.exports = AutoDeploy;