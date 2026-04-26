/** A specific harvestable part from a creature type — e.g. "Giant Spider Venom Sac".
 *  Sourced from the `harvest_components` table (208 rows) via
 *  `GET /api/harvest-components`; cached in `CookingDataService._harvestComponents`.
 *
 *  Each row belongs to a `creatureTypeId`; monsters select a subset via
 *  `selectedHarvestComponentIds`. The `HarvestingComponent` page uses these
 *  to show per-monster harvest tables with DCs and notes. */
export interface HarvestComponent {
  id: string;
  /** Foreign key into `CreatureType.id`. */
  creatureTypeId: string;
  /** Denormalised creature type name for display without a join. */
  creatureTypeName: string;
  /** Ability/tool check used to harvest this part (e.g. "Medicine", "Survival"). */
  harvestSkill: string;
  /** Display name of the harvestable part (e.g. "Venom Sac", "Carapace"). */
  name: string;
  /** Difficulty Class for the harvest check. */
  componentDc: number;
  /** Whether this part can be used as a cooking ingredient. When `true`,
   *  `edibleAs` identifies the component type it counts as in recipes. */
  isEdible: boolean;
  /** The `ComponentTypeName` this part substitutes for in a recipe slot.
   *  `null` when `isEdible` is `false`. Consumed by `CookingComponent`
   *  when building the combined harvest-item + ingredient list. */
  edibleAs: string | null;
  /** Whether harvesting or storing this part requires special handling
   *  (e.g. a volatile gland). Flagged in the Harvesting UI. */
  isVolatile: boolean;
  notes: string | null;
  /** Broad grouping used to cluster components in the Inventory page
   *  (e.g. "organ", "integument"). `null` when uncategorised. */
  componentMetatype: string | null;
}
