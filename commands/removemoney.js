const { SlashCommandBuilder } = require('discord.js');
const { removeBalance, formatSol } = require('../utils/economy');

const OWNER_ID = '794606718972723230';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removemoney')
        .setDescription('Remove money from a user')
        .addUserOption(opt =>
            opt.setName('user')
                .setDescription('User')
                .setRequired(true))
        .addNumberOption(opt =>
            opt.setName('amount')
                .setDescription('Amount')
                .setRequired(true)),

    async execute(interaction) {

        if (interaction.user.id !== OWNER_ID) {
            return interaction.reply({ content: '❌ You cannot use this.', ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const amount = interaction.options.getNumber('amount');

        removeBalance(user.id, amount);

        interaction.reply(`💸 Removed ${formatSol(amount)} from ${user.username}`);
    }
};
