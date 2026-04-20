import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { CookingDataService } from '../../services/cooking-data.service';
import { InventoryService } from '../../services/inventory.service';
import { HarvestComponent } from '../../models/harvest-component.model';

@Component({
  selector: 'app-harvesting',
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatChipsModule,
  ],
  templateUrl: './harvesting.component.html',
  styleUrl: './harvesting.component.scss',
})
export class HarvestingComponent {
  private dataService = inject(CookingDataService);
  private inventory   = inject(InventoryService);

  getQty(id: string): number {
    return this.inventory.getHarvestQuantity(id);
  }

  adjust(id: string, delta: number): void {
    this.inventory.updateHarvestQuantity(id, delta);
  }

  readonly creatureTypes = this.dataService.getCreatureTypes();
  selectedCreatureTypeId = signal<string | null>(null);

  readonly selectedComponents = computed((): HarvestComponent[] => {
    const id = this.selectedCreatureTypeId();
    if (!id) return [];
    return this.dataService.getHarvestComponentsByCreatureType(id).sort(
      (a, b) => a.componentDc - b.componentDc || a.name.localeCompare(b.name)
    );
  });

  readonly selectedCreatureType = computed(() => {
    const id = this.selectedCreatureTypeId();
    return id ? this.dataService.getCreatureType(id) : null;
  });

  selectCreatureType(id: string): void {
    this.selectedCreatureTypeId.set(this.selectedCreatureTypeId() === id ? null : id);
  }

  readonly dcGroupLabels: Record<number, string | undefined> = {
    5: 'DC 5 — Easy',
    10: 'DC 10 — Moderate',
    15: 'DC 15 — Hard',
    20: 'DC 20 — Very Hard',
    25: 'DC 25 — Formidable',
  };

  readonly componentsByDc = computed((): Array<{ dc: number; components: HarvestComponent[] }> => {
    const comps = this.selectedComponents();
    const groups = new Map<number, HarvestComponent[]>();
    for (const c of comps) {
      if (!groups.has(c.componentDc)) groups.set(c.componentDc, []);
      groups.get(c.componentDc)!.push(c);
    }
    return Array.from(groups.entries())
      .sort(([a], [b]) => a - b)
      .map(([dc, components]) => ({ dc, components }));
  });

  readonly COMPONENT_TYPE_LABELS: Record<string, string> = {
    blood: 'Blood', bone: 'Bone', brain: 'Brain', egg: 'Egg',
    eye: 'Eye', fat: 'Fat', flesh: 'Flesh', heart: 'Heart',
    liver: 'Liver', spice: 'Spice',
  };
}
