import { ComponentTypeName } from './component-type.model';

export type MonsterRarity = 'common' | 'uncommon' | 'rare' | 'very-rare' | 'legendary';

export interface Monster {
  id: string;
  name: string;
  creatureTypeId: string;
  rarity: MonsterRarity;
  harvestableComponents: ComponentTypeName[];
  notes?: string;
  isCustom?: boolean;
  createdAt?: string;
}
