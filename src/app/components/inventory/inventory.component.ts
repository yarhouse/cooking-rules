import { Component, inject, computed, signal } from '@angular/core';
import { SlicePipe } from '@angular/common';
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
import { Rarity } from '../../models/component-type.model';
import { Ingredient } from '../../models/ingredient.model';
import { HarvestComponent } from '../../models/harvest-component.model';

type GroupBy = 'component' | 'creature';

@Component({
  selector: 'app-inventory',
  imports: [
    FormsModule,
    RouterLink,
    SlicePipe,
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

  groupBy = signal<GroupBy>('component');

  readonly rarities: Rarity[] = ['uncommon', 'rare', 'very-rare', 'legendary', 'artifact'];

  readonly rarityLabels: Record<Rarity, string> = {
    uncommon: 'Uncommon',
    rare: 'Rare',
    'very-rare': 'Very Rare',
    legendary: 'Legendary',
    artifact: 'Artifact',
  };

  // ── Ingredients ─────────────────────────────────────────────────────

  readonly inventoryIngredients = computed(() => {
    const map = this.inventoryService.inventoryMap();
    return this.dataService.getIngredients().filter(i => (map.get(i.id) ?? 0) > 0);
  });

  readonly groupedIngredients = computed(() => {
    const ingredients = this.inventoryIngredients();
    const groups = new Map<string, { label: string; items: Ingredient[] }>();

    for (const ingredient of ingredients) {
      let key: string;
      let label: string;

      if (this.groupBy() === 'component') {
        key = ingredient.componentTypeId;
        label = this.dataService.getComponentType(ingredient.componentTypeId)?.name ?? key;
      } else {
        key = ingredient.creatureTypeId;
        label = this.dataService.getCreatureType(ingredient.creatureTypeId)?.name ?? key;
      }

      if (!groups.has(key)) groups.set(key, { label, items: [] });
      groups.get(key)!.items.push(ingredient);
    }

    return Array.from(groups.entries())
      .map(([key, value]) => ({ key, ...value }))
      .sort((a, b) => a.label.localeCompare(b.label));
  });

  getQuantity(ingredientId: string): number {
    return this.inventoryService.getQuantity(ingredientId);
  }

  getEffect(ingredient: Ingredient): string {
    return this.dataService.getEffectFor(ingredient.componentTypeId, ingredient.creatureTypeId)?.description ?? '';
  }

  getComponentName(id: string): string {
    return this.dataService.getComponentType(id as any)?.name ?? id;
  }

  getCreatureName(id: string): string {
    return this.dataService.getCreatureType(id)?.name ?? id;
  }

  adjust(ingredientId: string, delta: number): void {
    this.inventoryService.updateQuantity(ingredientId, delta);
  }

  adjustEssence(rarity: Rarity, delta: number): void {
    this.inventoryService.adjustEssence(rarity, delta);
  }

  getEssence(rarity: Rarity): number {
    return this.inventoryService.essence()[rarity] ?? 0;
  }

  // ── Harvest Stock ────────────────────────────────────────────────────

  harvestSearch = signal('');

  readonly harvestGrouped = computed(() => {
    const stockMap = this.inventoryService.harvestStockMap();
    const groups = new Map<string, { label: string; items: HarvestComponent[] }>();

    for (const comp of this.dataService.getHarvestComponents()) {
      if ((stockMap.get(comp.id) ?? 0) <= 0) continue;
      const label = this.dataService.getCreatureType(comp.creatureTypeId)?.name ?? comp.creatureTypeId;
      if (!groups.has(comp.creatureTypeId)) groups.set(comp.creatureTypeId, { label, items: [] });
      groups.get(comp.creatureTypeId)!.items.push(comp);
    }

    return Array.from(groups.entries())
      .map(([key, value]) => ({ key, ...value }))
      .sort((a, b) => a.label.localeCompare(b.label));
  });

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
