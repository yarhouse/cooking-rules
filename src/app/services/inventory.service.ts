import { Injectable, signal, computed } from '@angular/core';
import { InventoryEntry, HarvestStockEntry, EssenceStock } from '../models/inventory.model';
import { Monster } from '../models/monster.model';
import { Ingredient } from '../models/ingredient.model';
import { Recipe } from '../models/recipe.model';
import { Rarity } from '../models/component-type.model';
import { MagicItem } from '../models/magic-item.model';
import { HarvestComponent } from '../models/harvest-component.model';

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

@Injectable({ providedIn: 'root' })
export class InventoryService {
  // Writable signals backed by localStorage
  readonly inventory = signal<InventoryEntry[]>(
    loadFromStorage(STORAGE_KEYS.inventory, [])
  );
  readonly essence = signal<EssenceStock>({
    ...DEFAULT_ESSENCE,
    ...loadFromStorage<Partial<EssenceStock>>(STORAGE_KEYS.essence, {}),
  });
  readonly customMonsters = signal<Monster[]>(
    loadFromStorage(STORAGE_KEYS.customMonsters, [])
  );
  readonly customRecipes = signal<Recipe[]>(
    loadFromStorage(STORAGE_KEYS.customRecipes, [])
  );
  readonly customIngredients = signal<Ingredient[]>(
    loadFromStorage(STORAGE_KEYS.customIngredients, [])
  );

  readonly effectOverrides = signal<Record<string, string>>(
    loadFromStorage(STORAGE_KEYS.effectOverrides, {})
  );

  readonly harvestStock = signal<HarvestStockEntry[]>(
    loadFromStorage(STORAGE_KEYS.harvestStock, [])
  );

  // Derived
  readonly harvestStockMap = computed(() =>
    new Map(this.harvestStock().map(e => [e.harvestComponentId, e.quantity]))
  );

  readonly inventoryMap = computed(() =>
    new Map(this.inventory().map(e => [e.ingredientId, e.quantity]))
  );

  getQuantity(ingredientId: string): number {
    return this.inventoryMap().get(ingredientId) ?? 0;
  }

  hasIngredient(ingredientId: string): boolean {
    return this.getQuantity(ingredientId) > 0;
  }

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

  setEssence(rarity: Rarity, value: number): void {
    const next = { ...this.essence(), [rarity]: Math.max(0, value) };
    this.essence.set(next);
    saveToStorage(STORAGE_KEYS.essence, next);
  }

  adjustEssence(rarity: Rarity, delta: number): void {
    this.setEssence(rarity, (this.essence()[rarity] ?? 0) + delta);
  }

  // --- Harvest Stock ---

  getHarvestQuantity(harvestComponentId: string): number {
    return this.harvestStockMap().get(harvestComponentId) ?? 0;
  }

  updateHarvestQuantity(harvestComponentId: string, delta: number): void {
    const current = this.harvestStock();
    const idx = current.findIndex(e => e.harvestComponentId === harvestComponentId);
    let next: HarvestStockEntry[];

    if (idx === -1) {
      next = delta > 0 ? [...current, { harvestComponentId, quantity: delta }] : current;
    } else {
      const newQty = Math.max(0, current[idx].quantity + delta);
      next = newQty === 0
        ? current.filter((_, i) => i !== idx)
        : current.map((e, i) => i === idx ? { ...e, quantity: newQty } : e);
    }

    this.harvestStock.set(next);
    saveToStorage(STORAGE_KEYS.harvestStock, next);
  }

  setHarvestQuantity(harvestComponentId: string, quantity: number): void {
    const current = this.harvestStock();
    let next: HarvestStockEntry[];

    if (quantity <= 0) {
      next = current.filter(e => e.harvestComponentId !== harvestComponentId);
    } else {
      const idx = current.findIndex(e => e.harvestComponentId === harvestComponentId);
      next = idx === -1
        ? [...current, { harvestComponentId, quantity }]
        : current.map(e => e.harvestComponentId === harvestComponentId ? { ...e, quantity } : e);
    }

    this.harvestStock.set(next);
    saveToStorage(STORAGE_KEYS.harvestStock, next);
  }

