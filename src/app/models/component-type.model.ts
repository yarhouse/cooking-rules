/** The ten harvestable component categories. Used as the primary ID for
 *  `ComponentType` and as a foreign key throughout ingredients, recipes,
 *  and harvest components. */
export type ComponentTypeName =
  | 'blood' | 'bone' | 'brain' | 'egg' | 'eye'
  | 'fat' | 'flesh' | 'heart' | 'liver' | 'spice';

/** Rarity levels used for component effect scaling and essence stock.
 *  Note: monsters use `MonsterRarity` which adds 'common' and 'very-rare'
 *  at the low/high ends; this type covers only the essence/effect range. */
export type Rarity = 'uncommon' | 'rare' | 'very-rare' | 'legendary' | 'artifact';

/** The graduated effect text for a component–creature pairing at each
 *  rarity tier. All four fields are required when scaling exists — the
 *  UI renders whichever tier applies to the ingredient being cooked. */
export interface RarityScaling {
  uncommon: string;
  rare: string;
  veryRare: string;
  legendary: string;
}

/** The cooking effect produced by using a specific component type harvested
 *  from a specific creature type. One `ComponentType` has one effect entry
 *  per creature type that yields it.
 *
 *  `scaling` is present when the effect changes with ingredient rarity;
 *  `description` holds the base/default text when scaling is absent. */
export interface ComponentEffect {
  creatureTypeId: string;
  /** Base effect description. When `scaling` is present this is the
   *  fallback/common-rarity text shown in the Rules page. */
  description: string;
  /** Rarity-graduated effect text. Present only when the rulebook defines
   *  different effects per tier. Consumed by `RulesComponent` and
   *  `InventoryService.getEffectOverride`. */
  scaling?: RarityScaling;
}

/** A harvestable component category with its full set of creature-type effects.
 *  `id` doubles as the `ComponentTypeName` used throughout the data model.
 *  Sourced from `component_types` + `component_effects` tables via
 *  `GET /api/component-types`; cached in `CookingDataService._componentTypes`. */
export interface ComponentType {
  id: ComponentTypeName;
  name: string;
  description: string;
  /** One entry per creature type that can yield this component.
   *  Used by `CookingDataService.getEffectFor` and the Rules reference page. */
  effects: ComponentEffect[];
}
