import { Injectable, NgZone, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { CookingDataService } from './cooking-data.service';
import { Monster } from '../models/monster.model';
import { Ingredient } from '../models/ingredient.model';
import { Recipe } from '../models/recipe.model';
import {
  CreateMonsterPayload,
  UpdateMonsterPayload,
  CreateIngredientPayload,
  CreateRecipePayload,
} from '../models/create-payloads.model';

/**
 * Handles all create/update/delete mutations against the API.
 *
 * ## Relationship to `CookingDataService`
 * `CookingDataService` owns the read signals. This service owns writes.
 * After a successful mutation, this service calls the appropriate
 * `CookingDataService.refresh*()` method so the shared signals pick up
 * the new state without a page reload.
 *
 * ## Session signals (`newMonsters`, `newIngredients`, `newRecipes`)
 * These writable signals hold entities created in the current browser session.
 * They are merged into `CookingDataService` getters so freshly created items
 * appear in the UI immediately (before the next API refresh completes).
 * On refresh, `CookingDataService` re-fetches from the API and these session
 * lists become redundant — stale entries are pruned after update/delete.
 *
 * ## Static builds
 * In `environment.staticData === true` builds the API is unavailable. The
 * create/edit UI should be hidden and these methods should not be called.
 */
@Injectable({ providedIn: 'root' })
export class CookingCreateService {
  private api         = inject(ApiService);
  private zone        = inject(NgZone);
  private dataService = inject(CookingDataService);

  // ── Session signals ──────────────────────────────────────────────────────

  /** Monsters created this session via `createMonster`. Merged into
   *  `CookingDataService.getMonsters()`. Pruned on `updateMonster`/`deleteMonster`. */
  readonly newMonsters    = signal<Monster[]>([]);

  /** Ingredients created this session (both via `createMonster` and
   *  `createIngredient`). Merged into `CookingDataService.getIngredients()`. */
  readonly newIngredients = signal<Ingredient[]>([]);

  /** Recipes created this session via `createRecipe`. Merged into
   *  `CookingDataService.getRecipes()`. */
  readonly newRecipes     = signal<Recipe[]>([]);

  // ── Create ───────────────────────────────────────────────────────────────

  /**
   * Posts to `POST /api/monsters`. The server creates the monster and all
   * listed ingredients in a single transaction.
   *
   * On success, adds the returned monster to `newMonsters` and all returned
   * ingredients to `newIngredients` so they surface immediately in the UI.
   *
   * @param payload - See `CreateMonsterPayload`
   * @returns Observable of `CreateMonsterResult` (the created monster + ingredients)
   */
  createMonster(payload: CreateMonsterPayload): Observable<CreateMonsterResult> {
    return this.api.post<CreateMonsterResult>('/monsters', payload).pipe(
      tap(result => this.zone.run(() => {
        this.newMonsters.update(list => [...list, result.monster]);
        this.newIngredients.update(list => [...list, ...result.ingredients]);
      })),
    );
  }

  /**
   * Posts to `POST /api/ingredients`. Creates a standalone ingredient,
   * optionally linked to existing monster sources.
   *
   * On success, adds the ingredient to `newIngredients`.
   *
   * @param payload - See `CreateIngredientPayload`
   * @returns Observable of the created `Ingredient`
   */
  createIngredient(payload: CreateIngredientPayload): Observable<Ingredient> {
    return this.api.post<Ingredient>('/ingredients', payload).pipe(
      tap(ingredient => this.zone.run(() => {
        this.newIngredients.update(list => [...list, ingredient]);
      })),
    );
  }

  /**
   * Posts to `POST /api/recipes`. Creates a recipe with its ingredient slots.
   *
   * On success, adds the recipe to `newRecipes`.
   *
   * @param payload - See `CreateRecipePayload`
   * @returns Observable of the created `Recipe`
   */
  createRecipe(payload: CreateRecipePayload): Observable<Recipe> {
    return this.api.post<Recipe>('/recipes', payload).pipe(
      tap(recipe => this.zone.run(() => {
        this.newRecipes.update(list => [...list, recipe]);
      })),
    );
  }

  // ── Update ───────────────────────────────────────────────────────────────

  /**
   * Puts to `PUT /api/monsters/:id`. The server diffs
   * `selectedHarvestComponentIds` to determine which ingredients to delete
   * (removed edible components) and which to insert (`newIngredients`).
   *
   * On success, removes the stale session entry from `newMonsters` and
   * triggers a full refresh of monsters and ingredients so the UI reflects
   * the server state.
   *
   * @param id - ID of the monster to update
   * @param payload - See `UpdateMonsterPayload`
   * @returns Observable of `UpdateMonsterResult` (updated monster + current ingredients)
   */
  updateMonster(id: string, payload: UpdateMonsterPayload): Observable<UpdateMonsterResult> {
    return this.api.put<UpdateMonsterResult>(`/monsters/${id}`, payload).pipe(
      tap(() => this.zone.run(() => {
        this.newMonsters.update(list => list.filter(m => m.id !== id));
        this.dataService.refreshMonsters();
        this.dataService.refreshIngredients();
      })),
    );
  }

  // ── Delete ───────────────────────────────────────────────────────────────

  /**
   * Deletes to `DELETE /api/monsters/:id`. Removes the monster's junction rows.
   *
   * Pass `withIngredients = true` to also delete all linked ingredients
   * (sends `?withIngredients=true` query param to the API).
   *
   * On success, triggers a full refresh of monsters and ingredients.
   *
   * @param id - ID of the monster to delete
   * @param withIngredients - When `true`, cascade-deletes linked ingredients (default `false`)
   * @returns Observable of `DeleteMonsterResult`
   */
  deleteMonster(id: string, withIngredients = false): Observable<DeleteMonsterResult> {
    const params = withIngredients ? { withIngredients: 'true' } : undefined;
    return this.api.delete<DeleteMonsterResult>(`/monsters/${id}`, params).pipe(
      tap(() => this.zone.run(() => {
        this.dataService.refreshMonsters();
        this.dataService.refreshIngredients();
      })),
    );
  }

  /**
   * Deletes to `DELETE /api/ingredients/:id`. Removes the ingredient and its
   * `ingredient_source_monsters` junction rows.
   *
   * On success, triggers a refresh of ingredients.
   *
   * @param id - ID of the ingredient to delete
   * @returns Observable of `DeleteResult`
   */
  deleteIngredient(id: string): Observable<DeleteResult> {
    return this.api.delete<DeleteResult>(`/ingredients/${id}`).pipe(
      tap(() => this.zone.run(() => {
        this.dataService.refreshIngredients();
      })),
    );
  }

  /**
   * Deletes to `DELETE /api/recipes/:id`. Removes the recipe and its
   * `recipe_ingredients` junction rows.
   *
   * On success, triggers a refresh of recipes.
   *
   * @param id - ID of the recipe to delete
   * @returns Observable of `DeleteResult`
   */
  deleteRecipe(id: string): Observable<DeleteResult> {
    return this.api.delete<DeleteResult>(`/recipes/${id}`).pipe(
      tap(() => this.zone.run(() => {
        this.dataService.refreshRecipes();
      })),
    );
  }
}

/** Response from `POST /api/monsters`. The server returns the created monster
 *  and all ingredients created in the same transaction, so the client can
 *  append them all to `newMonsters` / `newIngredients` in one shot. */
export interface CreateMonsterResult {
  monster: Monster;
  ingredients: Ingredient[];
}

/** Response from `PUT /api/monsters/:id`. Returns the updated monster and
 *  its current (post-diff) ingredient list. */
export interface UpdateMonsterResult {
  monster: Monster;
  ingredients: Ingredient[];
}

/** Minimal response body for a delete operation. */
export interface DeleteResult {
  id: string;
  name: string;
}

/** Extended delete response for monster deletion, reporting how many linked
 *  ingredients were removed vs. unlinked (junction row deleted but ingredient kept). */
export interface DeleteMonsterResult extends DeleteResult {
  /** Ingredients whose `ingredient_source_monsters` junction row was removed
   *  but the ingredient itself was kept (because other monsters still source it). */
  unlinkedIngredientCount: number;
  /** Ingredients that were fully deleted (only sourced by this monster). */
  deletedIngredientCount:  number;
}
