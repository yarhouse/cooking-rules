import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { InventoryService } from './inventory.service';
import { CreatureType } from '../models/creature-type.model';
import { ComponentType, ComponentEffect, ComponentTypeName } from '../models/component-type.model';
import { Monster } from '../models/monster.model';
import { Ingredient } from '../models/ingredient.model';
import { Recipe } from '../models/recipe.model';
import { HarvestComponent } from '../models/harvest-component.model';
import { MagicItem, MagicItemCategory } from '../models/magic-item.model';
import { EssenceStock, } from '../models/inventory.model';
import { Rarity } from '../models/component-type.model';
import { environment } from '../../environments/environment';
import { CREATURE_TYPES } from '../data/creature-types.data';
import { COMPONENT_TYPES } from '../data/component-types.data';
import { MONSTERS } from '../data/monsters.data';
import { INGREDIENTS } from '../data/ingredients.data';
import { RECIPES } from '../data/recipes.data';
import { HARVEST_COMPONENTS } from '../data/harvest-components.data';
import { MAGIC_ITEMS } from '../data/magic-items.data';

/** Aggregated results from `CookingDataService.search`. Each array is capped
 *  at 10 entries to keep the Search page results manageable. */
export interface SearchResults {
  monsters: Monster[];
  recipes: Recipe[];
  ingredients: Ingredient[];
}

/**
 * Central read-only data layer for the entire application.
 *
 * ## Data pipeline
 * 1. On first injection, each dataset is fetched once from the API and cached
 *    as an Angular signal (`_monsters`, `_recipes`, etc.).
 * 2. In static builds (`environment.staticData === true`), the signals are
 *    initialised directly from `src/app/data/*.data.ts` — no HTTP calls are made.
 * 3. All public getters are synchronous — they read the signal value at call time.
 * 4. `getMonsters`, `getIngredients`, and `getRecipes` merge custom entities
 *    from `InventoryService` into every result so user-created items appear
 *    everywhere without a page reload.
 *
 * ## Refresh
 * Three datasets (monsters, ingredients, recipes) are refreshable via
 * `refreshMonsters()` / `refreshIngredients()` / `refreshRecipes()`.
 * Refreshing re-issues the HTTP GET and updates the signal. These are called
 * by `CookingCreateService` after create/update/delete operations.
 * Refresh methods are no-ops in static builds.
 *
 * ## API response shapes (all camelCase, arrays joined server-side)
 * - `GET /creature-types`  → `CreatureType[]`
 * - `GET /component-types` → `ComponentType[]`
 * - `GET /monsters`        → `Monster[]`
 * - `GET /ingredients`     → `Ingredient[]`
 * - `GET /recipes`         → `Recipe[]`
 * - `GET /harvest-components` → `HarvestComponent[]`
 * - `GET /magic-items`     → `MagicItem[]`
 */
@Injectable({ providedIn: 'root' })
export class CookingDataService {
  private api = inject(ApiService);
  private inventory = inject(InventoryService);

  // ── Private signals — loaded once, never mutated directly ────────────────

  /** Creature types from `GET /creature-types`. In static mode, sourced from
   *  `creature-types.data.ts`. Not refreshable (reference data, never changes). */
  private _creatureTypes: Signal<CreatureType[]> = environment.staticData
    ? signal(CREATURE_TYPES)
    : toSignal(this.api.get<CreatureType[]>('/creature-types'), { initialValue: [] as CreatureType[] });

  /** Component types + effects from `GET /component-types`. Not refreshable. */
  private _componentTypes: Signal<ComponentType[]> = environment.staticData
    ? signal(COMPONENT_TYPES)
    : toSignal(this.api.get<ComponentType[]>('/component-types'), { initialValue: [] as ComponentType[] });

  /** Trigger that causes `_monsters` to re-fetch from the API.
   *  Emitting on this subject re-runs the `switchMap` below. */
  private _monstersRefresh$ = new Subject<void>();

  /** All monsters from `GET /monsters`. Refreshable via `refreshMonsters()`.
   *  Does NOT include `InventoryService.customMonsters` — those are merged
   *  at the getter level so refresh doesn't overwrite unsaved custom data. */
  private _monsters: Signal<Monster[]> = environment.staticData
    ? signal(MONSTERS)
    : toSignal(
        this._monstersRefresh$.pipe(startWith(null), switchMap(() => this.api.get<Monster[]>('/monsters'))),
        { initialValue: [] as Monster[] }
      );

  /** Trigger that re-fetches ingredients from the API. */
  private _ingredientsRefresh$ = new Subject<void>();

