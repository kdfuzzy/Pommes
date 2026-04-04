const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const config = require("../../config/config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban a user")
        .addUserOption(opt => opt.setName("user").setDescription("User").setRequired(true))
        .addStringOption(opt => opt.setName("reason").setDescription("Reason"))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        const user = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason") || "No reason provided";

        const member = await interaction.guild.members.fetch(user.id).catch(() => null);
        if (!member) return interaction.reply({ content: "User not found", ephemeral: true });

        await member.ban({ reason });

        const embed = new EmbedBuilder()
            .setTitle("🔨 User Banned")
            .addFields(
                { name: "User", value: `${user.tag} (${user.id})` },
                { name: "Moderator", value: interaction.user.tag },
                { name: "Reason", value: reason }
            )
            .setColor("Red")
            .setTimestamp();

        interaction.reply({ embeds: [embed] });

        const logChannel = interaction.guild.channels.cache.get(config.logsChannel);
        if (logChannel) logChannel.send({ embeds: [embed] });
    }
};
