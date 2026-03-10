const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require("discord.js")

const LOG_CHANNEL = "1480954471868530769"
const HIGH_RANK = "1480954571844092155"
const LOW_RANK = "1480954537484222607"

module.exports = {

data: new SlashCommandBuilder()
.setName("send")
.setDescription("Send a message as the bot")
.addChannelOption(option =>
    option
        .setName("channel")
        .setDescription("Channel to send the message")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
)
.addStringOption(option =>
    option
        .setName("message")
        .setDescription("Message to send")
        .setRequired(true)
)
.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

async execute(interaction, client) {

const member = interaction.member

if (
!member.roles.cache.has(HIGH_RANK) &&
!member.roles.cache.has(LOW_RANK)
){
return interaction.reply({
content: "You do not have permission to use this command.",
ephemeral: true
})
}

const channel = interaction.options.getChannel("channel")
const message = interaction.options.getString("message")

await channel.send(message)

await interaction.reply({
content: "✅ Message sent successfully.",
ephemeral: true
})

const logChannel = await client.channels.fetch(LOG_CHANNEL)

logChannel.send(
`📨 **/send command used**

User: ${interaction.user.tag}
Channel: ${channel}

Message:
${message}`
)

}

}
