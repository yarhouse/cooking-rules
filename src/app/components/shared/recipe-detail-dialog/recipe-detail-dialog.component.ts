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

@Component({
  selector: 'app-recipe-detail-dialog',
  imports: [MatDialogModule, MatButtonModule, MatChipsModule, MatIconModule, MatDividerModule, MatTooltipModule],
  templateUrl: './recipe-detail-dialog.component.html',
  styleUrl: './recipe-detail-dialog.component.scss',
})
export class RecipeDetailDialogComponent {
  readonly recipe = inject<Recipe>(MAT_DIALOG_DATA);
  private dataService = inject(CookingDataService);

  get tierColor(): string { return TIER_COLORS[this.recipe.tier]; }
  get tierTextColor(): string { return TIER_TEXT_COLORS[this.recipe.tier]; }

  get ingredientDetails() {
    return this.recipe.ingredients.map(ri => {
      const ct = this.dataService.getComponentType(ri.componentTypeId);
      return {
        name: ct?.name ?? ri.componentTypeId,
        bossSpecific: ri.bossSpecific,
        effects: ct?.effects ?? [],
      };
    });
  }

  get noHeatNote(): string | null {
    return this.recipe.requiresHeat === false ? 'No heat source required' : null;
  }
}
