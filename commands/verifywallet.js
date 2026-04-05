const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getChallenge, verifyWallet } = require("../utils/walletStore");
const solanaWeb3 = require("@solana/web3.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("verifywallet")
        .setDescription("Verify your wallet by providing a signed message")
        .addStringOption(option =>
            option.setName("signature")
                  .setDescription("Signature from Phantom")
                  .setRequired(true)
        ),

    async execute(interaction) {
        const userId = interaction.user.id;
        const signature = interaction.options.getString("signature");

        const challengeData = getChallenge(userId);
        if (!challengeData) return interaction.reply({ content: "❌ No pending verification. Use /addwallet first.", ephemeral: true });

        const publicKey = new solanaWeb3.PublicKey(challengeData.address);
        const messageBytes = new TextEncoder().encode(challengeData.challenge);

        try {
            const sigBytes = Buffer.from(signature, "base64");
            const verified = solanaWeb3.Ed25519Program.verify(
                messageBytes,
                sigBytes,
                publicKey.toBuffer()
            );

            if (!verified) throw new Error("Invalid signature");

            const wallet = verifyWallet(userId);

            const embed = new EmbedBuilder()
                .setTitle("✅ Wallet Verified")
                .setDescription(`Your wallet has been successfully linked and verified:\n\`${wallet.address}\``)
                .setColor("Green")
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (err) {
            console.error(err);
            return interaction.reply({ content: "❌ Signature verification failed. Make sure you signed the correct message.", ephemeral: true });
        }
    }
};
