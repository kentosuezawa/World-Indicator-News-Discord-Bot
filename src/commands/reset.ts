import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('reset')
  .setDescription('データ初期化を行います（危険）。')
  .addStringOption(option =>
    option
      .setName('scope')
      .setDescription('対象')
      .setRequired(true)
      .addChoices(
        { name: 'cache', value: 'cache' },
        { name: 'subscriptions', value: 'subscriptions' },
        { name: 'all', value: 'all' }
      )
  )
  .addStringOption(option =>
    option.setName('confirm').setDescription('DELETE と入力').setRequired(true)
  )
  .addBooleanOption(option =>
    option.setName('ephemeral').setDescription('自分にだけ表示する').setRequired(false)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const ephemeral = interaction.options.getBoolean('ephemeral') ?? true;
  await interaction.reply({
    content: '⚠️ /reset は仕様に合わせた詳細実装が必要です。現在はコマンドのみ登録済みです。',
    ephemeral
  });
}
