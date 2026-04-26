import { Rarity } from './component-type.model';
import { MonsterRarity } from './monster.model';

/** A single ingredient stack in the player's inventory.
 *  Persisted to `localStorage` by `InventoryService`.
 *  Looked up via `InventoryService.inventoryMap` (keyed by `ingredientId`). */
export interface InventoryEntry {
  ingredientId: string;
  quantity: number;
}

/** A rarity-keyed stock entry for a harvested monster component.
 *  The same physical part harvested from different rarity monsters (e.g. common
 *  vs. rare Zombie flesh) is tracked separately so rarity-scaled effects remain
 *  available for crafting.
 *
 *  Persisted to `localStorage` by `InventoryService`.
 *  Looked up via `InventoryService.harvestStockMap` using the composite key
 *  `"{harvestComponentId}:{rarity}"`. */
export interface HarvestStockEntry {
  harvestComponentId: string;
  /** The monster rarity the component was harvested from. Determines which
   *  `RarityScaling` tier applies when the component is used in a recipe. */
  rarity: MonsterRarity;
  quantity: number;
}

/** Tracks loose essence by rarity tier, used as a crafting material for
 *  magic items whose `essenceType` matches a rarity key.
 *  Persisted to `localStorage` by `InventoryService.essence`.
 *  Checked by `CookingDataService.isMagicItemCraftable`. */
export type EssenceStock = Record<Rarity, number>;
