const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const WelcomeManager = require('../welcome-manager');

// Initialize Welcome Manager
const welcomeManager = new WelcomeManager();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('welcome')
        .setDescription('Kelola sistem welcome message')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand(subcommand =>
            subcommand
                .setName('test')
                .setDescription('Test welcome message dengan user saat ini')
                .addStringOption(option =>
                    option
                        .setName('type')
                        .setDescription('Tipe pesan yang akan ditest')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Welcome', value: 'welcome' },
                            { name: 'Goodbye', value: 'goodbye' }
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('setup')
                .setDescription('Setup channel untuk welcome/goodbye message')
                .addChannelOption(option =>
                    option
                        .setName('welcome-channel')
                        .setDescription('Channel untuk welcome message')
                        .addChannelTypes(ChannelType.GuildText)
                )
                .addChannelOption(option =>
                    option
                        .setName('goodbye-channel')
                        .setDescription('Channel untuk goodbye message')
                        .addChannelTypes(ChannelType.GuildText)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('toggle')
                .setDescription('Enable/disable welcome atau goodbye message')
                .addStringOption(option =>
                    option
                        .setName('type')
                        .setDescription('Tipe yang akan di toggle')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Welcome', value: 'welcome' },
                            { name: 'Goodbye', value: 'goodbye' }
                        )
                )
                .addBooleanOption(option =>
                    option
                        .setName('enabled')
                        .setDescription('Enable atau disable')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('message')
                .setDescription('Ubah pesan welcome/goodbye')
                .addStringOption(option =>
                    option
                        .setName('type')
                        .setDescription('Tipe pesan yang akan diubah')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Welcome', value: 'welcome' },
                            { name: 'Goodbye', value: 'goodbye' }
                        )
                )
                .addStringOption(option =>
                    option
                        .setName('message')
                        .setDescription('Pesan baru (gunakan {user}, {username}, {server}, {membercount})')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('settings')
                .setDescription('Ubah pengaturan welcome message')
                .addStringOption(option =>
                    option
                        .setName('welcome-color')
                        .setDescription('Warna embed welcome (hex color, contoh: #00ff00)')
                )
                .addStringOption(option =>
                    option
                        .setName('goodbye-color')
                        .setDescription('Warna embed goodbye (hex color, contoh: #ff0000)')
                )
                .addBooleanOption(option =>
                    option
                        .setName('show-avatar')
                        .setDescription('Tampilkan avatar di embed')
                )
                .addBooleanOption(option =>
                    option
                        .setName('show-member-count')
                        .setDescription('Tampilkan jumlah member')
                )
                .addBooleanOption(option =>
                    option
                        .setName('show-welcome-image')
                        .setDescription('Tampilkan gambar welcome card')
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('status')
                .setDescription('Lihat status dan pengaturan welcome system')
        ),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case 'test':
                await handleTest(interaction);
                break;
            case 'setup':
                await handleSetup(interaction);
                break;
            case 'toggle':
                await handleToggle(interaction);
                break;
            case 'message':
                await handleMessage(interaction);
                break;
            case 'settings':
                await handleSettings(interaction);
                break;
            case 'status':
                await handleStatus(interaction);
                break;
        }
    },

    // Export welcome manager for external access
    welcomeManager
};

async function handleTest(interaction) {
    const type = interaction.options.getString('type');
    
    try {
        await interaction.deferReply({ ephemeral: true });
        
        // Create a mock member object for testing
        const member = interaction.member;
        
        // Send test message to current channel
        const originalChannel = welcomeManager.getSettings().welcomeChannel;
        const originalGoodbyeChannel = welcomeManager.getSettings().goodbyeChannel;
        
        // Temporarily set current channel for test
        if (type === 'welcome') {
            welcomeManager.setWelcomeChannel(interaction.channel.id);
        } else {
            welcomeManager.setGoodbyeChannel(interaction.channel.id);
        }
        
        // Send test message
        await welcomeManager.sendWelcomeMessage(member, type);
        
        // Restore original channels
        welcomeManager.setWelcomeChannel(originalChannel);
        welcomeManager.setGoodbyeChannel(originalGoodbyeChannel);
        
        await interaction.editReply({
            content: `✅ Test ${type} message berhasil dikirim!`
        });
        
    } catch (error) {
        console.error('Error in welcome test:', error);
        await interaction.editReply({
            content: `❌ Error saat mengirim test ${type} message: ${error.message}`
        });
    }
}

async function handleSetup(interaction) {
    const welcomeChannel = interaction.options.getChannel('welcome-channel');
    const goodbyeChannel = interaction.options.getChannel('goodbye-channel');
    
    if (!welcomeChannel && !goodbyeChannel) {
        await interaction.reply({
            content: '❌ Pilih minimal satu channel untuk di-setup!',
            ephemeral: true
        });
        return;
    }
    
    let message = '✅ **Welcome System Setup:**\n';
    
    if (welcomeChannel) {
        welcomeManager.setWelcomeChannel(welcomeChannel.id);
        message += `🎉 Welcome channel: ${welcomeChannel}\n`;
    }
    
    if (goodbyeChannel) {
        welcomeManager.setGoodbyeChannel(goodbyeChannel.id);
        message += `👋 Goodbye channel: ${goodbyeChannel}\n`;
    }
    
    await interaction.reply({
        content: message,
        ephemeral: true
    });
}

