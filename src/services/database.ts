import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import fs from 'fs';

export class DatabaseService {
  private static db: Database | null = null;
  private static dbPath = process.env.DB_PATH || './data/bot.db';

  static async initialize() {
    // Ensure directory exists
    const dir = path.dirname(this.dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    this.db = await open({
      filename: this.dbPath,
      driver: sqlite3.Database
    });

    console.log('Connected to SQLite database.');
    await this.createTables();
  }

  private static async createTables() {
    if (!this.db) return;

    // Table for caching indicator data
    // Compound primary key on country, indicator, year to ensure uniqueness
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS indicators (
        country_code TEXT,
        indicator_code TEXT,
        year INTEGER,
        value REAL,
        fetched_at INTEGER,
        PRIMARY KEY (country_code, indicator_code, year)
      )
    `);

    // Table for configuration (e.g. channel IDs, active mode)
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS config (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `);

    // Table for subscriptions
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        guild_id TEXT NOT NULL,
        country TEXT NOT NULL,
        indicator TEXT NOT NULL,
        threshold REAL NOT NULL,
        period TEXT NOT NULL,
        direction TEXT NOT NULL,
        channel_id TEXT NOT NULL,
        cooldown_min INTEGER NOT NULL,
        created_at INTEGER NOT NULL
      )
    `);
    
    // Index for faster lookups
    await this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_indicators_lookup 
      ON indicators(indicator_code, country_code);
    `);

    await this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_subscriptions_lookup
      ON subscriptions(guild_id, user_id, indicator, country);
    `);
  }

  static async getDb(): Promise<Database> {
    if (!this.db) {
      await this.initialize();
    }
    return this.db!;
  }
}
