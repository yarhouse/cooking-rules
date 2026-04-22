import { Component, Input, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { Ingredient } from '../../../models/ingredient.model';
import { CookingDataService } from '../../../services/cooking-data.service';
import { InventoryService } from '../../../services/inventory.service';
import { IngredientDetailDialogComponent } from '../ingredient-detail-dialog/ingredient-detail-dialog.component';

@Component({
  selector: 'app-ingredient-card',
  imports: [MatCardModule, MatChipsModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './ingredient-card.component.html',
  styleUrl: './ingredient-card.component.scss',
})
export class IngredientCardComponent {
  @Input({ required: true }) ingredient!: Ingredient;

  private dataService = inject(CookingDataService);
  private inventoryService = inject(InventoryService);
  private dialog = inject(MatDialog);

  openDetails(): void {
    this.dialog.open(IngredientDetailDialogComponent, {
      data: this.ingredient,
      width: '560px',
      maxWidth: '95vw',
    });
  }

  get componentTypeName(): string {
    return this.dataService.getComponentType(this.ingredient.componentTypeId)?.name ?? this.ingredient.componentTypeId;
  }

  get creatureTypeName(): string {
    return this.dataService.getCreatureType(this.ingredient.creatureTypeId)?.name ?? this.ingredient.creatureTypeId;
  }

  get effect() {
    return this.dataService.getEffectFor(this.ingredient.componentTypeId, this.ingredient.creatureTypeId);
  }

  private get bestMatchHarvestComponent() {
    const comps = this.dataService.getHarvestComponents().filter(
      hc => hc.creatureTypeId === this.ingredient.creatureTypeId &&
            hc.edibleAs === this.ingredient.componentTypeId
    );
    return comps.sort((a, b) => a.componentDc - b.componentDc)[0] ?? null;
  }

  get quantity(): number {
    return this.dataService.getCookingIngredientCount(
      this.ingredient.creatureTypeId,
      this.ingredient.componentTypeId
    );
  }

  adjust(delta: number): void {
    const hc = this.bestMatchHarvestComponent;
    if (hc) {
      this.inventoryService.updateHarvestQuantity(hc.id, 'common', delta);
    } else {
      this.inventoryService.updateQuantity(this.ingredient.id, delta);
    }
  }
}
