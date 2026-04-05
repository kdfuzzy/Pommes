const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getStats, getBalance } = require('../utils/economy');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('View your gambling stats')
        .addUserOption(opt =>
            opt.setName('user').setDescription('User').setRequired(false)),

    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;

        const stats = getStats(user.id);
        const balance = getBalance(user.id);

        const totalGames = stats.wins + stats.losses;
        const winRate = totalGames > 0
            ? ((stats.wins / totalGames) * 100).toFixed(1)
            : 0;

        const embed = new EmbedBuilder()
            .setTitle(`📊 ${user.username}'s Stats`)
            .addFields(
                { name: '💰 Balance', value: `${balance}`, inline: true },
                { name: '🏆 Wins', value: `${stats.wins}`, inline: true },
                { name: '❌ Losses', value: `${stats.losses}`, inline: true },
                { name: '📈 Win Rate', value: `${winRate}%`, inline: true }
            )
            .setColor('Blue');

        interaction.reply({ embeds: [embed] });
    }
};
