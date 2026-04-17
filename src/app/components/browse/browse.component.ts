import { Component, signal, inject, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { CookingDataService } from '../../services/cooking-data.service';
import { MonsterCardComponent } from '../shared/monster-card/monster-card.component';
import { RecipeCardComponent } from '../shared/recipe-card/recipe-card.component';
import { IngredientCardComponent } from '../shared/ingredient-card/ingredient-card.component';
import { RecipeTier } from '../../models/recipe.model';
import { CreateIngredientSourceDialogComponent } from '../shared/create-ingredient-source-dialog/create-ingredient-source-dialog.component';
import { CreateRecipeDialogComponent } from '../shared/create-recipe-dialog/create-recipe-dialog.component';

@Component({
  selector: 'app-browse',
  imports: [
    FormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,
    MonsterCardComponent,
    RecipeCardComponent,
    IngredientCardComponent,
  ],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.scss',
})
export class BrowseComponent {
  private dataService = inject(CookingDataService);
  private dialog = inject(MatDialog);

  monsterQuery = signal('');
  recipeQuery = signal('');
  ingredientQuery = signal('');

  selectedCreatureType = signal<string | null>(null);
  selectedRecipeTier = signal<RecipeTier | null>(null);
  selectedComponentType = signal<string | null>(null);

  readonly creatureTypes = this.dataService.getCreatureTypes();
  readonly componentTypes = this.dataService.getComponentTypes();
  readonly recipeTiers: RecipeTier[] = ['novice', 'journeyman', 'expert', 'artisan', 'boss'];

  filteredMonsters = computed(() => {
    let monsters = this.dataService.getMonsters(this.monsterQuery() || undefined);
    if (this.selectedCreatureType()) {
      monsters = monsters.filter(m => m.creatureTypeId === this.selectedCreatureType());
    }
    return monsters;
  });

  filteredRecipes = computed(() => {
    let recipes = this.dataService.getRecipes(this.recipeQuery() || undefined);
    if (this.selectedRecipeTier()) {
      recipes = recipes.filter(r => r.tier === this.selectedRecipeTier());
    }
    return recipes;
  });

  filteredIngredients = computed(() => {
    let ingredients = this.dataService.getIngredients(this.ingredientQuery() || undefined);
    if (this.selectedComponentType()) {
      ingredients = ingredients.filter(i => i.componentTypeId === this.selectedComponentType());
    }
    return ingredients;
  });

  toggleCreatureType(id: string): void {
    this.selectedCreatureType.set(this.selectedCreatureType() === id ? null : id);
  }

  toggleRecipeTier(tier: RecipeTier): void {
    this.selectedRecipeTier.set(this.selectedRecipeTier() === tier ? null : tier);
  }

  toggleComponentType(id: string): void {
    this.selectedComponentType.set(this.selectedComponentType() === id ? null : id);
  }

  openAddMonster(): void {
    this.dialog.open(CreateIngredientSourceDialogComponent, { width: '900px', maxWidth: '95vw', disableClose: true });
  }

  openAddRecipe(): void {
    this.dialog.open(CreateRecipeDialogComponent, { width: '900px', maxWidth: '95vw' });
  }
}
