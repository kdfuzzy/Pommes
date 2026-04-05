const { 
    SlashCommandBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle,
    EmbedBuilder 
} = require('discord.js');

const { getBalance } = require('../utils/economy');

const cooldowns = new Map();
const COOLDOWN_TIME = 10 * 1000; // 10 seconds

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
        const now = Date.now();
        const userId = interaction.user.id;

        // ⏱️ COOLDOWN
        if (cooldowns.has(userId)) {
            const expire = cooldowns.get(userId) + COOLDOWN_TIME;

            if (now < expire) {
                const remaining = ((expire - now) / 1000).toFixed(1);
                return interaction.reply({
                    content: `⏳ Wait ${remaining}s before using this again.`,
                    ephemeral: true
                });
            }
        }

        cooldowns.set(userId, now);

        const opponent = interaction.options.getUser('opponent');
        const amount = interaction.options.getInteger('amount');
        const side = interaction.options.getString('side');

        if (opponent.bot || opponent.id === interaction.user.id) {
            return interaction.reply({ content: '❌ Invalid opponent.', ephemeral: true });
        }

        if (amount <= 0) {
            return interaction.reply({ content: '❌ Invalid amount.', ephemeral: true });
        }

        const userBal = getBalance(interaction.user.id);
        const oppBal = getBalance(opponent.id);

        if (userBal < amount || oppBal < amount) {
            return interaction.reply({ content: '❌ One of you doesn’t have enough money.', ephemeral: true });
        }

        // 🎮 EMBED
        const embed = new EmbedBuilder()
            .setTitle('🪙 Coinflip Challenge')
            .setDescription(
                `**${interaction.user.username}** vs **${opponent.username}**\n\n` +
                `💰 Bet: **${amount}**\n` +
                `🎯 Choice: **${side.toUpperCase()}**`
            )
            .setColor('Gold');

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`accept_${interaction.user.id}_${opponent.id}_${amount}_${side}`)
                .setLabel('Accept')
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId(`decline_${interaction.user.id}_${opponent.id}`)
                .setLabel('Decline')
                .setStyle(ButtonStyle.Danger)
        );

        await interaction.reply({
            embeds: [embed],
            components: [row]
        });
    }
};
