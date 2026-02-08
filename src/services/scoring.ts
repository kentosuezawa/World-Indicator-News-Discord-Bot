import { CountryScore, IndicatorData } from '../types';
import { INDICATORS } from './worldbank';

export class ScoringService {
  /**
   * Calculate scores for countries based on indicator changes.
   * Currently implements a simple ranking based on absolute change.
   */
  static calculateScores(
    gdpData: IndicatorData[],
    inflationData: IndicatorData[],
    popData: IndicatorData[]
  ): CountryScore[] {
    const scores: Map<string, CountryScore> = new Map();

    // Helper to get or create score object
    const getScoreObj = (countryCode: string): CountryScore => {
      if (!scores.has(countryCode)) {
        scores.set(countryCode, {
          countryCode: countryCode,
          totalScore: 0,
          breakdown: { gdp: 0, inflation: 0, population: 0 },
          indicatorChanges: { gdp: 0, inflation: 0, population: 0 }
        });
      }
      return scores.get(countryCode)!;
    };

    // Calculate changes and add to scores
    this.processIndicator(gdpData, 'gdp', getScoreObj);
    this.processIndicator(inflationData, 'inflation', getScoreObj);
    this.processIndicator(popData, 'population', getScoreObj);

    // Filter out countries with 0 total score (likely no data change or data missing)
    return Array.from(scores.values())
      .filter(s => s.totalScore > 0)
      .sort((a, b) => b.totalScore - a.totalScore);
  }

  private static processIndicator(
    data: IndicatorData[],
    type: 'gdp' | 'inflation' | 'population',
    getScoreObj: (code: string) => CountryScore
  ) {
    // Group data by country
    const countryData = new Map<string, IndicatorData[]>();
    for (const item of data) {
      if (!countryData.has(item.countryCode)) {
        countryData.set(item.countryCode, []);
      }
      countryData.get(item.countryCode)!.push(item);
    }

    // Calculate change for each country
    for (const [code, items] of countryData) {
      // Sort by year ascending
      items.sort((a, b) => a.year - b.year);
      
      if (items.length >= 2) {
        const latest = items[items.length - 1];
        const prev = items[items.length - 2];
        
        // Calculate absolute change
        const change = latest.value - prev.value;
        const absChange = Math.abs(change);
        
        const scoreObj = getScoreObj(code);
        scoreObj.indicatorChanges[type] = change;
        
        // Simple normalization/scoring logic for MVP:
        // Just add the absolute change to the total score.
        // Identify weights: Inflation usually changes by 1-10%, GDP 1-5%, Pop 0-2%.
        // Maybe weigh population higher to make it visible?
        // Or just raw absolute change sum for now.
        
        // Let's normalize slightly:
        // GDP change of 1% = 1 point
        // Inflation change of 1% = 1 point
        // Population change of 1% = 10 points (since it's usually small)
        
        let weight = 1;
        if (type === 'population') weight = 10;
        
        scoreObj.breakdown[type] = absChange * weight;
        scoreObj.totalScore += absChange * weight;
      }
    }
  }
}
