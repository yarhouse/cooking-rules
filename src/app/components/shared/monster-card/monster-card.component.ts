import { Component, Input, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { Monster } from '../../../models/monster.model';
import { RarityLabelComponent } from '../rarity-label/rarity-label.component';
import { SkillBadgeComponent } from '../skill-badge/skill-badge.component';
import { Ingredient } from '../../../models/ingredient.model';
import { HarvestComponent } from '../../../models/harvest-component.model';
import { ComponentTypeName } from '../../../models/component-type.model';
import { CookingDataService } from '../../../services/cooking-data.service';
import { InventoryService } from '../../../services/inventory.service';
import { MonsterDetailDialogComponent } from '../monster-detail-dialog/monster-detail-dialog.component';

const COOKING_METATYPES = new Set(['blood','bone','brain','egg','eye','fat','flesh','heart','liver','spice']);

@Component({
  selector: 'app-monster-card',
  imports: [MatCardModule, MatChipsModule, MatIconModule, MatButtonModule, MatTooltipModule, MatDividerModule, RarityLabelComponent, SkillBadgeComponent],
  templateUrl: './monster-card.component.html',
  styleUrl: './monster-card.component.scss',
})
export class MonsterCardComponent {
  @Input({ required: true }) monster!: Monster;

  private dataService = inject(CookingDataService);
  private inventoryService = inject(InventoryService);
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

  get harvestSkill(): string | null {
    return this.dataService.getCreatureType(this.monster.creatureTypeId)?.harvestSkill ?? null;
  }

  private get filteredHarvestComponents(): HarvestComponent[] {
    const allForType = this.dataService.getHarvestComponentsByCreatureType(this.monster.creatureTypeId);
    const selectedIds = new Set(this.monster.selectedHarvestComponentIds ?? []);

    if (selectedIds.size > 0) {
      return allForType.filter(hc => selectedIds.has(hc.id));
    }

    // Fallback: edible components filtered by harvestableComponents; all non-edible included
    const cookingTypes = new Set(this.monster.harvestableComponents);
    return allForType.filter(hc =>
      (!hc.isEdible || !hc.edibleAs) ||
      cookingTypes.has(hc.edibleAs as ComponentTypeName)
    );
  }

  get cookingComponents() {
    return this.filteredHarvestComponents
      .filter(hc => hc.isEdible && hc.edibleAs)
      .map(hc => ({
        hc,
        effect: this.dataService.getEffectFor(hc.edibleAs as ComponentTypeName, this.monster.creatureTypeId),
      }));
  }

  get craftingComponents(): HarvestComponent[] {
    return this.filteredHarvestComponents.filter(hc => !hc.isEdible || !hc.edibleAs);
  }

  get bossDrop(): Ingredient | null {
    return this.dataService.getIngredients().find(
      i => i.sourceMonsterIds?.includes(this.monster.id)
    ) ?? null;
  }

  get bossDropQuantity(): number {
    return this.bossDrop ? this.inventoryService.getQuantity(this.bossDrop.id) : 0;
  }

  adjustBossDrop(delta: number, event: MouseEvent): void {
    event.stopPropagation();
    if (this.bossDrop) this.inventoryService.updateQuantity(this.bossDrop.id, delta);
  }


}