  /** All ingredients from `GET /ingredients`. Refreshable via `refreshIngredients()`. */
  private _ingredients: Signal<Ingredient[]> = environment.staticData
    ? signal(INGREDIENTS)
    : toSignal(
        this._ingredientsRefresh$.pipe(startWith(null), switchMap(() => this.api.get<Ingredient[]>('/ingredients'))),
        { initialValue: [] as Ingredient[] }
      );

  /** Trigger that re-fetches recipes from the API. */
  private _recipesRefresh$ = new Subject<void>();

  /** All recipes from `GET /recipes`. Refreshable via `refreshRecipes()`. */
  private _recipes: Signal<Recipe[]> = environment.staticData
    ? signal(RECIPES)
    : toSignal(
        this._recipesRefresh$.pipe(startWith(null), switchMap(() => this.api.get<Recipe[]>('/recipes'))),
        { initialValue: [] as Recipe[] }
      );

  /** All harvestable components from `GET /harvest-components`. Not refreshable. */
  private _harvestComponents: Signal<HarvestComponent[]> = environment.staticData
    ? signal(HARVEST_COMPONENTS)
    : toSignal(this.api.get<HarvestComponent[]>('/harvest-components'), { initialValue: [] as HarvestComponent[] });

  /** Magic item recipes from `GET /magic-items`. Not refreshable. */
  private _magicItems: Signal<MagicItem[]> = environment.staticData
    ? signal(MAGIC_ITEMS)
    : toSignal(this.api.get<MagicItem[]>('/magic-items'), { initialValue: [] as MagicItem[] });

  // ── Loading state ────────────────────────────────────────────────────────

  /** `true` while any of the five primary datasets has not yet returned from
   *  the API. Always `false` in static builds (data is synchronous). Used by
   *  the app shell to show a loading indicator. */
  readonly loading = computed(() =>
    environment.staticData ? false :
    this._creatureTypes().length === 0 ||
    this._componentTypes().length === 0 ||
    this._monsters().length === 0 ||
    this._ingredients().length === 0 ||
    this._recipes().length === 0
  );

  // ── Refresh triggers (no-op in static builds) ────────────────────────────

  /** Re-fetches monsters from the API. Called by `CookingCreateService` after
   *  a create, update, or delete operation. No-op in static builds. */
  refreshMonsters(): void { if (!environment.staticData) this._monstersRefresh$.next(); }

  /** Re-fetches ingredients from the API. Called by `CookingCreateService`
   *  after operations that create or remove linked ingredients. No-op in static builds. */
  refreshIngredients(): void { if (!environment.staticData) this._ingredientsRefresh$.next(); }

  /** Re-fetches recipes from the API. Called by `CookingCreateService` after
   *  recipe create/delete. No-op in static builds. */
  refreshRecipes(): void { if (!environment.staticData) this._recipesRefresh$.next(); }

  // ── Creature Types ───────────────────────────────────────────────────────

  /** Returns all creature types. Used by filter chips throughout the app. */
  getCreatureTypes(): CreatureType[] {
    return this._creatureTypes();
  }

  /**
   * @param id - `CreatureType.id`
   * @returns The matching creature type, or `undefined` if not found
   */
  getCreatureType(id: string): CreatureType | undefined {
    return this._creatureTypes().find(ct => ct.id === id);
  }

  // ── Component Types ──────────────────────────────────────────────────────

  /** Returns all component types with their full effect lists. */
  getComponentTypes(): ComponentType[] {
    return this._componentTypes();
  }

  /**
   * @param id - A `ComponentTypeName` (e.g. `'blood'`, `'bone'`)
   * @returns The matching component type, or `undefined`
   */
  getComponentType(id: ComponentTypeName): ComponentType | undefined {
    return this._componentTypes().find(ct => ct.id === id);
  }

  /**
   * Looks up the cooking effect for a specific component × creature type pair.
   * Used by `RulesComponent` and recipe detail dialogs to show what a given
   * ingredient does when cooked.
   *
   * @param componentTypeId - The component category (e.g. `'flesh'`)
   * @param creatureTypeId - The creature type the ingredient came from
   * @returns The `ComponentEffect` entry, or `undefined` if no effect is defined
   */
  getEffectFor(componentTypeId: ComponentTypeName, creatureTypeId: string): ComponentEffect | undefined {
    return this.getComponentType(componentTypeId)?.effects.find(e => e.creatureTypeId === creatureTypeId);
  }

  // ── Monsters ─────────────────────────────────────────────────────────────

