const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getBalance, addBalance, removeBalance, addWin, addLoss, formatSol } = require('../utils/economy');
const { isLucky } = require('../utils/fuzzy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dice')
        .setDescription('Play animated dice')
        .addNumberOption(opt =>
            opt.setName('amount')
                .setDescription('Bet amount')
                .setRequired(true)
        ),

    async execute(interaction) {

        const user = interaction.user;
        const amount = interaction.options.getNumber('amount');

        if (!amount || amount <= 0) {
            return interaction.reply({ content: '❌ Invalid amount.', ephemeral: true });
        }

        const balance = getBalance(user.id);

        if (balance < amount) {
            return interaction.reply({
                content: `❌ You only have ${formatSol(balance)}`,
                ephemeral: true
            });
        }

        // ⚡ prevent timeout
        await interaction.deferReply();

        const diceFaces = ['🎲', '🎲', '🎲', '🎲', '🎲', '🎲'];

        const embed = new EmbedBuilder()
            .setTitle('🎲 Rolling Dice...')
            .setColor(0xFFFF00);

        // 🎬 SPIN ANIMATION
        for (let i = 0; i < 6; i++) {

            const fakeUser = Math.floor(Math.random() * 6) + 1;
            const fakeBot = Math.floor(Math.random() * 6) + 1;

            embed.setDescription(
                `Bet: ${formatSol(amount)}\n\n` +
                `You: 🎲 ${fakeUser}\n` +
                `Bot: 🎲 ${fakeBot}\n\n` +
                `⏳ Rolling...`
            );

            await interaction.editReply({ embeds: [embed] });

            await new Promise(r => setTimeout(r, 250));
        }

        // 🎯 FINAL ROLL
        let userRoll = Math.floor(Math.random() * 6) + 1;
        let botRoll = Math.floor(Math.random() * 6) + 1;

        // 🧠 FUZZY WIN
        if (isLucky(user.id)) {
            userRoll = 6;
            botRoll = 1;
        }

        let resultText;
        let color;

        if (userRoll > botRoll) {

            addBalance(user.id, amount);
            addWin(user.id);

            resultText = `🏆 **YOU WIN!**\n+${formatSol(amount)}`;
            color = 0x00FF00;

        } else if (botRoll > userRoll) {

            removeBalance(user.id, amount);
            addLoss(user.id);

            resultText = `💀 **YOU LOST!**\n-${formatSol(amount)}`;
            color = 0xFF0000;

        } else {

            resultText = `🤝 **TIE!**`;
            color = 0x5865F2;
        }

        const resultEmbed = new EmbedBuilder()
            .setTitle('🎲 Dice Result')
            .setDescription(
                `Bet: ${formatSol(amount)}\n\n` +
                `You: 🎲 **${userRoll}**\n` +
                `Bot: 🎲 **${botRoll}**\n\n` +
                resultText
            )
            .setColor(color);

        await interaction.editReply({ embeds: [resultEmbed] });
    }
};
