const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { verifySignature, markVerified, wallets } = require("../utils/walletStore");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("verifywallet")
        .setDescription("Verify your linked Solana wallet")
        .addStringOption(option =>
            option.setName("signature")
                .setDescription("Signature of the challenge message")
                .setRequired(true)
        ),

    async execute(interaction) {
        const signature = interaction.options.getString("signature");
        const userData = wallets.get(interaction.user.id);

        if (!userData) {
            return interaction.reply({ content: "❌ No wallet linked. Use /addwallet first.", ephemeral: true });
        }

        const valid = verifySignature(interaction.user.id, signature);
        if (!valid) {
            return interaction.reply({ content: "❌ Invalid signature. Try again.", ephemeral: true });
        }

        markVerified(interaction.user.id);

        const embed = new EmbedBuilder()
            .setTitle("✅ Wallet Verified")
            .setDescription(`Your wallet **${userData.address}** has been successfully verified!`)
            .setColor("Green")
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