  /**
   * Returns all monsters (rulebook + custom), optionally filtered by a search
   * query that matches against name and creature type name.
   *
   * Custom monsters from `InventoryService.customMonsters` are merged at the
   * end of the array so they don't interfere with signal refresh cycles.
   *
   * @param query - Case-insensitive substring to filter by; omit for all monsters
   */
  getMonsters(query?: string): Monster[] {
    const all = [...this._monsters(), ...this.inventory.customMonsters()];
    if (!query) return all;
    const q = query.toLowerCase();
    return all.filter(m =>
      m.name.toLowerCase().includes(q) ||
      (this.getCreatureType(m.creatureTypeId)?.name.toLowerCase().includes(q) ?? false)
    );
  }

  /**
   * @param id - `Monster.id`
   * @returns The monster (including custom), or `undefined`
   */
  getMonster(id: string): Monster | undefined {
    return this.getMonsters().find(m => m.id === id);
  }

  /**
   * @param creatureTypeId - `CreatureType.id` to filter by
   * @returns All monsters of that creature type (rulebook + custom)
   */
  getMonstersByType(creatureTypeId: string): Monster[] {
    return this.getMonsters().filter(m => m.creatureTypeId === creatureTypeId);
  }

  // ── Ingredients ──────────────────────────────────────────────────────────

  /**
   * Returns all ingredients (rulebook + custom), optionally filtered by a
   * query that matches name, component type ID, and creature type name.
   *
   * @param query - Case-insensitive substring filter; omit for all ingredients
   */
  getIngredients(query?: string): Ingredient[] {
    const all = [...this._ingredients(), ...this.inventory.customIngredients()];
    if (!query) return all;
    const q = query.toLowerCase();
    return all.filter(i =>
      i.name.toLowerCase().includes(q) ||
      i.componentTypeId.toLowerCase().includes(q) ||
      (this.getCreatureType(i.creatureTypeId)?.name.toLowerCase().includes(q) ?? false)
    );
  }

  /**
   * @param id - `Ingredient.id`
   * @returns The ingredient (including custom), or `undefined`
   */
  getIngredient(id: string): Ingredient | undefined {
    return this.getIngredients().find(i => i.id === id);
  }

  /**
   * @param componentTypeId - The component category to filter by
   * @returns All ingredients of that component type (e.g. all 'flesh' ingredients)
   */
  getIngredientsByComponentType(componentTypeId: ComponentTypeName): Ingredient[] {
    return this.getIngredients().filter(i => i.componentTypeId === componentTypeId);
  }

  /**
   * @param creatureTypeId - `CreatureType.id` to filter by
   * @returns All ingredients sourced from that creature type
   */
  getIngredientsByCreatureType(creatureTypeId: string): Ingredient[] {
    return this.getIngredients().filter(i => i.creatureTypeId === creatureTypeId);
  }

  // ── Recipes ──────────────────────────────────────────────────────────────

