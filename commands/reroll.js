const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reroll')
        .setDescription('Reroll a giveaway')
        .addStringOption(opt =>
            opt.setName('messageid').setDescription('Giveaway message ID').setRequired(true)),

    async execute(interaction) {

        const messageId = interaction.options.getString('messageid');

        const msg = await interaction.channel.messages.fetch(messageId).catch(() => null);
        if (!msg) return interaction.reply('❌ Message not found.');

        const reaction = msg.reactions.cache.get('🎉');
        if (!reaction) return interaction.reply('❌ No reactions.');

        const users = await reaction.users.fetch();
        const filtered = users.filter(u => !u.bot);

        if (filtered.size === 0) {
            return interaction.reply('❌ No valid users.');
        }

        const winner = filtered.random();

        interaction.reply(`🔄 New winner: <@${winner.id}>`);
    }
};
