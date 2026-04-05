const { 
    SlashCommandBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle 
} = require('discord.js');

const { getBalance } = require('../utils/economy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Challenge someone to a coinflip')
        .addUserOption(opt =>
            opt.setName('opponent').setDescription('Opponent').setRequired(true))
        .addIntegerOption(opt =>
            opt.setName('amount').setDescription('Bet amount').setRequired(true))
        .addStringOption(opt =>
            opt.setName('side')
                .setDescription('Pick heads or tails')
                .setRequired(true)
                .addChoices(
                    { name: 'Heads', value: 'heads' },
                    { name: 'Tails', value: 'tails' }
                )),

    async execute(interaction) {
        const opponent = interaction.options.getUser('opponent');
        const amount = interaction.options.getInteger('amount');
        const side = interaction.options.getString('side');
        const user = interaction.user;

        if (opponent.bot) {
            return interaction.reply({ content: '❌ You cannot challenge bots.', ephemeral: true });
        }

        if (opponent.id === user.id) {
            return interaction.reply({ content: '❌ You cannot challenge yourself.', ephemeral: true });
        }

        if (amount <= 0) {
            return interaction.reply({ content: '❌ Invalid amount.', ephemeral: true });
        }

        const userBal = getBalance(user.id);
        const oppBal = getBalance(opponent.id);

        if (userBal < amount) {
            return interaction.reply({ content: '❌ You don’t have enough money.', ephemeral: true });
        }

        if (oppBal < amount) {
            return interaction.reply({ content: '❌ Opponent doesn’t have enough money.', ephemeral: true });
        }

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`accept_${user.id}_${opponent.id}_${amount}_${side}`)
                .setLabel('Accept')
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId(`decline_${user.id}_${opponent.id}`)
                .setLabel('Decline')
                .setStyle(ButtonStyle.Danger)
        );

        await interaction.reply({
            content: `🪙 ${opponent}, ${user} challenged you for **${amount}**!\n🎯 They chose **${side.toUpperCase()}**`,
            components: [row]
        });
    }
};
