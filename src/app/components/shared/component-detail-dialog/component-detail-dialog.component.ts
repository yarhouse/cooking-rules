import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { HarvestComponent } from '../../../models/harvest-component.model';
import { ComponentTypeName } from '../../../models/component-type.model';
import { CookingDataService } from '../../../services/cooking-data.service';
import { RarityLabelComponent } from '../rarity-label/rarity-label.component';

/**
 * Dialog showing full details for a `HarvestComponent` — DC, volatility,
 * edibility, cooking effect (when applicable), and related recipes.
 *
 * Opened by `ComponentCardComponent.openDetails()`.
 */
@Component({
  selector: 'app-component-detail-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatDividerModule, RarityLabelComponent],
  templateUrl: './component-detail-dialog.component.html',
  styleUrl: './component-detail-dialog.component.scss',
})
export class ComponentDetailDialogComponent {
  /** The harvest component being displayed, injected from `MatDialog` data. */
  readonly component = inject<HarvestComponent>(MAT_DIALOG_DATA);
  private dataService = inject(CookingDataService);

  /** The cooking effect for this component's edibleAs × creature type pairing,
   *  or `null` when the component is not edible. */
  get effect() {
    if (!this.component.isEdible || !this.component.edibleAs) return null;
    return this.dataService.getEffectFor(this.component.edibleAs as ComponentTypeName, this.component.creatureTypeId);
  }

  /** Display name for the component type this part counts as in recipes.
   *  Empty string when not edible. */
  get componentTypeName(): string {
    if (!this.component.edibleAs) return '';
    return this.dataService.getComponentType(this.component.edibleAs as ComponentTypeName)?.name ?? this.component.edibleAs;
  }

  /** All recipes that require the same component type as this part.
   *  Empty when the component is not edible. */
  get relatedRecipes() {
    if (!this.component.edibleAs) return [];
    return this.dataService.getRecipesContaining(this.component.edibleAs as ComponentTypeName);
  }
}
