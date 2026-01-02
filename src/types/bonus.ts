import type { StatName } from './stats';

// Bonus system using discriminated union
export type Bonus =
  | { type: 'stat'; isSupernatural: boolean; id: StatName; amount: number }
  | { type: 'skill'; isSupernatural: boolean; id: string; amount: number }
  | { type: 'item'; isSupernatural: boolean; id: string; amount: number }
  | { type: 'option'; options: Bonus[] };

// Background (no requirement)
export interface Background {
  id: string;
  description: string;
  bonuses: Bonus[];
}

// Experience (has requirement)
export interface Experience {
  id: string;
  description: string;
  requirement: string;
  bonuses: Bonus[];
}
