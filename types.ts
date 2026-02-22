export type AttributeKey = 'for' | 'des' | 'con' | 'int' | 'sab' | 'car';

export interface Attribute {
  value: number;
  modifier: number;
}

export interface Skill {
  name: string;
  attr: AttributeKey;
  proficient: boolean;
  expertise: boolean; // Double proficiency
}

export interface Attributes {
  for: Attribute;
  des: Attribute;
  con: Attribute;
  int: Attribute;
  sab: Attribute;
  car: Attribute;
}

export interface CharacterInfo {
  playerName: string;
  charName: string;
  origin: string;
  region: string;
  background: string;
  essence: string;
  classLevel: string;
  level: number;
  xp: string;
}

export interface Vitals {
  hpCurrent: string;
  hpMax: string;
  hpTemp: string;
  hitDice: string;
  hitDiceTotal: string;
  ac: number;
  initiative: number; // usually auto-calculated but can be overridden
  speed: string;
  proficiencyBonus: number;
  inspiration: boolean;
  passivePerception: number;
  passiveInsight: number;
}

export interface NamedBonus {
  id: string;
  name: string;
  value: number;
}

export interface Attack {
  id: string;
  name: string;
  description: string;
  
  // Attack Roll (Acerto)
  accAttr1: AttributeKey | 'none';
  accAttr2: AttributeKey | 'none';
  accProf: boolean;
  accBonuses: NamedBonus[];
 
  // Damage (Dano)
  dmgAttr1: AttributeKey | 'none';
  dmgAttr2: AttributeKey | 'none';
  dmgDice: string;
  dmgType: string;
  dmgBonuses: NamedBonus[];
}

export type SpellType = 'damage' | 'utility' | 'defense';

export interface Spell {
  id: string;
  name: string;
  description: string;
  type: SpellType;
  cycle: number;
  manaCost: number;
  
  // Logic Configuration (For DC, Attack, or Effect)
  attr1: AttributeKey | 'none';
  attr2: AttributeKey | 'none';
  hasProficiency: boolean;
  
  // Mode: 'attack' (Attack Roll) or 'save' (DC) - Only relevant for Damage/Utility
  castMode: 'attack' | 'save'; 
  
  bonuses: NamedBonus[]; // Bonuses for Hit/DC/AC

  // Damage / Effect Output
  effectDice: string; // "1d6" or flat value
  effectType: string; // "Fogo", "Cura", "CA"
  effectBonuses: NamedBonus[];
}

export type BonusType = 'none' | 'attack' | 'damage' | 'spellDC' | 'ac';
export type BonusSource = 'flat' | AttributeKey | 'prof';

export interface EquipmentEntry {
  id: string;
  title: string;
  description: string;
  isEquipped: boolean;
  bonusType: BonusType;
  bonusSource: BonusSource;
  bonusValue: number;
}

export interface ItemEntry {
  id: string;
  title: string;
  description: string;
}

export interface CharacterSheetData {
  info: CharacterInfo;
  attributes: Attributes;
  skills: Record<string, Skill>;
  vitals: Vitals;
  savingThrows: Record<AttributeKey, boolean>;
  attacks: Attack[];
  spells: Spell[]; 
  runes: string; 
  features: ItemEntry[];
  equipment: EquipmentEntry[];
  languages: ItemEntry[];
  proficiencies: ItemEntry[];
  notes: ItemEntry[];
  deathSaves: { success: number; failure: number };
  exhaustion: number;
  mana: { current: string; max: string };
  spellSaveDC: string; 
  spellAttack: string; 
  runeDC: string;
  runeAttack: string;
}

export interface RollResult {
  title: string;
  total: number;
  diceRolls: number[];
  modifier: number;
  isCrit: boolean;
  isFumble: boolean;
  formula: string;
}

export interface SavedCharacter {
  id: string;
  name: string;
  classLevel: string;
  date: string;
  data: CharacterSheetData;
}
