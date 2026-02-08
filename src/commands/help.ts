import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('主要コマンドの使い方を表示します。')
  .addBooleanOption(option =>
    option
      .setName('ephemeral')
      .setDescription('自分にだけ表示する')
      .setRequired(false)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const ephemeral = interaction.options.getBoolean('ephemeral') ?? true;

  const lines = [
    '✅ 主要コマンド例（コピペ可）',
    '/pulse',
    '/country country:Japan indicator:GDP period:1y news_limit:3',
    '/news query:"GDP" country:Japan limit:5 sort:latest',
    '/top indicator:GDP period:1y metric:change_rate limit:10',
    '/compare country_a:Japan country_b:United States indicator:GDP period:5y',
    '/history country:Japan indicator:GDP period:10y format:table',
    '/subscribe country:Japan indicator:GDP period:1y threshold:2 direction:up',
    '/subscriptions',
    '/unsubscribe id:xxxxxxxx'
  ];

  await interaction.reply({
    content: lines.join('\n'),
    ephemeral
  });
}