  craftMagicItem(item: MagicItem, allHarvestComponents: HarvestComponent[]): void {
    for (const req of item.components) {
      const matching = allHarvestComponents.filter(
        hc => hc.creatureTypeId === req.creatureTypeId &&
              hc.name.toLowerCase() === req.componentName.toLowerCase()
      );
      let remaining = req.quantity;
      for (const hc of matching) {
        if (remaining <= 0) break;
        const available = this.getHarvestQuantity(hc.id);
        const deduct = Math.min(available, remaining);
        if (deduct > 0) {
          this.updateHarvestQuantity(hc.id, -deduct);
          remaining -= deduct;
        }
      }
    }
    if (item.essenceType) {
      const rarity = ESSENCE_RARITY_MAP[item.essenceType];
      if (rarity) this.adjustEssence(rarity, -1);
    }
  }

  // --- Effect Overrides (house rules) ---

  getEffectOverride(componentTypeId: string, creatureTypeId: string): string | null {
    return this.effectOverrides()[`${componentTypeId}:${creatureTypeId}`] ?? null;
  }

  setEffectOverride(componentTypeId: string, creatureTypeId: string, text: string): void {
    const updated = { ...this.effectOverrides(), [`${componentTypeId}:${creatureTypeId}`]: text };
    this.effectOverrides.set(updated);
    saveToStorage(STORAGE_KEYS.effectOverrides, updated);
  }

  clearEffectOverride(componentTypeId: string, creatureTypeId: string): void {
    const updated = { ...this.effectOverrides() };
    delete updated[`${componentTypeId}:${creatureTypeId}`];
    this.effectOverrides.set(updated);
    saveToStorage(STORAGE_KEYS.effectOverrides, updated);
  }

  // --- Custom Entities ---

  addCustomMonster(monster: Monster): void {
    const next = [...this.customMonsters(), { ...monster, isCustom: true, createdAt: new Date().toISOString() }];
    this.customMonsters.set(next);
    saveToStorage(STORAGE_KEYS.customMonsters, next);
  }

  updateCustomMonster(id: string, updates: Partial<Monster>): void {
    const next = this.customMonsters().map(m => m.id === id ? { ...m, ...updates } : m);
    this.customMonsters.set(next);
    saveToStorage(STORAGE_KEYS.customMonsters, next);
  }

  deleteCustomMonster(id: string): void {
    const next = this.customMonsters().filter(m => m.id !== id);
    this.customMonsters.set(next);
    saveToStorage(STORAGE_KEYS.customMonsters, next);
  }

  addCustomRecipe(recipe: Recipe): void {
    const next = [...this.customRecipes(), { ...recipe, isCustom: true, createdAt: new Date().toISOString() }];
    this.customRecipes.set(next);
    saveToStorage(STORAGE_KEYS.customRecipes, next);
  }

  updateCustomRecipe(id: string, updates: Partial<Recipe>): void {
    const next = this.customRecipes().map(r => r.id === id ? { ...r, ...updates } : r);
    this.customRecipes.set(next);
    saveToStorage(STORAGE_KEYS.customRecipes, next);
  }

  deleteCustomRecipe(id: string): void {
    const next = this.customRecipes().filter(r => r.id !== id);
    this.customRecipes.set(next);
    saveToStorage(STORAGE_KEYS.customRecipes, next);
  }

  addCustomIngredient(ingredient: Ingredient): void {
    const next = [...this.customIngredients(), { ...ingredient, isCustom: true, createdAt: new Date().toISOString() }];
    this.customIngredients.set(next);
    saveToStorage(STORAGE_KEYS.customIngredients, next);
  }

  updateCustomIngredient(id: string, updates: Partial<Ingredient>): void {
    const next = this.customIngredients().map(i => i.id === id ? { ...i, ...updates } : i);
    this.customIngredients.set(next);
    saveToStorage(STORAGE_KEYS.customIngredients, next);
  }

  deleteCustomIngredient(id: string): void {
    const next = this.customIngredients().filter(i => i.id !== id);
    this.customIngredients.set(next);
    saveToStorage(STORAGE_KEYS.customIngredients, next);
  }
}
