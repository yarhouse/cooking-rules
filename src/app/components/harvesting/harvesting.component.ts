import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { CookingDataService } from '../../services/cooking-data.service';
import { RarityLabelComponent } from '../shared/rarity-label/rarity-label.component';
import { SkillBadgeComponent } from '../shared/skill-badge/skill-badge.component';
import { InventoryService } from '../../services/inventory.service';
import { HarvestComponent } from '../../models/harvest-component.model';
import { Monster, MonsterRarity } from '../../models/monster.model';
import { Ingredient } from '../../models/ingredient.model';

/**
 * Harvesting reference page — browse monster components by creature type and
 * individual monster, track harvest stock, and view boss-specific named drops.
 *
 * ## Data flow
 * 1. `creatureTypes` populates the creature type chip row (static, loaded once).
 * 2. Selecting a creature type sets `selectedCreatureTypeId`, which drives:
 *    - `selectedComponents` — all harvest components for the type, sorted by DC
 *    - `componentsByDc` — the same list grouped into DC bands for the reference table
 *    - `monstersForType` — monsters of that type, sorted by rarity then name
 * 3. Selecting a monster sets `selectedMonsterId`, which drives:
 *    - `selectedMonster` — the resolved `Monster` object
 *    - `harvestComponentsForMonster` — components matching the monster's selected metatypes
 *    - `bossDropsForMonster` — named ingredients linked to this monster but not in its component list
 * 4. `adjust` / `adjustIngredient` write to `InventoryService` with the selected monster's rarity,
 *    so rarity-scaled stock is recorded correctly.
 */
@Component({
  selector: 'app-harvesting',
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatChipsModule,
    RarityLabelComponent,
    SkillBadgeComponent,
  ],
  templateUrl: './harvesting.component.html',
  styleUrl: './harvesting.component.scss',
})
export class HarvestingComponent {
  private dataService = inject(CookingDataService);
  private inventory   = inject(InventoryService);

  /**
   * Total harvest stock for a component across all rarity tiers.
   * Used in the creature-type reference table where rarity doesn't matter.
   * @param id - `HarvestComponent.id`
   */
  getQty(id: string): number {
    return this.inventory.getTotalHarvestQuantity(id);
  }

  /**
   * Harvest stock for a component at the selected monster's specific rarity.
   * Used in the monster-specific panel so the displayed count reflects only
   * the rarity tier that would be harvested from this monster.
   * @param id - `HarvestComponent.id`
   */
  getMonsterQty(id: string): number {
    const rarity = this.selectedMonster()?.rarity;
    if (!rarity) return 0;
    return this.inventory.getHarvestQuantity(id, rarity);
  }

  /**
   * Adjusts harvest stock for the selected monster's rarity tier.
   * @param id - `HarvestComponent.id`
   * @param delta - Amount to add (positive) or remove (negative)
   */
  adjust(id: string, delta: number): void {
    const rarity = this.selectedMonster()?.rarity;
    if (!rarity) return;
    this.inventory.updateHarvestQuantity(id, rarity, delta);
  }

  /** All creature types; used to populate the top filter row. Static — loaded once. */
  readonly creatureTypes = this.dataService.getCreatureTypes();
  /** ID of the currently selected creature type chip; `null` when none selected. */
  selectedCreatureTypeId = signal<string | null>(null);
  /** ID of the currently selected monster card; `null` when none selected. */
  selectedMonsterId = signal<string | null>(null);

  /** All harvest components for the selected creature type, sorted by DC then name.
   *  Empty when no creature type is selected. */
  readonly selectedComponents = computed((): HarvestComponent[] => {
    const id = this.selectedCreatureTypeId();
    if (!id) return [];
    return this.dataService.getHarvestComponentsByCreatureType(id).sort(
      (a, b) => a.componentDc - b.componentDc || a.name.localeCompare(b.name)
    );
  });

  /** The resolved `CreatureType` for the active filter selection, or `null`. */
  readonly selectedCreatureType = computed(() => {
    const id = this.selectedCreatureTypeId();
    return id ? this.dataService.getCreatureType(id) : null;
  });

