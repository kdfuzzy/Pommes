const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Unban a user")
        .addStringOption(option =>
            option.setName("userid")
                .setDescription("User ID to unban")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        await interaction.deferReply();

        const userId = interaction.options.getString("userid");

        try {
            const bannedUsers = await interaction.guild.bans.fetch();
            const bannedUser = bannedUsers.get(userId);

            if (!bannedUser) {
                return interaction.editReply("❌ This user is not banned.");
            }

            await interaction.guild.members.unban(userId);

            const embed = new EmbedBuilder()
                .setTitle("🔓 User Unbanned")
                .setColor("Green")
                .addFields(
                    { name: "User", value: `${bannedUser.user.tag}`, inline: true },
                    { name: "Moderator", value: `${interaction.user.tag}`, inline: true }
                )
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

            // Logs
            const logChannel = interaction.guild.channels.cache.get(process.env.LOG_CHANNEL_ID);
            if (logChannel) {
                logChannel.send({ embeds: [embed] }).catch(() => {});
            }

        } catch (err) {
            console.error(err);
            await interaction.editReply("❌ Failed to unban user.");
        }
    }
};
