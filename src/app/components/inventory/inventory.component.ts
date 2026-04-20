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
    const stockMap = this.inventoryService.harvestStockMap();
    const mode = this.componentGroupBy();
    const groups = new Map<string, { label: string; items: HarvestComponent[] }>();

    for (const comp of this.dataService.getHarvestComponents()) {
      if ((stockMap.get(comp.id) ?? 0) <= 0) continue;

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
      groups.get(key)!.items.push(comp);
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
    const stockMap = this.inventoryService.harvestStockMap();
    const essence = this.inventoryService.essence();
    return this.dataService.getMagicItems()
      .filter(item => this.dataService.isMagicItemCraftable(item, stockMap, essence))
      .length;
  });

  getHarvestQty(id: string): number {
    return this.inventoryService.getHarvestQuantity(id);
  }

  adjustHarvest(id: string, delta: number): void {
    this.inventoryService.updateHarvestQuantity(id, delta);
  }

  addFromSearch(comp: HarvestComponent): void {
    this.inventoryService.updateHarvestQuantity(comp.id, 1);
    this.harvestSearch.set('');
  }
}
