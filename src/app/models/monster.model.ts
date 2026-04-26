import { ComponentTypeName } from './component-type.model';

/** Rarity of a monster; drives which tier of ingredient it yields and
 *  which rarity-scaled effects apply when its components are cooked.
 *  'common' is the baseline; 'legendary' produces artifact-tier effects. */
export type MonsterRarity = 'common' | 'uncommon' | 'rare' | 'very-rare' | 'legendary';

/** A harvestable creature — either a rulebook entry or a user-created custom monster.
 *  Sourced from the `monsters` + `monster_harvestable_components` tables via
 *  `GET /api/monsters`; cached in `CookingDataService._monsters`.
 *
 *  Custom monsters (created via `CookingCreateService`) are persisted to the
 *  API and merged back into the signal; they carry `isCustom: true`. */
export interface Monster {
  id: string;
  name: string;
  /** Foreign key into `CreatureType.id`. Drives which components are available
   *  and which skill is used during harvesting. */
  creatureTypeId: string;
  rarity: MonsterRarity;
  /** When `true`, this monster uses the boss-tier recipe slot and may unlock
   *  the `bossEffect` on recipes that list one. */
  isBoss?: boolean;
  /** The subset of the creature type's component types that this specific
   *  monster can yield (e.g. a Zombie yields flesh + bone but not blood).
   *  Used by `CookingDataService.cookingIngredientAvailability` to build
   *  the ingredient count map. */
  harvestableComponents: ComponentTypeName[];
  /** IDs of `HarvestComponent` rows selected for this monster on the edit page.
   *  Includes both edible and non-edible parts. Used by `HarvestingComponent`
   *  to show the monster-specific component list. */
  selectedHarvestComponentIds?: string[];
  notes?: string;
  /** `true` for user-created monsters; `false`/absent for rulebook entries. */
  isCustom?: boolean;
  /** ISO 8601 timestamp; present only for custom monsters. */
  createdAt?: string;
}
