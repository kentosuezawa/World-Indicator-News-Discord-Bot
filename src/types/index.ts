export interface Country {
  name: string;
  iso2: string;
  iso3: string;
}

export interface IndicatorData {
  countryCode: string;
  indicatorCode: string;
  year: number;
  value: number;
}

export interface CountryScore {
  countryCode: string;
  totalScore: number;
  breakdown: {
    gdp: number; // Normalized score for GDP
    inflation: number; // Normalized score for Inflation
    population: number; // Normalized score for Population
  };
  indicatorChanges: {
    gdp: number; // Raw change value
    inflation: number; // Raw change value
    population: number; // Raw change value
  };
}

export interface NewsArticle {
  title: string;
  link: string;
  source: string;
  pubDate: string;
  countryCodes: string[];
}

export interface Subscription {
  id: number;
  userId: string;
  guildId: string;
  country: string;
  indicator: string;
  threshold: number;
  period: string;
  direction: string;
  channelId: string;
  cooldownMin: number;
  createdAt: number;
}
