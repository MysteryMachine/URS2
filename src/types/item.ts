// Item definition
export interface Item {
  id: string;
  name: string;
  description: string;
  defence: number;
  reach: number;
  dice: string; // e.g., "1d8", "2d6"
  hands: 1 | 2; // 1-handed or 2-handed
  isArmor: boolean;
}

// Equipment slots
export interface EquipmentSlots {
  armor: Item | null;
  leftHand: Item | null;
  rightHand: Item | null;
  accessories: Item[];
}
