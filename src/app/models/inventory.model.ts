import { Rarity } from './component-type.model';

export interface InventoryEntry {
  ingredientId: string;
  quantity: number;
}

export interface HarvestStockEntry {
  harvestComponentId: string;
  quantity: number;
}

export type EssenceStock = Record<Rarity, number>;