  /**
   * Returns all recipes (rulebook + custom), optionally filtered by a query
   * that matches name, tier, and ingredient component type IDs.
   *
   * @param query - Case-insensitive substring filter; omit for all recipes
   */
  getRecipes(query?: string): Recipe[] {
    const all = [...this._recipes(), ...this.inventory.customRecipes()];
    if (!query) return all;
    const q = query.toLowerCase();
    return all.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.tier.toLowerCase().includes(q) ||
      r.ingredients.some(i => i.componentTypeId.toLowerCase().includes(q))
    );
  }

  /**
   * @param id - `Recipe.id`
   * @returns The recipe (including custom), or `undefined`
   */
  getRecipe(id: string): Recipe | undefined {
    return this.getRecipes().find(r => r.id === id);
  }

  /**
   * @param componentTypeId - Component type to search for in recipe ingredient slots
   * @returns All recipes that require at least one ingredient of this component type
   */
  getRecipesContaining(componentTypeId: ComponentTypeName): Recipe[] {
    return this.getRecipes().filter(r =>
      r.ingredients.some(i => i.componentTypeId === componentTypeId)
    );
  }

  /**
   * Matches the current ingredient selection against all recipes and returns
   * those with at least one covered slot.
   *
   * Matching is by component type — a slot is covered if any selected component
   * type ID equals `RecipeIngredient.componentTypeId`. Specific-ingredient
   * overrides (`ingredientId`) are intentionally ignored here; the caller is
   * responsible for finer-grained checks if needed.
   *
   * Results are sorted: fully covered recipes first, then descending by
   * number of covered slots.
   *
   * @param selectedComponentTypeIds - Component types currently added to the cooking builder
   * @returns Recipes with coverage metadata; only recipes with ≥1 covered slot are included
   */
  matchRecipesToIngredients(selectedComponentTypeIds: ComponentTypeName[]): Array<{
    recipe: Recipe;
    covered: ComponentTypeName[];
    missing: ComponentTypeName[];
    complete: boolean;
  }> {
    return this.getRecipes()
      .map(recipe => {
        const required = recipe.ingredients.map(i => i.componentTypeId);
        const covered = required.filter(cid => selectedComponentTypeIds.includes(cid));
        const missing = required.filter(cid => !selectedComponentTypeIds.includes(cid));
        return { recipe, covered, missing, complete: missing.length === 0 };
      })
      .filter(m => m.covered.length > 0)
      .sort((a, b) => {
        if (a.complete && !b.complete) return -1;
        if (!a.complete && b.complete) return 1;
        return b.covered.length - a.covered.length;
      });
  }

  /**
   * Searches effect descriptions (including rarity-scaled variants) for a
   * keyword and returns the edible harvest components that produce each match.
   *
   * Used by the Recipe Builder's effect-search mode to let players find
   * components by desired effect rather than by name.
   *
   * @param query - Case-insensitive substring to search in effect text
   * @returns One entry per matching edible harvest component
   */
  searchEffects(query: string): Array<{ harvestComponent: HarvestComponent; effect: ComponentEffect; componentType: ComponentType }> {
    const q = query.toLowerCase();
    const results: Array<{ harvestComponent: HarvestComponent; effect: ComponentEffect; componentType: ComponentType }> = [];

    for (const ct of this._componentTypes()) {
      for (const effect of ct.effects) {
        const matchesDescription = effect.description.toLowerCase().includes(q);
        const matchesScaling = effect.scaling
          ? Object.values(effect.scaling).some(v => v.toLowerCase().includes(q))
          : false;
        if (matchesDescription || matchesScaling) {
          const components = this._harvestComponents().filter(
            hc => hc.isEdible && hc.edibleAs === ct.id && hc.creatureTypeId === effect.creatureTypeId
          );
          for (const harvestComponent of components) {
            results.push({ harvestComponent, effect, componentType: ct });
          }
        }
      }
    }

    return results;
  }

  // ── Harvest Components ───────────────────────────────────────────────────

  /** Returns all 208 harvestable components. */
  getHarvestComponents(): HarvestComponent[] {
    return this._harvestComponents();
  }

  /**
   * @param id - `HarvestComponent.id`
   * @returns The harvest component, or `undefined`
   */
  getHarvestComponent(id: string): HarvestComponent | undefined {
    return this._harvestComponents().find(hc => hc.id === id);
  }

  /**
   * @param creatureTypeId - `CreatureType.id` to filter by
   * @returns All harvestable components for that creature type
   */
  getHarvestComponentsByCreatureType(creatureTypeId: string): HarvestComponent[] {
    return this._harvestComponents().filter(hc => hc.creatureTypeId === creatureTypeId);
  }

  /**
   * Returns only components where `isEdible === true` and `edibleAs` is set.
   * These are the items that can appear in the Recipe Builder's ingredient list.
   *
   * @param query - Optional case-insensitive filter on name, creature type, or component type
   */
  getEdibleHarvestComponents(query?: string): HarvestComponent[] {
    const all = this._harvestComponents().filter(hc => hc.isEdible && hc.edibleAs);
    if (!query) return all;
    const q = query.toLowerCase();
    return all.filter(hc =>
      hc.name.toLowerCase().includes(q) ||
      hc.creatureTypeName.toLowerCase().includes(q) ||
      (hc.edibleAs?.toLowerCase().includes(q) ?? false)
    );
  }

  /**
   * Computed map of how many units of each creature-type × component-type
   * combination are currently in the harvest stock.
   *
   * Key format: `"{creatureTypeId}:{edibleAs}"` (e.g. `"undead:flesh"`).
   * Value: total quantity across all rarity tiers in stock.
   *
   * Used by `getCookingIngredientCount` and the cooking builder to show
   * how many of each edible component type are available from each creature type.
   * Re-evaluated automatically when `InventoryService.harvestStock` changes.
   */
  readonly cookingIngredientAvailability = computed(() => {
    const stockMap = this.inventory.harvestStockMap();
    const counts = new Map<string, number>(); // key: `${creatureTypeId}:${edibleAs}`
    for (const hc of this._harvestComponents()) {
      if (!hc.isEdible || !hc.edibleAs) continue;
      const key = `${hc.creatureTypeId}:${hc.edibleAs}`;
      counts.set(key, (counts.get(key) ?? 0) + (stockMap.get(hc.id) ?? 0));
    }
    return counts;
  });

  /**
   * Returns the total number of units in stock for a given creature-type ×
   * component-type pair. Reads from `cookingIngredientAvailability`.
   *
   * @param creatureTypeId - Source creature type
   * @param componentTypeId - The component category (e.g. `'flesh'`)
   * @returns Quantity in stock, or `0`
   */
  getCookingIngredientCount(creatureTypeId: string, componentTypeId: string): number {
    return this.cookingIngredientAvailability().get(`${creatureTypeId}:${componentTypeId}`) ?? 0;
  }

  // ── Magic Items ──────────────────────────────────────────────────────────

  /**
   * Returns all magic items, optionally filtered by a query that matches name,
   * category, and required component names.
   *
   * @param query - Case-insensitive substring filter; omit for all items
   */
  getMagicItems(query?: string): MagicItem[] {
    const all = this._magicItems();
    if (!query) return all;
    const q = query.toLowerCase();
    return all.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      m.components.some(c => c.componentName.toLowerCase().includes(q))
    );
  }

  /**
   * @param category - `MagicItemCategory` to filter by (e.g. `'potion'`)
   * @returns All magic items of that category
   */
  getMagicItemsByCategory(category: MagicItemCategory): MagicItem[] {
    return this._magicItems().filter(m => m.category === category);
  }

  /**
   * @param creatureTypeId - `CreatureType.id` to filter by
   * @returns All magic items that require at least one component from that creature type
   */
  getMagicItemsByCreatureType(creatureTypeId: string): MagicItem[] {
    return this._magicItems().filter(m =>
      m.components.some(c => c.creatureTypeId === creatureTypeId)
    );
  }

  // ── Craftability ─────────────────────────────────────────────────────────

  /** Maps `MagicItem.essenceType` strings (from the DB) to `Rarity` keys
   *  used in `EssenceStock`. */
  private static readonly ESSENCE_RARITY_MAP: Record<string, Rarity> = {
    Frail: 'uncommon', Robust: 'rare', Potent: 'very-rare',
    Mythic: 'legendary', Deific: 'artifact',
  };

  /**
   * Determines whether the player has enough harvested components and essence
   * to craft the given magic item.
   *
   * For each component requirement, matches harvestable components by
   * `creatureTypeId` and `componentName` (case-insensitive), then sums
   * quantities across all rarity tiers in `stockMap`. If the sum is less
   * than `req.quantity`, the item is not craftable.
   *
   * Essence is checked as a simple binary — at least 1 unit of the mapped
   * rarity tier must be available.
   *
   * @param item - The magic item recipe to check
   * @param stockMap - `InventoryService.harvestTotalMap` (total per component ID across rarities)
   * @param essence - `InventoryService.essence` (current essence stock)
   * @returns `true` if all requirements are met
   */
  isMagicItemCraftable(
    item: MagicItem,
    stockMap: Map<string, number>,
    essence: EssenceStock
  ): boolean {
    const allComponents = this._harvestComponents();
    for (const req of item.components) {
      const matching = allComponents.filter(
        hc => hc.creatureTypeId === req.creatureTypeId &&
              hc.name.toLowerCase() === req.componentName.toLowerCase()
      );
      const owned = matching.reduce((sum, hc) => sum + (stockMap.get(hc.id) ?? 0), 0);
      if (owned < req.quantity) return false;
    }
    if (item.essenceType) {
      const rarity = CookingDataService.ESSENCE_RARITY_MAP[item.essenceType];
      if (rarity && (essence[rarity] ?? 0) < 1) return false;
    }
    return true;
  }

  // ── Federated Search ─────────────────────────────────────────────────────

  /**
   * Searches monsters, recipes, and ingredients simultaneously for a keyword.
   * Each result set is capped at 10 entries. Returns empty arrays for a blank
   * or whitespace-only query.
   *
   * Consumed exclusively by `SearchComponent`.
   *
   * @param query - The search term entered by the user
   * @returns `SearchResults` with up to 10 entries per entity type
   */
  search(query: string): SearchResults {
    if (!query.trim()) return { monsters: [], recipes: [], ingredients: [] };
    return {
      monsters: this.getMonsters(query).slice(0, 10),
      recipes: this.getRecipes(query).slice(0, 10),
      ingredients: this.getIngredients(query).slice(0, 10),
    };
  }
}
