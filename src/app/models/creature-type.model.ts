import { ComponentTypeName } from './component-type.model';

/** A creature category (e.g. Aberration, Beast, Undead) that determines
 *  which component types can be harvested from it and which skill is used.
 *  Sourced from the `creature_types` table; consumed by `CookingDataService`,
 *  `HarvestingComponent`, and the browse/filter UI. */
export interface CreatureType {
  id: string;
  name: string;
  /** Component types that monsters of this category can yield.
   *  Drives the component filter on the Browse page and the
   *  available-components list in `CookingDataService.cookingIngredientAvailability`. */
  availableComponents: ComponentTypeName[];
  /** Ability/tool check used to harvest from this creature type (e.g. "Medicine").
   *  `null` when the creature type has no standard harvesting skill. */
  harvestSkill: string | null;
}
