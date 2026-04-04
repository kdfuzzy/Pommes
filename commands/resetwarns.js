const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const warnCommand = require("./warn.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resetwarns")
        .setDescription("Clear all warns from a user")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("User")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        await interaction.deferReply();

        const user = interaction.options.getUser("user");
        const warns = warnCommand.warns;

        if (!warns.has(user.id) || warns.get(user.id).length === 0) {
            return interaction.editReply("❌ This user has no warns.");
        }

        warns.delete(user.id);

        const embed = new EmbedBuilder()
            .setTitle("♻️ Warns Reset")
            .setColor("Red")
            .addFields(
                { name: "User", value: user.tag, inline: true },
                { name: "Moderator", value: interaction.user.tag, inline: true }
            )
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });

        // Log
        const logChannel = interaction.guild.channels.cache.get("1490123710760353822");
        if (logChannel) {
            logChannel.send({ embeds: [embed] }).catch(() => {});
        }
    }
};
