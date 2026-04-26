import { Component, Input, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { HarvestComponent } from '../../../models/harvest-component.model';
import { ComponentTypeName } from '../../../models/component-type.model';
import { CookingDataService } from '../../../services/cooking-data.service';
import { ComponentDetailDialogComponent } from '../component-detail-dialog/component-detail-dialog.component';

/**
 * Card component for a single `HarvestComponent`. Shows the DC, volatility flag,
 * component type, and cooking effect (when edible). Clicking opens
 * `ComponentDetailDialogComponent`.
 *
 * Used on the Browse page's Components tab.
 */
@Component({
  selector: 'app-component-card',
  imports: [MatCardModule, MatChipsModule, MatIconModule, MatButtonModule],
  templateUrl: './component-card.component.html',
  styleUrl: './component-card.component.scss',
})
export class ComponentCardComponent {
  /** The harvest component to display. Required. */
  @Input({ required: true }) component!: HarvestComponent;

  private dataService = inject(CookingDataService);
  private dialog = inject(MatDialog);

  /** The cooking effect for this component, or `null` if not edible. */
  get effect() {
    if (!this.component.isEdible || !this.component.edibleAs) return null;
    return this.dataService.getEffectFor(this.component.edibleAs as ComponentTypeName, this.component.creatureTypeId);
  }

  /** Display name for the component type this part counts as (e.g. `'Flesh'`).
   *  Empty string when the component is not edible. */
  get componentTypeName(): string {
    if (!this.component.edibleAs) return '';
    return this.dataService.getComponentType(this.component.edibleAs as ComponentTypeName)?.name ?? this.component.edibleAs;
  }

  /** Opens the component detail dialog with this harvest component as dialog data. */
  openDetails(): void {
    this.dialog.open(ComponentDetailDialogComponent, {
      data: this.component,
      width: '560px',
      maxWidth: '95vw',
    });
  }
}
