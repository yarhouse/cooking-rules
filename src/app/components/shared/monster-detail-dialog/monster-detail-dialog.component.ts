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

/**
 * Dialog that shows the full monster sheet — creature type, rarity, harvesting
 * skill, all harvestable components with their cooking effects, and an Edit button
 * for custom monsters.
 *
 * Opened by `MonsterCardComponent.openDetails()` with the `Monster` as dialog data.
 */
@Component({
  selector: 'app-monster-detail-dialog',
  imports: [MatDialogModule, MatButtonModule, MatChipsModule, MatIconModule, MatDividerModule, RarityLabelComponent],
  templateUrl: './monster-detail-dialog.component.html',
  styleUrl: './monster-detail-dialog.component.scss',
})
export class MonsterDetailDialogComponent {
  /** The monster being displayed, injected from `MatDialog` data. */
  readonly monster    = inject<Monster>(MAT_DIALOG_DATA);
  private dataService = inject(CookingDataService);
  private dialogRef   = inject(MatDialogRef<MonsterDetailDialogComponent>);
  private router      = inject(Router);

  /** Display name of the monster's creature type. Falls back to the raw ID. */
  get creatureTypeName(): string {
    return this.dataService.getCreatureType(this.monster.creatureTypeId)?.name ?? this.monster.creatureTypeId;
  }

  /** Maps the monster's rarity to the corresponding `RarityScaling` key so the
   *  template can look up the correct scaled effect text.
   *  `null` for `'common'` (no scaling at that tier). */
  get monsterScalingKey(): keyof RarityScaling | null {
    const map: Partial<Record<MonsterRarity, keyof RarityScaling>> = {
      uncommon:    'uncommon',
      rare:        'rare',
      'very-rare': 'veryRare',
      legendary:   'legendary',
    };
    return map[this.monster.rarity] ?? null;
  }

  /** Each harvestable component type paired with its component type name and
   *  `ComponentEffect` (for the cooking effect description). */
  get ingredients() {
    return this.monster.harvestableComponents.map(cid => {
      const componentType = this.dataService.getComponentType(cid);
      const effect = this.dataService.getEffectFor(cid, this.monster.creatureTypeId);
      return { componentTypeId: cid, componentTypeName: componentType?.name ?? cid, effect };
    });
  }

  /** Closes the dialog and navigates to the monster edit page. */
  openEdit(): void {
    this.dialogRef.close();
    this.router.navigate(['/monsters', this.monster.id, 'edit']);
  }
}
