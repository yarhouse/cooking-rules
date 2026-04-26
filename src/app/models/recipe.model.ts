import { ComponentTypeName } from './component-type.model';

/** Difficulty tier of a recipe. Determines the default DC (see `TIER_DC`)
 *  and how the recipe is grouped and sorted in the Browse and Recipe Builder pages. */
export type RecipeTier = 'novice' | 'journeyman' | 'expert' | 'artisan' | 'boss';

/** Default Cooking check DCs by tier.
 *  Boss recipes have variable DCs set per-recipe (`dc` field), so `TIER_DC.boss`
 *  is `0` as a sentinel — always read the recipe's own `dc` field for boss entries. */
export const TIER_DC: Record<RecipeTier, number> = {
  novice: 12,
  journeyman: 16,
  expert: 20,
  artisan: 24,
  boss: 0, // varies per recipe
};

/** One ingredient slot in a recipe. A slot is satisfied by:
 *  - Any ingredient whose `componentTypeId` matches, when `ingredientId` is absent.
 *  - Only the exact ingredient identified by `ingredientId`, when it is present.
 *
 *  `CookingDataService.matchRecipesToIngredients` uses this distinction to
 *  determine whether a recipe is fully coverable by the current selection. */
export interface RecipeIngredient {
  componentTypeId: ComponentTypeName;
  /** When set, this slot requires a specific named ingredient rather than
   *  any ingredient of the given component type. */
  ingredientId?: string;
}

/** A cooking recipe with its required ingredient slots and result.
 *  Sourced from `recipes` + `recipe_ingredients` tables via `GET /api/recipes`;
 *  cached in `CookingDataService._recipes`.
 *
 *  Custom recipes (via `CookingCreateService`) carry `isCustom: true` and are
 *  merged into the signal alongside rulebook entries. */
export interface Recipe {
  id: string;
  name: string;
  tier: RecipeTier;
  /** Cooking check DC. For non-boss tiers this equals `TIER_DC[tier]`;
   *  boss recipes carry their own DC from the DB. */
  dc: number;
  /** Ordered list of ingredient slots. Order matches display in recipe cards. */
  ingredients: RecipeIngredient[];
  /** Extra effect unlocked when a boss-rarity ingredient is used.
   *  Absent on recipes that have no boss variant. */
  bossEffect?: string;
  /** `false` only for Bloody Gazpacho, which is the sole recipe that does
   *  not require a heat source. `undefined` is treated as `true`. */
  requiresHeat?: boolean;
  notes?: string;
  imageUrl?: string;
  /** `true` for user-created recipes; absent for rulebook entries. */
  isCustom?: boolean;
  /** ISO 8601 timestamp; present only for custom recipes. */
  createdAt?: string;
}
