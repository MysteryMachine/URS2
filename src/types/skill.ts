import type { StatName } from './stats';

// Skill definition
export interface Skill {
  id: string;
  name: string;
  clause: string; // e.g., "attacking something violently in melee range"
  description?: string;
  success?: string;
  failure?: string;
  partialSuccess?: string;
  subclauses?: string[]; // Alternative to success/partial/failure - list of sub-conditions
  roll?: StatName[]; // Stats to add for this skill roll (undefined if skill has no roll)
  storytellerDeterminesBonuses?: boolean; // If true, Storyteller determines which stats to add
}
