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

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
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

// ===== INTERACTIONS =====
client.on('interactionCreate', async interaction => {

    // =====================
    // SLASH COMMANDS
    // =====================
    if (interaction.isChatInputCommand()) {
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
    }

    // =====================
    // BUTTON HANDLER (COINFLIP)
    // =====================
    if (interaction.isButton()) {

        const parts = interaction.customId.split('_');
        const action = parts[0];

        if (action !== 'accept' && action !== 'decline') return;

        const userId = parts[1];
        const opponentId = parts[2];
        const amount = parts[3];
        const chosenSide = parts[4]; // heads/tails

        // Only opponent can click
        if (interaction.user.id !== opponentId) {
            return interaction.reply({
                content: '❌ This is not your challenge.',
                ephemeral: true
            });
        }

        // Decline
        if (action === 'decline') {
            return interaction.update({
                content: '❌ Coinflip declined.',
                components: []
            });
        }

        // Accept
        if (action === 'accept') {
            const bet = parseInt(amount);

            const { getBalance, removeBalance, addBalance } = require('./utils/economy');

            const userBal = getBalance(userId);
            const oppBal = getBalance(opponentId);

            if (userBal < bet || oppBal < bet) {
                return interaction.update({
                    content: '❌ One of you no longer has enough money.',
                    components: []
                });
            }

            // 🎲 Flip coin
            const result = Math.random() < 0.5 ? 'heads' : 'tails';

            const opponentSide = chosenSide === 'heads' ? 'tails' : 'heads';

            let winnerId;

            if (result === chosenSide) {
                winnerId = userId;
            } else {
                winnerId = opponentId;
            }

            const loserId = winnerId === userId ? opponentId : userId;

            removeBalance(loserId, bet);
            addBalance(winnerId, bet);

            const winner = await client.users.fetch(winnerId);

            return interaction.update({
                content:
`🪙 **Coinflip Result**
🎯 Result: **${result.toUpperCase()}**

👤 Challenger: ${chosenSide.toUpperCase()}
👤 Opponent: ${opponentSide.toUpperCase()}

🏆 Winner: ${winner}
💰 Won: ${bet}`,
                components: []
            });
        }
    }
});

// ===== LOGIN =====
client.login(TOKEN);
