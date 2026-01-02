import type { Skill } from '@site/src/types';

const description = 
`Each day of travel costs 1 Ration and 1 liter of Water. Under normal conditions, a small group is capable of
traveling 15 kilometers per day. If the party finds themselves foodless or waterless, they may have to hunt for food
and water. Each day spent traveling or camping without food incurs **1d4** of damage.`

const subclauses = [
`If the group chooses to march leisurely, reduce traveling speed by 5 kilometers per day. Recover **1d4** of damage per
day spent leisurely traveling.`,
`If the group chooses to force march, increase traveling speed by 5 kilometers per day. Take **1d4** of damage per day
spent force marching.`,
`If the group is traveling on well maintained roads, increase traveling speed by 10 kilometers per day.`,
`If the group is traveling in the wilds, reduce traveling speed by 10 kilometers per day.`,
`If the group is traveling in arid conditions, increase the daily water water consumption by 1 liter.`,
`If the group is traveling on horseback, double travel speed. A horse per person is required, and the group consumes 2
extra Rations per day.`
]

export const travel: Skill = {
  id: 'travel',
  name: 'Travel',
  clause: 'traveling long distances',
  description,
  subclauses,
};
