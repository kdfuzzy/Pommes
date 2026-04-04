const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const warnCommand = require("./warn.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("checkwarns")
        .setDescription("Check a user's warnings")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("User to check")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const user = interaction.options.getUser("user");
        const warns = warnCommand.warns;

        if (!warns.has(user.id) || warns.get(user.id).length === 0) {
            return interaction.editReply(`✅ ${user.tag} has no warnings.`);
        }

        const userWarns = warns.get(user.id);

        const warnList = userWarns
            .map((w, i) => `**${i + 1}.** ${w.reason} (by ${w.moderator})`)
            .join("\n");

        const embed = new EmbedBuilder()
            .setTitle(`⚠️ Warnings for ${user.tag}`)
            .setColor("Orange")
            .setDescription(warnList)
            .setFooter({ text: `Total warns: ${userWarns.length}` })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    }
};
