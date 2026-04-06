const { SlashCommandBuilder } = require('discord.js');
const { resetBalance } = require('../utils/economy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resetmoney')
        .setDescription('Reset a user\'s money')
        .addUserOption(opt =>
            opt.setName('user').setDescription('User').setRequired(true)),

    async execute(interaction) {

        const user = interaction.options.getUser('user');

        resetBalance(user.id);

        interaction.reply(`♻️ Reset ${user.username}'s balance.`);
    }
};
