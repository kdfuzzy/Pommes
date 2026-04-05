const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const crypto = require("crypto");
const { addChallenge } = require("../utils/walletStore");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("addwallet")
        .setDescription("Start linking your Phantom wallet")
        .addStringOption(option =>
            option.setName("address")
                  .setDescription("Your Solana wallet address")
                  .setRequired(true)
        ),

    async execute(interaction) {
        const walletAddress = interaction.options.getString("address");

        // basic check for Solana address length
        if (!/^([1-9A-HJ-NP-Za-km-z]{32,44})$/.test(walletAddress)) {
            return interaction.reply({ content: "❌ Invalid Solana wallet address.", ephemeral: true });
        }

        // Generate random challenge
        const challenge = crypto.randomBytes(16).toString("hex");
        addChallenge(interaction.user.id, challenge, walletAddress);

        const embed = new EmbedBuilder()
            .setTitle("📝 Verify Your Wallet")
            .setDescription(
                `To verify your wallet, sign the following message in Phantom and then use /verifywallet:\n\n` +
                `\`${challenge}\``
            )
            .setColor("Yellow")
            .setFooter({ text: "This proves you own the wallet address." })
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
