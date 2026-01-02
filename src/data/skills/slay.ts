import type { Skill } from '@site/src/types';

export const slay: Skill = {
  id: 'slay',
  name: 'Slay',
  clause: 'attacking something with a melee weapon with deadly intent',
  subclauses: [
    'If your target is completely defenseless to your attack, and unaware of your presence, kill it. ' +
      'A target might not count as defenseless due to being too large or powerful. ' + 
      'The Storyteller will tell you if your strike is lethal.',
    'If your target is alert but not capable of defending itself from your attack, roll your weapon\'s damage die and deal damage to the creature equal to it.',
    'If your target is capable of defending itself, the Storyteller will tell you how it attempts to defend itself. ' + 
      'You may attempt to bypass its defenses. If you succeed, roll your weapon\'s damage die and deal damage to the creature equal to it..',
  ],
};
