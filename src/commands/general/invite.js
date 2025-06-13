const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('link discord vidlyzer'),
    async execute(interaction) {
        await interaction.reply(`https://discord.gg/8d5ZFMybs4`);
    },
};
