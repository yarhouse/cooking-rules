import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { CookingDataService } from '../../services/cooking-data.service';
import { InventoryService } from '../../services/inventory.service';
import { HarvestComponent } from '../../models/harvest-component.model';
import { ComponentTypeName } from '../../models/component-type.model';
import { Recipe } from '../../models/recipe.model';
import { RecipeDetailDialogComponent } from '../shared/recipe-detail-dialog/recipe-detail-dialog.component';

/** Controls which search/browse mode is active in the builder's left panel.
 *  `'ingredient'` shows the ingredient list; `'effect'` shows effect keyword search. */
export type BuilderMode = 'ingredient' | 'effect';

/** Unified representation of a selectable cooking ingredient.
 *  Merges `HarvestComponent` (edible only) and `Ingredient` into one shape
 *  so the template doesn't need to branch on source type.
 *
 *  `isUnique = true` → named `Ingredient` tracked in `InventoryService.inventory`
 *  `isUnique = false` → `HarvestComponent` tracked in `InventoryService.harvestStock` */
export interface CookingItem {
  id: string;
  name: string;
  /** The component type this item counts as in a recipe slot. */
  componentTypeId: ComponentTypeName;
  creatureTypeId: string;
  /** Denormalised display name — avoids a lookup in the template. */
  creatureTypeName: string;
  /** Harvest DC; only present for harvest-component items, not named ingredients. */
  dc?: number;
  isVolatile: boolean;
  /** `true` for named `Ingredient` rows; `false` for `HarvestComponent` rows. */
  isUnique: boolean;
  notes?: string | null;
}

/**
 * Recipe Builder page — lets the player select cooking ingredients and see
 * which recipes they can craft.
 *
 * ## Data flow
 * 1. `allCookingItems` merges all edible `HarvestComponent` rows + all named
 *    `Ingredient` rows into a unified `CookingItem[]`.
 * 2. `filteredIngredientList` applies the inventory toggle, creature/component
 *    type filters, and the text search to produce the visible list.
 * 3. When the player selects items, `selectedComponentTypes` extracts the
 *    component type IDs.
 * 4. `recipeMatches` feeds those IDs to `CookingDataService.matchRecipesToIngredients`
 *    and returns coverage metadata for each matching recipe.
 * 5. `selectedEffects` looks up the `ComponentEffect` for each selected item
 *    and surfaces them in the effects panel.
 *
 * The effect-search mode (`mode = 'effect'`) queries `searchEffects` and
 * lets the player add items from matching results without browsing the full list.
 */
@Component({
  selector: 'app-cooking',
  imports: [
    FormsModule,
    MatButtonToggleModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatTooltipModule,
  ],
  templateUrl: './cooking.component.html',
  styleUrl: './cooking.component.scss',
})
export class CookingComponent {
  private dataService = inject(CookingDataService);
  readonly inventoryService = inject(InventoryService);
  private dialog = inject(MatDialog);

  /** Active left-panel mode. Toggled by the mode button toggle. */
  mode = signal<BuilderMode>('ingredient');

  /** Ingredients currently added to the builder. Drives `recipeMatches` and `selectedEffects`. */
  selectedItems = signal<CookingItem[]>([]);

  /** When `true`, `filteredIngredientList` shows only items with stock > 0. */
  ingredientOnlyInventory = signal(true);
  /** Text filter applied to the ingredient list in ingredient mode. */
  ingredientQuery = signal('');
  /** Keyword used to search effects in effect mode. Minimum 2 characters to trigger. */
  effectQuery = signal('');
  /** Active creature type filter chip. `null` = no filter. */
  selectedCreatureTypeFilter = signal<string | null>(null);
  /** Active component type filter chip. `null` = no filter. */
  selectedComponentTypeFilter = signal<string | null>(null);

