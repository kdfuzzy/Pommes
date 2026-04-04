const { Client, Collection, GatewayIntentBits } = require("discord.js");
require("dotenv").config();
const fs = require("fs");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Command Collection
client.commands = new Collection();

// Load commands
const folders = fs.readdirSync("./src/commands");
for (const folder of folders) {
    const files = fs.readdirSync(`./src/commands/${folder}`).filter(f => f.endsWith(".js"));
    for (const file of files) {
        const command = require(`./src/commands/${folder}/${file}`);
        if (command.data && command.execute) client.commands.set(command.data.name, command);
    }
}

// Event handler
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction, client);
    } catch (err) {
        console.error(err);
        interaction.reply({ content: "❌ Error executing command", ephemeral: true });
    }
});

// Auto-sync slash commands on startup
const { REST, Routes } = require("discord.js");
client.once("ready", async () => {
    console.log(`Logged in as ${client.user.tag}`);

    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

    const commands = [];
    for (const command of client.commands.values()) {
        commands.push(command.data.toJSON());
    }

    try {
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );
        console.log("✅ Slash commands synced automatically!");
    } catch (err) {
        console.error("❌ Failed to sync commands:", err);
    }
});

// Login
client.login(process.env.TOKEN);
