import { DatabaseService } from './database';
import { Subscription } from '../types';

export type CreateSubscriptionInput = {
  userId: string;
  guildId: string;
  country: string;
  indicator: string;
  threshold: number;
  period: string;
  direction: string;
  channelId: string;
  cooldownMin: number;
};

export class SubscriptionsService {
  static async create(input: CreateSubscriptionInput): Promise<number> {
    const db = await DatabaseService.getDb();
    const result = await db.run(
      `INSERT INTO subscriptions (
        user_id, guild_id, country, indicator, threshold,
        period, direction, channel_id, cooldown_min, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
      input.userId,
      input.guildId,
      input.country,
      input.indicator,
      input.threshold,
      input.period,
      input.direction,
      input.channelId,
      input.cooldownMin,
      Date.now()
    );

    return result.lastID ?? 0;
  }

  static async listByUser(guildId: string, userId: string): Promise<Subscription[]> {
    const db = await DatabaseService.getDb();
    const rows = await db.all<any[]>(
      `SELECT id, user_id, guild_id, country, indicator, threshold, period,
        direction, channel_id, cooldown_min, created_at
       FROM subscriptions
       WHERE guild_id = ? AND user_id = ?
       ORDER BY created_at DESC`,
      guildId,
      userId
    );

    return rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      guildId: row.guild_id,
      country: row.country,
      indicator: row.indicator,
      threshold: row.threshold,
      period: row.period,
      direction: row.direction,
      channelId: row.channel_id,
      cooldownMin: row.cooldown_min,
      createdAt: row.created_at
    }));
  }

  static async removeByDraft(guildId: string, userId: string, country: string, indicator: string): Promise<number> {
    const db = await DatabaseService.getDb();
    const result = await db.run(
      `DELETE FROM subscriptions
       WHERE guild_id = ? AND user_id = ? AND country = ? AND indicator = ?`,
      guildId,
      userId,
      country,
      indicator
    );

    return result.changes ?? 0;
  }
}