  /** All selectable cooking items — edible harvest components + named ingredients.
   *  Recomputed when service signals change (e.g. after a data refresh).
   *  Consumed by `filteredIngredientList`, `availableCreatureTypes`,
   *  and `availableComponentTypes`. */
  readonly allCookingItems = computed<CookingItem[]>(() => {
    const harvestItems = this.dataService.getEdibleHarvestComponents().map(hc => this.harvestToItem(hc));
    const ingredientItems = this.dataService.getIngredients().map(ing => ({
      id: ing.id,
      name: ing.name,
      componentTypeId: ing.componentTypeId,
      creatureTypeId: ing.creatureTypeId,
      creatureTypeName: this.dataService.getCreatureType(ing.creatureTypeId)?.name ?? ing.creatureTypeId,
      isVolatile: false,
      isUnique: true,
      notes: ing.notes,
    } satisfies CookingItem));
    return [...harvestItems, ...ingredientItems];
  });

  /** Creature types that have at least one selectable cooking item.
   *  Drives the creature type filter chip row. */
  readonly availableCreatureTypes = computed(() => {
    const ids = new Set(this.allCookingItems().map(c => c.creatureTypeId));
    return this.dataService.getCreatureTypes().filter(ct => ids.has(ct.id));
  });

  /** Component types present in the current item list.
   *  Drives the component type filter chip row. */
  readonly availableComponentTypes = computed(() => {
    const ids = new Set(this.allCookingItems().map(c => c.componentTypeId).filter(Boolean));
    return this.dataService.getComponentTypes().filter(ct => ids.has(ct.id));
  });

