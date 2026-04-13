import { ComponentTypeName } from './component-type.model';

export interface Ingredient {
  id: string;
  name: string;
  componentTypeId: ComponentTypeName;
  creatureTypeId: string;
  sourceMonsterIds?: string[];
  notes?: string;
  isCustom?: boolean;
  createdAt?: string;
}
