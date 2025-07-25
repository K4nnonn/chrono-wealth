export type Tier = 'Free' | 'Core' | 'Plus' | 'Pro' | 'Advisory';

export const tiersRank: Record<Tier, number> = {
  Free: 0,
  Core: 1,
  Plus: 2,
  Pro: 3,
  Advisory: 4,
};
