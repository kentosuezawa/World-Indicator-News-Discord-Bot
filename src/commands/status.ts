import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('status')
  .setDescription('Botの稼働状況を表示します。')
  .addBooleanOption(option =>
    option.setName('ephemeral').setDescription('自分にだけ表示する').setRequired(false)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const ephemeral = interaction.options.getBoolean('ephemeral') ?? true;
  await interaction.reply({
    content: '⚠️ /status は仕様に合わせた詳細実装が必要です。現在はコマンドのみ登録済みです。',
    ephemeral
  });
}
