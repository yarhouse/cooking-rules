/** Category of a magic item recipe, matching the D&D 5e item type taxonomy.
 *  Used as a filter dimension on the Crafting page. */
export type MagicItemCategory =
  | 'ammunition' | 'armour'  | 'potion' | 'ring'   | 'rod'
  | 'scroll'     | 'staff'   | 'wand'   | 'weapon' | 'wondrous';

/** Human-readable labels for each `MagicItemCategory`.
 *  Used by the Crafting page filter chips and the item table header. */
export const MAGIC_ITEM_CATEGORY_LABELS: Record<MagicItemCategory, string> = {
  ammunition: 'Ammunition',
  armour:     'Armour',
  potion:     'Potion',
  ring:       'Ring',
  rod:        'Rod',
  scroll:     'Scroll',
  staff:      'Staff',
  wand:       'Wand',
  weapon:     'Weapon',
  wondrous:   'Wondrous Item',
};

/** One component requirement in a magic item crafting recipe.
 *  `InventoryService.craftMagicItem` iterates these to deduct from
 *  `harvestStock` when the player crafts an item. */
export interface MagicItemComponent {
  /** The creature type the component must come from, or `null` if any
   *  creature type is acceptable. */
  creatureTypeId: string | null;
  /** Name of the specific harvestable part required (e.g. "Venom Sac"). */
  componentName: string;
  /** Optional grouping tag used to match against `HarvestComponent.componentMetatype`
   *  when `componentName` alone is ambiguous. `null` when not needed. */
  metatag: string | null;
  /** Number of units of this component required. */
  quantity: number;
}

/** A magic item that can be crafted using harvested monster components.
 *  Sourced from `magic_item_recipes` + `magic_item_components` tables via
 *  `GET /api/magic-items`; cached in `CookingDataService._magicItems`.
 *
 *  Craftability is evaluated client-side by `CookingDataService.isMagicItemCraftable`,
 *  which checks `components` against `InventoryService.harvestStockMap` and
 *  `essenceType` against `InventoryService.essence`. */
export interface MagicItem {
  id: string;
  name: string;
  category: MagicItemCategory;
  /** Rarity string as stored in the DB (e.g. "uncommon", "very rare"). */
  rarity: string;
  /** Market value in gold pieces. `null` when not specified in the rulebook. */
  itemValueGp: number | null;
  /** Arcana/tool check DC to craft this item. `null` when not specified. */
  craftingDc: number | null;
  /** Time required to craft in hours. `null` when not specified. */
  craftingTimeHrs: number | null;
  /** The type of essence consumed during crafting (e.g. "necrotic", "fire").
   *  Matches keys in `InventoryService.essence`. `null` when no essence is required. */
  essenceType: string | null;
  notes: string | null;
  /** All component requirements for this recipe. Consumed by
   *  `CookingDataService.isMagicItemCraftable` and rendered in the Crafting page detail view. */
  components: MagicItemComponent[];
}
