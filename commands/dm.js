const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("dm")
        .setDescription("Send a direct message to a user")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("User to DM")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("message")
                .setDescription("Message to send")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const user = interaction.options.getUser("user");
        const message = interaction.options.getString("message");

        try {
            const embed = new EmbedBuilder()
                .setTitle(`📩 Message from ${interaction.guild.name}`)
                .setColor("Blue")
                .setDescription(message)
                .addFields(
                    { name: "Sent by", value: interaction.user.tag }
                )
                .setTimestamp();

            await user.send({ embeds: [embed] });

            await interaction.editReply(`✅ Successfully sent DM to **${user.tag}**`);

            // Log
            const logChannel = interaction.guild.channels.cache.get("1490123710760353822");
            if (logChannel) {
                logChannel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("📨 DM Sent")
                            .setColor("Blue")
                            .addFields(
                                { name: "To", value: user.tag, inline: true },
                                { name: "From", value: interaction.user.tag, inline: true },
                                { name: "Message", value: message }
                            )
                            .setTimestamp()
                    ]
                }).catch(() => {});
            }

        } catch (err) {
            console.error(err);
            await interaction.editReply("❌ Couldn't send DM (user may have DMs disabled).");
        }
    }
};
