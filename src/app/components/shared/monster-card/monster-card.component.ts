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

/**
 * Card component that summarises a monster and its harvestable components.
 * Clicking opens `MonsterDetailDialogComponent` for the full monster sheet.
 *
 * ## Component resolution
 * `filteredHarvestComponents` selects which harvest parts to show:
 * - When `monster.selectedHarvestComponentIds` has entries, only those exact
 *   IDs are shown (precise selection from the edit page).
 * - Otherwise falls back to showing edible components filtered by
 *   `monster.harvestableComponents` plus all non-edible parts (legacy data).
 *
 * `cookingComponents` further filters to only edible parts and pairs each with
 * its `ComponentEffect` for display.
 */
@Component({
  selector: 'app-monster-card',
  imports: [MatCardModule, MatChipsModule, MatIconModule, MatButtonModule, MatTooltipModule, MatDividerModule, RarityLabelComponent, SkillBadgeComponent],
  templateUrl: './monster-card.component.html',
  styleUrl: './monster-card.component.scss',
})
export class MonsterCardComponent {
  /** The monster to display. Required. */
  @Input({ required: true }) monster!: Monster;

  private dataService = inject(CookingDataService);
  private inventoryService = inject(InventoryService);
  private dialog = inject(MatDialog);

  /** Opens the monster detail dialog with this monster as dialog data. */
  openDetails(): void {
    this.dialog.open(MonsterDetailDialogComponent, {
      data: this.monster,
      width: '560px',
      maxWidth: '95vw',
    });
  }

  /** Display name of the monster's creature type. Falls back to the raw ID. */
  get creatureTypeName(): string {
    return this.dataService.getCreatureType(this.monster.creatureTypeId)?.name ?? this.monster.creatureTypeId;
  }

  /** The ability/tool check used to harvest this creature type, or `null`. */
  get harvestSkill(): string | null {
    return this.dataService.getCreatureType(this.monster.creatureTypeId)?.harvestSkill ?? null;
  }

  /** Harvest components relevant to this specific monster.
   *  Prefers `selectedHarvestComponentIds` when present; falls back to
   *  type-level filtering by `harvestableComponents`. */
  private get filteredHarvestComponents(): HarvestComponent[] {
    const allForType = this.dataService.getHarvestComponentsByCreatureType(this.monster.creatureTypeId);
    const selectedIds = new Set(this.monster.selectedHarvestComponentIds ?? []);

    if (selectedIds.size > 0) {
      return allForType.filter(hc => selectedIds.has(hc.id));
    }

    const cookingTypes = new Set(this.monster.harvestableComponents);
    return allForType.filter(hc =>
      (!hc.isEdible || !hc.edibleAs) ||
      cookingTypes.has(hc.edibleAs as ComponentTypeName)
    );
  }

  /** Edible harvest components for this monster, each paired with its `ComponentEffect`. */
  get cookingComponents() {
    return this.filteredHarvestComponents
      .filter(hc => hc.isEdible && hc.edibleAs)
      .map(hc => ({
        hc,
        effect: this.dataService.getEffectFor(hc.edibleAs as ComponentTypeName, this.monster.creatureTypeId),
      }));
  }

  /** Non-edible harvest components for this monster (used in magic item crafting). */
  get craftingComponents(): HarvestComponent[] {
    return this.filteredHarvestComponents.filter(hc => !hc.isEdible || !hc.edibleAs);
  }

  /** The first named ingredient linked to this monster, or `null`.
   *  Boss monsters typically have a unique named ingredient drop. */
  get bossDrop(): Ingredient | null {
    return this.dataService.getIngredients().find(
      i => i.sourceMonsterIds?.includes(this.monster.id)
    ) ?? null;
  }

  /** Current inventory quantity of the boss drop ingredient. */
  get bossDropQuantity(): number {
    return this.bossDrop ? this.inventoryService.getQuantity(this.bossDrop.id) : 0;
  }

  /** Adjusts boss drop inventory by `delta`. Stops event propagation to prevent
   *  the card click from opening the detail dialog. */
  adjustBossDrop(delta: number, event: MouseEvent): void {
    event.stopPropagation();
    if (this.bossDrop) this.inventoryService.updateQuantity(this.bossDrop.id, delta);
  }
}
