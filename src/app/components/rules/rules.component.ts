import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CookingDataService } from '../../services/cooking-data.service';
import { InventoryService } from '../../services/inventory.service';
import { ComponentEffect, ComponentTypeName, Rarity } from '../../models/component-type.model';

type EffectMode = 'component' | 'creature';
type QuirkFilter = 'all' | 'flaw' | 'boon';

interface Quirk {
  roll: number;
  name: string;
  effect: string;
  type: 'flaw' | 'boon';
}

interface EffectRow {
  key: string;
  label: string;
  description: string;
  scaledValue: string | null;
  isOverridden: boolean;
}

@Component({
  selector: 'app-rules',
  imports: [
    FormsModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    MatTooltipModule,
  ],
  templateUrl: './rules.component.html',
  styleUrl: './rules.component.scss',
})
export class RulesComponent {
  private dataService = inject(CookingDataService);
  readonly inventoryService = inject(InventoryService);

  // Tab 2 state
  effectMode = signal<EffectMode>('component');
  selectedRarity = signal<Rarity>('uncommon');
  selectedComponent = signal<ComponentTypeName | null>(null);
  selectedCreature = signal<string | null>(null);
  editingKey = signal<string | null>(null);
  editText = signal('');

  // Tab 3 state
  quirkFilter = signal<QuirkFilter>('all');

  readonly componentTypes = this.dataService.getComponentTypes();
  readonly creatureTypes = this.dataService.getCreatureTypes();

  readonly selectedComponentType = computed(() => {
    const id = this.selectedComponent();
    return id ? this.dataService.getComponentType(id) : null;
  });

  readonly selectedCreatureType = computed(() => {
    const id = this.selectedCreature();
    return id ? this.dataService.getCreatureType(id) : null;
  });

  readonly effectsByComponent = computed((): EffectRow[] => {
    const comp = this.selectedComponentType();
    if (!comp) return [];
    return comp.effects.map(effect => {
      const creature = this.dataService.getCreatureType(effect.creatureTypeId);
      const key = `${comp.id}:${effect.creatureTypeId}`;
      const override = this.inventoryService.getEffectOverride(comp.id, effect.creatureTypeId);
      return {
        key,
        label: creature?.name ?? effect.creatureTypeId,
        description: override ?? effect.description,
        scaledValue: this.getScaledValue(effect, this.selectedRarity()),
        isOverridden: !!override,
      };
    }).sort((a, b) => a.label.localeCompare(b.label));
  });

  readonly effectsByCreature = computed((): EffectRow[] => {
    const creature = this.selectedCreatureType();
    if (!creature) return [];
    return this.componentTypes
      .map(comp => {
        const effect = comp.effects.find(e => e.creatureTypeId === creature.id);
        if (!effect) return null;
        const key = `${comp.id}:${creature.id}`;
        const override = this.inventoryService.getEffectOverride(comp.id, creature.id);
        return {
          key,
          label: comp.name,
          description: override ?? effect.description,
          scaledValue: this.getScaledValue(effect, this.selectedRarity()),
          isOverridden: !!override,
        };
      })
      .filter((x): x is EffectRow => x !== null);
  });

  private getScaledValue(effect: ComponentEffect, rarity: Rarity): string | null {
    if (!effect.scaling) return null;
    const map: Record<Rarity, keyof NonNullable<ComponentEffect['scaling']>> = {
      uncommon: 'uncommon',
      rare: 'rare',
      'very-rare': 'veryRare',
      legendary: 'legendary',
      artifact: 'legendary',
    };
    return effect.scaling[map[rarity]] ?? null;
  }

  startEdit(key: string, currentDescription: string): void {
    this.editingKey.set(key);
    this.editText.set(currentDescription);
  }

  saveEdit(key: string): void {
    const parts = key.split(':');
    const compId = parts[0];
    const creatureId = parts[1];
    const text = this.editText().trim();
    if (text) {
      this.inventoryService.setEffectOverride(compId, creatureId, text);
    }
    this.editingKey.set(null);
  }

  clearOverride(key: string): void {
    const parts = key.split(':');
    this.inventoryService.clearEffectOverride(parts[0], parts[1]);
    this.editingKey.set(null);
  }

