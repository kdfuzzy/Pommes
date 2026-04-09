const { SlashCommandBuilder } = require('discord.js');

const GIVEAWAY_ROLES = [
    '1489800888695521323',
    '1480954571844092155'
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reroll')
        .setDescription('Reroll giveaway')
        .addStringOption(opt =>
            opt.setName('messageid')
                .setDescription('Giveaway message ID')
                .setRequired(true)),

    async execute(interaction) {

        if (!interaction.member.roles.cache.some(r => GIVEAWAY_ROLES.includes(r.id))) {
            return interaction.reply({ content: '❌ No permission.', ephemeral: true });
        }

        // your existing reroll logic...
    }
};
