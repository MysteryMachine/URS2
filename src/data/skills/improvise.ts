import type { Skill } from '@site/src/types';

export const improvise: Skill = {
  id: 'improvise',
  name: 'Improvise',
  clause: 'attempting to do something unfamiliar or unpracticed under duress',
  description: '',
  roll: [],
  storytellerDeterminesBonuses: true,
  success: 'You succeed at your improvised action.',
  partialSuccess: 'You succeed, but there is a complication or cost.',
  failure: 'You fail, and the Storyteller determines the consequences.',
};
