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

type BuilderMode = 'ingredient' | 'effect';

interface CookingItem {
  id: string;
  name: string;
  componentTypeId: ComponentTypeName;
  creatureTypeId: string;
  creatureTypeName: string;
  dc?: number;
  isVolatile: boolean;
  isUnique: boolean;
  notes?: string | null;
}

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

  mode = signal<BuilderMode>('ingredient');

  selectedItems = signal<CookingItem[]>([]);

  ingredientOnlyInventory = signal(true);
  ingredientQuery = signal('');
  effectQuery = signal('');
  selectedCreatureTypeFilter = signal<string | null>(null);
  selectedComponentTypeFilter = signal<string | null>(null);

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

  readonly availableCreatureTypes = computed(() => {
    const ids = new Set(this.allCookingItems().map(c => c.creatureTypeId));
    return this.dataService.getCreatureTypes().filter(ct => ids.has(ct.id));
  });

  readonly availableComponentTypes = computed(() => {
    const ids = new Set(this.allCookingItems().map(c => c.componentTypeId).filter(Boolean));
    return this.dataService.getComponentTypes().filter(ct => ids.has(ct.id));
  });

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

  readonly selectedComponentTypes = computed<ComponentTypeName[]>(() =>
    this.selectedItems().map(c => c.componentTypeId).filter(Boolean)
  );

  readonly recipeMatches = computed(() =>
    this.dataService.matchRecipesToIngredients(this.selectedComponentTypes())
  );

  readonly selectedEffects = computed(() =>
    this.selectedItems().map(item => {
      const effect = this.dataService.getEffectFor(item.componentTypeId, item.creatureTypeId);
      const componentType = this.dataService.getComponentType(item.componentTypeId);
      return { item, effect, componentType };
    }).filter(e => e.effect != null)
  );

  readonly effectSearchResults = computed(() => {
    const q = this.effectQuery().trim();
    if (q.length < 2) return [];
    return this.dataService.searchEffects(q);
  });

  isSelected(item: CookingItem): boolean {
    return this.selectedItems().some(c => c.id === item.id);
  }

  toggleIngredient(item: CookingItem): void {
    if (this.isSelected(item)) {
      this.selectedItems.update(list => list.filter(c => c.id !== item.id));
    } else {
      this.selectedItems.update(list => [...list, item]);
    }
  }

  removeSelected(item: CookingItem): void {
    this.selectedItems.update(list => list.filter(c => c.id !== item.id));
  }

  clearSelection(): void {
    this.selectedItems.set([]);
  }

  loadFromInventory(): void {
    const inStock = this.allCookingItems().filter(c => this.getStockQty(c) > 0);
    this.selectedItems.set(inStock);
  }

  addFromEffect(comp: HarvestComponent): void {
    const item = this.harvestToItem(comp);
    if (!this.isSelected(item)) {
      this.selectedItems.update(list => [...list, item]);
    }
    this.mode.set('ingredient');
  }

  getStockQty(item: CookingItem): number {
    return item.isUnique
      ? this.inventoryService.getQuantity(item.id)
      : this.inventoryService.getTotalHarvestQuantity(item.id);
  }

  getEffectStockQty(comp: HarvestComponent): number {
    return this.inventoryService.getTotalHarvestQuantity(comp.id);
  }

  getComponentName(id: string): string {
    return this.dataService.getComponentType(id as ComponentTypeName)?.name ?? id;
  }

  getCreatureName(id: string): string {
    return this.dataService.getCreatureType(id)?.name ?? id;
  }

  openRecipe(recipe: Recipe): void {
    this.dialog.open(RecipeDetailDialogComponent, { data: recipe, width: '560px', maxWidth: '95vw' });
  }

  matchClass(complete: boolean, covered: ComponentTypeName[], required: ComponentTypeName[]): string {
    if (complete) return 'match-complete';
    if (covered.length >= required.length - 1) return 'match-close';
    return 'match-partial';
  }

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
