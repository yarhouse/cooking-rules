import { ComponentTypeName } from './component-type.model';

/** A named cooking ingredient harvested from a specific creature type.
 *  Sourced from the `ingredients` + `ingredient_source_monsters` tables via
 *  `GET /api/ingredients`; cached in `CookingDataService._ingredients`.
 *
 *  Ingredients are the bridge between monsters and recipes: a recipe slot
 *  specifies a `componentTypeId` and an optional `ingredientId`; if the
 *  latter is present, only this exact ingredient satisfies that slot. */
export interface Ingredient {
  id: string;
  name: string;
  /** The component category this ingredient belongs to (e.g. 'flesh', 'bone').
   *  Determines which recipe slots it can fill and how its cooking effect is
   *  looked up via `CookingDataService.getEffectFor`. */
  componentTypeId: ComponentTypeName;
  /** The creature type this ingredient is associated with.
   *  Used by `CookingDataService.getIngredientsByCreatureType` and to resolve
   *  the cooking effect from the correct `ComponentEffect` entry. */
  creatureTypeId: string;
  /** Monster IDs that drop this ingredient. Absent when the ingredient has
   *  no specific source monsters (e.g. vendor items or generic components). */
  sourceMonsterIds?: string[];
  notes?: string;
  /** `true` for user-created ingredients; absent for rulebook entries. */
  isCustom?: boolean;
  /** ISO 8601 timestamp; present only for custom ingredients. */
  createdAt?: string;
}
