import type { CharacterStats, DerivedStats } from './stats';
import type { Skill } from './skill';
import type { Item, EquipmentSlots } from './item';
import type { Background, Experience } from './bonus';

// Complete character
export interface Character {
  name: string;
  description: string; // Character description
  biography: string; // Character biography/story
  relations: string; // Relations with other characters
  notes: string; // Additional notes
  stats: CharacterStats;
  derivedStats: DerivedStats;
  background: Background | null;
  experiences: Experience[];
  skills: Skill[];
  items: Item[]; // Inventory
  equipment: EquipmentSlots; // Equipped items
  freeStatPoints: number; // Remaining points from initial 8
}
