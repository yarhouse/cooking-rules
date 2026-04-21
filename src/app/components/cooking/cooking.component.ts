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
import { CookingDataService } from '../../services/cooking-data.service';
import { InventoryService } from '../../services/inventory.service';
import { HarvestComponent } from '../../models/harvest-component.model';
import { ComponentTypeName } from '../../models/component-type.model';

type BuilderMode = 'ingredient' | 'effect';

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

  mode = signal<BuilderMode>('ingredient');

  selectedItems = signal<HarvestComponent[]>([]);

  ingredientOnlyInventory = signal(true);
  ingredientQuery = signal('');
  effectQuery = signal('');
  selectedCreatureTypeFilter = signal<string | null>(null);
  selectedComponentTypeFilter = signal<string | null>(null);

  readonly allEdibleComponents = computed(() => this.dataService.getEdibleHarvestComponents());

  readonly availableCreatureTypes = computed(() => {
    const ids = new Set(this.allEdibleComponents().map(c => c.creatureTypeId));
    return this.dataService.getCreatureTypes().filter(ct => ids.has(ct.id));
  });

  readonly availableComponentTypes = computed(() => {
    const ids = new Set(this.allEdibleComponents().map(c => c.edibleAs).filter(Boolean));
    return this.dataService.getComponentTypes().filter(ct => ids.has(ct.id));
  });

  readonly filteredIngredientList = computed(() => {
    let list = this.ingredientOnlyInventory()
      ? this.allEdibleComponents().filter(c => this.inventoryService.getHarvestQuantity(c.id) > 0)
      : this.allEdibleComponents();

    const creatureType = this.selectedCreatureTypeFilter();
    if (creatureType) list = list.filter(c => c.creatureTypeId === creatureType);

    const componentType = this.selectedComponentTypeFilter();
    if (componentType) list = list.filter(c => c.edibleAs === componentType);

    const q = this.ingredientQuery().toLowerCase();
    if (q) {
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.creatureTypeName.toLowerCase().includes(q) ||
        (c.edibleAs?.toLowerCase().includes(q) ?? false)
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
    this.selectedItems().map(c => c.edibleAs as ComponentTypeName).filter(Boolean)
  );

  readonly recipeMatches = computed(() =>
    this.dataService.matchRecipesToIngredients(this.selectedComponentTypes())
  );

  readonly selectedEffects = computed(() =>
    this.selectedItems().map(item => {
      const effect = this.dataService.getEffectFor(item.edibleAs as ComponentTypeName, item.creatureTypeId);
      const componentType = this.dataService.getComponentType(item.edibleAs as ComponentTypeName);
      return { item, effect, componentType };
    }).filter(e => e.effect != null)
  );

  readonly effectSearchResults = computed(() => {
    const q = this.effectQuery().trim();
    if (q.length < 2) return [];
    return this.dataService.searchEffects(q);
  });

  isSelected(comp: HarvestComponent): boolean {
    return this.selectedItems().some(c => c.id === comp.id);
  }

  toggleIngredient(comp: HarvestComponent): void {
    if (this.isSelected(comp)) {
      this.selectedItems.update(list => list.filter(c => c.id !== comp.id));
    } else {
      this.selectedItems.update(list => [...list, comp]);
    }
  }

  removeSelected(comp: HarvestComponent): void {
    this.selectedItems.update(list => list.filter(c => c.id !== comp.id));
  }

  clearSelection(): void {
    this.selectedItems.set([]);
  }

  loadFromInventory(): void {
    const inStock = this.allEdibleComponents().filter(
      c => this.inventoryService.getHarvestQuantity(c.id) > 0
    );
    this.selectedItems.set(inStock);
  }

  addFromEffect(comp: HarvestComponent): void {
    if (!this.isSelected(comp)) {
      this.selectedItems.update(list => [...list, comp]);
    }
    this.mode.set('ingredient');
  }

  getHarvestQty(id: string): number {
    return this.inventoryService.getHarvestQuantity(id);
  }

  getComponentName(id: string): string {
    return this.dataService.getComponentType(id as ComponentTypeName)?.name ?? id;
  }

  getCreatureName(id: string): string {
    return this.dataService.getCreatureType(id)?.name ?? id;
  }

  matchClass(complete: boolean, covered: ComponentTypeName[], required: ComponentTypeName[]): string {
    if (complete) return 'match-complete';
    if (covered.length >= required.length - 1) return 'match-close';
    return 'match-partial';
  }
}
