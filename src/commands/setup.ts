import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder
} from 'discord.js';
import { buildPanelMessage } from '../ui/panel';
import { DatabaseService } from '../services/database';

export const data = new SlashCommandBuilder()
  .setName('setup')
  .setDescription('操作パネルを投稿します。')
  .addChannelOption(option =>
    option.setName('channel').setDescription('投稿先チャンネル').setRequired(false)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.inCachedGuild()) {
    await interaction.reply({ content: 'この操作はサーバー内でのみ利用できます。', ephemeral: true });
    return;
  }

  if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
    await interaction.reply({ content: '管理者権限が必要です。', ephemeral: true });
    return;
  }

  const targetChannel = interaction.options.getChannel('channel') ?? interaction.channel;

  if (!targetChannel || !targetChannel.isTextBased()) {
    await interaction.reply({ content: '投稿先チャンネルが不正です。', ephemeral: true });
    return;
  }

  const message = await targetChannel.send(buildPanelMessage());

  const db = await DatabaseService.getDb();
  await db.run('INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)', 'ui_panel_channel_id', targetChannel.id);
  await db.run('INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)', 'ui_panel_message_id', message.id);

  await interaction.reply({ content: '操作パネルを投稿しました。', ephemeral: true });
}
