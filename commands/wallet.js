const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const walletSystem = require("./addwallet.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("wallet")
        .setDescription("View your linked wallet"),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const wallet = walletSystem.wallets.get(interaction.user.id);

        if (!wallet) {
            return interaction.editReply("❌ You haven't linked a wallet yet.");
        }

        const embed = new EmbedBuilder()
            .setTitle("💼 Your Wallet")
            .setColor("Blue")
            .addFields(
                { name: "Address", value: `\`${wallet}\`` }
            )
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    }
};
