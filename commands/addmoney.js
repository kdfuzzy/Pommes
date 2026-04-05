const { SlashCommandBuilder } = require('discord.js');
const { addBalance } = require('../utils/economy');

const ALLOWED_ROLE = '1480954571844092155';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addmoney')
        .setDescription('Add money to a user')
        .addUserOption(opt =>
            opt.setName('user').setDescription('User').setRequired(true))
        .addIntegerOption(opt =>
            opt.setName('amount').setDescription('Amount').setRequired(true)),

    async execute(interaction) {
        const member = interaction.member;

        if (!member.roles.cache.has(ALLOWED_ROLE)) {
            return interaction.reply({
                content: '❌ You don’t have permission.',
                ephemeral: true
            });
        }

        const user = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');

        if (amount <= 0) {
            return interaction.reply({ content: '❌ Invalid amount.', ephemeral: true });
        }

        addBalance(user.id, amount);

        await interaction.reply(`💰 Added **${amount}** to ${user.username}`);
    }
};
