import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('news')
  .setDescription('ニュースを検索して一覧表示します。')
  .addStringOption(option =>
    option.setName('query').setDescription('検索キーワード').setRequired(false)
  )
  .addStringOption(option =>
    option.setName('country').setDescription('国名または国コード').setRequired(false)
  )
  .addIntegerOption(option =>
    option.setName('limit').setDescription('件数 (1-20)').setRequired(false).setMinValue(1).setMaxValue(20)
  )
  .addStringOption(option =>
    option
      .setName('sort')
      .setDescription('並び順')
      .setRequired(false)
      .addChoices(
        { name: 'relevance', value: 'relevance' },
        { name: 'latest', value: 'latest' }
      )
  )
  .addBooleanOption(option =>
    option.setName('ephemeral').setDescription('自分にだけ表示する').setRequired(false)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const ephemeral = interaction.options.getBoolean('ephemeral') ?? true;
  await interaction.reply({
    content: '⚠️ /news は仕様に合わせた詳細実装が必要です。現在はコマンドのみ登録済みです。',
    ephemeral
  });
}
