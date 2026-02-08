import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('history')
  .setDescription('指標の履歴を表示します。')
  .addStringOption(option =>
    option.setName('country').setDescription('国名または国コード').setRequired(true)
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
  .addStringOption(option =>
    option
      .setName('format')
      .setDescription('表示形式')
      .setRequired(false)
      .addChoices(
        { name: 'table', value: 'table' },
        { name: 'summary', value: 'summary' }
      )
  )
  .addBooleanOption(option =>
    option.setName('ephemeral').setDescription('自分にだけ表示する').setRequired(false)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const ephemeral = interaction.options.getBoolean('ephemeral') ?? true;
  await interaction.reply({
    content: '⚠️ /history は仕様に合わせた詳細実装が必要です。現在はコマンドのみ登録済みです。',
    ephemeral
  });
}
