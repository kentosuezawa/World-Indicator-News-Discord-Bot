import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('country')
  .setDescription('指定国の指標サマリーとニュースを表示します。')
  .addStringOption(option =>
    option.setName('country').setDescription('国名または国コード (例: Japan / JPN)').setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName('indicator')
      .setDescription('指標')
      .setRequired(true)
      .addChoices(
        { name: 'GDP', value: 'GDP' },
        { name: 'INFLATION', value: 'INFLATION' },
        { name: 'POPULATION', value: 'POPULATION' },
        { name: 'UNEMPLOYMENT', value: 'UNEMPLOYMENT' },
        { name: 'CPI', value: 'CPI' }
      )
  )
  .addStringOption(option =>
    option
      .setName('period')
      .setDescription('期間')
      .setRequired(false)
      .addChoices(
        { name: '1y', value: '1y' },
        { name: '3y', value: '3y' },
        { name: '5y', value: '5y' },
        { name: '10y', value: '10y' }
      )
  )
  .addIntegerOption(option =>
    option.setName('news_limit').setDescription('ニュース件数 (1-10)').setRequired(false).setMinValue(1).setMaxValue(10)
  )
  .addBooleanOption(option =>
    option.setName('ephemeral').setDescription('自分にだけ表示する').setRequired(false)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const ephemeral = interaction.options.getBoolean('ephemeral') ?? true;
  await interaction.reply({
    content: '⚠️ /country は仕様に合わせた詳細実装が必要です。現在はコマンドのみ登録済みです。',
    ephemeral
  });
}
