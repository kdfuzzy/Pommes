const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addwallet')
        .setDescription('Link your Solana wallet')
        .addStringOption(option =>
            option.setName('address')
                  .setDescription('Enter your wallet address')
                  .setRequired(true)),
    
    async execute(interaction, client) {
        const address = interaction.options.getString('address');

        // Basic validation
        if (!/^([1-9A-HJ-NP-Za-km-z]{32,44})$/.test(address)) {
            return interaction.reply({ content: '❌ Invalid wallet address.', ephemeral: true });
        }

        // Save wallet in memory
        client.wallets[interaction.user.id] = address;

        const embed = new EmbedBuilder()
            .setTitle('Wallet Linked')
            .setDescription(`✅ Your wallet has been linked!\n\nWallet: \`${address}\``)
            .setColor('Green')
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
