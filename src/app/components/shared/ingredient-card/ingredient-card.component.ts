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

/**
 * Card component for a named ingredient showing its component type, creature
 * source, cooking effect, and a stock counter.
 *
 * ## Quantity and adjustment
 * `quantity` reads from `CookingDataService.cookingIngredientAvailability`
 * (the aggregate harvest stock count for the creature × component type pair).
 *
 * `adjust` writes to the best-matching `HarvestComponent` entry in
 * `InventoryService.harvestStock` when one exists; falls back to the named
 * ingredient entry in `InventoryService.inventory` when there is no matching
 * harvest component (e.g. vendor-bought or custom ingredients).
 */
@Component({
  selector: 'app-ingredient-card',
  imports: [MatCardModule, MatChipsModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './ingredient-card.component.html',
  styleUrl: './ingredient-card.component.scss',
})
export class IngredientCardComponent {
  /** The ingredient to display. Required. */
  @Input({ required: true }) ingredient!: Ingredient;

  private dataService = inject(CookingDataService);
  private inventoryService = inject(InventoryService);
  private dialog = inject(MatDialog);

  /** Opens the ingredient detail dialog. */
  openDetails(): void {
    this.dialog.open(IngredientDetailDialogComponent, {
      data: this.ingredient,
      width: '560px',
      maxWidth: '95vw',
    });
  }

  /** Display name for the ingredient's component type. Falls back to the raw ID. */
  get componentTypeName(): string {
    return this.dataService.getComponentType(this.ingredient.componentTypeId)?.name ?? this.ingredient.componentTypeId;
  }

  /** Display name for the ingredient's source creature type. Falls back to the raw ID. */
  get creatureTypeName(): string {
    return this.dataService.getCreatureType(this.ingredient.creatureTypeId)?.name ?? this.ingredient.creatureTypeId;
  }

  /** The cooking effect for this ingredient's component × creature pairing. */
  get effect() {
    return this.dataService.getEffectFor(this.ingredient.componentTypeId, this.ingredient.creatureTypeId);
  }

  /** The harvest component with the lowest DC that matches this ingredient's
   *  creature type and component type. Used as the stock target for `adjust`.
   *  `null` if no matching harvest component exists. */
  private get bestMatchHarvestComponent() {
    const comps = this.dataService.getHarvestComponents().filter(
      hc => hc.creatureTypeId === this.ingredient.creatureTypeId &&
            hc.edibleAs === this.ingredient.componentTypeId
    );
    return comps.sort((a, b) => a.componentDc - b.componentDc)[0] ?? null;
  }

  /** Aggregate stock count for this creature × component type pair (sum across
   *  all rarity tiers). Sourced from `CookingDataService.cookingIngredientAvailability`. */
  get quantity(): number {
    return this.dataService.getCookingIngredientCount(
      this.ingredient.creatureTypeId,
      this.ingredient.componentTypeId
    );
  }

  /** Adjusts inventory by `delta`. Routes to harvest stock when a matching
   *  `HarvestComponent` exists, otherwise adjusts the named ingredient entry. */
  adjust(delta: number): void {
    const hc = this.bestMatchHarvestComponent;
    if (hc) {
      this.inventoryService.updateHarvestQuantity(hc.id, 'common', delta);
    } else {
      this.inventoryService.updateQuantity(this.ingredient.id, delta);
    }
  }
}
