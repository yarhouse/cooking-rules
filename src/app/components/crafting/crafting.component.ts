import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CookingDataService } from '../../services/cooking-data.service';
import { RarityLabelComponent } from '../shared/rarity-label/rarity-label.component';
import { InventoryService } from '../../services/inventory.service';
import { MagicItem, MagicItemCategory, MAGIC_ITEM_CATEGORY_LABELS } from '../../models/magic-item.model';
import { CraftConfirmDialogComponent, CraftConfirmData } from './craft-confirm-dialog.component';

/**
 * Magic Item Crafting page — browse, filter, sort, and craft magic items.
 *
 * ## Data flow
 * 1. `craftableItemIds` evaluates craftability for every magic item against the
 *    current `harvestTotalMap` and `essence`, producing a `Set<string>` of IDs.
 * 2. `filteredMagicItems` applies search text, category, rarity, and the
 *    "craftable only" toggle to the full item list.
 * 3. `sortedItems` sorts the filtered list by the active column and direction.
 * 4. `pagedItems` slices the sorted list to the current page (20 items per page).
 * 5. `confirmCraft` opens the confirmation dialog; on confirm, calls
 *    `InventoryService.craftMagicItem` to deduct components and shows a snackbar.
 */
@Component({
  selector: 'app-crafting',
  imports: [
    FormsModule,
    TitleCasePipe,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatDividerModule,
    MatTooltipModule,
    MatExpansionModule,
    MatPaginatorModule,
    RarityLabelComponent,
  ],
  templateUrl: './crafting.component.html',
  styleUrl: './crafting.component.scss',
})
export class CraftingComponent {
  private dataService  = inject(CookingDataService);
  private inventory    = inject(InventoryService);
  private dialog       = inject(MatDialog);
  private snackBar     = inject(MatSnackBar);

  readonly CATEGORY_LABELS = MAGIC_ITEM_CATEGORY_LABELS;
  readonly ALL_CATEGORIES: MagicItemCategory[] = [
    'ammunition', 'armour', 'potion', 'ring', 'rod', 'scroll', 'staff', 'wand', 'weapon', 'wondrous',
  ];
  readonly ALL_RARITIES = ['common', 'uncommon', 'rare', 'very-rare', 'legendary', 'artifact'];
  readonly RARITY_LABELS: Record<string, string> = {
    common: 'Common', uncommon: 'Uncommon', rare: 'Rare',
    'very-rare': 'Very Rare', legendary: 'Legendary', artifact: 'Artifact',
  };

  /** Current text filter. Passed to `CookingDataService.getMagicItems` as a search query. */
  searchQuery      = signal('');
  /** Active category filter chip. `null` = all categories. */
  selectedCategory = signal<MagicItemCategory | null>(null);
  /** Active rarity filter chip. `null` = all rarities. */
  selectedRarity   = signal<string | null>(null);
  /** When `true`, `filteredMagicItems` shows only items in `craftableItemIds`. */
  craftableOnly    = signal(false);
  /** Current zero-based page index for the paginator. Reset to 0 on filter/sort changes. */
  pageIndex        = signal(0);
  /** Active sort column. */
  sortColumn       = signal<'name' | 'cost' | 'rarity'>('name');
  /** Active sort direction. Toggled by clicking the same column header twice. */
  sortDir          = signal<'asc' | 'desc'>('asc');
  /** Page size is fixed at 20 items. */
  readonly pageSize = 20;

  private readonly RARITY_ORDER: Record<string, number> = {
    common: 0, uncommon: 1, rare: 2, 'very-rare': 3, legendary: 4, artifact: 5,
  };

  /** Set of magic item IDs the player can currently craft.
   *  Recomputed whenever `harvestTotalMap` or `essence` changes.
   *  Used by `filteredMagicItems` (craftable-only toggle) and the template
   *  to show/hide the Craft button on each row. */
  readonly craftableItemIds = computed((): Set<string> => {
    const stockMap = this.inventory.harvestTotalMap();
    const essence  = this.inventory.essence();
    const ids = new Set<string>();
    for (const item of this.dataService.getMagicItems()) {
      if (this.dataService.isMagicItemCraftable(item, stockMap, essence)) {
        ids.add(item.id);
      }
    }
    return ids;
  });

