---
sidebar_position: 3
---

import SkillCard from '@site/src/components/SkillCard';

# Skills

All Skill rolls in URS are 2d6 rolls. This means you roll 2 six-sided die. Skill rolls also usually include a stat bonus. When a Skill has a stat bonus, you add your score to your roll. For example, consider the following character.

<div style={{ marginLeft: "24px" }}>
**POW** +2<br />
**PRE** +0<br />
**CON** -2<br />
**WIT** +1<br />
**WIL** -1<br />
</div>

If a roll was tagged as **2d6+POW**, you would roll 2 six-sided die, and then add your power. Assume one die rolled a 5 and the other a 1. The result would be 5 + 1 + 2, for a total of 8. Negative numbers also apply, so if that same roll was tagged **2d6+CON**, and you rolled a 5 and a 1, the total would be 5 + 1 - 2 for a total of 4.

Rolls can also involve multiple stats. A roll marked as **2d6+WIT/WIL** requires both your Wit and Willpower scores to be added to the roll. Assume you rolled a 5 and a 1. The result would be 5 + 1 + 1 - 1 for a total of 6.

Any action that involves a roll follows the following rules.

<div style={{ marginLeft: "24px" }}>
**On a 10+** the roll succeeds.<br />
**On a 7-9** the roll succeeds, but there is a complication or catch. <br />
**Otherwise** the roll fails. You suffer a consequence.
</div>

## Improvise

Improvise is the action you'll be using most regularly in the game. Whenever you attempt an to do something unfamiliar or unpracticed under duress, meaning there are consequences for failing the action, your Storyteller will usually tell you to roll Improvise. Actions that are well practiced or that are done under relaxed conditions do not need a roll. Actions that are impossible do not need a roll, the Storyteller just informs the player that they have failed or that their character decides the action does not seem possible. Multi-step actions might require additional Improvise rolls.

An Improvise roll can have zero to three additional stats added to the roll, as determined by the Storyteller. For example, if a player is attempting to catch a small fast-moving heavy object, the Storyteller might rule that they have to roll **2d6+POW/PRE/WIL**, the Power score being added to account for the power the character would have to exert to stop the object, the Precision score being added to account for the precise hand movement required to catch the object, and the Willpower being added to account for the difficulty of percieving a small fast movign object.

<SkillCard id="improvise" />

## Slay

<SkillCard id="slay" />