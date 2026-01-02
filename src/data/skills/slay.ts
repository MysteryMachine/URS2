import type { Skill } from '@site/src/types';

export const slay: Skill = {
  id: 'slay',
  name: 'Slay',
  clause: 'attacking something with a melee weapon',
  subclauses: [
    'if it is completely defenseless to your attack, and unaware of your presence, kill it. a target might not count as defenseless due to being too large or powerful. your storyteller will tell you if your strike as lethal.',
    'if it is alert but not capable of defending itself from your attack, roll your weapon\'s damage die',
    'if is capable of defending itself, the storyteller will tell you how it attempts to defend itself. you may attempt to use another skill to bypass its defenses. if you succeed, roll your weapon\'s damage die',
  ],
};
