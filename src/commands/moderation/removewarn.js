const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("removewarn")
        .setDescription("Remove a warn")
        .addUserOption(opt => opt.setName("user").setRequired(true))
        .addIntegerOption(opt =>
            opt.setName("index").setDescription("Warn number").setRequired(true)
        ),

    async execute(interaction) {
        const user = interaction.options.getUser("user");
        const index = interaction.options.getInteger("index") - 1;

        if (!global.warns[user.id]) return interaction.reply("No warns");

        global.warns[user.id].splice(index, 1);

        interaction.reply("Warn removed");
    }
};
