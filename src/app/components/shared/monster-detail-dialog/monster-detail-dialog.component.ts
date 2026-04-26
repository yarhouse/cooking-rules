import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { Monster, MonsterRarity } from '../../../models/monster.model';
import { RarityScaling } from '../../../models/component-type.model';
import { RarityLabelComponent } from '../rarity-label/rarity-label.component';
import { CookingDataService } from '../../../services/cooking-data.service';

@Component({
  selector: 'app-monster-detail-dialog',
  imports: [MatDialogModule, MatButtonModule, MatChipsModule, MatIconModule, MatDividerModule, RarityLabelComponent],
  templateUrl: './monster-detail-dialog.component.html',
  styleUrl: './monster-detail-dialog.component.scss',
})
export class MonsterDetailDialogComponent {
  readonly monster    = inject<Monster>(MAT_DIALOG_DATA);
  private dataService = inject(CookingDataService);
  private dialogRef   = inject(MatDialogRef<MonsterDetailDialogComponent>);
  private router      = inject(Router);

  get creatureTypeName(): string {
    return this.dataService.getCreatureType(this.monster.creatureTypeId)?.name ?? this.monster.creatureTypeId;
  }

  get monsterScalingKey(): keyof RarityScaling | null {
    const map: Partial<Record<MonsterRarity, keyof RarityScaling>> = {
      uncommon:    'uncommon',
      rare:        'rare',
      'very-rare': 'veryRare',
      legendary:   'legendary',
    };
    return map[this.monster.rarity] ?? null;
  }

  get ingredients() {
    return this.monster.harvestableComponents.map(cid => {
      const componentType = this.dataService.getComponentType(cid);
      const effect = this.dataService.getEffectFor(cid, this.monster.creatureTypeId);
      return { componentTypeId: cid, componentTypeName: componentType?.name ?? cid, effect };
    });
  }

  openEdit(): void {
    this.dialogRef.close();
    this.router.navigate(['/monsters', this.monster.id, 'edit']);
  }
}
