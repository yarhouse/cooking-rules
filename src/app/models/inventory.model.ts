import { Rarity } from './component-type.model';
import { MonsterRarity } from './monster.model';

export interface InventoryEntry {
  ingredientId: string;
  quantity: number;
}

export interface HarvestStockEntry {
  harvestComponentId: string;
  rarity: MonsterRarity;
  quantity: number;
}

export type EssenceStock = Record<Rarity, number>;
