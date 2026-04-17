export interface HarvestComponent {
  id: string;
  creatureTypeId: string;
  creatureTypeName: string;
  harvestSkill: string;
  name: string;
  componentDc: number;
  isEdible: boolean;
  edibleAs: string | null;   // ComponentTypeName if edible (blood, bone, etc.)
  isVolatile: boolean;
  notes: string | null;
}
