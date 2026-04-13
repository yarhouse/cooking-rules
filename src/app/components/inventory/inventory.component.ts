import { Component, inject, computed, signal } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { CookingDataService } from '../../services/cooking-data.service';
import { Rarity } from '../../models/component-type.model';
import { Ingredient } from '../../models/ingredient.model';

type GroupBy = 'component' | 'creature';

@Component({
  selector: 'app-inventory',
  imports: [
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
    MatButtonToggleModule,
    SlicePipe,
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss',
})
export class InventoryComponent {
  readonly inventoryService = inject(InventoryService);
  private dataService = inject(CookingDataService);

  groupBy = signal<GroupBy>('component');

  readonly rarities: Rarity[] = ['uncommon', 'rare', 'very-rare', 'legendary'];

  readonly rarityLabels: Record<Rarity, string> = {
    uncommon: 'Uncommon',
    rare: 'Rare',
    'very-rare': 'Very Rare',
    legendary: 'Legendary',
  };

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

      if (!groups.has(key)) {
        groups.set(key, { label, items: [] });
      }
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
}
