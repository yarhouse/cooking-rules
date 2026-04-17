export type ComponentTypeName =
  | 'blood' | 'bone' | 'brain' | 'egg' | 'eye'
  | 'fat' | 'flesh' | 'heart' | 'liver' | 'spice';

export type Rarity = 'uncommon' | 'rare' | 'very-rare' | 'legendary' | 'artifact';

export interface RarityScaling {
  uncommon: string;
  rare: string;
  veryRare: string;
  legendary: string;
}

export interface ComponentEffect {
  creatureTypeId: string;
  description: string;
  scaling?: RarityScaling;
}

export interface ComponentType {
  id: ComponentTypeName;
  name: string;
  description: string;
  effects: ComponentEffect[];
}
