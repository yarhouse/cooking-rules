import { Injectable, NgZone, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { CookingDataService } from './cooking-data.service';
import { Monster } from '../models/monster.model';
import { Ingredient } from '../models/ingredient.model';
import { Recipe } from '../models/recipe.model';
import {
  CreateMonsterPayload,
  CreateIngredientPayload,
  CreateRecipePayload,
} from '../models/create-payloads.model';

/** Holds entities created this session via the API.
 *
 *  These are WritableSignals — unlike the toSignal() HTTP signals in
 *  CookingDataService (which are readonly), these can be updated after a
 *  successful POST. CookingDataService merges them into its public getters
 *  so newly created items appear everywhere immediately without a page reload.
 *
 *  In static builds (environment.staticData === true) the API is unavailable —
 *  the create form should be hidden and these signals will remain empty.
 */
@Injectable({ providedIn: 'root' })
export class CookingCreateService {
  private api         = inject(ApiService);
  private zone        = inject(NgZone);
  private dataService = inject(CookingDataService);

  // ── Freshly created entities for this session ───────────────────────────
  readonly newMonsters    = signal<Monster[]>([]);
  readonly newIngredients = signal<Ingredient[]>([]);
  readonly newRecipes     = signal<Recipe[]>([]);

  // ── Create methods ───────────────────────────────────────────────────────

  /** Creates an ingredient source and its harvested ingredients in one transaction.
   *  On success, adds the monster to newMonsters and all created ingredients
   *  to newIngredients so they surface immediately in the UI. */
  createMonster(payload: CreateMonsterPayload): Observable<CreateMonsterResult> {
    return this.api.post<CreateMonsterResult>('/monsters', payload).pipe(
      tap(result => this.zone.run(() => {
        this.newMonsters.update(list => [...list, result.monster]);
        this.newIngredients.update(list => [...list, ...result.ingredients]);
      })),
    );
  }

  /** Creates a standalone ingredient, optionally linked to existing sources. */
  createIngredient(payload: CreateIngredientPayload): Observable<Ingredient> {
    return this.api.post<Ingredient>('/ingredients', payload).pipe(
      tap(ingredient => this.zone.run(() => {
        this.newIngredients.update(list => [...list, ingredient]);
      })),
    );
  }

  /** Creates a recipe. */
  createRecipe(payload: CreateRecipePayload): Observable<Recipe> {
    return this.api.post<Recipe>('/recipes', payload).pipe(
      tap(recipe => this.zone.run(() => {
        this.newRecipes.update(list => [...list, recipe]);
      })),
    );
  }

  // ── Delete methods ───────────────────────────────────────────────────────────

  /** Deletes a monster and its junction rows.
   *  Pass withIngredients=true to also delete all linked ingredients. */
  deleteMonster(id: string, withIngredients = false): Observable<DeleteMonsterResult> {
    const params = withIngredients ? { withIngredients: 'true' } : undefined;
    return this.api.delete<DeleteMonsterResult>(`/monsters/${id}`, params).pipe(
      tap(() => this.zone.run(() => {
        this.dataService.refreshMonsters();
        this.dataService.refreshIngredients();
      })),
    );
  }

  /** Deletes a standalone ingredient and its junction rows. */
  deleteIngredient(id: string): Observable<DeleteResult> {
    return this.api.delete<DeleteResult>(`/ingredients/${id}`).pipe(
      tap(() => this.zone.run(() => {
        this.dataService.refreshIngredients();
      })),
    );
  }

  /** Deletes a recipe and its ingredient junction rows. */
  deleteRecipe(id: string): Observable<DeleteResult> {
    return this.api.delete<DeleteResult>(`/recipes/${id}`).pipe(
      tap(() => this.zone.run(() => {
        this.dataService.refreshRecipes();
      })),
    );
  }
}

/** The monster POST returns both the created monster and any ingredients
 *  created alongside it so the client can add them all to its signals. */
export interface CreateMonsterResult {
  monster: Monster;
  ingredients: Ingredient[];
}

export interface DeleteResult {
  id: string;
  name: string;
}

export interface DeleteMonsterResult extends DeleteResult {
  unlinkedIngredientCount: number;
  deletedIngredientCount:  number;
}
