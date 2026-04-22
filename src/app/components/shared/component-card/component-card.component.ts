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

@Component({
  selector: 'app-component-card',
  imports: [MatCardModule, MatChipsModule, MatIconModule, MatButtonModule],
  templateUrl: './component-card.component.html',
  styleUrl: './component-card.component.scss',
})
export class ComponentCardComponent {
  @Input({ required: true }) component!: HarvestComponent;

  private dataService = inject(CookingDataService);
  private dialog = inject(MatDialog);

  get effect() {
    if (!this.component.isEdible || !this.component.edibleAs) return null;
    return this.dataService.getEffectFor(this.component.edibleAs as ComponentTypeName, this.component.creatureTypeId);
  }

  get componentTypeName(): string {
    if (!this.component.edibleAs) return '';
    return this.dataService.getComponentType(this.component.edibleAs as ComponentTypeName)?.name ?? this.component.edibleAs;
  }

  openDetails(): void {
    this.dialog.open(ComponentDetailDialogComponent, {
      data: this.component,
      width: '560px',
      maxWidth: '95vw',
    });
  }
}
