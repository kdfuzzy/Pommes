const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("announce")
        .setDescription("Send an embedded announcement to a channel")
        .addChannelOption(option =>
            option.setName("channel")
                .setDescription("Channel to send the announcement in")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("title")
                .setDescription("Title of the announcement")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("message")
                .setDescription("Announcement message")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("color")
                .setDescription("Embed color (e.g. Red, Blue, Green, #ff0000)")
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const channel = interaction.options.getChannel("channel");
        const title = interaction.options.getString("title");
        const message = interaction.options.getString("message");
        const color = interaction.options.getString("color") || "Blue";

        if (!channel.isTextBased()) {
            return interaction.editReply("❌ That is not a valid text channel.");
        }

        try {
            const embed = new EmbedBuilder()
                .setTitle(title)
                .setDescription(message)
                .setColor(color)
                .setFooter({ text: `Announcement by ${interaction.user.tag}` })
                .setTimestamp();

            await channel.send({ embeds: [embed] });

            await interaction.editReply(`✅ Announcement sent in ${channel}`);

            // Log
            const logChannel = interaction.guild.channels.cache.get("1490123710760353822");
            if (logChannel) {
                logChannel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("📢 Announcement Sent")
                            .setColor("Blue")
                            .addFields(
                                { name: "Channel", value: `${channel}`, inline: true },
                                { name: "Moderator", value: interaction.user.tag, inline: true },
                                { name: "Title", value: title },
                                { name: "Message", value: message }
                            )
                            .setTimestamp()
                    ]
                }).catch(() => {});
            }

        } catch (err) {
            console.error(err);
            await interaction.editReply("❌ Failed to send announcement.");
        }
    }
};
