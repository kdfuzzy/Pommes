const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { createChallenge, wallets } = require("../utils/walletStore");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("addwallet")
        .setDescription("Link your Solana wallet")
        .addStringOption(option =>
            option.setName("address")
                .setDescription("Your Solana wallet address")
                .setRequired(true)
        ),

    async execute(interaction) {
        const address = interaction.options.getString("address");

        // Generate challenge
        const challenge = createChallenge(interaction.user.id, address);

        const embed = new EmbedBuilder()
            .setTitle("🔗 Wallet Linking")
            .setDescription(
                `Your wallet **${address}** has been linked.\n` +
                `To verify ownership, sign this message in Phantom:\n\n\`${challenge}\``
            )
            .setColor("Yellow")
            .setFooter({ text: "Use /verifywallet with the signed message" })
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
