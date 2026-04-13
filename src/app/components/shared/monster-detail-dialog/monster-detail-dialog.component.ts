import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Monster } from '../../../models/monster.model';
import { Recipe } from '../../../models/recipe.model';
import { CookingDataService } from '../../../services/cooking-data.service';
import { RecipeDetailDialogComponent } from '../recipe-detail-dialog/recipe-detail-dialog.component';

@Component({
  selector: 'app-monster-detail-dialog',
  imports: [MatDialogModule, MatButtonModule, MatChipsModule, MatIconModule, MatDividerModule],
  templateUrl: './monster-detail-dialog.component.html',
  styleUrl: './monster-detail-dialog.component.scss',
})
export class MonsterDetailDialogComponent {
  readonly monster = inject<Monster>(MAT_DIALOG_DATA);
  private dataService = inject(CookingDataService);
  private dialog = inject(MatDialog);
  private dialogRef = inject(MatDialogRef<MonsterDetailDialogComponent>);

  get creatureTypeName(): string {
    return this.dataService.getCreatureType(this.monster.creatureTypeId)?.name ?? this.monster.creatureTypeId;
  }

  get ingredients() {
    return this.monster.harvestableComponents.map(cid => {
      const componentType = this.dataService.getComponentType(cid);
      const effect = this.dataService.getEffectFor(cid, this.monster.creatureTypeId);
      return { componentTypeId: cid, componentTypeName: componentType?.name ?? cid, effect };
    });
  }

  get relatedRecipes() {
    const seen = new Set<string>();
    const recipes = [];
    for (const ct of this.monster.harvestableComponents) {
      for (const r of this.dataService.getRecipesContaining(ct)) {
        if (!seen.has(r.id)) {
          seen.add(r.id);
          recipes.push(r);
        }
      }
    }
    return recipes;
  }

  rarityClass(rarity: string): string {
    return `rarity-${rarity}`;
  }

  openRecipe(recipe: Recipe): void {
    const newRef = this.dialog.open(RecipeDetailDialogComponent, { data: recipe, width: '560px', maxWidth: '95vw' });
    newRef.afterOpened().subscribe(() => this.dialogRef.close());
  }
}
