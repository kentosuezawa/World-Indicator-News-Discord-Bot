import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('set')
  .setDescription('グローバル設定を変更します。')
  .addChannelOption(option =>
    option.setName('default_channel').setDescription('デフォルトチャンネル').setRequired(false)
  )
  .addStringOption(option =>
    option
      .setName('default_period')
      .setDescription('デフォルト期間')
      .setRequired(false)
      .addChoices(
        { name: '1y', value: '1y' },
        { name: '3y', value: '3y' },
        { name: '5y', value: '5y' },
        { name: '10y', value: '10y' }
      )
  )
  .addIntegerOption(option =>
    option.setName('default_news_limit').setDescription('デフォルトのニュース件数').setRequired(false)
  )
  .addIntegerOption(option =>
    option.setName('notify_interval_min').setDescription('通知チェック間隔（分）').setRequired(false)
  )
  .addStringOption(option =>
    option
      .setName('language')
      .setDescription('言語')
      .setRequired(false)
      .addChoices(
        { name: 'ja', value: 'ja' },
        { name: 'en', value: 'en' }
      )
  )
  .addBooleanOption(option =>
    option.setName('ephemeral').setDescription('自分にだけ表示する').setRequired(false)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const ephemeral = interaction.options.getBoolean('ephemeral') ?? true;
  await interaction.reply({
    content: '⚠️ /set は仕様に合わせた詳細実装が必要です。現在はコマンドのみ登録済みです。',
    ephemeral
  });
}
