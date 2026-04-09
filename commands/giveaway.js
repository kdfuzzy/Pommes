const { SlashCommandBuilder } = require('discord.js');

const GIVEAWAY_ROLES = [
    '1489800888695521323',
    '1480954571844092155'
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('Create a giveaway')
        .addStringOption(opt =>
            opt.setName('name').setDescription('Giveaway name').setRequired(true))
        .addNumberOption(opt =>
            opt.setName('duration').setDescription('Duration (seconds)').setRequired(true))
        .addNumberOption(opt =>
            opt.setName('winners').setDescription('Winners count').setRequired(true))
        .addStringOption(opt =>
            opt.setName('prize').setDescription('Prize').setRequired(true)),

    async execute(interaction) {

        if (!interaction.member.roles.cache.some(r => GIVEAWAY_ROLES.includes(r.id))) {
            return interaction.reply({ content: '❌ No permission.', ephemeral: true });
        }

        // your existing giveaway code continues...
    }
};
