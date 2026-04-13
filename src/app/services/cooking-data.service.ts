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
import { environment } from '../../environments/environment';
import { CREATURE_TYPES } from '../data/creature-types.data';
import { COMPONENT_TYPES } from '../data/component-types.data';
import { MONSTERS } from '../data/monsters.data';
import { INGREDIENTS } from '../data/ingredients.data';
import { RECIPES } from '../data/recipes.data';

export interface SearchResults {
  monsters: Monster[];
  recipes: Recipe[];
  ingredients: Ingredient[];
}

/**
 * All data is fetched once from the API on first injection and cached as
 * Angular signals.  Every public method is synchronous — the same call
 * signatures components already use — so no component changes are needed.
 *
 * Expected API response shapes (all camelCase, arrays joined server-side):
 *
 *  GET /creature-types  → CreatureType[]
 *    { id, name, availableComponents: ComponentTypeName[] }
 *
 *  GET /component-types → ComponentType[]
 *    { id, name, description, effects: [{ creatureTypeId, description,
 *      scaling?: { uncommon, rare, veryRare, legendary } }] }
 *
 *  GET /monsters        → Monster[]
 *    { id, name, creatureTypeId, rarity, harvestableComponents: ComponentTypeName[],
 *      notes?, isCustom?, createdAt? }
 *
 *  GET /ingredients     → Ingredient[]
 *    { id, name, componentTypeId, creatureTypeId, sourceMonsterIds?: string[],
 *      notes?, isCustom?, createdAt? }
 *
 *  GET /recipes         → Recipe[]
 *    { id, name, tier, dc, ingredients: [{ componentTypeId, bossSpecific? }],
 *      bossEffect?, requiresHeat?, notes?, imageUrl?, isCustom?, createdAt? }
 */
@Injectable({ providedIn: 'root' })
export class CookingDataService {
  private api = inject(ApiService);
  private inventory = inject(InventoryService);

  // Reference data — static signals in static builds, HTTP signals otherwise
  private _creatureTypes: Signal<CreatureType[]> = environment.staticData
    ? signal(CREATURE_TYPES)
    : toSignal(this.api.get<CreatureType[]>('/creature-types'), { initialValue: [] as CreatureType[] });

  private _componentTypes: Signal<ComponentType[]> = environment.staticData
    ? signal(COMPONENT_TYPES)
    : toSignal(this.api.get<ComponentType[]>('/component-types'), { initialValue: [] as ComponentType[] });

  private _monstersRefresh$ = new Subject<void>();
  private _monsters: Signal<Monster[]> = environment.staticData
    ? signal(MONSTERS)
    : toSignal(
        this._monstersRefresh$.pipe(startWith(null), switchMap(() => this.api.get<Monster[]>('/monsters'))),
        { initialValue: [] as Monster[] }
      );

  private _ingredientsRefresh$ = new Subject<void>();
  private _ingredients: Signal<Ingredient[]> = environment.staticData
    ? signal(INGREDIENTS)
    : toSignal(
        this._ingredientsRefresh$.pipe(startWith(null), switchMap(() => this.api.get<Ingredient[]>('/ingredients'))),
        { initialValue: [] as Ingredient[] }
      );

  private _recipesRefresh$ = new Subject<void>();
  private _recipes: Signal<Recipe[]> = environment.staticData
    ? signal(RECIPES)
    : toSignal(
        this._recipesRefresh$.pipe(startWith(null), switchMap(() => this.api.get<Recipe[]>('/recipes'))),
        { initialValue: [] as Recipe[] }
      );

  /** Always false in static builds (data is available synchronously).
   *  True while any reference dataset has not yet arrived from the API otherwise. */
  readonly loading = computed(() =>
    environment.staticData ? false :
    this._creatureTypes().length === 0 ||
    this._componentTypes().length === 0 ||
    this._monsters().length === 0 ||
    this._ingredients().length === 0 ||
    this._recipes().length === 0
  );

  // --- Refresh triggers (no-op in static builds) ---

