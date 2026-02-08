import {
  ButtonInteraction,
  Interaction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  StringSelectMenuInteraction,
  ModalSubmitInteraction
} from 'discord.js';
import { UI_IDS } from './panel';
import { getDraft, updateDraft } from './state';
import { SubscriptionsService } from '../services/subscriptions';

const INDICATOR_VALUES = ['GDP', 'INFLATION', 'POPULATION', 'UNEMPLOYMENT', 'CPI'];
const PERIOD_VALUES = ['1y', '3y', '5y', '10y'];
const DIRECTION_VALUES = ['up', 'down', 'both'];

function buildDraftSummary(guildId: string, userId: string) {
  const draft = getDraft(guildId, userId);
  const parts = [
    `国/コード: ${draft.country ?? '未設定'}`,
    `指標: ${draft.indicator ?? '未設定'}`,
    `閾値: ${draft.threshold ?? '未設定'}`,
    `期間: ${draft.period ?? '1y'}`,
    `方向: ${draft.direction ?? 'both'}`,
    `通知先: ${draft.channelId ? `<#${draft.channelId}>` : '未設定'}`,
    `クールダウン: ${draft.cooldownMin ?? 0} 分`
  ];

  return parts.join('\n');
}

function parseChannelId(input: string): string | null {
  const trimmed = input.trim();
  const mentionMatch = trimmed.match(/^<#(\d+)>$/);
  if (mentionMatch) return mentionMatch[1];
  if (/^\d+$/.test(trimmed)) return trimmed;
  return null;
}

async function handleButton(interaction: ButtonInteraction) {
  if (!interaction.inCachedGuild()) {
    await interaction.reply({ content: 'この操作はサーバー内でのみ利用できます。', ephemeral: true });
    return;
  }

  const { guildId, user } = interaction;

  switch (interaction.customId) {
    case UI_IDS.country: {
      const modal = new ModalBuilder().setCustomId(UI_IDS.countryModal).setTitle('国/コード入力');
      const input = new TextInputBuilder()
        .setCustomId(UI_IDS.countryInput)
        .setLabel('国名または国コード')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(input));
      await interaction.showModal(modal);
      return;
    }
    case UI_IDS.threshold: {
      const modal = new ModalBuilder().setCustomId(UI_IDS.thresholdModal).setTitle('閾値入力');
      const input = new TextInputBuilder()
        .setCustomId(UI_IDS.thresholdInput)
        .setLabel('閾値（%）')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('例: 2.5')
        .setRequired(true);

      modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(input));
      await interaction.showModal(modal);
      return;
    }
    case UI_IDS.cooldown: {
      const modal = new ModalBuilder().setCustomId(UI_IDS.cooldownModal).setTitle('クールダウン入力');
      const input = new TextInputBuilder()
        .setCustomId(UI_IDS.cooldownInput)
        .setLabel('最小通知間隔（分）')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('例: 60')
        .setRequired(true);

      modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(input));
      await interaction.showModal(modal);
      return;
    }
    case UI_IDS.channel: {
      const modal = new ModalBuilder().setCustomId(UI_IDS.channelModal).setTitle('通知先チャンネル入力');
      const input = new TextInputBuilder()
        .setCustomId(UI_IDS.channelInput)
        .setLabel('チャンネル (#general or ID)')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('#general または 1234567890')
        .setRequired(true);

      modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(input));
      await interaction.showModal(modal);
      return;
    }
    case UI_IDS.register: {
      const draft = getDraft(guildId, user.id);
      if (!draft.country || !draft.indicator || draft.threshold === undefined) {
        await interaction.reply({
          content: '国/コード、指標、閾値を入力してください。\n' + buildDraftSummary(guildId, user.id),
          ephemeral: true
        });
        return;
      }

      const channelId = draft.channelId ?? interaction.channelId;
      const cooldownMin = draft.cooldownMin ?? 0;
      const period = draft.period ?? '1y';
      const direction = draft.direction ?? 'both';

      const id = await SubscriptionsService.create({
        userId: user.id,
        guildId,
        country: draft.country,
        indicator: draft.indicator,
        threshold: draft.threshold,
        period,
        direction,
        channelId,
        cooldownMin
      });

      await interaction.reply({
        content: `登録完了（ID: ${id}）\n` + buildDraftSummary(guildId, user.id),
        ephemeral: true
      });
      return;
    }
    case UI_IDS.remove: {
      const draft = getDraft(guildId, user.id);
      if (!draft.country || !draft.indicator) {
        await interaction.reply({
          content: '解除するには国/コードと指標を設定してください。\n' + buildDraftSummary(guildId, user.id),
          ephemeral: true
        });
        return;
      }

      const removed = await SubscriptionsService.removeByDraft(guildId, user.id, draft.country, draft.indicator);
      if (removed === 0) {
        await interaction.reply({
          content: '一致する登録が見つかりませんでした。\n' + buildDraftSummary(guildId, user.id),
          ephemeral: true
        });
        return;
      }

      await interaction.reply({
        content: `解除しました（${removed}件）。\n` + buildDraftSummary(guildId, user.id),
        ephemeral: true
      });
      return;
    }
    case UI_IDS.list: {
      const subscriptions = await SubscriptionsService.listByUser(guildId, user.id);
      if (subscriptions.length === 0) {
        await interaction.reply({ content: '現在の登録はありません。', ephemeral: true });
        return;
      }

      const lines = subscriptions.slice(0, 10).map(sub => {
        return `#${sub.id} ${sub.country} ${sub.indicator} ${sub.threshold}% ${sub.period} ${sub.direction} <#${sub.channelId}> cooldown:${sub.cooldownMin}`;
      });

      await interaction.reply({
        content: `現在の登録一覧（最大10件）\n${lines.join('\n')}`,
        ephemeral: true
      });
      return;
    }
    default:
      return;
  }
}

