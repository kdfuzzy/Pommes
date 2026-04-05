const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getWallet } = require("../utils/walletStore");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("wallet")
        .setDescription("View a user's linked wallet")
        .addUserOption(option =>
            option.setName("user")
                  .setDescription("The user to check")
                  .setRequired(false)
        ),

    async execute(interaction) {
        const target = interaction.options.getUser("user") || interaction.user;
        const wallet = getWallet(target.id);

        if (!wallet) {
            return interaction.reply({ content: `❌ ${target.username} has no linked wallet.`, ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle(`💰 Wallet of ${target.username}`)
            .setDescription(`\`${wallet.address}\`\nVerified: ${wallet.verified ? "✅" : "❌"}`)
            .setColor("Blue")
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