  /** All monsters of the selected creature type, sorted rarity ascending then name.
   *  Used to populate the monster picker panel. */
  readonly monstersForType = computed((): Monster[] => {
    const id = this.selectedCreatureTypeId();
    if (!id) return [];
    const RARITY_ORDER: Record<string, number> = {
      common: 0, uncommon: 1, rare: 2, 'very-rare': 3, legendary: 4,
    };
    return this.dataService.getMonstersByType(id).sort(
      (a, b) => (RARITY_ORDER[a.rarity] ?? 0) - (RARITY_ORDER[b.rarity] ?? 0) || a.name.localeCompare(b.name)
    );
  });

  /** The resolved `Monster` for the active monster selection, or `undefined`. */
  readonly selectedMonster = computed((): Monster | undefined => {
    const id = this.selectedMonsterId();
    return id ? this.dataService.getMonster(id) : undefined;
  });

  /** Harvest components relevant to the selected monster. Filters the creature
   *  type's components to only those whose `componentMetatype` matches one of
   *  the monster's `harvestableComponents` types. */
  readonly harvestComponentsForMonster = computed((): HarvestComponent[] => {
    const monster = this.selectedMonster();
    if (!monster) return [];
    const metatypes = new Set(monster.harvestableComponents);
    return this.dataService.getHarvestComponentsByCreatureType(monster.creatureTypeId)
      .filter(hc => hc.componentMetatype != null && metatypes.has(hc.componentMetatype as never))
      .sort((a, b) => a.componentDc - b.componentDc || a.name.localeCompare(b.name));
  });

  /** Named ingredient drops for the selected monster that are not already
   *  represented in `harvestComponentsForMonster` (boss-specific or unique drops). */
  readonly bossDropsForMonster = computed((): Ingredient[] => {
    const monster = this.selectedMonster();
    if (!monster) return [];
    const coveredIds = new Set(this.harvestComponentsForMonster().map(hc => hc.id));
    return this.dataService.getIngredients()
      .filter(i => i.sourceMonsterIds?.includes(monster.id) && !coveredIds.has(i.id))
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  /** @returns Named ingredient stock quantity. */
  getIngredientQty(id: string): number {
    return this.inventory.getQuantity(id);
  }

  /** Adjusts a named ingredient's inventory quantity. */
  adjustIngredient(id: string, delta: number): void {
    this.inventory.updateQuantity(id, delta);
  }

  /** Selects a creature type chip; deselects if already active.
   *  Also resets `selectedMonsterId`. */
  selectCreatureType(id: string): void {
    const next = this.selectedCreatureTypeId() === id ? null : id;
    this.selectedCreatureTypeId.set(next);
    this.selectedMonsterId.set(null);
  }

  /** Selects a monster card; deselects if already active. */
  selectMonster(id: string): void {
    this.selectedMonsterId.set(this.selectedMonsterId() === id ? null : id);
  }

  /** Human-readable labels for each DC band in the component reference table. */
  readonly dcGroupLabels: Record<number, string | undefined> = {
    5: 'DC 5 — Easy',
    10: 'DC 10 — Moderate',
    15: 'DC 15 — Hard',
    20: 'DC 20 — Very Hard',
    25: 'DC 25 — Formidable',
  };

  /** `selectedComponents` grouped by DC value and sorted ascending.
   *  Consumed by the DC-band reference table in the template. */
  readonly componentsByDc = computed((): Array<{ dc: number; components: HarvestComponent[] }> => {
    const comps = this.selectedComponents();
    const groups = new Map<number, HarvestComponent[]>();
    for (const c of comps) {
      if (!groups.has(c.componentDc)) groups.set(c.componentDc, []);
      groups.get(c.componentDc)!.push(c);
    }
    return Array.from(groups.entries())
      .sort(([a], [b]) => a - b)
      .map(([dc, components]) => ({ dc, components }));
  });

  readonly COMPONENT_TYPE_LABELS: Record<string, string> = {
    blood: 'Blood', bone: 'Bone', brain: 'Brain', egg: 'Egg',
    eye: 'Eye', fat: 'Fat', flesh: 'Flesh', heart: 'Heart',
    liver: 'Liver', spice: 'Spice',
  };
}
