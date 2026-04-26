import { Component, inject, signal, computed, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { CookingDataService } from '../../services/cooking-data.service';
import { RarityLabelComponent } from '../shared/rarity-label/rarity-label.component';
import { MonsterCardComponent } from '../shared/monster-card/monster-card.component';
import { InventoryService } from '../../services/inventory.service';
import { Monster, MonsterRarity } from '../../models/monster.model';
import { ComponentTypeName } from '../../models/component-type.model';

export interface HarvestListItem {
  id: string;
  name: string;
  componentDc: number;
  isVolatile: boolean;
  volatileNote: string | null;
  isBossDrop: boolean;
  isEssence: boolean;
  edibleAsLabel: string | null;
  harvestComponentId?: string;
  ingredientId?: string;
}

export interface ResultItem extends HarvestListItem {
  harvestDc: number;
  harvested: boolean;
  started: boolean;
}

const ESSENCE_BY_RARITY: Record<MonsterRarity, { name: string; dc: number } | null> = {
  common:     null,
  uncommon:   { name: 'Frail Essence',  dc: 25 },
  rare:       { name: 'Robust Essence', dc: 30 },
  'very-rare':{ name: 'Potent Essence', dc: 35 },
  legendary:  { name: 'Mythic Essence', dc: 40 },
};

const RARITY_ORDER: Record<MonsterRarity, number> = {
  common: 0, uncommon: 1, rare: 2, 'very-rare': 3, legendary: 4,
};

@Component({
  selector: 'app-harvest-session',
  imports: [
    FormsModule,
    MatStepperModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatTooltipModule,
    MatDividerModule,
    RarityLabelComponent,
    MonsterCardComponent,
  ],
  templateUrl: './harvest-session.component.html',
  styleUrl: './harvest-session.component.scss',
})
export class HarvestSessionComponent {
  @ViewChild('stepper') stepper!: MatStepper;

  private dataService = inject(CookingDataService);
  private inventoryService = inject(InventoryService);

  // ── Step 1 ──────────────────────────────────────────────────────────────
  readonly creatureTypes = this.dataService.getCreatureTypes();
  selectedCreatureTypeId = signal<string | null>(null);
  selectedMonsterId = signal<string | null>(null);

  readonly monstersForType = computed((): Monster[] => {
    const id = this.selectedCreatureTypeId();
    if (!id) return [];
    return this.dataService.getMonstersByType(id).sort(
      (a, b) => (RARITY_ORDER[a.rarity] ?? 0) - (RARITY_ORDER[b.rarity] ?? 0) || a.name.localeCompare(b.name)
    );
  });

  readonly selectedMonster = computed((): Monster | null => {
    const id = this.selectedMonsterId();
    if (!id) return null;
    return this.monstersForType().find(m => m.id === id) ?? null;
  });

  readonly selectedMonsterTypeName = computed((): string => {
    const id = this.selectedCreatureTypeId();
    return this.creatureTypes.find(ct => ct.id === id)?.name ?? '';
  });

  readonly selectedMonsterComponentTypes = computed((): string[] => {
    const monster = this.selectedMonster();
    if (!monster) return [];
    return monster.harvestableComponents.map(
      cid => this.dataService.getComponentType(cid)?.name ?? cid
    );
  });

  // ── Step 2 ──────────────────────────────────────────────────────────────
  harvestList = signal<HarvestListItem[]>([]);

  readonly availableComponents = computed((): HarvestListItem[] => {
    const monster = this.selectedMonster();
    if (!monster) return [];
    const cookingMetatypes = new Set(monster.harvestableComponents);
    const COOKING_TYPES = new Set(['blood','bone','brain','egg','eye','fat','flesh','heart','liver','spice']);
    return this.dataService
      .getHarvestComponentsByCreatureType(monster.creatureTypeId)
      .filter(hc => {
        if (hc.componentMetatype == null) return true;
        if (COOKING_TYPES.has(hc.componentMetatype)) return cookingMetatypes.has(hc.componentMetatype as never);
        return true;
      })
      .sort((a, b) => a.componentDc - b.componentDc || a.name.localeCompare(b.name))
      .map(hc => ({
        id: hc.id,
        name: hc.name,
        componentDc: hc.componentDc,
        isVolatile: hc.isVolatile,
        volatileNote: hc.notes,
        isBossDrop: false,
        isEssence: false,
        edibleAsLabel: hc.isEdible && hc.edibleAs
          ? (this.dataService.getComponentType(hc.edibleAs as ComponentTypeName)?.name ?? hc.edibleAs)
          : null,
        harvestComponentId: hc.id,
      }));
  });

  readonly bossDrop = computed((): HarvestListItem | null => {
    const monster = this.selectedMonster();
    if (!monster) return null;
    const ingredient = this.dataService.getIngredients().find(
      i => i.sourceMonsterIds?.includes(monster.id)
    );
    if (!ingredient) return null;
    return {
      id: ingredient.id,
      name: ingredient.name,
      componentDc: 20,
      isVolatile: false,
      volatileNote: null,
      isBossDrop: true,
      isEssence: false,
      edibleAsLabel: null,
      ingredientId: ingredient.id,
    };
  });

  readonly essenceEntry = computed((): HarvestListItem | null => {
    const monster = this.selectedMonster();
    if (!monster) return null;
    const essence = ESSENCE_BY_RARITY[monster.rarity];
    if (!essence) return null;
    return {
      id: `essence-${monster.id}`,
      name: essence.name,
      componentDc: essence.dc,
      isVolatile: false,
      volatileNote: null,
      isBossDrop: false,
      isEssence: true,
      edibleAsLabel: null,
    };
  });

  countInList(itemId: string): number {
    return this.harvestList().filter(i => i.id === itemId).length;
  }

  addItem(item: HarvestListItem): void {
    this.harvestList.set([...this.harvestList(), item]);
  }

  removeLastOfItem(itemId: string): void {
    const list = [...this.harvestList()];
    const lastIdx = list.map(i => i.id).lastIndexOf(itemId);
    if (lastIdx !== -1) list.splice(lastIdx, 1);
    this.harvestList.set(list);
  }

  moveItem(index: number, direction: -1 | 1): void {
    const list = [...this.harvestList()];
    const target = index + direction;
    if (target < 0 || target >= list.length) return;
    [list[index], list[target]] = [list[target], list[index]];
    this.harvestList.set(list);
  }

  removeItem(index: number): void {
    const list = [...this.harvestList()];
    list.splice(index, 1);
    this.harvestList.set(list);
  }

  // ── Steps 3/4/5 ─────────────────────────────────────────────────────────
  readonly harvestListWithDCs = computed(() => {
    let total = 0;
    return this.harvestList().map(item => {
      total += item.componentDc;
      return { ...item, harvestDc: total };
    });
  });

  readonly runningDC = computed(() => this.harvestListWithDCs().at(-1)?.harvestDc ?? 0);

  readonly harvestSkill = computed((): string => {
    const monster = this.selectedMonster();
    if (!monster) return '';
    return this.dataService.getHarvestComponentsByCreatureType(monster.creatureTypeId)[0]?.harvestSkill ?? '';
  });

  readonly isRitualCarving = computed((): boolean => {
    const monster = this.selectedMonster();
    if (!monster) return false;
    return ['aberration', 'celestial', 'elemental', 'fey', 'fiend'].includes(monster.creatureTypeId);
  });

  assessmentRoll = signal(0);
  carvingRoll = signal(0);
  readonly harvestingTotal = computed(() => this.assessmentRoll() + this.carvingRoll());

  readonly results = computed((): ResultItem[] => {
    const total = this.harvestingTotal();
    const list = this.harvestListWithDCs();
    return list.map((item, i) => {
      const prevDc = i > 0 ? list[i - 1].harvestDc : 0;
      const harvested = total >= item.harvestDc;
      const started = !harvested && total > prevDc;
      return { ...item, harvested, started };
    });
  });

  readonly harvestedCount = computed(() => this.results().filter(r => r.harvested).length);

  readonly suppliesCost = computed((): number =>
    this.results()
      .filter(r => r.harvested || r.started)
      .reduce((sum, r) => sum + r.componentDc, 0)
  );

  readonly startedVolatiles = computed(() => this.results().filter(r => r.started && r.isVolatile));

  addToInventory(): void {
    const rarity = this.selectedMonster()?.rarity ?? 'common';
    for (const item of this.results().filter(r => r.harvested)) {
      if (item.harvestComponentId) {
        this.inventoryService.updateHarvestQuantity(item.harvestComponentId, rarity, 1);
      } else if (item.ingredientId) {
        this.inventoryService.updateQuantity(item.ingredientId, 1);
      }
    }
  }

  reset(): void {
    this.selectedCreatureTypeId.set(null);
    this.selectedMonsterId.set(null);
    this.harvestList.set([]);
    this.assessmentRoll.set(0);
    this.carvingRoll.set(0);
    this.stepper.reset();
  }

  selectCreatureType(id: string): void {
    this.selectedCreatureTypeId.set(this.selectedCreatureTypeId() === id ? null : id);
    this.selectedMonsterId.set(null);
    this.harvestList.set([]);
  }

  selectMonster(monster: Monster): void {
    this.selectedMonsterId.set(monster.id);
    this.harvestList.set([]);
  }
}
