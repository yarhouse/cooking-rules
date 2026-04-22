import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { CookingDataService } from '../../services/cooking-data.service';
import { InventoryService } from '../../services/inventory.service';
import { HarvestComponent } from '../../models/harvest-component.model';
import { Monster, MonsterRarity } from '../../models/monster.model';
import { Ingredient } from '../../models/ingredient.model';

@Component({
  selector: 'app-harvesting',
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatChipsModule,
  ],
  templateUrl: './harvesting.component.html',
  styleUrl: './harvesting.component.scss',
})
export class HarvestingComponent {
  private dataService = inject(CookingDataService);
  private inventory   = inject(InventoryService);

  // Total across all rarities — used in the creature-type reference table
  getQty(id: string): number {
    return this.inventory.getTotalHarvestQuantity(id);
  }

  // Qty for the currently selected monster's rarity — used in the monster-specific panel
  getMonsterQty(id: string): number {
    const rarity = this.selectedMonster()?.rarity;
    if (!rarity) return 0;
    return this.inventory.getHarvestQuantity(id, rarity);
  }

  adjust(id: string, delta: number): void {
    const rarity = this.selectedMonster()?.rarity;
    if (!rarity) return;
    this.inventory.updateHarvestQuantity(id, rarity, delta);
  }

readonly creatureTypes = this.dataService.getCreatureTypes();
  selectedCreatureTypeId = signal<string | null>(null);
  selectedMonsterId = signal<string | null>(null);

  readonly selectedComponents = computed((): HarvestComponent[] => {
    const id = this.selectedCreatureTypeId();
    if (!id) return [];
    return this.dataService.getHarvestComponentsByCreatureType(id).sort(
      (a, b) => a.componentDc - b.componentDc || a.name.localeCompare(b.name)
    );
  });

  readonly selectedCreatureType = computed(() => {
    const id = this.selectedCreatureTypeId();
    return id ? this.dataService.getCreatureType(id) : null;
  });

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

  readonly selectedMonster = computed((): Monster | undefined => {
    const id = this.selectedMonsterId();
    return id ? this.dataService.getMonster(id) : undefined;
  });

  readonly harvestComponentsForMonster = computed((): HarvestComponent[] => {
    const monster = this.selectedMonster();
    if (!monster) return [];
    const metatypes = new Set(monster.harvestableComponents);
    return this.dataService.getHarvestComponentsByCreatureType(monster.creatureTypeId)
      .filter(hc => hc.componentMetatype != null && metatypes.has(hc.componentMetatype as never))
      .sort((a, b) => a.componentDc - b.componentDc || a.name.localeCompare(b.name));
  });

  readonly bossDropsForMonster = computed((): Ingredient[] => {
    const monster = this.selectedMonster();
    if (!monster) return [];
    const coveredIds = new Set(this.harvestComponentsForMonster().map(hc => hc.id));
    return this.dataService.getIngredients()
      .filter(i => i.sourceMonsterIds?.includes(monster.id) && !coveredIds.has(i.id))
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  getIngredientQty(id: string): number {
    return this.inventory.getQuantity(id);
  }

  adjustIngredient(id: string, delta: number): void {
    this.inventory.updateQuantity(id, delta);
  }

  selectCreatureType(id: string): void {
    const next = this.selectedCreatureTypeId() === id ? null : id;
    this.selectedCreatureTypeId.set(next);
    this.selectedMonsterId.set(null);
  }

  selectMonster(id: string): void {
    this.selectedMonsterId.set(this.selectedMonsterId() === id ? null : id);
  }

  readonly dcGroupLabels: Record<number, string | undefined> = {
    5: 'DC 5 — Easy',
    10: 'DC 10 — Moderate',
    15: 'DC 15 — Hard',
    20: 'DC 20 — Very Hard',
    25: 'DC 25 — Formidable',
  };

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
