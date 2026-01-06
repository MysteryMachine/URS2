// Item definition
export interface Item {
  id: string;
  name: string;
  description: string;
  damage?: string;      // e.g., "1d4", "1d6"
  range?: number;       // in meters (for ranged weapons)
  defence?: number;     // armor defence value
  reach?: number;       // melee reach in meters
  hands?: 1 | 2;        // 1-handed or 2-handed
  isArmor?: boolean;
  isConsumable?: boolean;  // for rations, water, etc.
  quantity?: number;    // for stackable items like arrows
}

// Equipment slots
export interface EquipmentSlots {
  armor: Item | null;
  leftHand: Item | null;
  rightHand: Item | null;
  accessories: Item[];
}
