import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('subscribe')
  .setDescription('条件通知を登録します。')
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
  .addNumberOption(option =>
    option.setName('threshold').setDescription('閾値（%）').setRequired(true)
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
      .setName('direction')
      .setDescription('変化方向')
      .setRequired(false)
      .addChoices(
        { name: 'up', value: 'up' },
        { name: 'down', value: 'down' },
        { name: 'both', value: 'both' }
      )
  )
  .addChannelOption(option =>
    option.setName('channel').setDescription('通知先チャンネル').setRequired(false)
  )
  .addIntegerOption(option =>
    option.setName('cooldown_min').setDescription('最小通知間隔（分）').setRequired(false)
  )
  .addBooleanOption(option =>
    option.setName('ephemeral').setDescription('自分にだけ表示する').setRequired(false)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const ephemeral = interaction.options.getBoolean('ephemeral') ?? true;
  await interaction.reply({
    content: '⚠️ /subscribe は仕様に合わせた詳細実装が必要です。現在はコマンドのみ登録済みです。',
    ephemeral
  });
}
