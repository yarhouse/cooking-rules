import { Component, Input, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { Monster } from '../../../models/monster.model';
import { CookingDataService } from '../../../services/cooking-data.service';
import { MonsterDetailDialogComponent } from '../monster-detail-dialog/monster-detail-dialog.component';

@Component({
  selector: 'app-monster-card',
  imports: [MatCardModule, MatChipsModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './monster-card.component.html',
  styleUrl: './monster-card.component.scss',
})
export class MonsterCardComponent {
  @Input({ required: true }) monster!: Monster;

  private dataService = inject(CookingDataService);
  private dialog = inject(MatDialog);

  openDetails(): void {
    this.dialog.open(MonsterDetailDialogComponent, {
      data: this.monster,
      width: '560px',
      maxWidth: '95vw',
    });
  }

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

  rarityClass(rarity: string): string {
    return `rarity-${rarity}`;
  }
}
