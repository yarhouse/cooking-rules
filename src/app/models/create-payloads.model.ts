import { ComponentTypeName } from './component-type.model';
import { MonsterRarity } from './monster.model';
import { RecipeTier } from './recipe.model';

/** Payload for POST /api/monsters.
 *  Creates an ingredient source (monster, plant, etc.) and any named
 *  ingredients harvested from it in a single server transaction. */
export interface CreateMonsterPayload {
  name: string;
  creatureTypeId: string;
  rarity: MonsterRarity;
  isBoss: boolean;
  notes: string | null;
  harvestableComponents: ComponentTypeName[];
  /** All selected harvest_component IDs (edible and non-edible). */
  selectedHarvestComponentIds: string[];
  /** One entry per harvestable component — named and annotated by the user. */
  ingredients: CreateMonsterIngredientPayload[];
}

export interface CreateMonsterIngredientPayload {
  name: string;
  componentTypeId: ComponentTypeName | null;
  notes: string | null;
}

/** Payload for PUT /api/monsters/:id.
 *  Server diffs selectedHarvestComponentIds to determine removals and cascades ingredient deletion. */
export interface UpdateMonsterPayload {
  name: string;
  rarity: MonsterRarity;
  isBoss: boolean;
  notes: string | null;
  /** Complete new set of edible component types. */
  harvestableComponents: ComponentTypeName[];
  /** Complete new set of all selected harvest_component IDs (edible + non-edible). */
  selectedHarvestComponentIds: string[];
  /** Ingredients to create for newly added edible components. */
  newIngredients: CreateMonsterIngredientPayload[];
}

/** Payload for POST /api/ingredients.
 *  Creates a standalone ingredient, optionally linked to existing sources. */

export interface CreateIngredientPayload {
  name: string;
  componentTypeId: ComponentTypeName;
  creatureTypeId: string;
  notes: string | null;
  sourceMonsterIds: string[];
}

/** Payload for POST /api/recipes. */
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

export interface CreateRecipeIngredientPayload {
  componentTypeId: ComponentTypeName;
  ingredientId?: string;
}
