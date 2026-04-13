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

@Component({
  selector: 'app-ingredient-detail-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatDividerModule],
  templateUrl: './ingredient-detail-dialog.component.html',
  styleUrl: './ingredient-detail-dialog.component.scss',
})
export class IngredientDetailDialogComponent {
  readonly ingredient = inject<Ingredient>(MAT_DIALOG_DATA);
  private dataService = inject(CookingDataService);
  private inventoryService = inject(InventoryService);
  private dialog = inject(MatDialog);
  private dialogRef = inject(MatDialogRef<IngredientDetailDialogComponent>);

  get componentTypeName(): string {
    return this.dataService.getComponentType(this.ingredient.componentTypeId)?.name ?? this.ingredient.componentTypeId;
  }

  get creatureTypeName(): string {
    return this.dataService.getCreatureType(this.ingredient.creatureTypeId)?.name ?? this.ingredient.creatureTypeId;
  }

  get effect() {
    return this.dataService.getEffectFor(this.ingredient.componentTypeId, this.ingredient.creatureTypeId);
  }

  get sourceMonsters() {
    return (this.ingredient.sourceMonsterIds ?? [])
      .map(id => this.dataService.getMonster(id))
      .filter(Boolean);
  }

  get relatedRecipes() {
    return this.dataService.getRecipesContaining(this.ingredient.componentTypeId);
  }

  get quantity(): number {
    return this.inventoryService.getQuantity(this.ingredient.id);
  }

  adjust(delta: number): void {
    this.inventoryService.updateQuantity(this.ingredient.id, delta);
  }

  get contextImageUrl(): string {
    return this.ingredient.componentTypeId === 'spice'
      ? 'images/context/spices.png'
      : 'images/context/ingredients-scene.png';
  }

  openRecipe(recipe: Recipe): void {
    const newRef = this.dialog.open(RecipeDetailDialogComponent, { data: recipe, width: '560px', maxWidth: '95vw' });
    newRef.afterOpened().subscribe(() => this.dialogRef.close());
  }

  openMonster(monster: Monster): void {
    const newRef = this.dialog.open(MonsterDetailDialogComponent, { data: monster, width: '560px', maxWidth: '95vw' });
    newRef.afterOpened().subscribe(() => this.dialogRef.close());
  }
}
