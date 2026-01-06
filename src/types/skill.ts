import type { StatName } from './stats';

// Skill definition (template/database entry)
export interface Skill {
  id: string;
  name: string;
  clause?: string; // e.g., "attacking something violently in melee range"
  description?: string;
  success?: string;
  failure?: string;
  partialSuccess?: string;
  subclauses?: string[]; // Alternative to success/partial/failure - list of sub-conditions
  roll?: StatName[]; // Stats to add for this skill roll (undefined if skill has no roll)
  storytellerDeterminesBonuses?: boolean; // If true, Storyteller determines which stats to add
  statOptions?: StatName[]; // For skills where player chooses which stat to use (e.g., Volley can be POW, PRE, or WIL)
  limitStatOptions?: number; // How many stats can be chosen from statOptions (default 1, e.g., 3 for Duel+)
  prompts?: string[]; // Questions the player must answer (e.g., "What environment are you used to surviving in?")
}

// Skill instance on a character (with choices made)
export interface CharacterSkill {
  skillId: string;
  chosenStat?: StatName;  // For skills with statOptions where you pick 1
  chosenStats?: StatName[];  // For skills where you pick multiple stats (e.g., Duel+)
  promptAnswers?: Record<string, string>;  // Answers to skill prompts, keyed by prompt text
}
