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
import { ComponentCardComponent } from '../shared/component-card/component-card.component';
import { RecipeTier } from '../../models/recipe.model';
import { CreateIngredientSourceDialogComponent } from '../shared/create-ingredient-source-dialog/create-ingredient-source-dialog.component';
import { CreateRecipeDialogComponent } from '../shared/create-recipe-dialog/create-recipe-dialog.component';

/**
 * Browse page — tabbed view to browse monsters, recipes, and harvest components
 * with independent filters for each tab.
 *
 * Each tab has its own search query and filter signals that independently
 * drive a computed filtered list. The three filter streams do not interact.
 */
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
    ComponentCardComponent,
  ],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.scss',
})
export class BrowseComponent {
  private dataService = inject(CookingDataService);
  private dialog = inject(MatDialog);

  /** Text search query for the Monsters tab. */
  monsterQuery = signal('');
  /** Text search query for the Recipes tab. */
  recipeQuery = signal('');
  /** Text search query for the Components tab. */
  componentQuery = signal('');

  /** Active creature type filter on the Monsters tab. `null` = all types. */
  selectedCreatureType = signal<string | null>(null);
  /** Active tier filter on the Recipes tab. `null` = all tiers. */
  selectedRecipeTier = signal<RecipeTier | null>(null);
  /** Active creature type filter on the Components tab. `null` = all types. */
  selectedComponentCreatureType = signal<string | null>(null);

  /** All creature types; used for filter chips on Monsters and Components tabs. */
  readonly creatureTypes = this.dataService.getCreatureTypes();
  readonly recipeTiers: RecipeTier[] = ['novice', 'journeyman', 'expert', 'artisan', 'boss'];

  /** Monsters matching `monsterQuery` and `selectedCreatureType`. */
  filteredMonsters = computed(() => {
    let monsters = this.dataService.getMonsters(this.monsterQuery() || undefined);
    if (this.selectedCreatureType()) {
      monsters = monsters.filter(m => m.creatureTypeId === this.selectedCreatureType());
    }
    return monsters;
  });

  /** Recipes matching `recipeQuery` and `selectedRecipeTier`. */
  filteredRecipes = computed(() => {
    let recipes = this.dataService.getRecipes(this.recipeQuery() || undefined);
    if (this.selectedRecipeTier()) {
      recipes = recipes.filter(r => r.tier === this.selectedRecipeTier());
    }
    return recipes;
  });

  /** Harvest components matching `componentQuery` and `selectedComponentCreatureType`. */
  filteredComponents = computed(() => {
    let components = this.dataService.getHarvestComponents();
    const q = this.componentQuery().toLowerCase();
    if (q) {
      components = components.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.creatureTypeName.toLowerCase().includes(q)
      );
    }
    if (this.selectedComponentCreatureType()) {
      components = components.filter(c => c.creatureTypeId === this.selectedComponentCreatureType());
    }
    return components;
  });

  /** Toggles the creature type filter on the Monsters tab. */
  toggleCreatureType(id: string): void {
    this.selectedCreatureType.set(this.selectedCreatureType() === id ? null : id);
  }

  /** Toggles the tier filter on the Recipes tab. */
  toggleRecipeTier(tier: RecipeTier): void {
    this.selectedRecipeTier.set(this.selectedRecipeTier() === tier ? null : tier);
  }

  /** Toggles the creature type filter on the Components tab. */
  toggleComponentCreatureType(id: string): void {
    this.selectedComponentCreatureType.set(this.selectedComponentCreatureType() === id ? null : id);
  }

  /** Opens the create-monster wizard dialog (API builds only). */
  openAddMonster(): void {
    this.dialog.open(CreateIngredientSourceDialogComponent, { width: '900px', maxWidth: '95vw', disableClose: true });
  }

  /** Opens the create-recipe dialog (API builds only). */
  openAddRecipe(): void {
    this.dialog.open(CreateRecipeDialogComponent, { width: '900px', maxWidth: '95vw' });
  }
}
