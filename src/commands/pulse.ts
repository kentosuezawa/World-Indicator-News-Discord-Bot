import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { WorldBankService, INDICATORS } from '../services/worldbank';
import { ScoringService } from '../services/scoring';
import { NewsService } from '../services/news';
import { EmbedUtils } from '../utils/embeds';

export const data = new SlashCommandBuilder()
  .setName('pulse')
  .setDescription('世界の経済指標を分析し、変化の大きい国を表示します。');

export async function execute(interaction: ChatInputCommandInteraction) {
  // Use deferReply because fetching data might take longer than 3 seconds
  await interaction.deferReply();

  try {
    // 1. Fetch Data
    const [gdpData, infData, popData] = await Promise.all([
      WorldBankService.fetchIndicator(INDICATORS.GDP_GROWTH),
      WorldBankService.fetchIndicator(INDICATORS.INFLATION),
      WorldBankService.fetchIndicator(INDICATORS.POPULATION_GROWTH)
    ]);

    // 2. Score & Rank
    const scores = ScoringService.calculateScores(gdpData, infData, popData);
    const topN = 3; 
    const topCountries = scores.slice(0, topN);

    // 3. Fetch News & Generate Embeds
    for (let i = 0; i < topCountries.length; i++) {
        const countryScore = topCountries[i];
        
        const news = await NewsService.fetchNews(countryScore.countryCode, []);
        const embed = EmbedUtils.createCountryEmbed(countryScore, news, i + 1);
        
        // Follow up with multiple messages
        await interaction.followUp({ embeds: [embed] });
    }

    await interaction.followUp({ content: '✅ Global Pulse Complete.', ephemeral: true });

  } catch (error) {
    console.error(error);
    await interaction.editReply('❌ An error occurred while fetching data.');
  }
}

