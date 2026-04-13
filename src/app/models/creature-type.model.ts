import { ComponentTypeName } from './component-type.model';

export interface CreatureType {
  id: string;
  name: string;
  availableComponents: ComponentTypeName[];
}
