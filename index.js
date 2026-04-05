onst { Client, GatewayIntentBits, Collection, REST, Routes } = require("discord.js");
const fs = require("fs");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

// Load commands
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

// 🔥 AUTO REGISTER SLASH COMMANDS
const commands = [];
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

client.once("ready", async () => {
    console.log(`✅ Logged in as ${client.user.tag}`);

    try {
        console.log("🔄 Registering slash commands...");

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            { body: commands }
        );

        console.log("✅ Slash commands registered!");
    } catch (error) {
        console.error(error);
    }
});

// Command handler
client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.deferred || interaction.replied) {
            interaction.editReply({ content: "❌ Error executing command." });
        } else {
            interaction.reply({ content: "❌ Error executing command.", ephemeral: true });
        }
    }
});

client.login(process.env.TOKEN);
