import type { Skill } from '@site/src/types/character';
import { improvise } from './skills/improvise';
import { slay } from './skills/slay';

// Skills database - maps skill IDs to skill definitions
export const SKILLS_DB: Record<string, Skill> = {
  'improvise': improvise,
  'slay': slay,
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
