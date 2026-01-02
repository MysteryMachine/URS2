// Base stat names
export type StatName = 'POW' | 'PRE' | 'CON' | 'WIT' | 'WIL';

// Skill definition
export interface Skill {
  id: string;
  description: string;
  success: string;
  failure: string;
  partialSuccess: string;
  roll: StatName[]; // Stats to add for this skill roll
}

// Item definition
export interface Item {
  id: string;
  name: string;
  description: string;
  defence: number;
  reach: number;
  dice: string; // e.g., "1d8", "2d6"
  hands: 1 | 2; // 1-handed or 2-handed
  isArmor: boolean;
}

// Equipment slots
export interface EquipmentSlots {
  armor: Item | null;
  leftHand: Item | null;
  rightHand: Item | null;
  accessories: Item[];
}

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

// Character stats
export interface CharacterStats {
  POW: number;
  PRE: number;
  CON: number;
  WIT: number;
  WIL: number;
}

// Derived stats
export interface DerivedStats {
  hp: number;
  maxHp: number;
  wp: number;
  maxWp: number;
  carryCapacity: number;
  defence: number;
}

// Complete character
export interface Character {
  name: string;
  stats: CharacterStats;
  derivedStats: DerivedStats;
  background: Background | null;
  experiences: Experience[];
  skills: Skill[];
  items: Item[]; // Inventory
  equipment: EquipmentSlots; // Equipped items
  freeStatPoints: number; // Remaining points from initial 8
}

// Roll result for 2d6 system
export interface RollResult {
  die1: number;
  die2: number;
  modifier: number;
  total: number;
  statName: StatName;
}
