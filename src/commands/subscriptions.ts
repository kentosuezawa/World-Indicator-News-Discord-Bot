import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('subscriptions')
  .setDescription('現在の通知一覧を表示します。')
  .addBooleanOption(option =>
    option.setName('ephemeral').setDescription('自分にだけ表示する').setRequired(false)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const ephemeral = interaction.options.getBoolean('ephemeral') ?? true;
  await interaction.reply({
    content: '⚠️ /subscriptions は仕様に合わせた詳細実装が必要です。現在はコマンドのみ登録済みです。',
    ephemeral
  });
}
