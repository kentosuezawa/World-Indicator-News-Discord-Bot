import axios from 'axios';
import { IndicatorData } from '../types';
import { DatabaseService } from './database';

const BASE_URL = 'http://api.worldbank.org/v2/country/all/indicator';
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

// Indicator Codes
export const INDICATORS = {
  GDP_GROWTH: 'NY.GDP.MKTP.KD.ZG', // Annual %
  INFLATION: 'FP.CPI.TOTL.ZG',     // Consumer prices annual %
  POPULATION_GROWTH: 'SP.POP.GROW' // Annual %
};

interface WorldBankResponseItem {
  indicator: { id: string; value: string };
  country: { id: string; value: string };
  countryiso3code: string;
  date: string;
  value: number | null;
  unit: string;
  obs_status: string;
  decimal: number;
}

export class WorldBankService {
  /**
   * Fetch indicator data for a specific year range.
   * Checks cache first.
   */
  static async fetchIndicator(indicatorCode: string, years: number = 2): Promise<IndicatorData[]> {
    const db = await DatabaseService.getDb();
    const dateRange = this.getDateRangeString(years);
    const splitYears = dateRange.split(':');
    const startYear = parseInt(splitYears[0]);
    
    // 1. Check Cache
    // We check if we have data for this indicator recently fetched.
    // For simplicity, we just check if we have *any* fresh data for this indicator.
    // A robust solution would check per country/year, but that's heavy.
    // Let's check the timestamp of one record.
    const cachedRecord = await db.get(
      'SELECT fetched_at FROM indicators WHERE indicator_code = ? LIMIT 1',
      indicatorCode
    );

    const now = Date.now();
    if (cachedRecord && (now - cachedRecord.fetched_at < CACHE_DURATION_MS)) {
      console.log(`Using cached data for ${indicatorCode}`);
      const rows = await db.all<any[]>(
        'SELECT country_code, indicator_code, year, value FROM indicators WHERE indicator_code = ? AND year >= ?',
        indicatorCode, startYear
      );
      
      return rows.map(r => ({
        countryCode: r.country_code,
        indicatorCode: r.indicator_code,
        year: r.year,
        value: r.value
      }));
    }

    console.log(`Cache miss/expired for ${indicatorCode}. Fetching from API...`);
    
    // 2. Fetch from API
    const results: IndicatorData[] = [];
    try {
      let page = 1;
      let totalPages = 1;

      while (page <= totalPages) {
        const url = `${BASE_URL}/${indicatorCode}?format=json&per_page=500&date=${dateRange}&page=${page}`;
        console.log(`Fetching World Bank Data: ${url}`);
        
        const response = await axios.get(url);
        const data = response.data;

        if (!data || data.length < 2) {
          break;
        }

        const metadata = data[0];
        const records: WorldBankResponseItem[] = data[1];

        totalPages = metadata.pages;

        for (const record of records) {
          if (record.value !== null && record.countryiso3code) {
             results.push({
              countryCode: record.country.id, // ISO2
              indicatorCode: indicatorCode,
              year: parseInt(record.date),
              value: record.value
            });
          }
        }
        page++;
      }

      // 3. Save to Cache (Async)
      // Delete old data for this indicator to avoid stale mix? Or just upsert.
      // Easiest is to delete old cache for this indicator and insert new.
      await db.run('DELETE FROM indicators WHERE indicator_code = ?', indicatorCode);
      
      const stmt = await db.prepare(
        'INSERT INTO indicators (country_code, indicator_code, year, value, fetched_at) VALUES (?, ?, ?, ?, ?)'
      );
      
      for (const item of results) {
        await stmt.run(item.countryCode, item.indicatorCode, item.year, item.value, now);
      }
      await stmt.finalize();
      console.log(`Cached ${results.length} records for ${indicatorCode}`);

    } catch (error) {
      console.error(`Error fetching indicator ${indicatorCode}:`, error);
    }

    return results;
  }

  private static getDateRangeString(yearsBack: number): string {
    const currentYear = new Date().getFullYear();
    const endYear = currentYear; 
    const startYear = currentYear - yearsBack; 
    return `${startYear}:${endYear}`;
  }
}

