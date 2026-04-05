const { 
    Client, 
    GatewayIntentBits, 
    REST, 
    Routes 
} = require('discord.js');

const fs = require('fs');
const path = require('path');

// ===== CONFIG =====
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

// ===== CLIENT =====
const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.commands = new Map();

// ===== LOAD COMMANDS =====
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    // ✅ THIS IS THE IMPORTANT FIX
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON()); // 🔥 REQUIRED for SlashCommandBuilder
    } else {
        console.log(`❌ Invalid command file: ${file}`);
    }
}

// ===== REGISTER COMMANDS =====
const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log('🔄 Registering slash commands...');

        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands }
        );

        console.log('✅ Slash commands registered');
    } catch (error) {
        console.error(error);
    }
})();

// ===== READY =====
client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

// ===== HANDLE COMMANDS =====
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        return interaction.reply({ content: '❌ Command not found', ephemeral: true });
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: '❌ Error executing command', ephemeral: true });
        } else {
            await interaction.reply({ content: '❌ Error executing command', ephemeral: true });
        }
    }
});

// ===== LOGIN =====
client.login(TOKEN);
