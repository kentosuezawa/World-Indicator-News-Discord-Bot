console.log('World Indicator News Bot is starting...');

import * as dotenv from 'dotenv';
dotenv.config();

import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});


import * as pulseCommand from './commands/pulse';
import * as pingCommand from './commands/ping';
import * as helpCommand from './commands/help';
import * as countryCommand from './commands/country';
import * as newsCommand from './commands/news';
import * as topCommand from './commands/top';
import * as compareCommand from './commands/compare';
import * as historyCommand from './commands/history';
import * as subscribeCommand from './commands/subscribe';
import * as unsubscribeCommand from './commands/unsubscribe';
import * as subscriptionsCommand from './commands/subscriptions';
import * as setCommand from './commands/set';
import * as statusCommand from './commands/status';
import * as resetCommand from './commands/reset';
import * as setupCommand from './commands/setup';
import { DatabaseService } from './services/database';
import { handleUiInteraction } from './ui/handlers';

// Map commands
const commands = new Map();
commands.set(pulseCommand.data.name, pulseCommand);
commands.set(pingCommand.data.name, pingCommand);
commands.set(helpCommand.data.name, helpCommand);
commands.set(countryCommand.data.name, countryCommand);
commands.set(newsCommand.data.name, newsCommand);
commands.set(topCommand.data.name, topCommand);
commands.set(compareCommand.data.name, compareCommand);
commands.set(historyCommand.data.name, historyCommand);
commands.set(subscribeCommand.data.name, subscribeCommand);
commands.set(unsubscribeCommand.data.name, unsubscribeCommand);
commands.set(subscriptionsCommand.data.name, subscriptionsCommand);
commands.set(setCommand.data.name, setCommand);
commands.set(statusCommand.data.name, statusCommand);
commands.set(resetCommand.data.name, resetCommand);
commands.set(setupCommand.data.name, setupCommand);

client.once('ready', async () => {
  await DatabaseService.initialize();
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      const command = commands.get(interaction.commandName);
      if (!command) return;
      await command.execute(interaction);
      return;
    }

    await handleUiInteraction(interaction);
  } catch (error) {
    console.error(error);
    if (!interaction.isRepliable()) {
      return;
    }

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
});


client.login(process.env.DISCORD_TOKEN).catch((err) => {
  console.error('Failed to login:', err);
});
