import { ComponentTypeName } from './component-type.model';

export type RecipeTier = 'novice' | 'journeyman' | 'expert' | 'artisan' | 'boss';

export const TIER_DC: Record<RecipeTier, number> = {
  novice: 12,
  journeyman: 16,
  expert: 20,
  artisan: 24,
  boss: 0, // varies per recipe
};

export interface RecipeIngredient {
  componentTypeId: ComponentTypeName;
  bossSpecific?: string; // e.g. "Fiend (pygmy) brain"
}

export interface Recipe {
  id: string;
  name: string;
  tier: RecipeTier;
  dc: number;
  ingredients: RecipeIngredient[];
  bossEffect?: string;
  requiresHeat?: boolean; // false for Bloody Gazpacho
  notes?: string;
  imageUrl?: string;
  isCustom?: boolean;
  createdAt?: string;
}
