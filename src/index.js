import dotenv from 'dotenv';
import { Client, GatewayIntentBits, Routes } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';

import { handleScrapbook } from './scrapbook.js';

import PingCommand from './commands/ping.js';
import ScrappyCommand from './commands/scrappy.js';
import ModalCommand from './commands/modal.js';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

const commands = [
  PingCommand,
  // ScrappyCommand,
  // ModalCommand,
];


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
  await handleScrapbook(client, message);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  let cmd = commands.find(c => c.config.name === commandName);
  if (cmd) cmd.run(client, interaction);
});


async function main() {
  const commandsConfig = commands.map((command) => command.config);

  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), {
      body: commandsConfig,
    });
    console.log('Successfully reloaded application (/) commands.');

    client.login(process.env.TOKEN);
  } catch (err) {
    console.error(err);
  }
}
main();