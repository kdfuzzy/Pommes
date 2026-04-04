const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("timeout")
        .setDescription("Timeout (mute) a user")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("User to timeout")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName("duration")
                .setDescription("Duration in minutes")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("reason")
                .setDescription("Reason for timeout")
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        await interaction.deferReply();

        const user = interaction.options.getUser("user");
        const duration = interaction.options.getInteger("duration");
        const reason = interaction.options.getString("reason") || "No reason provided";

        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            return interaction.editReply("❌ User not found.");
        }

        if (user.id === interaction.user.id) {
            return interaction.editReply("❌ You can't timeout yourself.");
        }

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            return interaction.editReply("❌ I don't have permission to timeout users.");
        }

        try {
            const ms = duration * 60 * 1000;

            await member.timeout(ms, reason);

            const embed = new EmbedBuilder()
                .setTitle("⏳ User Timed Out")
                .setColor("Orange")
                .addFields(
                    { name: "User", value: user.tag, inline: true },
                    { name: "Moderator", value: interaction.user.tag, inline: true },
                    { name: "Duration", value: `${duration} minute(s)`, inline: true },
                    { name: "Reason", value: reason }
                )
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

            // Log
            const logChannel = interaction.guild.channels.cache.get("1490123710760353822");
            if (logChannel) {
                logChannel.send({ embeds: [embed] }).catch(() => {});
            }

        } catch (err) {
            console.error(err);
            await interaction.editReply("❌ Failed to timeout user.");
        }
    }
};
