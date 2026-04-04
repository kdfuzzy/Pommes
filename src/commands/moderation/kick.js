const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const config = require("../../config/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kick a user")
        .addUserOption(opt => opt.setName("user").setRequired(true))
        .addStringOption(opt => opt.setName("reason"))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction) {
        const user = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason") || "No reason";

        const member = await interaction.guild.members.fetch(user.id).catch(() => null);
        if (!member) return interaction.reply({ content: "User not found", ephemeral: true });

        await member.kick(reason);

        const embed = new EmbedBuilder()
            .setTitle("👢 User Kicked")
            .addFields(
                { name: "User", value: user.tag },
                { name: "Moderator", value: interaction.user.tag },
                { name: "Reason", value: reason }
            )
            .setColor("Orange")
            .setTimestamp();

        interaction.reply({ embeds: [embed] });

        const logChannel = interaction.guild.channels.cache.get(config.logsChannel);
        if (logChannel) logChannel.send({ embeds: [embed] });
    }
};
