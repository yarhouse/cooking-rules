import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Ingredient } from '../../../models/ingredient.model';
import { Monster } from '../../../models/monster.model';
import { Recipe } from '../../../models/recipe.model';
import { CookingDataService } from '../../../services/cooking-data.service';
import { InventoryService } from '../../../services/inventory.service';
import { MonsterDetailDialogComponent } from '../monster-detail-dialog/monster-detail-dialog.component';
import { RecipeDetailDialogComponent } from '../recipe-detail-dialog/recipe-detail-dialog.component';

/**
 * Dialog showing full ingredient details — component type, creature source,
 * cooking effect, source monsters, related recipes, and an inventory counter.
 *
 * Opening a recipe or monster link closes this dialog first to avoid stacking.
 * Opened by `IngredientCardComponent.openDetails()`.
 */
@Component({
  selector: 'app-ingredient-detail-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatDividerModule],
  templateUrl: './ingredient-detail-dialog.component.html',
  styleUrl: './ingredient-detail-dialog.component.scss',
})
export class IngredientDetailDialogComponent {
  /** The ingredient being displayed, injected from `MatDialog` data. */
  readonly ingredient = inject<Ingredient>(MAT_DIALOG_DATA);
  private dataService = inject(CookingDataService);
  private inventoryService = inject(InventoryService);
  private dialog = inject(MatDialog);
  private dialogRef = inject(MatDialogRef<IngredientDetailDialogComponent>);

  /** Display name for the ingredient's component type. Falls back to the raw ID. */
  get componentTypeName(): string {
    return this.dataService.getComponentType(this.ingredient.componentTypeId)?.name ?? this.ingredient.componentTypeId;
  }

  /** Display name for the ingredient's source creature type. Falls back to the raw ID. */
  get creatureTypeName(): string {
    return this.dataService.getCreatureType(this.ingredient.creatureTypeId)?.name ?? this.ingredient.creatureTypeId;
  }

  /** The `ComponentEffect` for this ingredient's component × creature pairing. */
  get effect() {
    return this.dataService.getEffectFor(this.ingredient.componentTypeId, this.ingredient.creatureTypeId);
  }

  /** Resolved `Monster` objects for each `sourceMonsterIds` entry.
   *  Filters out unresolved IDs (e.g. deleted monsters). */
  get sourceMonsters() {
    return (this.ingredient.sourceMonsterIds ?? [])
      .map(id => this.dataService.getMonster(id))
      .filter(Boolean);
  }

  /** All recipes that require this ingredient's component type. */
  get relatedRecipes() {
    return this.dataService.getRecipesContaining(this.ingredient.componentTypeId);
  }

  /** Current named inventory quantity from `InventoryService.inventory`. */
  get quantity(): number {
    return this.inventoryService.getQuantity(this.ingredient.id);
  }

  /** Adjusts the named ingredient's inventory quantity by `delta`. */
  adjust(delta: number): void {
    this.inventoryService.updateQuantity(this.ingredient.id, delta);
  }

  /** Context image URL — spice ingredients use a different illustration. */
  get contextImageUrl(): string {
    return this.ingredient.componentTypeId === 'spice'
      ? 'images/context/spices.png'
      : 'images/context/ingredients-scene.png';
  }

  /** Opens the recipe detail dialog and closes this dialog once it opens. */
  openRecipe(recipe: Recipe): void {
    const newRef = this.dialog.open(RecipeDetailDialogComponent, { data: recipe, width: '560px', maxWidth: '95vw' });
    newRef.afterOpened().subscribe(() => this.dialogRef.close());
  }

  /** Opens the monster detail dialog and closes this dialog once it opens. */
  openMonster(monster: Monster): void {
    const newRef = this.dialog.open(MonsterDetailDialogComponent, { data: monster, width: '560px', maxWidth: '95vw' });
    newRef.afterOpened().subscribe(() => this.dialogRef.close());
  }
}
