const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getBalance, addBalance, removeBalance, addWin, addLoss, formatSol } = require('../utils/economy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dice')
        .setDescription('Play dice against the bot')
        .addNumberOption(opt =>
            opt.setName('amount')
                .setDescription('Amount of SOL to bet')
                .setRequired(true)
        ),

    async execute(interaction) {

        const user = interaction.user;
        const amount = interaction.options.getNumber('amount');

        if (amount <= 0) {
            return interaction.reply({ content: '❌ Invalid amount.', ephemeral: true });
        }

        const balance = getBalance(user.id);

        if (balance < amount) {
            return interaction.reply({
                content: `❌ You only have ${formatSol(balance)}`,
                ephemeral: true
            });
        }

        // 🎬 Start animation
        const loadingEmbed = new EmbedBuilder()
            .setTitle('🎲 Rolling Dice...')
            .setDescription(`Bet: ${formatSol(amount)}`)
            .setColor(0xFFFF00);

        await interaction.reply({ embeds: [loadingEmbed] });

        await new Promise(r => setTimeout(r, 2000));

        // 🎲 Rolls
        const userRoll = Math.floor(Math.random() * 6) + 1;
        const botRoll = Math.floor(Math.random() * 6) + 1;

        let resultText = '';
        let color = 0x5865F2;

        if (userRoll > botRoll) {
            addBalance(user.id, amount);
            addWin(user.id);

            resultText = `🏆 You win!\n+${formatSol(amount)}`;
            color = 0x00FF00;

        } else if (botRoll > userRoll) {
            removeBalance(user.id, amount);
            addLoss(user.id);

            resultText = `💀 You lost!\n-${formatSol(amount)}`;
            color = 0xFF0000;

        } else {
            resultText = `🤝 It's a tie! Your bet was returned.`;
        }

        const resultEmbed = new EmbedBuilder()
            .setTitle('🎲 Dice Result')
            .addFields(
                { name: 'You Rolled', value: `🎲 ${userRoll}`, inline: true },
                { name: 'Bot Rolled', value: `🎲 ${botRoll}`, inline: true }
            )
            .setDescription(resultText)
            .setColor(color);

        await interaction.editReply({ embeds: [resultEmbed] });
    }
};
