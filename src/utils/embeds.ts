import { EmbedBuilder } from 'discord.js';
import { CountryScore, NewsArticle } from '../types';

export class EmbedUtils {
  static createCountryEmbed(score: CountryScore, news: NewsArticle[], rank: number) {
    const countryName = score.countryCode; // In real app, map ISO code to name
    const flag = typeof score.countryCode === 'string' && score.countryCode.length === 2 
      ? `:flag_${score.countryCode.toLowerCase()}:` 
      : '🏳️';

    const embed = new EmbedBuilder()
      .setTitle(`${flag} ${countryName} (Rank #${rank})`)
      .setDescription(`**Score:** ${score.totalScore.toFixed(2)}\nHigh activity detected in key indicators.`)
      .setColor(0x0099ff)
      .addFields(
        { 
          name: '📈 Indicator Shifts', 
          value: `
          **GDP:** ${score.indicatorChanges.gdp > 0 ? '+' : ''}${score.indicatorChanges.gdp.toFixed(2)}%
          **Inflation:** ${score.indicatorChanges.inflation > 0 ? '+' : ''}${score.indicatorChanges.inflation.toFixed(2)}%
          **Population:** ${score.indicatorChanges.population > 0 ? '+' : ''}${score.indicatorChanges.population.toFixed(2)}%
          `,
          inline: false
        }
      );

    if (news.length > 0) {
      const newsList = news.map(n => `• [${n.title}](${n.link}) - *${n.source}*`).join('\n');
      embed.addFields({ name: '📰 Top News', value: newsList.slice(0, 1024) });
    } else {
      embed.addFields({ name: '📰 Top News', value: 'No recent news found.' });
    }

    embed.setFooter({ text: 'Data: World Bank | News: NewsData.io' });
    embed.setTimestamp();

    return embed;
  }
}
