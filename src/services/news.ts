import axios from 'axios';
import { NewsArticle } from '../types';

const NEWSDATA_BASE_URL = 'https://newsdata.io/api/1/news';

export class NewsService {
  /**
   * Fetch news for a specific country and related keywords.
   */
  static async fetchNews(countryName: string, keywords: string[]): Promise<NewsArticle[]> {
    const articles: NewsArticle[] = [];
    const apiKey = process.env.NEWSDATA_API_KEY;

    if (!apiKey) {
      console.warn('NewsData API Key is missing.');
      return [];
    }

    // Construct query: "CountryName" AND ("Keyword1" OR "Keyword2")
    // NewsData q parameter supports simple boolean logic.
    // However, simplest is just to search for CountryName + One main keyword, or just CountryName if no specific keyword strongly correlates.
    // To avoid complex query limits, let's keep it simple: CountryName AND (GDP OR inflation OR population)
    // keywords: ['GDP', 'inflation', 'population']
    
    // According to NewsData docs, 'q' is mandatory.
    // Let's format: "CountryName" AND ("GDP" OR "inflation" OR "population")
    // Note: URL encoding needed.
    const query = `"${countryName}" AND ("GDP" OR "inflation" OR "population" OR "economy")`;
    
    try {
      const url = `${NEWSDATA_BASE_URL}?apikey=${apiKey}&q=${encodeURIComponent(query)}&language=en`;
      console.log(`Fetching News: ${url}`);
      
      const response = await axios.get(url);
      const data = response.data;

      if (data.status === 'success' && data.results) {
        for (const result of data.results) {
           // Basic deduping can happen here if needed
           articles.push({
             title: result.title,
             link: result.link,
             source: result.source_id,
             pubDate: result.pubDate,
             countryCodes: result.country || [] // NewsData returns country codes involved
           });
        }
      }
    } catch (error) {
       console.error(`Error fetching news for ${countryName}:`, error);
    }
    
    return articles.slice(0, 5); // Return top 5
  }
}