  /** Magic items passing all active filters (search, category, rarity, craftable toggle).
   *  Input to `sortedItems`. */
  readonly filteredMagicItems = computed(() => {
    const q    = this.searchQuery().toLowerCase().trim();
    const cat  = this.selectedCategory();
    const rar  = this.selectedRarity();
    const craftIds = this.craftableOnly() ? this.craftableItemIds() : null;
    return this.dataService.getMagicItems(q || undefined).filter(item => {
      if (cat && item.category !== cat)  return false;
      if (rar && item.rarity   !== rar)  return false;
      if (craftIds && !craftIds.has(item.id)) return false;
      return true;
    });
  });

  /** `filteredMagicItems` sorted by `sortColumn` / `sortDir`. Input to `pagedItems`. */
  readonly sortedItems = computed(() => {
    const col = this.sortColumn();
    const dir = this.sortDir() === 'asc' ? 1 : -1;
    return [...this.filteredMagicItems()].sort((a, b) => {
      if (col === 'cost') {
        return ((a.itemValueGp ?? -1) - (b.itemValueGp ?? -1)) * dir;
      }
      if (col === 'rarity') {
        return ((this.RARITY_ORDER[a.rarity] ?? 0) - (this.RARITY_ORDER[b.rarity] ?? 0)) * dir;
      }
      return a.name.localeCompare(b.name) * dir;
    });
  });

  /** The slice of `sortedItems` for the current page. Bound to the item table. */
  readonly pagedItems = computed(() => {
    const start = this.pageIndex() * this.pageSize;
    return this.sortedItems().slice(start, start + this.pageSize);
  });

  /** Toggles the category filter; resets page to 0. */
  selectCategory(cat: MagicItemCategory): void {
    this.selectedCategory.set(this.selectedCategory() === cat ? null : cat);
    this.pageIndex.set(0);
  }

  /** Toggles the rarity filter; resets page to 0. */
  selectRarity(rar: string): void {
    this.selectedRarity.set(this.selectedRarity() === rar ? null : rar);
    this.pageIndex.set(0);
  }

  /** Updates the search query and resets to page 0. */
  onSearchChange(q: string): void {
    this.searchQuery.set(q);
    this.pageIndex.set(0);
  }

  /** Syncs `pageIndex` from the Material paginator event. */
  onPage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
  }

  /**
   * Sets the sort column; toggles direction if the same column is clicked again.
   * Resets to page 0.
   */
  sortBy(col: 'name' | 'cost' | 'rarity'): void {
    if (this.sortColumn() === col) {
      this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(col);
      this.sortDir.set('asc');
    }
    this.pageIndex.set(0);
  }

  /**
   * Opens the craft confirmation dialog for the given magic item.
   * If the player confirms, calls `InventoryService.craftMagicItem` to deduct
   * components and shows a snackbar.
   * @param event - Stops propagation to prevent the row's expansion panel from toggling
   */
  confirmCraft(item: MagicItem, event: Event): void {
    event.stopPropagation();
    const lines: CraftConfirmData['lines'] = item.components
      .filter(c => c.creatureTypeId)
      .map(c => ({
        label: `${c.creatureTypeId ? c.creatureTypeId.charAt(0).toUpperCase() + c.creatureTypeId.slice(1) : ''} — ${c.componentName}`,
        qty: c.quantity,
      }));
    if (item.essenceType) {
      lines.push({ label: `${item.essenceType} Essence`, qty: 1 });
    }

    const ref = this.dialog.open(CraftConfirmDialogComponent, {
      data: { itemName: item.name, lines } satisfies CraftConfirmData,
      width: '360px',
    });

    ref.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.inventory.craftMagicItem(item, this.dataService.getHarvestComponents());
        this.snackBar.open(`Crafted ${item.name}!`, 'Dismiss', { duration: 3500 });
      }
    });
  }
}
