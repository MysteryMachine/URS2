import type { StatName } from './stats';

// Item grant - used in item bonuses and bundles
export interface ItemGrant {
  id: string;
  amount: number;
}

// Bonus system using discriminated union
export type Bonus =
  | { type: 'stat'; isSupernatural: boolean; id: StatName; amount: number }
  | { type: 'skill'; isSupernatural: boolean; id: string; amount: number; statOptions?: StatName[]; limitStatOptions?: number }
  | { type: 'item'; items: ItemGrant[] }  // Can grant multiple items as a bundle
  | { type: 'option'; options: Bonus[]; choose?: number };  // choose defaults to 1

// Background (no requirement)
export interface Background {
  id: string;
  name: string;
  description: string;
  prompts?: string[];  // Roleplaying prompts like "Why did you leave?"
  bonuses: Bonus[];
}

// Experience (has requirement)
export interface Experience {
  id: string;
  name: string;
  description: string;
  requirement: string;
  bonuses: Bonus[];
}
