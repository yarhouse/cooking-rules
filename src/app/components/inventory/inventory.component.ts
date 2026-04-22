import { Component, inject, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { CookingDataService } from '../../services/cooking-data.service';
import { Rarity, ComponentTypeName } from '../../models/component-type.model';
import { HarvestComponent } from '../../models/harvest-component.model';
import { MonsterRarity } from '../../models/monster.model';
import { Ingredient } from '../../models/ingredient.model';

type ComponentGroupBy = 'creature' | 'metatype';

@Component({
  selector: 'app-inventory',
  imports: [
    FormsModule,
    RouterLink,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss',
})
export class InventoryComponent {
  readonly inventoryService = inject(InventoryService);
  private dataService = inject(CookingDataService);

  componentGroupBy = signal<ComponentGroupBy>('creature');

  readonly rarities: Rarity[] = ['uncommon', 'rare', 'very-rare', 'legendary', 'artifact'];

  readonly rarityLabels: Record<Rarity, string> = {
    uncommon: 'Uncommon',
    rare: 'Rare',
    'very-rare': 'Very Rare',
    legendary: 'Legendary',
    artifact: 'Artifact',
  };

  adjustEssence(rarity: Rarity, delta: number): void {
    this.inventoryService.adjustEssence(rarity, delta);
  }

  getEssence(rarity: Rarity): number {
    return this.inventoryService.essence()[rarity] ?? 0;
  }

  getComponentName(id: string): string {
    return this.dataService.getComponentType(id as ComponentTypeName)?.name ?? id;
  }

  getCreatureName(id: string): string {
    return this.dataService.getCreatureType(id)?.name ?? id;
  }

  // ── Components (Harvest Stock) ───────────────────────────────────────

  harvestSearch = signal('');

  readonly componentsGrouped = computed(() => {
    const stock = this.inventoryService.harvestStock();
    const mode = this.componentGroupBy();

    type HarvestRow = { comp: HarvestComponent; rarity: MonsterRarity; qty: number };
    const groups = new Map<string, { label: string; items: HarvestRow[] }>();

    for (const entry of stock) {
      if (entry.quantity <= 0) continue;
      const comp = this.dataService.getHarvestComponent(entry.harvestComponentId);
      if (!comp) continue;

      let key: string;
      let label: string;

      if (mode === 'creature') {
        key = comp.creatureTypeId;
        label = this.dataService.getCreatureType(comp.creatureTypeId)?.name ?? comp.creatureTypeId;
      } else {
        key = comp.componentMetatype ?? '__unique';
        label = comp.componentMetatype ? this.getMetatypeLabel(comp.componentMetatype) : 'Unique';
      }

      if (!groups.has(key)) groups.set(key, { label, items: [] });
      groups.get(key)!.items.push({ comp, rarity: entry.rarity, qty: entry.quantity });
    }

    return Array.from(groups.entries())
      .map(([key, value]) => ({ key, ...value }))
      .sort((a, b) => {
        if (a.key === '__unique') return 1;
        if (b.key === '__unique') return -1;
        return a.label.localeCompare(b.label);
      });
  });

  private getMetatypeLabel(metatype: string): string {
    const fromComponentType = this.dataService.getComponentType(metatype as ComponentTypeName)?.name;
    if (fromComponentType) return fromComponentType;
    return metatype.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  readonly harvestSearchResults = computed(() => {
    const q = this.harvestSearch().toLowerCase().trim();
    if (!q) return [];
    return this.dataService.getHarvestComponents()
      .filter(hc => {
        const creatureName = this.dataService.getCreatureType(hc.creatureTypeId)?.name ?? '';
        return hc.name.toLowerCase().includes(q) || creatureName.toLowerCase().includes(q);
      })
      .slice(0, 10);
  });

  readonly craftableCount = computed(() => {
    const stockMap = this.inventoryService.harvestTotalMap();
    const essence = this.inventoryService.essence();
    return this.dataService.getMagicItems()
      .filter(item => this.dataService.isMagicItemCraftable(item, stockMap, essence))
      .length;
  });

  getHarvestQty(id: string): number {
    return this.inventoryService.getTotalHarvestQuantity(id);
  }

  adjustHarvest(id: string, rarity: MonsterRarity, delta: number): void {
    this.inventoryService.updateHarvestQuantity(id, rarity, delta);
  }

  addFromSearch(comp: HarvestComponent): void {
    // Defaults to 'common' — use the Harvesting page for rarity-tracked additions
    this.inventoryService.updateHarvestQuantity(comp.id, 'common', 1);
    this.harvestSearch.set('');
  }

  // ── Named Drops (boss / unique ingredients) ──────────────────────────

  readonly namedDropsInStock = computed((): Array<{ ingredient: Ingredient; qty: number }> => {
    const stockMap = this.inventoryService.inventoryMap();
    return this.dataService.getIngredients()
      .filter(i => (stockMap.get(i.id) ?? 0) > 0)
      .map(i => ({ ingredient: i, qty: stockMap.get(i.id)! }))
      .sort((a, b) => a.ingredient.name.localeCompare(b.ingredient.name));
  });

  getIngredientQty(id: string): number {
    return this.inventoryService.getQuantity(id);
  }

  adjustIngredient(id: string, delta: number): void {
    this.inventoryService.updateQuantity(id, delta);
  }

  getComponentTypeName(id: string): string {
    return this.dataService.getComponentType(id as ComponentTypeName)?.name ?? id;
  }
}
