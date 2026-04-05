const { SlashCommandBuilder } = require('discord.js');
const { getBalance } = require('../utils/economy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Check balance')
        .addUserOption(opt =>
            opt.setName('user').setDescription('User')),

    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;

        const balance = getBalance(user.id);

        await interaction.reply(`💰 **${user.username}'s Balance:** ${balance}`);
    }
};