  refreshMonsters(): void { if (!environment.staticData) this._monstersRefresh$.next(); }
  refreshIngredients(): void { if (!environment.staticData) this._ingredientsRefresh$.next(); }
  refreshRecipes(): void { if (!environment.staticData) this._recipesRefresh$.next(); }

  // --- Creature Types ---

  getCreatureTypes(): CreatureType[] {
    return this._creatureTypes();
  }

  getCreatureType(id: string): CreatureType | undefined {
    return this._creatureTypes().find(ct => ct.id === id);
  }

  // --- Component Types ---

  getComponentTypes(): ComponentType[] {
    return this._componentTypes();
  }

  getComponentType(id: ComponentTypeName): ComponentType | undefined {
    return this._componentTypes().find(ct => ct.id === id);
  }

  getEffectFor(componentTypeId: ComponentTypeName, creatureTypeId: string): ComponentEffect | undefined {
    return this.getComponentType(componentTypeId)?.effects.find(e => e.creatureTypeId === creatureTypeId);
  }

  // --- Monsters ---

  getMonsters(query?: string): Monster[] {
    const all = [...this._monsters(), ...this.inventory.customMonsters()];
    if (!query) return all;
    const q = query.toLowerCase();
    return all.filter(m =>
      m.name.toLowerCase().includes(q) ||
      (this.getCreatureType(m.creatureTypeId)?.name.toLowerCase().includes(q) ?? false)
    );
  }

  getMonster(id: string): Monster | undefined {
    return this.getMonsters().find(m => m.id === id);
  }

  getMonstersByType(creatureTypeId: string): Monster[] {
    return this.getMonsters().filter(m => m.creatureTypeId === creatureTypeId);
  }

  // --- Ingredients ---

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

  getIngredient(id: string): Ingredient | undefined {
    return this.getIngredients().find(i => i.id === id);
  }

  getIngredientsByComponentType(componentTypeId: ComponentTypeName): Ingredient[] {
    return this.getIngredients().filter(i => i.componentTypeId === componentTypeId);
  }

  getIngredientsByCreatureType(creatureTypeId: string): Ingredient[] {
    return this.getIngredients().filter(i => i.creatureTypeId === creatureTypeId);
  }

  // --- Recipes ---

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

  getRecipe(id: string): Recipe | undefined {
    return this.getRecipes().find(r => r.id === id);
  }

  getRecipesContaining(componentTypeId: ComponentTypeName): Recipe[] {
    return this.getRecipes().filter(r =>
      r.ingredients.some(i => i.componentTypeId === componentTypeId)
    );
  }

  /** Returns recipes that match a given set of component type IDs.
   * complete: all ingredients covered
   * partial: some ingredients covered
   * Sorted: complete first, then by coverage descending */
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

  /** Searches effects across all component types for a keyword */
  searchEffects(query: string): Array<{ ingredient: Ingredient; effect: ComponentEffect; componentType: ComponentType }> {
    const q = query.toLowerCase();
    const results: Array<{ ingredient: Ingredient; effect: ComponentEffect; componentType: ComponentType }> = [];

    for (const ct of this._componentTypes()) {
      for (const effect of ct.effects) {
        const matchesDescription = effect.description.toLowerCase().includes(q);
        const matchesScaling = effect.scaling
          ? Object.values(effect.scaling).some(v => v.toLowerCase().includes(q))
          : false;
        if (matchesDescription || matchesScaling) {
          const ingredients = this.getIngredients().filter(
            i => i.componentTypeId === ct.id && i.creatureTypeId === effect.creatureTypeId
          );
          for (const ingredient of ingredients) {
            results.push({ ingredient, effect, componentType: ct });
          }
        }
      }
    }

    return results;
  }

  // --- Federated Search ---

  search(query: string): SearchResults {
    if (!query.trim()) return { monsters: [], recipes: [], ingredients: [] };
    return {
      monsters: this.getMonsters(query).slice(0, 10),
      recipes: this.getRecipes(query).slice(0, 10),
      ingredients: this.getIngredients(query).slice(0, 10),
    };
  }
}
