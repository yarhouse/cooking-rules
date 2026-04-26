import { ComponentTypeName } from './component-type.model';
import { MonsterRarity } from './monster.model';
import { RecipeTier } from './recipe.model';

/** Payload for `POST /api/monsters`.
 *  Creates a monster and all of its named ingredients atomically in a single
 *  server transaction. If any ingredient insert fails the whole operation
 *  rolls back. Handled by `CookingCreateService.createMonster`. */
export interface CreateMonsterPayload {
  name: string;
  creatureTypeId: string;
  rarity: MonsterRarity;
  isBoss: boolean;
  notes: string | null;
  /** The component types this monster can yield (edible parts only).
   *  Stored in `monster_harvestable_components`; drives recipe matching. */
  harvestableComponents: ComponentTypeName[];
  /** All selected `harvest_component` IDs (edible and non-edible).
   *  Stored in `monster_harvest_component_selections`. */
  selectedHarvestComponentIds: string[];
  /** One entry per harvestable component — the named ingredient to create.
   *  Order matches `harvestableComponents`; the server pairs them positionally. */
  ingredients: CreateMonsterIngredientPayload[];
}

/** A single named ingredient to create alongside its parent monster.
 *  `componentTypeId` may be `null` when the user skips the component classification. */
export interface CreateMonsterIngredientPayload {
  name: string;
  componentTypeId: ComponentTypeName | null;
  notes: string | null;
}

/** Payload for `PUT /api/monsters/:id`.
 *  The server diffs `selectedHarvestComponentIds` against the existing DB rows
 *  to determine which ingredients to delete (removed edible components) and
 *  which to create (`newIngredients`). Handled by `CookingCreateService.updateMonster`. */
export interface UpdateMonsterPayload {
  name: string;
  rarity: MonsterRarity;
  isBoss: boolean;
  notes: string | null;
  /** Complete replacement set of edible component types.
   *  The server uses this to update `monster_harvestable_components`. */
  harvestableComponents: ComponentTypeName[];
  /** Complete replacement set of all selected harvest component IDs.
   *  The server diffs this against the current DB state to cascade-delete
   *  ingredients whose source component was removed. */
  selectedHarvestComponentIds: string[];
  /** Ingredients to create for harvest components added in this update.
   *  Only newly added edible components need entries here. */
  newIngredients: CreateMonsterIngredientPayload[];
}

/** Payload for `POST /api/ingredients`.
 *  Creates a standalone ingredient not tied to a new monster creation.
 *  Handled by `CookingCreateService.createIngredient`. */
export interface CreateIngredientPayload {
  name: string;
  componentTypeId: ComponentTypeName;
  creatureTypeId: string;
  notes: string | null;
  /** Monster IDs to link as sources in `ingredient_source_monsters`. */
  sourceMonsterIds: string[];
}

/** Payload for `POST /api/recipes`.
 *  Handled by `CookingCreateService.createRecipe`. */
export interface CreateRecipePayload {
  name: string;
  tier: RecipeTier;
  dc: number;
  requiresHeat: boolean;
  bossEffect: string | null;
  notes: string | null;
  imageUrl: string | null;
  ingredients: CreateRecipeIngredientPayload[];
}

/** One ingredient slot in a recipe being created.
 *  `ingredientId` is optional — omit it to accept any ingredient of the given component type. */
export interface CreateRecipeIngredientPayload {
  componentTypeId: ComponentTypeName;
  /** When set, this slot requires a specific named ingredient. */
  ingredientId?: string;
}
