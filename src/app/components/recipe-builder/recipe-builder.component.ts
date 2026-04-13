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
import { Ingredient } from '../../models/ingredient.model';
import { ComponentTypeName } from '../../models/component-type.model';

type BuilderMode = 'ingredient' | 'effect';

@Component({
  selector: 'app-recipe-builder',
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
  templateUrl: './recipe-builder.component.html',
  styleUrl: './recipe-builder.component.scss',
})
export class RecipeBuilderComponent {
  private dataService = inject(CookingDataService);
  readonly inventoryService = inject(InventoryService);

  mode = signal<BuilderMode>('ingredient');

  // Shared selection state — persists when switching modes
  selectedIngredients = signal<Ingredient[]>([]);

  // Ingredient-first mode
  ingredientOnlyInventory = signal(false);
  ingredientQuery = signal('');

  // Effect-first mode
  effectQuery = signal('');

  // Derived
  readonly allIngredients = computed(() => this.dataService.getIngredients());

  readonly filteredIngredientList = computed(() => {
    let list = this.ingredientOnlyInventory()
      ? this.allIngredients().filter(i => this.inventoryService.hasIngredient(i.id))
      : this.allIngredients();

    const q = this.ingredientQuery().toLowerCase();
    if (q) {
      list = list.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.componentTypeId.toLowerCase().includes(q) ||
        (this.dataService.getCreatureType(i.creatureTypeId)?.name.toLowerCase().includes(q) ?? false)
      );
    }

    return list;
  });

  readonly selectedComponentTypes = computed<ComponentTypeName[]>(() =>
    this.selectedIngredients().map(i => i.componentTypeId)
  );

  readonly recipeMatches = computed(() =>
    this.dataService.matchRecipesToIngredients(this.selectedComponentTypes())
  );

  readonly selectedEffects = computed(() =>
    this.selectedIngredients().map(ingredient => {
      const effect = this.dataService.getEffectFor(ingredient.componentTypeId, ingredient.creatureTypeId);
      const componentType = this.dataService.getComponentType(ingredient.componentTypeId);
      return { ingredient, effect, componentType };
    }).filter(e => e.effect != null)
  );

  readonly effectSearchResults = computed(() => {
    const q = this.effectQuery().trim();
    if (q.length < 2) return [];
    return this.dataService.searchEffects(q);
  });

  isSelected(ingredient: Ingredient): boolean {
    return this.selectedIngredients().some(i => i.id === ingredient.id);
  }

  toggleIngredient(ingredient: Ingredient): void {
    if (this.isSelected(ingredient)) {
      this.selectedIngredients.update(list => list.filter(i => i.id !== ingredient.id));
    } else {
      this.selectedIngredients.update(list => [...list, ingredient]);
    }
  }

  removeSelected(ingredient: Ingredient): void {
    this.selectedIngredients.update(list => list.filter(i => i.id !== ingredient.id));
  }

  clearSelection(): void {
    this.selectedIngredients.set([]);
  }

  loadFromInventory(): void {
    const inventoryIngredients = this.allIngredients().filter(i =>
      this.inventoryService.hasIngredient(i.id)
    );
    this.selectedIngredients.set(inventoryIngredients);
  }

  addFromEffect(ingredient: Ingredient): void {
    if (!this.isSelected(ingredient)) {
      this.selectedIngredients.update(list => [...list, ingredient]);
    }
    this.mode.set('ingredient');
  }

  getQuantity(id: string): number {
    return this.inventoryService.getQuantity(id);
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
