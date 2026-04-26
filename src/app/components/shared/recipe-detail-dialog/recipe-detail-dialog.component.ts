import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Recipe, RecipeTier } from '../../../models/recipe.model';
import { CookingDataService } from '../../../services/cooking-data.service';

const TIER_COLORS: Record<RecipeTier, string> = {
  novice: '#c8e6c9',
  journeyman: '#fff9c4',
  expert: '#ffe0b2',
  artisan: '#f3e5f5',
  boss: '#fce4ec',
};
const TIER_TEXT_COLORS: Record<RecipeTier, string> = {
  novice: '#2e7d32',
  journeyman: '#f57f17',
  expert: '#e65100',
  artisan: '#6a1b9a',
  boss: '#880e4f',
};

/**
 * Dialog showing the full recipe sheet — tier, DC, ingredient slots with
 * component effects, boss effect (if any), and notes.
 *
 * `ingredientDetails` extends each slot with the component type's full
 * `effects` array so the template can show all creature-type effect variants.
 * Opened by `RecipeCardComponent.openDetails()` and `CookingComponent.openRecipe()`.
 */
@Component({
  selector: 'app-recipe-detail-dialog',
  imports: [MatDialogModule, MatButtonModule, MatChipsModule, MatIconModule, MatDividerModule, MatTooltipModule],
  templateUrl: './recipe-detail-dialog.component.html',
  styleUrl: './recipe-detail-dialog.component.scss',
})
export class RecipeDetailDialogComponent {
  /** The recipe being displayed, injected from `MatDialog` data. */
  readonly recipe = inject<Recipe>(MAT_DIALOG_DATA);
  private dataService = inject(CookingDataService);

  /** Background colour for the tier badge. */
  get tierColor(): string { return TIER_COLORS[this.recipe.tier]; }
  /** Text colour for the tier badge. */
  get tierTextColor(): string { return TIER_TEXT_COLORS[this.recipe.tier]; }

  /** Ingredient slots enriched with the component type name, optional specific
   *  ingredient name, and the full `ComponentEffect[]` array for the component.
   *  The effects array is used to show all possible cooking outcomes per slot. */
  get ingredientDetails() {
    return this.recipe.ingredients.map(ri => {
      const ct = this.dataService.getComponentType(ri.componentTypeId);
      const ingredient = ri.ingredientId ? this.dataService.getIngredient(ri.ingredientId) : null;
      return {
        name: ct?.name ?? ri.componentTypeId,
        ingredientName: ingredient?.name ?? null,
        effects: ct?.effects ?? [],
      };
    });
  }

  /** Returns a note string when the recipe does not require heat, or `null`. */
  get noHeatNote(): string | null {
    return this.recipe.requiresHeat === false ? 'No heat source required' : null;
  }
}
