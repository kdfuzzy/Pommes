const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const warnCommand = require("./warn.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("removewarn")
        .setDescription("Remove a specific warn from a user")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("User")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName("index")
                .setDescription("Warn number (from /checkwarns)")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const user = interaction.options.getUser("user");
        const index = interaction.options.getInteger("index") - 1;
        const warns = warnCommand.warns;

        if (!warns.has(user.id) || warns.get(user.id).length === 0) {
            return interaction.editReply("❌ This user has no warns.");
        }

        const userWarns = warns.get(user.id);

        if (index < 0 || index >= userWarns.length) {
            return interaction.editReply("❌ Invalid warn number.");
        }

        const removed = userWarns.splice(index, 1);

        const embed = new EmbedBuilder()
            .setTitle("🗑️ Warn Removed")
            .setColor("Orange")
            .addFields(
                { name: "User", value: user.tag, inline: true },
                { name: "Removed Warn", value: removed[0].reason },
                { name: "Remaining Warns", value: `${userWarns.length}`, inline: true }
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
