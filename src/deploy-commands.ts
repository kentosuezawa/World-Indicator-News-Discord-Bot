import { REST, Routes } from 'discord.js';
import * as dotenv from 'dotenv';
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

dotenv.config();

const commands = [
  pulseCommand.data.toJSON(),
  pingCommand.data.toJSON(),
  helpCommand.data.toJSON(),
  countryCommand.data.toJSON(),
  newsCommand.data.toJSON(),
  topCommand.data.toJSON(),
  compareCommand.data.toJSON(),
  historyCommand.data.toJSON(),
  subscribeCommand.data.toJSON(),
  unsubscribeCommand.data.toJSON(),
  subscriptionsCommand.data.toJSON(),
  setCommand.data.toJSON(),
  statusCommand.data.toJSON(),
  resetCommand.data.toJSON(),
  setupCommand.data.toJSON(),
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    const applicationId = process.env.APPLICATION_ID;
    if (!applicationId) {
      throw new Error('Missing APPLICATION_ID in .env');
    }

    // 1) Delete all existing global commands
    await rest.put(
      Routes.applicationCommands(applicationId),
      { body: [] },
    );

    console.log('Cleared existing application (/) commands.');

    // 2) Register new commands
    await rest.put(
      Routes.applicationCommands(applicationId),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
