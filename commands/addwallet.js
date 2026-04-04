const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { addWallet } = require("../utils/walletStore");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("addwallet")
        .setDescription("Add your verified Solana wallet")
        .addStringOption(option =>
            option.setName("address")
                .setDescription("Your Solana wallet address")
                .setRequired(true)
        ),

    async execute(interaction) {
        const address = interaction.options.getString("address");

        addWallet(interaction.user.id, address);

        const embed = new EmbedBuilder()
            .setTitle("✅ Wallet Added")
            .setDescription(`Wallet \`${address}\` has been successfully added and verified.`)
            .setColor("Green")
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: false });
    }
};
