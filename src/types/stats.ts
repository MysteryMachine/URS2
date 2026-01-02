// Base stat names
export type StatName = 'POW' | 'PRE' | 'CON' | 'WIT' | 'WIL';

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
  speed: number;
}

// Roll result for 2d6 system
export interface RollResult {
  die1: number;
  die2: number;
  modifier: number;
  total: number;
  statName: StatName;
}
