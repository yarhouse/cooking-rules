import { Injectable, signal, computed } from '@angular/core';
import { InventoryEntry, HarvestStockEntry, EssenceStock } from '../models/inventory.model';
import { Monster, MonsterRarity } from '../models/monster.model';
import { Ingredient } from '../models/ingredient.model';
import { Recipe } from '../models/recipe.model';
import { Rarity } from '../models/component-type.model';
import { MagicItem } from '../models/magic-item.model';
import { HarvestComponent } from '../models/harvest-component.model';

/** `localStorage` keys used by this service. All keys are prefixed with
 *  `'cooking-rules:'` to avoid collisions with other apps on the same origin. */
const STORAGE_KEYS = {
  inventory: 'cooking-rules:inventory',
  essence: 'cooking-rules:essence',
  harvestStock: 'cooking-rules:harvest-stock',
  customMonsters: 'cooking-rules:custom-monsters',
  customRecipes: 'cooking-rules:custom-recipes',
  customIngredients: 'cooking-rules:custom-ingredients',
  effectOverrides: 'cooking-rules:effect-overrides',
} as const;

const DEFAULT_ESSENCE: EssenceStock = {
  uncommon: 0,
  rare: 0,
  'very-rare': 0,
  legendary: 0,
  artifact: 0,
};

/** Sorted from lowest to highest rarity. `craftMagicItem` deducts from the
 *  lowest tier first so rare components are preserved. */
const HARVEST_RARITY_ORDER: MonsterRarity[] = ['common', 'uncommon', 'rare', 'very-rare', 'legendary'];

/** Builds the composite key used in `harvestStockMap`. */
function harvestKey(id: string, rarity: MonsterRarity): string {
  return `${id}:${rarity}`;
}

