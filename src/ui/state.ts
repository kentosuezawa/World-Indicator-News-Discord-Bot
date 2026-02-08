export type DraftState = {
  country?: string;
  indicator?: string;
  period?: string;
  direction?: string;
  threshold?: number;
  channelId?: string;
  cooldownMin?: number;
  updatedAt: number;
};

const drafts = new Map<string, DraftState>();

const getKey = (guildId: string, userId: string) => `${guildId}:${userId}`;

export function getDraft(guildId: string, userId: string): DraftState {
  const key = getKey(guildId, userId);
  const existing = drafts.get(key);
  if (existing) {
    return existing;
  }

  const draft: DraftState = {
    period: '1y',
    direction: 'both',
    updatedAt: Date.now()
  };
  drafts.set(key, draft);
  return draft;
}

export function updateDraft(guildId: string, userId: string, update: Partial<DraftState>): DraftState {
  const draft = getDraft(guildId, userId);
  const next = { ...draft, ...update, updatedAt: Date.now() };
  drafts.set(getKey(guildId, userId), next);
  return next;
}

export function resetDraft(guildId: string, userId: string) {
  drafts.delete(getKey(guildId, userId));
}
