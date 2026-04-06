const { SlashCommandBuilder } = require('discord.js');
const { addBalance, formatSol } = require('../utils/economy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addmoney')
        .setDescription('Add SOL to a user')
        .addUserOption(opt =>
            opt.setName('user').setDescription('User').setRequired(true))
        .addNumberOption(opt =>
            opt.setName('amount').setDescription('Amount in SOL').setRequired(true)),

    async execute(interaction) {

        const user = interaction.options.getUser('user');
        const amount = interaction.options.getNumber('amount');

        if (amount <= 0) return interaction.reply('❌ Invalid amount.');

        addBalance(user.id, amount);

        interaction.reply(`➕ Added ${formatSol(amount)} to ${user.username}`);
    }
};
