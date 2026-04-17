import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { CookingDataService } from '../../services/cooking-data.service';
import { HarvestComponent } from '../../models/harvest-component.model';

@Component({
  selector: 'app-harvesting',
  imports: [
    RouterLink,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
    MatChipsModule,
  ],
  templateUrl: './harvesting.component.html',
  styleUrl: './harvesting.component.scss',
})
export class HarvestingComponent {
  private dataService = inject(CookingDataService);

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

  readonly harvestSizeTable = [
    { size: 'Tiny',       time: '5 minutes',   helpers: 0 },
    { size: 'Small',      time: '10 minutes',  helpers: 1 },
    { size: 'Medium',     time: '15 minutes',  helpers: 2 },
    { size: 'Large',      time: '30 minutes',  helpers: 4 },
    { size: 'Huge',       time: '2 hours',     helpers: 6 },
    { size: 'Gargantuan', time: '12 hours',    helpers: 10 },
  ];

  readonly essenceTable = [
    { cr: '3–6',   dc: 25, essence: 'Frail',    rarity: 'uncommon'  },
    { cr: '7–11',  dc: 30, essence: 'Robust',   rarity: 'rare'      },
    { cr: '12–17', dc: 35, essence: 'Potent',   rarity: 'very-rare' },
    { cr: '18–24', dc: 40, essence: 'Mythic',   rarity: 'legendary' },
    { cr: '25+',   dc: 50, essence: 'Deific',   rarity: 'artifact'  },
  ];

  readonly componentValueTable = [
    { dc: 5,  sell: '10 gp',  buy: '20 gp',   sellSupplied: '15 gp',  buySupplied: '30 gp'  },
    { dc: 10, sell: '20 gp',  buy: '40 gp',   sellSupplied: '30 gp',  buySupplied: '60 gp'  },
    { dc: 15, sell: '30 gp',  buy: '60 gp',   sellSupplied: '45 gp',  buySupplied: '90 gp'  },
    { dc: 20, sell: '40 gp',  buy: '80 gp',   sellSupplied: '60 gp',  buySupplied: '120 gp' },
    { dc: 25, sell: '50 gp',  buy: '100 gp',  sellSupplied: '75 gp',  buySupplied: '150 gp' },
  ];

  readonly essenceValueTable = [
    { essence: 'Frail',  sell: '50 gp',      buy: '100 gp'     },
    { essence: 'Robust', sell: '250 gp',     buy: '500 gp'     },
    { essence: 'Potent', sell: '1,500 gp',   buy: '3,000 gp'   },
    { essence: 'Mythic', sell: '8,000 gp',   buy: '16,000 gp'  },
    { essence: 'Deific', sell: '80,000 gp',  buy: '160,000 gp' },
  ];

  readonly tradingTable = [
    { check: '1–10', buyer: 'No buyer found',  seller: 'No seller found' },
    { check: '11–25', buyer: '50%',            seller: '150%'             },
    { check: '26–50', buyer: '100%',           seller: '100%'             },
    { check: '51+',   buyer: '120%',           seller: '80%'              },
  ];

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
