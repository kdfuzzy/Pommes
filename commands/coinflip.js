const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getBalance, formatSol } = require('../utils/economy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Challenge someone to coinflip')
        .addUserOption(opt =>
            opt.setName('user')
                .setDescription('Opponent') // ✅ FIXED
                .setRequired(true)
        )
        .addNumberOption(opt =>
            opt.setName('amount')
                .setDescription('Bet amount') // ✅ FIXED
                .setRequired(true)
        )
        .addStringOption(opt =>
            opt.setName('side')
                .setDescription('Choose heads or tails') // ✅ FIXED
                .setRequired(true)
                .addChoices(
                    { name: 'Heads', value: 'heads' },
                    { name: 'Tails', value: 'tails' }
                )
        ),

    async execute(interaction) {

        const challenger = interaction.user;
        const opponent = interaction.options.getUser('user');
        const amount = interaction.options.getNumber('amount');
        const side = interaction.options.getString('side');

        if (opponent.bot || opponent.id === challenger.id) {
            return interaction.reply({ content: '❌ Invalid opponent.', ephemeral: true });
        }

        if (amount <= 0) {
            return interaction.reply({ content: '❌ Invalid amount.', ephemeral: true });
        }

        if (getBalance(challenger.id) < amount || getBalance(opponent.id) < amount) {
            return interaction.reply({ content: '❌ Not enough balance.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle('🪙 Coinflip')
            .setDescription(
                `${challenger.username} (${side}) vs ${opponent.username}\n\nBet: ${formatSol(amount)}`
            )
            .setColor(0x5865F2);

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`coinflip_${challenger.id}_${opponent.id}_${amount}_${side}`)
                .setLabel('Accept')
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId(`decline_${challenger.id}_${opponent.id}`)
                .setLabel('Decline')
                .setStyle(ButtonStyle.Danger)
        );

        await interaction.reply({
            content: `${opponent}`,
            embeds: [embed],
            components: [row]
        });
    }
};
