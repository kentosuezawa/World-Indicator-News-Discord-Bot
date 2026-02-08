import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Botの応答とレイテンシを確認します。');

export async function execute(interaction: ChatInputCommandInteraction) {
  const sent = Date.now();
  await interaction.reply('Pong!');
  const latency = Date.now() - sent;

  await interaction.editReply(`Pong! 🏓 レイテンシ: ${latency}ms`);
}