async function handleSelect(interaction: StringSelectMenuInteraction) {
  if (!interaction.inCachedGuild()) {
    await interaction.reply({ content: 'この操作はサーバー内でのみ利用できます。', ephemeral: true });
    return;
  }

  const { guildId, user } = interaction;
  const value = interaction.values[0];

  if (interaction.customId === UI_IDS.indicator) {
    if (!INDICATOR_VALUES.includes(value)) {
      await interaction.reply({ content: '不正な指標です。', ephemeral: true });
      return;
    }
    updateDraft(guildId, user.id, { indicator: value });
    await interaction.reply({ content: '指標を設定しました。\n' + buildDraftSummary(guildId, user.id), ephemeral: true });
    return;
  }

  if (interaction.customId === UI_IDS.period) {
    if (!PERIOD_VALUES.includes(value)) {
      await interaction.reply({ content: '不正な期間です。', ephemeral: true });
      return;
    }
    updateDraft(guildId, user.id, { period: value });
    await interaction.reply({ content: '期間を設定しました。\n' + buildDraftSummary(guildId, user.id), ephemeral: true });
    return;
  }

  if (interaction.customId === UI_IDS.direction) {
    if (!DIRECTION_VALUES.includes(value)) {
      await interaction.reply({ content: '不正な方向です。', ephemeral: true });
      return;
    }
    updateDraft(guildId, user.id, { direction: value });
    await interaction.reply({ content: '方向を設定しました。\n' + buildDraftSummary(guildId, user.id), ephemeral: true });
    return;
  }
}

async function handleModal(interaction: ModalSubmitInteraction) {
  if (!interaction.inCachedGuild()) {
    await interaction.reply({ content: 'この操作はサーバー内でのみ利用できます。', ephemeral: true });
    return;
  }

  const { guildId, user } = interaction;

  if (interaction.customId === UI_IDS.countryModal) {
    const value = interaction.fields.getTextInputValue(UI_IDS.countryInput).trim();
    updateDraft(guildId, user.id, { country: value });
    await interaction.reply({ content: '国/コードを設定しました。\n' + buildDraftSummary(guildId, user.id), ephemeral: true });
    return;
  }

  if (interaction.customId === UI_IDS.thresholdModal) {
    const raw = interaction.fields.getTextInputValue(UI_IDS.thresholdInput).trim();
    const number = Number(raw);
    if (!Number.isFinite(number)) {
      await interaction.reply({ content: '数値を入力してください。', ephemeral: true });
      return;
    }
    updateDraft(guildId, user.id, { threshold: number });
    await interaction.reply({ content: '閾値を設定しました。\n' + buildDraftSummary(guildId, user.id), ephemeral: true });
    return;
  }

  if (interaction.customId === UI_IDS.cooldownModal) {
    const raw = interaction.fields.getTextInputValue(UI_IDS.cooldownInput).trim();
    const number = Number(raw);
    if (!Number.isFinite(number) || number < 0) {
      await interaction.reply({ content: '0以上の数値を入力してください。', ephemeral: true });
      return;
    }
    updateDraft(guildId, user.id, { cooldownMin: Math.floor(number) });
    await interaction.reply({ content: 'クールダウンを設定しました。\n' + buildDraftSummary(guildId, user.id), ephemeral: true });
    return;
  }

  if (interaction.customId === UI_IDS.channelModal) {
    const raw = interaction.fields.getTextInputValue(UI_IDS.channelInput);
    const channelId = parseChannelId(raw);
    if (!channelId) {
      await interaction.reply({ content: 'チャンネルを #channel 形式かIDで入力してください。', ephemeral: true });
      return;
    }

    const channel = interaction.guild.channels.cache.get(channelId);
    if (!channel || !channel.isTextBased()) {
      await interaction.reply({ content: 'そのチャンネルは使用できません。', ephemeral: true });
      return;
    }

    updateDraft(guildId, user.id, { channelId });
    await interaction.reply({ content: '通知先を設定しました。\n' + buildDraftSummary(guildId, user.id), ephemeral: true });
    return;
  }
}

export async function handleUiInteraction(interaction: Interaction) {
  if (!interaction.isButton() && !interaction.isStringSelectMenu() && !interaction.isModalSubmit()) {
    return;
  }

  const customId = interaction.customId;
  if (!customId.startsWith('ui:')) {
    return;
  }

  if (interaction.isButton()) {
    await handleButton(interaction);
    return;
  }

  if (interaction.isStringSelectMenu()) {
    await handleSelect(interaction);
    return;
  }

  if (interaction.isModalSubmit()) {
    await handleModal(interaction);
  }
}