/** Maps `MagicItem.essenceType` strings to `Rarity` keys used in `EssenceStock`. */
const ESSENCE_RARITY_MAP: Record<string, Rarity> = {
  Frail: 'uncommon',
  Robust: 'rare',
  Potent: 'very-rare',
  Mythic: 'legendary',
  Deific: 'artifact',
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Manages all mutable player state — ingredient inventory, essence stock,
 * harvested components, and user-created custom entities.
 *
 * ## Persistence
 * Every writable signal is backed by `localStorage`. Reads happen on
 * construction; writes happen immediately on every mutation method.
 * There is no debounce — each call to `updateQuantity`, `setEssence`, etc.
 * writes synchronously.
 *
 * ## Custom entities
 * `customMonsters`, `customRecipes`, and `customIngredients` hold entities
 * the player created in-session using the static build (no API). They are
 * merged into `CookingDataService` getters so they appear throughout the UI.
 * In the API build, entity creation goes through `CookingCreateService` and
 * these signals remain empty.
 *
 * ## Effect overrides
 * `effectOverrides` stores house-rule text keyed by `"{componentTypeId}:{creatureTypeId}"`.
 * Overrides shadow the rulebook effect descriptions shown in `RulesComponent`.
 */
@Injectable({ providedIn: 'root' })
export class InventoryService {

  // ── Writable signals — each backed by a localStorage key ─────────────────

  /** Named ingredient inventory. Persisted to `STORAGE_KEYS.inventory`.
   *  Read by `InventoryComponent` and the Recipe Builder.
   *  Mutated via `updateQuantity` / `setQuantity`. */
  readonly inventory = signal<InventoryEntry[]>(
    loadFromStorage(STORAGE_KEYS.inventory, [])
  );

  /** Loose essence stock by rarity tier. Persisted to `STORAGE_KEYS.essence`.
   *  Checked by `CookingDataService.isMagicItemCraftable`.
   *  Mutated via `setEssence` / `adjustEssence`. */
  readonly essence = signal<EssenceStock>({
    ...DEFAULT_ESSENCE,
    ...loadFromStorage<Partial<EssenceStock>>(STORAGE_KEYS.essence, {}),
  });

  /** User-created monsters for the static build. Persisted to `STORAGE_KEYS.customMonsters`.
   *  Merged into `CookingDataService.getMonsters()`. Empty in API builds. */
  readonly customMonsters = signal<Monster[]>(
    loadFromStorage(STORAGE_KEYS.customMonsters, [])
  );

  /** User-created recipes for the static build. Persisted to `STORAGE_KEYS.customRecipes`.
   *  Merged into `CookingDataService.getRecipes()`. Empty in API builds. */
  readonly customRecipes = signal<Recipe[]>(
    loadFromStorage(STORAGE_KEYS.customRecipes, [])
  );

  /** User-created ingredients for the static build. Persisted to `STORAGE_KEYS.customIngredients`.
   *  Merged into `CookingDataService.getIngredients()`. Empty in API builds. */
  readonly customIngredients = signal<Ingredient[]>(
    loadFromStorage(STORAGE_KEYS.customIngredients, [])
  );

  /** House-rule effect text overrides. Key: `"{componentTypeId}:{creatureTypeId}"`.
   *  Persisted to `STORAGE_KEYS.effectOverrides`.
   *  Read by `RulesComponent` via `getEffectOverride`. */
  readonly effectOverrides = signal<Record<string, string>>(
    loadFromStorage(STORAGE_KEYS.effectOverrides, {})
  );

  /** Harvested component stock, keyed by component ID + rarity (separate entries
   *  per rarity so the cooking builder can apply rarity-scaled effects).
   *  Persisted to `STORAGE_KEYS.harvestStock`.
   *  Mutated via `updateHarvestQuantity` / `setHarvestQuantity`. */
  readonly harvestStock = signal<HarvestStockEntry[]>(
    loadFromStorage(STORAGE_KEYS.harvestStock, [])
  );

  // ── Derived (computed) signals ────────────────────────────────────────────

  /** Rarity-specific harvest lookup. Key: `"{harvestComponentId}:{rarity}"`.
   *  Use this when you need to know the exact rarity tier of a component (e.g.
   *  displaying per-rarity quantities in `InventoryComponent`).
   *  Re-evaluated whenever `harvestStock` changes. */
  readonly harvestStockMap = computed(() =>
    new Map(this.harvestStock().map(e => [harvestKey(e.harvestComponentId, e.rarity), e.quantity]))
  );

  /** Total quantity across all rarity tiers for each harvest component.
   *  Key: `harvestComponentId`. Use this for craftability checks where rarity
   *  doesn't matter (e.g. `CookingDataService.isMagicItemCraftable`).
   *  Re-evaluated whenever `harvestStock` changes. */
  readonly harvestTotalMap = computed(() => {
    const totals = new Map<string, number>();
    for (const e of this.harvestStock()) {
      totals.set(e.harvestComponentId, (totals.get(e.harvestComponentId) ?? 0) + e.quantity);
    }
    return totals;
  });

  /** Ingredient inventory as a keyed map for O(1) lookups.
   *  Key: `ingredientId`. Consumed by `getQuantity` and `hasIngredient`.
   *  Re-evaluated whenever `inventory` changes. */
  readonly inventoryMap = computed(() =>
    new Map(this.inventory().map(e => [e.ingredientId, e.quantity]))
  );

  // ── Ingredient inventory ──────────────────────────────────────────────────

  /**
   * @param ingredientId - `Ingredient.id`
   * @returns Current quantity in stock, or `0`
   */
  getQuantity(ingredientId: string): number {
    return this.inventoryMap().get(ingredientId) ?? 0;
  }

  /**
   * @param ingredientId - `Ingredient.id`
   * @returns `true` if at least one unit is in stock
   */
  hasIngredient(ingredientId: string): boolean {
    return this.getQuantity(ingredientId) > 0;
  }

  /**
   * Adjusts the quantity of an ingredient by a relative delta.
   * Clamps to zero — will not go negative. Removes the entry entirely when
   * quantity reaches zero.
   *
   * @param ingredientId - `Ingredient.id`
   * @param delta - Amount to add (positive) or remove (negative)
   */
  updateQuantity(ingredientId: string, delta: number): void {
    const current = this.inventory();
    const idx = current.findIndex(e => e.ingredientId === ingredientId);
    let next: InventoryEntry[];

    if (idx === -1) {
      next = delta > 0 ? [...current, { ingredientId, quantity: delta }] : current;
    } else {
      const newQty = Math.max(0, current[idx].quantity + delta);
      next = newQty === 0
        ? current.filter((_, i) => i !== idx)
        : current.map((e, i) => i === idx ? { ...e, quantity: newQty } : e);
    }

    this.inventory.set(next);
    saveToStorage(STORAGE_KEYS.inventory, next);
  }

  /**
   * Sets the quantity of an ingredient to an absolute value.
   * Removes the entry when `quantity <= 0`.
   *
   * @param ingredientId - `Ingredient.id`
   * @param quantity - Target quantity (will be removed if ≤ 0)
   */
  setQuantity(ingredientId: string, quantity: number): void {
    const current = this.inventory();
    const idx = current.findIndex(e => e.ingredientId === ingredientId);
    let next: InventoryEntry[];

    if (quantity <= 0) {
      next = current.filter(e => e.ingredientId !== ingredientId);
    } else if (idx === -1) {
      next = [...current, { ingredientId, quantity }];
    } else {
      next = current.map(e => e.ingredientId === ingredientId ? { ...e, quantity } : e);
    }

    this.inventory.set(next);
    saveToStorage(STORAGE_KEYS.inventory, next);
  }

  // ── Essence ───────────────────────────────────────────────────────────────

  /**
   * Sets the essence count for a rarity tier. Clamps to zero.
   * @param rarity - `Rarity` key (e.g. `'uncommon'`, `'legendary'`)
   * @param value - New absolute quantity
   */
  setEssence(rarity: Rarity, value: number): void {
    const next = { ...this.essence(), [rarity]: Math.max(0, value) };
    this.essence.set(next);
    saveToStorage(STORAGE_KEYS.essence, next);
  }

  /**
   * Adjusts the essence count for a rarity tier by a relative delta.
   * @param rarity - `Rarity` key
   * @param delta - Amount to add (positive) or remove (negative)
   */
  adjustEssence(rarity: Rarity, delta: number): void {
    this.setEssence(rarity, (this.essence()[rarity] ?? 0) + delta);
  }

  // ── Harvest Stock ─────────────────────────────────────────────────────────

  /**
   * @param harvestComponentId - `HarvestComponent.id`
   * @param rarity - The monster rarity the component was harvested from
   * @returns Quantity for that specific component × rarity combination, or `0`
   */
  getHarvestQuantity(harvestComponentId: string, rarity: MonsterRarity): number {
    return this.harvestStockMap().get(harvestKey(harvestComponentId, rarity)) ?? 0;
  }

  /**
   * @param harvestComponentId - `HarvestComponent.id`
   * @returns Total quantity across all rarity tiers, or `0`
   */
  getTotalHarvestQuantity(harvestComponentId: string): number {
    return this.harvestTotalMap().get(harvestComponentId) ?? 0;
  }

  /**
   * Adjusts the harvest stock for a component × rarity pair by a relative delta.
   * Clamps to zero; removes the entry at zero.
   *
   * @param harvestComponentId - `HarvestComponent.id`
   * @param rarity - The rarity tier to adjust
   * @param delta - Amount to add (positive) or remove (negative)
   */
  updateHarvestQuantity(harvestComponentId: string, rarity: MonsterRarity, delta: number): void {
    const current = this.harvestStock();
    const idx = current.findIndex(e => e.harvestComponentId === harvestComponentId && e.rarity === rarity);
    let next: HarvestStockEntry[];

    if (idx === -1) {
      next = delta > 0 ? [...current, { harvestComponentId, rarity, quantity: delta }] : current;
    } else {
      const newQty = Math.max(0, current[idx].quantity + delta);
      next = newQty === 0
        ? current.filter((_, i) => i !== idx)
        : current.map((e, i) => i === idx ? { ...e, quantity: newQty } : e);
    }

    this.harvestStock.set(next);
    saveToStorage(STORAGE_KEYS.harvestStock, next);
  }

  /**
   * Sets the harvest stock for a component × rarity pair to an absolute value.
   * Removes the entry when `quantity <= 0`.
   *
   * @param harvestComponentId - `HarvestComponent.id`
   * @param rarity - The rarity tier to set
   * @param quantity - Target quantity (removed if ≤ 0)
   */
  setHarvestQuantity(harvestComponentId: string, rarity: MonsterRarity, quantity: number): void {
    const current = this.harvestStock();
    let next: HarvestStockEntry[];

    if (quantity <= 0) {
      next = current.filter(e => !(e.harvestComponentId === harvestComponentId && e.rarity === rarity));
    } else {
      const idx = current.findIndex(e => e.harvestComponentId === harvestComponentId && e.rarity === rarity);
      next = idx === -1
        ? [...current, { harvestComponentId, rarity, quantity }]
        : current.map(e => e.harvestComponentId === harvestComponentId && e.rarity === rarity ? { ...e, quantity } : e);
    }

    this.harvestStock.set(next);
    saveToStorage(STORAGE_KEYS.harvestStock, next);
  }

  /**
   * Deducts the component and essence requirements of a magic item from stock
   * and saves the updated state to `localStorage`.
   *
   * Components are deducted starting from the lowest rarity tier (`HARVEST_RARITY_ORDER`)
   * to preserve rare material. Does not check craftability first — callers should
   * gate this on `CookingDataService.isMagicItemCraftable` before calling.
   *
   * @param item - The magic item being crafted
   * @param allHarvestComponents - Full `HarvestComponent[]` array from `CookingDataService`
   *   (needed to resolve component IDs from the item's `componentName` strings)
   */
  craftMagicItem(item: MagicItem, allHarvestComponents: HarvestComponent[]): void {
    for (const req of item.components) {
      const matching = allHarvestComponents.filter(
        hc => hc.creatureTypeId === req.creatureTypeId &&
              hc.name.toLowerCase() === req.componentName.toLowerCase()
      );
      let remaining = req.quantity;
      for (const hc of matching) {
        for (const rarity of HARVEST_RARITY_ORDER) {
          if (remaining <= 0) break;
          const available = this.getHarvestQuantity(hc.id, rarity);
          const deduct = Math.min(available, remaining);
          if (deduct > 0) {
            this.updateHarvestQuantity(hc.id, rarity, -deduct);
            remaining -= deduct;
          }
        }
        if (remaining <= 0) break;
      }
    }
    if (item.essenceType) {
      const rarity = ESSENCE_RARITY_MAP[item.essenceType];
      if (rarity) this.adjustEssence(rarity, -1);
    }
  }

  // ── Effect Overrides (house rules) ────────────────────────────────────────

  /**
   * Returns the house-rule override text for a component × creature pairing,
   * or `null` if no override exists. Consumed by `RulesComponent` to shadow
   * the rulebook description.
   *
   * @param componentTypeId - `ComponentTypeName`
   * @param creatureTypeId - `CreatureType.id`
   */
  getEffectOverride(componentTypeId: string, creatureTypeId: string): string | null {
    return this.effectOverrides()[`${componentTypeId}:${creatureTypeId}`] ?? null;
  }

  /**
   * Saves a house-rule override for a component × creature pairing.
   * Persists immediately to `localStorage`.
   *
   * @param componentTypeId - `ComponentTypeName`
   * @param creatureTypeId - `CreatureType.id`
   * @param text - Replacement effect description
   */
  setEffectOverride(componentTypeId: string, creatureTypeId: string, text: string): void {
    const updated = { ...this.effectOverrides(), [`${componentTypeId}:${creatureTypeId}`]: text };
    this.effectOverrides.set(updated);
    saveToStorage(STORAGE_KEYS.effectOverrides, updated);
  }

  /**
   * Removes a house-rule override, restoring the rulebook description.
   * @param componentTypeId - `ComponentTypeName`
   * @param creatureTypeId - `CreatureType.id`
   */
  clearEffectOverride(componentTypeId: string, creatureTypeId: string): void {
    const updated = { ...this.effectOverrides() };
    delete updated[`${componentTypeId}:${creatureTypeId}`];
    this.effectOverrides.set(updated);
    saveToStorage(STORAGE_KEYS.effectOverrides, updated);
  }

  // ── Custom Entities ───────────────────────────────────────────────────────

  /** Appends a monster to `customMonsters` and persists. Stamps `isCustom: true`
   *  and `createdAt` (ISO 8601). */
  addCustomMonster(monster: Monster): void {
    const next = [...this.customMonsters(), { ...monster, isCustom: true, createdAt: new Date().toISOString() }];
    this.customMonsters.set(next);
    saveToStorage(STORAGE_KEYS.customMonsters, next);
  }

  /** Merges `updates` into the matching custom monster by ID. */
  updateCustomMonster(id: string, updates: Partial<Monster>): void {
    const next = this.customMonsters().map(m => m.id === id ? { ...m, ...updates } : m);
    this.customMonsters.set(next);
    saveToStorage(STORAGE_KEYS.customMonsters, next);
  }

  /** Removes the custom monster with the given ID. */
  deleteCustomMonster(id: string): void {
    const next = this.customMonsters().filter(m => m.id !== id);
    this.customMonsters.set(next);
    saveToStorage(STORAGE_KEYS.customMonsters, next);
  }

  /** Appends a recipe to `customRecipes` and persists. */
  addCustomRecipe(recipe: Recipe): void {
    const next = [...this.customRecipes(), { ...recipe, isCustom: true, createdAt: new Date().toISOString() }];
    this.customRecipes.set(next);
    saveToStorage(STORAGE_KEYS.customRecipes, next);
  }

  /** Merges `updates` into the matching custom recipe by ID. */
  updateCustomRecipe(id: string, updates: Partial<Recipe>): void {
    const next = this.customRecipes().map(r => r.id === id ? { ...r, ...updates } : r);
    this.customRecipes.set(next);
    saveToStorage(STORAGE_KEYS.customRecipes, next);
  }

  /** Removes the custom recipe with the given ID. */
  deleteCustomRecipe(id: string): void {
    const next = this.customRecipes().filter(r => r.id !== id);
    this.customRecipes.set(next);
    saveToStorage(STORAGE_KEYS.customRecipes, next);
  }

  /** Appends an ingredient to `customIngredients` and persists. */
  addCustomIngredient(ingredient: Ingredient): void {
    const next = [...this.customIngredients(), { ...ingredient, isCustom: true, createdAt: new Date().toISOString() }];
    this.customIngredients.set(next);
    saveToStorage(STORAGE_KEYS.customIngredients, next);
  }

  /** Merges `updates` into the matching custom ingredient by ID. */
  updateCustomIngredient(id: string, updates: Partial<Ingredient>): void {
    const next = this.customIngredients().map(i => i.id === id ? { ...i, ...updates } : i);
    this.customIngredients.set(next);
    saveToStorage(STORAGE_KEYS.customIngredients, next);
  }

  /** Removes the custom ingredient with the given ID. */
  deleteCustomIngredient(id: string): void {
    const next = this.customIngredients().filter(i => i.id !== id);
    this.customIngredients.set(next);
    saveToStorage(STORAGE_KEYS.customIngredients, next);
  }
}
