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
import { RarityLabelComponent } from '../shared/rarity-label/rarity-label.component';
import { CookingDataService } from '../../services/cooking-data.service';
import { Rarity, ComponentTypeName } from '../../models/component-type.model';
import { HarvestComponent } from '../../models/harvest-component.model';
import { MonsterRarity } from '../../models/monster.model';
import { Ingredient } from '../../models/ingredient.model';

/** Controls how the harvest stock section groups components.
 *  `'creature'` groups by source creature type; `'metatype'` groups by
 *  `HarvestComponent.componentMetatype` (e.g. organ, integument). */
export type ComponentGroupBy = 'creature' | 'metatype';

/** One harvest stock row within a `componentsGrouped` group. */
export type HarvestRow = { comp: HarvestComponent; rarity: MonsterRarity; qty: number };

/**
 * Inventory page — tracks harvested components (with rarity), named ingredients,
 * and loose essence. Also shows a live count of craftable magic items.
 *
 * ## Sections
 * - **Essence** — adjust rarity-keyed essence counts (Frail, Robust, etc.)
 * - **Harvest Components** — all `HarvestStockEntry` rows, grouped and searched;
 *   `componentsGrouped` drives the display and respects `componentGroupBy`
 * - **Named Drops** — `Ingredient` items with stock > 0
 * - **Craftable Items** — `craftableCount` shows how many magic items can be crafted
 */
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
    RarityLabelComponent,
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss',
})
export class InventoryComponent {
  readonly inventoryService = inject(InventoryService);
  private dataService = inject(CookingDataService);

  /** Controls how the harvest stock list is grouped. Toggled by the button-toggle. */
  componentGroupBy = signal<ComponentGroupBy>('creature');

  readonly rarities: Rarity[] = ['uncommon', 'rare', 'very-rare', 'legendary', 'artifact'];

  /** Adjusts essence for a rarity tier by a delta. */
  adjustEssence(rarity: Rarity, delta: number): void {
    this.inventoryService.adjustEssence(rarity, delta);
  }

  /** @returns Current essence count for a rarity tier. */
  getEssence(rarity: Rarity): number {
    return this.inventoryService.essence()[rarity] ?? 0;
  }

  /** @returns Display name for a component type ID. Falls back to the raw ID. */
  getComponentName(id: string): string {
    return this.dataService.getComponentType(id as ComponentTypeName)?.name ?? id;
  }

  /** @returns Display name for a creature type ID. Falls back to the raw ID. */
  getCreatureName(id: string): string {
    return this.dataService.getCreatureType(id)?.name ?? id;
  }

  // ── Components (Harvest Stock) ───────────────────────────────────────

  /** Text query for the harvest component quick-add search. Shows up to 10 results. */
  harvestSearch = signal('');

  /** Harvest stock items grouped by creature type or metatype (depending on
   *  `componentGroupBy`), sorted alphabetically with a "Unique" group last.
   *  Re-evaluated when `harvestStock` or `componentGroupBy` changes. */
  readonly componentsGrouped = computed(() => {
    const stock = this.inventoryService.harvestStock();
    const mode = this.componentGroupBy();

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

  /** Quick-add search results: harvest components matching `harvestSearch`, capped at 10.
   *  Empty when the query is blank. */
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

  /** Number of magic items the player can currently craft with their stock.
   *  Shown in the Crafting page link badge. Re-evaluated when stock or essence changes. */
  readonly craftableCount = computed(() => {
    const stockMap = this.inventoryService.harvestTotalMap();
    const essence = this.inventoryService.essence();
    return this.dataService.getMagicItems()
      .filter(item => this.dataService.isMagicItemCraftable(item, stockMap, essence))
      .length;
  });

  /** @returns Total harvest quantity across all rarities for a component. */
  getHarvestQty(id: string): number {
    return this.inventoryService.getTotalHarvestQuantity(id);
  }

  /** Adjusts harvest stock for a specific component × rarity combination. */
  adjustHarvest(id: string, rarity: MonsterRarity, delta: number): void {
    this.inventoryService.updateHarvestQuantity(id, rarity, delta);
  }

  /** Adds 1 unit of a component at 'common' rarity from the quick-add search.
   *  Use the Harvesting page to add with a specific monster rarity. */
  addFromSearch(comp: HarvestComponent): void {
    this.inventoryService.updateHarvestQuantity(comp.id, 'common', 1);
    this.harvestSearch.set('');
  }

  // ── Named Drops (boss / unique ingredients) ──────────────────────────

  /** All named ingredients with stock > 0, sorted alphabetically.
   *  Drives the Named Drops section. */
  readonly namedDropsInStock = computed((): Array<{ ingredient: Ingredient; qty: number }> => {
    const stockMap = this.inventoryService.inventoryMap();
    return this.dataService.getIngredients()
      .filter(i => (stockMap.get(i.id) ?? 0) > 0)
      .map(i => ({ ingredient: i, qty: stockMap.get(i.id)! }))
      .sort((a, b) => a.ingredient.name.localeCompare(b.ingredient.name));
  });

  /** @returns Named ingredient stock quantity. */
  getIngredientQty(id: string): number {
    return this.inventoryService.getQuantity(id);
  }

  /** Adjusts a named ingredient's stock quantity. */
  adjustIngredient(id: string, delta: number): void {
    this.inventoryService.updateQuantity(id, delta);
  }

}
