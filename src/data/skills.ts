import type { Skill } from '@site/src/types';
import { improvise } from './skills/improvise';
import { slay } from './skills/slay';
import { travel } from './skills/travel';
import { restAndPrepare } from './skills/rest-and-prepare';
import { volley } from './skills/volley';
import { wildernessSurvival } from './skills/wilderness-survival';
import { leatherworking } from './skills/leatherworking';
import { trapping } from './skills/trapping';
import { duel } from './skills/duel';
import { duelPlus } from './skills/duel-plus';
import { duelPlusPlus } from './skills/duel-plus-plus';

// Skills database - maps skill IDs to skill definitions
export const SKILLS_DB: Record<string, Skill> = {
  improvise,
  slay,
  travel,
  'rest-and-prepare': restAndPrepare,
  volley,
  'wilderness-survival': wildernessSurvival,
  leatherworking,
  trapping,
  duel,
  'duel-plus': duelPlus,
  'duel-plus-plus': duelPlusPlus,
};

// Helper function to get a skill by ID
export function getSkill(id: string): Skill | undefined {
  return SKILLS_DB[id];
}

// Helper function to format roll information
export function formatSkillRoll(skill: Skill): string {
  if (skill.storytellerDeterminesBonuses) {
    return '2d6 + up to 3 scores determined by the Storyteller';
  }

  if (!skill.roll || skill.roll.length === 0) {
    return '2d6';
  }

  if (skill.roll.length === 1) {
    return `2d6+${skill.roll[0]}`;
  }

  return `2d6+${skill.roll.join('/')}`;
}
