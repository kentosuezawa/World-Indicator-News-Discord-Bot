import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  StringSelectMenuBuilder
} from 'discord.js';

export const UI_IDS = {
  country: 'ui:country',
  threshold: 'ui:threshold',
  cooldown: 'ui:cooldown',
  channel: 'ui:channel',
  indicator: 'ui:indicator',
  period: 'ui:period',
  direction: 'ui:direction',
  register: 'ui:register',
  remove: 'ui:remove',
  list: 'ui:list',
  countryModal: 'ui:country_modal',
  thresholdModal: 'ui:threshold_modal',
  cooldownModal: 'ui:cooldown_modal',
  channelModal: 'ui:channel_modal',
  countryInput: 'ui:country_input',
  thresholdInput: 'ui:threshold_input',
  cooldownInput: 'ui:cooldown_input',
  channelInput: 'ui:channel_input'
} as const;

export function buildPanelMessage() {
  const embed = new EmbedBuilder()
    .setTitle('World Indicator News 操作パネル')
    .setDescription('ボタン・メニューで条件通知を作成できます。')
    .setColor(0x4b8bf4)
    .addFields(
      { name: '① 国/コード', value: 'ボタンで入力', inline: true },
      { name: '② 指標', value: 'メニューで選択', inline: true },
      { name: '③ 閾値/期間/方向', value: '入力・選択', inline: true },
      { name: '④ 通知先', value: 'ボタンで入力（#channel / ID）', inline: true },
      { name: '⑤ 登録/解除/確認', value: '最後に実行', inline: true }
    );

  const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId(UI_IDS.country).setLabel('国/コード入力').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId(UI_IDS.threshold).setLabel('閾値入力').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId(UI_IDS.cooldown).setLabel('クールダウン入力').setStyle(ButtonStyle.Secondary)
  );

  const indicatorSelect = new StringSelectMenuBuilder()
    .setCustomId(UI_IDS.indicator)
    .setPlaceholder('指標を選択')
    .addOptions(
      { label: 'GDP', value: 'GDP' },
      { label: 'INFLATION', value: 'INFLATION' },
      { label: 'POPULATION', value: 'POPULATION' },
      { label: 'UNEMPLOYMENT', value: 'UNEMPLOYMENT' },
      { label: 'CPI', value: 'CPI' }
    );

  const row2 = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(indicatorSelect);

  const periodSelect = new StringSelectMenuBuilder()
    .setCustomId(UI_IDS.period)
    .setPlaceholder('期間を選択')
    .addOptions(
      { label: '1y', value: '1y' },
      { label: '3y', value: '3y' },
      { label: '5y', value: '5y' },
      { label: '10y', value: '10y' }
    );

  const row3 = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(periodSelect);

  const directionSelect = new StringSelectMenuBuilder()
    .setCustomId(UI_IDS.direction)
    .setPlaceholder('変化方向を選択')
    .addOptions(
      { label: 'up', value: 'up' },
      { label: 'down', value: 'down' },
      { label: 'both', value: 'both' }
    );

  const row4 = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(directionSelect);

  const row5 = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId(UI_IDS.channel).setLabel('通知先チャンネル入力').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId(UI_IDS.register).setLabel('登録').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId(UI_IDS.remove).setLabel('解除').setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId(UI_IDS.list).setLabel('確認').setStyle(ButtonStyle.Secondary)
  );

  return {
    embeds: [embed],
    components: [row1, row2, row3, row4, row5]
  };
}