  cancelEdit(): void {
    this.editingKey.set(null);
  }

  readonly rarityLabels: Record<Rarity, string> = {
    uncommon: 'Uncommon',
    rare: 'Rare',
    'very-rare': 'Very Rare',
    legendary: 'Legendary',
    artifact: 'Artifact',
  };

  readonly rarities: Rarity[] = ['uncommon', 'rare', 'very-rare', 'legendary'];

  readonly dcTable = [
    { tier: 'Novice', dc: 12, ingredients: 1 },
    { tier: 'Journeyman', dc: 16, ingredients: 2 },
    { tier: 'Expert', dc: 20, ingredients: 3 },
    { tier: 'Artisan', dc: 24, ingredients: 4 },
  ];

  readonly flaws: Quirk[] = [
    { roll: 1, name: "Rottworth's Revenge", type: 'flaw', effect: "Explosive emissions leave you poisoned and unable to benefit from short or long rests. Spells or magical effects that remove the poisoned condition suppress this effect for 1 hour only." },
    { roll: 2, name: "Nauseating Nightmare", type: 'flaw', effect: "Visual and audible hallucinations. Disadvantage on Intelligence, Wisdom, and Charisma checks, and on initiative rolls." },
    { roll: 3, name: "Tongue Tied", type: 'flaw', effect: "Tongue becomes enchanted; you can speak only in a language associated with one of the creature types whose component you ingested (GM's choice)." },
    { roll: 4, name: "Flatulence", type: 'flaw', effect: "Foetid gases erupt uncontrollably. Disadvantage on Charisma checks against creatures within 30 feet that can smell; disadvantage on Stealth checks against creatures that can smell or hear." },
    { roll: 5, name: "Borborygmus Bomb", type: 'flaw', effect: "Disadvantage on saving throws to maintain concentration. After 1d8 hours (GM secret), release a pungent miasma with the effects of the cloudkill spell centered on yourself, lasting 1 minute." },
    { roll: 6, name: "High Glycemic Index", type: 'flaw', effect: "After 1d4 hours (GM secret), you crash. Disadvantage on Dexterity checks and Dexterity saving throws." },
    { roll: 7, name: "Allergic Reaction", type: 'flaw', effect: "Skin puckers into an irritating rash. DC 10 Constitution saving throw at the start of each turn or use your action or bonus action to scratch." },
    { roll: 8, name: "Food Baby", type: 'flaw', effect: "Meal leaves you bloated. Speed reduced by 5 feet." },
  ];

  readonly boons: Quirk[] = [
    { roll: 1, name: "Iron Gut", type: 'boon', effect: "Resistance to poison damage and advantage on saving throws against the poisoned condition." },
    { roll: 2, name: "Sweet Breath", type: 'boon', effect: "Aroma perfumes your breath. Advantage on Charisma checks against creatures within 30 feet that can smell." },
    { roll: 3, name: "Linguistic Learning", type: 'boon', effect: "Gain the ability to speak one language associated with the creature type of each magical component consumed (GM's choice)." },
    { roll: 4, name: "Slow Release Energy", type: 'boon', effect: "Advantage on saving throws to maintain concentration." },
    { roll: 5, name: "Fearless Fancy", type: 'boon', effect: "Immune to the frightened condition." },
    { roll: 6, name: "Hearty Harvest", type: 'boon', effect: "Advantage on Strength checks; count as one size larger for carrying capacity and weight pushed, dragged, or lifted." },
    { roll: 7, name: "Peaceful Digestion", type: 'boon', effect: "Next short rest: +1 HP per Hit Die rolled. Next long rest: recover extra Hit Dice equal to your proficiency bonus." },
    { roll: 8, name: "Fast Food", type: 'boon', effect: "Meal leaves you energised. Speed increases by 5 feet." },
  ];

  readonly filteredQuirks = computed((): Quirk[] => {
    const filter = this.quirkFilter();
    if (filter === 'flaw') return this.flaws;
    if (filter === 'boon') return this.boons;
    return [...this.flaws, ...this.boons].sort((a, b) => a.type.localeCompare(b.type) || a.roll - b.roll);
  });
}
