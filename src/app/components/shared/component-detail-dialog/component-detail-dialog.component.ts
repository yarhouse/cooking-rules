import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { HarvestComponent } from '../../../models/harvest-component.model';
import { ComponentTypeName } from '../../../models/component-type.model';
import { CookingDataService } from '../../../services/cooking-data.service';
import { RarityLabelComponent } from '../rarity-label/rarity-label.component';

@Component({
  selector: 'app-component-detail-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatDividerModule, RarityLabelComponent],
  templateUrl: './component-detail-dialog.component.html',
  styleUrl: './component-detail-dialog.component.scss',
})
export class ComponentDetailDialogComponent {
  readonly component = inject<HarvestComponent>(MAT_DIALOG_DATA);
  private dataService = inject(CookingDataService);

  get effect() {
    if (!this.component.isEdible || !this.component.edibleAs) return null;
    return this.dataService.getEffectFor(this.component.edibleAs as ComponentTypeName, this.component.creatureTypeId);
  }

  get componentTypeName(): string {
    if (!this.component.edibleAs) return '';
    return this.dataService.getComponentType(this.component.edibleAs as ComponentTypeName)?.name ?? this.component.edibleAs;
  }

  get relatedRecipes() {
    if (!this.component.edibleAs) return [];
    return this.dataService.getRecipesContaining(this.component.edibleAs as ComponentTypeName);
  }
}
