export type MagicItemCategory =
  | 'ammunition' | 'armour'  | 'potion' | 'ring'   | 'rod'
  | 'scroll'     | 'staff'   | 'wand'   | 'weapon' | 'wondrous';

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

export interface MagicItemComponent {
  creatureTypeId: string | null;
  componentName: string;
  metatag: string | null;
  quantity: number;
}

export interface MagicItem {
  id: string;
  name: string;
  category: MagicItemCategory;
  rarity: string;
  itemValueGp: number | null;
  craftingDc: number | null;
  craftingTimeHrs: number | null;
  essenceType: string | null;
  notes: string | null;
  components: MagicItemComponent[];
}
