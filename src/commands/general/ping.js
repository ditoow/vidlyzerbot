const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Cek latency bot'),
    async execute(interaction) {
        await interaction.reply(`Pong! Latency: ${Date.now() - interaction.createdTimestamp}ms`);
    },
};