  /** The visible ingredient list after applying all active filters.
   *  Depends on: `ingredientOnlyInventory`, `selectedCreatureTypeFilter`,
   *  `selectedComponentTypeFilter`, `ingredientQuery`, and `allCookingItems`. */
  readonly filteredIngredientList = computed(() => {
    let list = this.ingredientOnlyInventory()
      ? this.allCookingItems().filter(c => this.getStockQty(c) > 0)
      : this.allCookingItems();

    const creatureType = this.selectedCreatureTypeFilter();
    if (creatureType) list = list.filter(c => c.creatureTypeId === creatureType);

    const componentType = this.selectedComponentTypeFilter();
    if (componentType) list = list.filter(c => c.componentTypeId === componentType);

    const q = this.ingredientQuery().toLowerCase();
    if (q) {
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.creatureTypeName.toLowerCase().includes(q) ||
        c.componentTypeId.toLowerCase().includes(q)
      );
    }

    return list;
  });

  toggleCreatureTypeFilter(id: string): void {
    this.selectedCreatureTypeFilter.set(this.selectedCreatureTypeFilter() === id ? null : id);
  }

  toggleComponentTypeFilter(id: string): void {
    this.selectedComponentTypeFilter.set(this.selectedComponentTypeFilter() === id ? null : id);
  }

  /** Component type IDs of all currently selected items.
   *  Passed to `CookingDataService.matchRecipesToIngredients` to compute recipe coverage. */
  readonly selectedComponentTypes = computed<ComponentTypeName[]>(() =>
    this.selectedItems().map(c => c.componentTypeId).filter(Boolean)
  );

  /** Recipes with coverage metadata for the current ingredient selection.
   *  Sorted: fully covered first, then descending by coverage count.
   *  Consumed by the recipe match list in the right panel. */
  readonly recipeMatches = computed(() =>
    this.dataService.matchRecipesToIngredients(this.selectedComponentTypes())
  );

  /** Cooking effects for each selected item. Items without a defined effect
   *  (e.g. an unknown creature type pairing) are filtered out.
   *  Consumed by the effects panel below the ingredient selection. */
  readonly selectedEffects = computed(() =>
    this.selectedItems().map(item => {
      const effect = this.dataService.getEffectFor(item.componentTypeId, item.creatureTypeId);
      const componentType = this.dataService.getComponentType(item.componentTypeId);
      return { item, effect, componentType };
    }).filter(e => e.effect != null)
  );

  /** Effect keyword search results. Empty when `effectQuery` is fewer than
   *  2 characters. Consumed by the effect-mode ingredient list. */
  readonly effectSearchResults = computed(() => {
    const q = this.effectQuery().trim();
    if (q.length < 2) return [];
    return this.dataService.searchEffects(q);
  });

  /** @returns `true` if the item is currently in `selectedItems` */
  isSelected(item: CookingItem): boolean {
    return this.selectedItems().some(c => c.id === item.id);
  }

  /** Adds the item to `selectedItems` if not already present; removes it if it is. */
  toggleIngredient(item: CookingItem): void {
    if (this.isSelected(item)) {
      this.selectedItems.update(list => list.filter(c => c.id !== item.id));
    } else {
      this.selectedItems.update(list => [...list, item]);
    }
  }

  /** Removes a specific item from `selectedItems`. */
  removeSelected(item: CookingItem): void {
    this.selectedItems.update(list => list.filter(c => c.id !== item.id));
  }

  /** Clears all selected items. */
  clearSelection(): void {
    this.selectedItems.set([]);
  }

  /** Populates `selectedItems` with every item currently in stock (quantity > 0). */
  loadFromInventory(): void {
    const inStock = this.allCookingItems().filter(c => this.getStockQty(c) > 0);
    this.selectedItems.set(inStock);
  }

  /** Adds the given harvest component (from effect-search results) to `selectedItems`
   *  and switches the panel back to ingredient mode. */
  addFromEffect(comp: HarvestComponent): void {
    const item = this.harvestToItem(comp);
    if (!this.isSelected(item)) {
      this.selectedItems.update(list => [...list, item]);
    }
    this.mode.set('ingredient');
  }

  /** Returns the current stock quantity for a cooking item.
   *  Routes to `getQuantity` for named ingredients or `getTotalHarvestQuantity`
   *  for harvest components. */
  getStockQty(item: CookingItem): number {
    return item.isUnique
      ? this.inventoryService.getQuantity(item.id)
      : this.inventoryService.getTotalHarvestQuantity(item.id);
  }

  /** @returns Total harvest stock (all rarities) for a harvest component. */
  getEffectStockQty(comp: HarvestComponent): number {
    return this.inventoryService.getTotalHarvestQuantity(comp.id);
  }

  /** @returns Display name for a component type ID. Falls back to the raw ID. */
  getComponentName(id: string): string {
    return this.dataService.getComponentType(id as ComponentTypeName)?.name ?? id;
  }

  /** @returns Display name for a creature type ID. Falls back to the raw ID. */
  getCreatureName(id: string): string {
    return this.dataService.getCreatureType(id)?.name ?? id;
  }

  /** Opens the recipe detail dialog for the given recipe. */
  openRecipe(recipe: Recipe): void {
    this.dialog.open(RecipeDetailDialogComponent, { data: recipe, width: '560px', maxWidth: '95vw' });
  }

  /**
   * Returns a CSS class name for a recipe match card based on coverage.
   * @param complete - All ingredient slots are covered
   * @param covered - Slots that are covered by the current selection
   * @param required - All required slots for the recipe
   */
  matchClass(complete: boolean, covered: ComponentTypeName[], required: ComponentTypeName[]): string {
    if (complete) return 'match-complete';
    if (covered.length >= required.length - 1) return 'match-close';
    return 'match-partial';
  }

  /** Maps a `HarvestComponent` to a `CookingItem` for use in the builder. */
  private harvestToItem(hc: HarvestComponent): CookingItem {
    return {
      id: hc.id,
      name: hc.name,
      componentTypeId: hc.edibleAs as ComponentTypeName,
      creatureTypeId: hc.creatureTypeId,
      creatureTypeName: hc.creatureTypeName,
      dc: hc.componentDc,
      isVolatile: hc.isVolatile,
      isUnique: false,
      notes: hc.notes,
    };
  }
}
