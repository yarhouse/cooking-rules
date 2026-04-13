import { Component, Input, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { Recipe, RecipeTier } from '../../../models/recipe.model';
import { CookingDataService } from '../../../services/cooking-data.service';
import { RecipeDetailDialogComponent } from '../recipe-detail-dialog/recipe-detail-dialog.component';

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
  selector: 'app-recipe-card',
  imports: [MatCardModule, MatChipsModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.scss',
})
export class RecipeCardComponent {
  @Input({ required: true }) recipe!: Recipe;

  private dataService = inject(CookingDataService);
  private dialog = inject(MatDialog);

  openDetails(): void {
    this.dialog.open(RecipeDetailDialogComponent, {
      data: this.recipe,
      width: '560px',
      maxWidth: '95vw',
    });
  }

  get tierColor(): string {
    return TIER_COLORS[this.recipe.tier];
  }

  get tierTextColor(): string {
    return TIER_TEXT_COLORS[this.recipe.tier];
  }

  get ingredientDetails() {
    return this.recipe.ingredients.map(ri => {
      const ct = this.dataService.getComponentType(ri.componentTypeId);
      return {
        name: ct?.name ?? ri.componentTypeId,
        bossSpecific: ri.bossSpecific,
      };
    });
  }

  get noHeatNote(): string | null {
    return this.recipe.requiresHeat === false ? 'No heat source required' : null;
  }
}