async function handleToggle(interaction) {
    const type = interaction.options.getString('type');
    const enabled = interaction.options.getBoolean('enabled');
    
    if (type === 'welcome') {
        welcomeManager.toggleWelcome(enabled);
    } else {
        welcomeManager.toggleGoodbye(enabled);
    }
    
    await interaction.reply({
        content: `✅ ${type === 'welcome' ? 'Welcome' : 'Goodbye'} message ${enabled ? 'diaktifkan' : 'dinonaktifkan'}!`,
        ephemeral: true
    });
}

async function handleMessage(interaction) {
    const type = interaction.options.getString('type');
    const message = interaction.options.getString('message');
    
    const settings = {};
    if (type === 'welcome') {
        settings.welcomeMessage = message;
    } else {
        settings.goodbyeMessage = message;
    }
    
    welcomeManager.updateSettings(settings);
    
    await interaction.reply({
        content: `✅ ${type === 'welcome' ? 'Welcome' : 'Goodbye'} message berhasil diubah!\n\n**Pesan baru:**\n${message}`,
        ephemeral: true
    });
}

async function handleSettings(interaction) {
    const welcomeColor = interaction.options.getString('welcome-color');
    const goodbyeColor = interaction.options.getString('goodbye-color');
    const showAvatar = interaction.options.getBoolean('show-avatar');
    const showMemberCount = interaction.options.getBoolean('show-member-count');
    const showWelcomeImage = interaction.options.getBoolean('show-welcome-image');
    
    const settings = {};
    
    if (welcomeColor) {
        if (!/^#[0-9A-F]{6}$/i.test(welcomeColor)) {
            await interaction.reply({
                content: '❌ Format warna welcome tidak valid! Gunakan format hex seperti #00ff00',
                ephemeral: true
            });
            return;
        }
        settings.welcomeColor = welcomeColor;
    }
    
    if (goodbyeColor) {
        if (!/^#[0-9A-F]{6}$/i.test(goodbyeColor)) {
            await interaction.reply({
                content: '❌ Format warna goodbye tidak valid! Gunakan format hex seperti #ff0000',
                ephemeral: true
            });
            return;
        }
        settings.goodbyeColor = goodbyeColor;
    }
    
    if (showAvatar !== null) settings.showAvatar = showAvatar;
    if (showMemberCount !== null) settings.showMemberCount = showMemberCount;
    if (showWelcomeImage !== null) settings.showWelcomeImage = showWelcomeImage;
    
    welcomeManager.updateSettings(settings);
    
    let message = '✅ **Pengaturan berhasil diubah:**\n';
    if (welcomeColor) message += `🎨 Welcome color: ${welcomeColor}\n`;
    if (goodbyeColor) message += `🎨 Goodbye color: ${goodbyeColor}\n`;
    if (showAvatar !== null) message += `👤 Show avatar: ${showAvatar ? 'Ya' : 'Tidak'}\n`;
    if (showMemberCount !== null) message += `📊 Show member count: ${showMemberCount ? 'Ya' : 'Tidak'}\n`;
    if (showWelcomeImage !== null) message += `🖼️ Show welcome image: ${showWelcomeImage ? 'Ya' : 'Tidak'}\n`;
    
    await interaction.reply({
        content: message,
        ephemeral: true
    });
}

async function handleStatus(interaction) {
    const settings = welcomeManager.getSettings();
    const guild = interaction.guild;
    
    const welcomeChannel = settings.welcomeChannel ? guild.channels.cache.get(settings.welcomeChannel) : null;
    const goodbyeChannel = settings.goodbyeChannel ? guild.channels.cache.get(settings.goodbyeChannel) : null;
    
    const embed = {
        title: '🎉 Welcome System Status',
        color: 0x0099ff,
        fields: [
            {
                name: '📊 Status',
                value: `Welcome: ${settings.welcomeEnabled ? '✅ Aktif' : '❌ Nonaktif'}\nGoodbye: ${settings.goodbyeEnabled ? '✅ Aktif' : '❌ Nonaktif'}`,
                inline: true
            },
            {
                name: '📍 Channels',
                value: `Welcome: ${welcomeChannel ? welcomeChannel.toString() : '❌ Belum diset'}\nGoodbye: ${goodbyeChannel ? goodbyeChannel.toString() : '❌ Belum diset'}`,
                inline: true
            },
            {
                name: '🎨 Colors',
                value: `Welcome: ${settings.welcomeColor}\nGoodbye: ${settings.goodbyeColor}`,
                inline: true
            },
            {
                name: '⚙️ Display Settings',
                value: `Avatar: ${settings.showAvatar ? '✅' : '❌'}\nMember Count: ${settings.showMemberCount ? '✅' : '❌'}\nWelcome Image: ${settings.showWelcomeImage ? '✅' : '❌'}`,
                inline: true
            },
            {
                name: '💬 Welcome Message',
                value: `\`\`\`${settings.welcomeMessage}\`\`\``,
                inline: false
            },
            {
                name: '💬 Goodbye Message',
                value: `\`\`\`${settings.goodbyeMessage}\`\`\``,
                inline: false
            }
        ],
        footer: {
            text: 'Gunakan /welcome untuk mengatur sistem welcome'
        },
        timestamp: new Date().toISOString()
    };
    
    await interaction.reply({
        embeds: [embed],
        ephemeral: true
    });
}