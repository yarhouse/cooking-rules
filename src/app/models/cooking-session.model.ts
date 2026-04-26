import { ComponentTypeName } from './component-type.model';
import { MonsterRarity } from './monster.model';

/** A cooking quirk rolled when the cook check margin is ≥5 (boon) or <0 (flaw).
 *  Shared between `CookSessionComponent` and `RulesComponent` (quirk reference tables). */
export interface CookingQuirk {
  roll: number;
  name: string;
  type: 'flaw' | 'boon';
  effect: string;
}

/** A single stock item displayed in the ingredient-detail panel of the cook session. */
export interface StockItem {
  name: string;
  creatureTypeName: string;
  rarity: MonsterRarity | null;
  /** Flavor description of the effect. */
  effectDesc: string;
  /** Rarity-scaled mechanical effect text. */
  scalingText: string;
  qty: number;
}

/** Aggregated stock information for one component-type slot in the selected recipe.
 *  Drives the ingredient-detail panel (step 1 of the cook session). */
export interface SlotDetail {
  componentTypeId: ComponentTypeName;
  componentTypeName: string;
  componentTypeDescription: string;
  slotsNeeded: number;
  totalInStock: number;
  items: StockItem[];
  /** Set when this slot requires a specific named ingredient. */
  ingredientId?: string;
}

/** A unified cooking ingredient candidate for a recipe slot.
 *
 *  `isUnique = true`  → named `Ingredient`; deduct via `InventoryService.updateQuantity`.
 *  `isUnique = false` → `HarvestComponent`; deduct via `InventoryService.updateHarvestQuantity`.
 *  The compound key `"componentId:rarity"` is used as `id` for harvest candidates. */
export interface CookingCandidate {
  id: string;
  componentId: string;
  name: string;
  componentTypeId: ComponentTypeName;
  creatureTypeId: string;
  creatureTypeName: string;
  isUnique: boolean;
  rarity: MonsterRarity | null;
  qty: number;
  effectText: string;
  effectDescription: string;
  hasEffect: boolean;
  isSelected: boolean;
  available: boolean;
}

/** One fully resolved ingredient slot, ready for display in the assignment step. */
export interface ResolvedSlot {
  slotIndex: number;
  componentTypeId: ComponentTypeName;
  componentTypeName: string;
  componentTypeDescription: string;
  specificIngredientId?: string;
  selectedId: string | null;
  candidates: CookingCandidate[];
}

/** Ingredient row shown in the results panel after a successful cook. */
export interface ResultIngredient {
  id: string;
  name: string;
  effectText: string;
  creatureTypeName: string;
  componentTypeName: string;
  rarity: MonsterRarity | null;
  hasEffect: boolean;
}
