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
import { RarityLabelComponent } from '../shared/rarity-label/rarity-label.component';
import { InventoryService } from '../../services/inventory.service';
import { ComponentEffect, ComponentTypeName, Rarity } from '../../models/component-type.model';

type EffectMode = 'component' | 'creature';
type QuirkFilter = 'all' | 'flaw' | 'boon';
type CraftingQuirkSection = 'all' | 'manufacturing' | 'enchanting';

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
    RarityLabelComponent,
  ],
  templateUrl: './rules.component.html',
  styleUrl: './rules.component.scss',
})
export class RulesComponent {
  private dataService = inject(CookingDataService);
  readonly inventoryService = inject(InventoryService);

  // ── Cooking: Component Effects state ─────────────────────────────────
  effectMode = signal<EffectMode>('component');
  selectedRarity = signal<Rarity>('uncommon');
  selectedComponent = signal<ComponentTypeName | null>(null);
  selectedCreature = signal<string | null>(null);
  editingKey = signal<string | null>(null);
  editText = signal('');

  // ── Cooking: Quirks state ─────────────────────────────────────────────
  cookingQuirkFilter = signal<QuirkFilter>('all');

  // ── Crafting: Quirks state ────────────────────────────────────────────
  craftingQuirkSection = signal<CraftingQuirkSection>('all');
  craftingQuirkType = signal<QuirkFilter>('all');

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

  // ── Shared display helpers ────────────────────────────────────────────

  readonly rarityLabels: Record<Rarity, string> = {
    uncommon: 'Uncommon',
    rare: 'Rare',
    'very-rare': 'Very Rare',
    legendary: 'Legendary',
    artifact: 'Artifact',
  };

  readonly rarities: Rarity[] = ['uncommon', 'rare', 'very-rare', 'legendary'];

  rarityClass(rarity: string): string {
    return rarity.toLowerCase().replace(/\s+/g, '-');
  }

  // ── Cooking: static data ──────────────────────────────────────────────

  readonly dcTable = [
    { tier: 'Novice',      dc: 12, ingredients: 1 },
    { tier: 'Journeyman',  dc: 16, ingredients: 2 },
    { tier: 'Expert',      dc: 20, ingredients: 3 },
    { tier: 'Artisan',     dc: 24, ingredients: 4 },
  ];

  readonly cookingFlaws: Quirk[] = [
    { roll: 1, name: "Rottworth's Revenge",  type: 'flaw', effect: "Explosive emissions leave you poisoned and unable to benefit from short or long rests. Spells or magical effects that remove the poisoned condition suppress this effect for 1 hour only." },
    { roll: 2, name: "Nauseating Nightmare", type: 'flaw', effect: "Visual and audible hallucinations. Disadvantage on Intelligence, Wisdom, and Charisma checks, and on initiative rolls." },
    { roll: 3, name: "Tongue Tied",          type: 'flaw', effect: "Tongue becomes enchanted; you can speak only in a language associated with one of the creature types whose component you ingested (GM's choice)." },
    { roll: 4, name: "Flatulence",           type: 'flaw', effect: "Foetid gases erupt uncontrollably. Disadvantage on Charisma checks against creatures within 30 feet that can smell; disadvantage on Stealth checks against creatures that can smell or hear." },
    { roll: 5, name: "Borborygmus Bomb",     type: 'flaw', effect: "Disadvantage on saving throws to maintain concentration. After 1d8 hours (GM secret), release a pungent miasma with the effects of the cloudkill spell centered on yourself, lasting 1 minute." },
    { roll: 6, name: "High Glycemic Index",  type: 'flaw', effect: "After 1d4 hours (GM secret), you crash. Disadvantage on Dexterity checks and Dexterity saving throws." },
    { roll: 7, name: "Allergic Reaction",    type: 'flaw', effect: "Skin puckers into an irritating rash. DC 10 Constitution saving throw at the start of each turn or use your action or bonus action to scratch." },
    { roll: 8, name: "Food Baby",            type: 'flaw', effect: "Meal leaves you bloated. Speed reduced by 5 feet." },
  ];

  readonly cookingBoons: Quirk[] = [
    { roll: 1, name: "Iron Gut",              type: 'boon', effect: "Resistance to poison damage and advantage on saving throws against the poisoned condition." },
    { roll: 2, name: "Sweet Breath",          type: 'boon', effect: "Aroma perfumes your breath. Advantage on Charisma checks against creatures within 30 feet that can smell." },
    { roll: 3, name: "Linguistic Learning",   type: 'boon', effect: "Gain the ability to speak one language associated with the creature type of each magical component consumed (GM's choice)." },
    { roll: 4, name: "Slow Release Energy",   type: 'boon', effect: "Advantage on saving throws to maintain concentration." },
    { roll: 5, name: "Fearless Fancy",        type: 'boon', effect: "Immune to the frightened condition." },
    { roll: 6, name: "Hearty Harvest",        type: 'boon', effect: "Advantage on Strength checks; count as one size larger for carrying capacity and weight pushed, dragged, or lifted." },
    { roll: 7, name: "Peaceful Digestion",    type: 'boon', effect: "Next short rest: +1 HP per Hit Die rolled. Next long rest: recover extra Hit Dice equal to your proficiency bonus." },
    { roll: 8, name: "Fast Food",             type: 'boon', effect: "Meal leaves you energised. Speed increases by 5 feet." },
  ];

  readonly filteredCookingQuirks = computed((): Quirk[] => {
    const filter = this.cookingQuirkFilter();
    if (filter === 'flaw') return this.cookingFlaws;
    if (filter === 'boon') return this.cookingBoons;
    return [...this.cookingFlaws, ...this.cookingBoons].sort((a, b) => a.type.localeCompare(b.type) || a.roll - b.roll);
  });

  // ── Harvesting: static data ───────────────────────────────────────────

  readonly harvestSizeTable = [
    { size: 'Tiny',       time: '5 minutes',   helpers: 0  },
    { size: 'Small',      time: '10 minutes',  helpers: 1  },
    { size: 'Medium',     time: '15 minutes',  helpers: 2  },
    { size: 'Large',      time: '30 minutes',  helpers: 4  },
    { size: 'Huge',       time: '2 hours',     helpers: 6  },
    { size: 'Gargantuan', time: '12 hours',    helpers: 10 },
  ];

  readonly essenceTable = [
    { cr: '3–6',   dc: 25, essence: 'Frail',  rarity: 'uncommon'  },
    { cr: '7–11',  dc: 30, essence: 'Robust', rarity: 'rare'      },
    { cr: '12–17', dc: 35, essence: 'Potent', rarity: 'very-rare' },
    { cr: '18–24', dc: 40, essence: 'Mythic', rarity: 'legendary' },
    { cr: '25+',   dc: 50, essence: 'Deific', rarity: 'artifact'  },
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
    { check: '1–10',  buyer: 'No buyer found', seller: 'No seller found' },
    { check: '11–25', buyer: '50%',            seller: '150%'            },
    { check: '26–50', buyer: '100%',           seller: '100%'            },
    { check: '51+',   buyer: '120%',           seller: '80%'             },
  ];

  // ── Crafting: static data ─────────────────────────────────────────────

  readonly enchantingTable = [
    { rarity: 'Common',    essence: '—',      dc: 12, consumable: '0.5 hrs', nonAttunement: '1 hr',    attunement: '2 hrs'     },
    { rarity: 'Uncommon',  essence: 'Frail',  dc: 15, consumable: '4 hrs',   nonAttunement: '10 hrs',  attunement: '20 hrs'    },
    { rarity: 'Rare',      essence: 'Robust', dc: 18, consumable: '20 hrs',  nonAttunement: '40 hrs',  attunement: '80 hrs'    },
    { rarity: 'Very Rare', essence: 'Potent', dc: 21, consumable: '80 hrs',  nonAttunement: '160 hrs', attunement: '320 hrs'   },
    { rarity: 'Legendary', essence: 'Mythic', dc: 25, consumable: '320 hrs', nonAttunement: '640 hrs', attunement: '1,280 hrs' },
    { rarity: 'Artifact',  essence: 'Deific', dc: 30, consumable: '50k hrs', nonAttunement: '100k hrs',attunement: '200k hrs'  },
  ];

  readonly enchantingSkillTable = [
    { type: 'Aberration',  skill: 'Arcana'        },
    { type: 'Beast',       skill: 'Survival'      },
    { type: 'Celestial',   skill: 'Religion'      },
    { type: 'Construct',   skill: 'Investigation' },
    { type: 'Dragon',      skill: 'Survival'      },
    { type: 'Elemental',   skill: 'Arcana'        },
    { type: 'Fey',         skill: 'Arcana'        },
    { type: 'Fiend',       skill: 'Religion'      },
    { type: 'Giant',       skill: 'Medicine'      },
    { type: 'Humanoid',    skill: 'Medicine'      },
    { type: 'Monstrosity', skill: 'Survival'      },
    { type: 'Ooze',        skill: 'Nature'        },
    { type: 'Plant',       skill: 'Nature'        },
    { type: 'Undead',      skill: 'Medicine'      },
  ];

  readonly quirksGainedTable = [
    { result: '−13 or less', outcome: 'Total failure — item destroyed' },
    { result: '−12 to −9',   outcome: 'Three flaws'  },
    { result: '−8 to −5',    outcome: 'Two flaws'    },
    { result: '−4 to −1',    outcome: 'One flaw'     },
    { result: '0 to +4',     outcome: 'Nothing'      },
    { result: '+5 to +8',    outcome: 'One boon'     },
    { result: '+9 to +12',   outcome: 'Two boons'    },
    { result: '+13 or more', outcome: 'Three boons'  },
  ];

  readonly manufacturingFlaws = [
    { roll: '1–6',   name: 'Poor Handiwork',     effect: 'Weapon: −1 to attack and damage rolls. Armour: −1 to base AC. Other: gains Fragile.' },
    { roll: '7–8',   name: 'Fragile',             effect: 'Weapon: breaks on a natural 1 attack roll. Other: on a critical hit against you, roll d20 per fragile item; on 1 it breaks.' },
    { roll: '9–10',  name: 'Unwieldy',            effect: 'On a natural 1 attack or Dex save/check: weapon flies 10 ft in a random direction; other item causes you to fall prone.' },
    { roll: '11–12', name: 'Degradable',          effect: 'Roll d20 after each submersion in water or hour in a corrosive environment. On 1, the item breaks.' },
    { roll: '13–14', name: 'Noisy',               effect: 'You have disadvantage on Stealth checks while wearing or carrying the item, even if stowed.' },
    { roll: '15',    name: 'Pungent',             effect: 'Disadvantage on Charisma checks against creatures that dislike bad smells; others have advantage on Perception checks to detect you by smell.' },
    { roll: '16',    name: 'Heavy',               effect: 'This item weighs twice as much as normal.' },
    { roll: '17',    name: 'Garish',              effect: 'Disadvantage on Intimidation checks against creatures that can see the item.' },
    { roll: '18',    name: 'Mediocre Finish',     effect: 'The item looks terrible and is worth half its normal value.' },
    { roll: '19',    name: 'Under Insulated',     effect: 'While wearing or carrying this item, whenever you take cold or fire damage you take an additional 1d8 of the same type.' },
    { roll: '20',    name: 'Dangerous',           effect: 'The critical fail range for attacks/checks with this item increases by 1 (e.g. 1–2 instead of 1).' },
  ];

  readonly manufacturingBoons = [
    { roll: '1–2',   name: 'Durable',               effect: 'The hit points of this item are tripled.' },
    { roll: '3–4',   name: 'Unreactive',             effect: 'Resists corrosion and rot. When an effect would damage the item, roll d20; on 11+ the item is unaffected.' },
    { roll: '5–6',   name: 'Lightweight',            effect: "Weighs half as much. Loses the heavy property (or gains light if it didn't have heavy)." },
    { roll: '7–8',   name: 'Magnificent Finish',     effect: "The item's finish is exceptional and worth twice its normal value." },
    { roll: '9–10',  name: 'Flashy',                 effect: 'Advantage on Persuasion checks against creatures that can see the item.' },
    { roll: '11–12', name: 'Insulated',              effect: 'Armour/clothing: advantage on Con saves vs. cold weather. Weapon/held: advantage on saves vs. heat metal.' },
    { roll: '13–14', name: 'Grippy',                 effect: 'Advantage on checks/saves to resist being disarmed or having the item taken from you.' },
    { roll: '15–16', name: 'Quick Release',          effect: 'Armour/shield: don or doff time is 10× quicker (shield takes a bonus action or action).' },
    { roll: '17–18', name: 'Aerodynamic',            effect: 'Thrown/ammunition: normal and long range increase by 50%.' },
    { roll: '19',    name: 'Perfect Balance',        effect: 'Weapon: reroll natural 1s on attack rolls. Armour/clothing: reroll natural 1s on Acrobatics checks and Dex saves.' },
    { roll: '20',    name: 'Artisanal Craftsmanship',effect: 'Weapon: +1 to damage rolls. Armour: reduce nonmagical B/P/S damage by 1.' },
  ];

  readonly enchantingFlaws = [
    { roll: '1–2',  name: 'Cursed',              effect: "Item is cursed. You are unwilling to part with it. Roll again on this table to determine the curse's nature." },
    { roll: '3',    name: 'Battlerage',           effect: 'When combat ends, make a Wisdom save or treat all creatures as enemies until the end of your next turn.' },
    { roll: '4',    name: 'Desensitisation',      effect: 'Vision becomes black and white, darkvision reduced by 30 ft, sounds muted. Disadvantage on Perception checks.' },
    { roll: '5',    name: 'Gravity Well',         effect: 'You weigh three times as much. Your speed is reduced by 5 feet.' },
    { roll: '6',    name: 'Falsehood',            effect: 'Each time you willingly speak the truth, take 1d6 psychic damage (once per minute).' },
    { roll: '7',    name: 'Divinable',            effect: 'Any Arcana-proficient creature that knows your name can pinpoint your location as an action.' },
    { roll: '8',    name: 'Illiteracy',           effect: "You can't read or write." },
    { roll: '9',    name: 'Attraction',           effect: 'Ranged weapon attacks made against you have advantage to hit.' },
    { roll: '10',   name: 'Energy Magnet',        effect: 'A random damage type (roll d10) has advantage on attack rolls against you and you have disadvantage on saves vs. it.' },
    { roll: '11',   name: 'Creature Sustaining',  effect: 'You deal only half damage to creatures of a type determined by a d14 roll.' },
    { roll: '12',   name: 'External Monologue',   effect: 'After a long rest, make a Wisdom save or speak all your thoughts aloud until your next long rest.' },
    { roll: '13',   name: 'Chain Reaction',       effect: 'When you take a random damage type, all creatures within 10 ft take 3d6 of the same type (Dex save half; you automatically fail).' },
    { roll: '14',   name: 'Rot',                  effect: "You appear and smell like you're decaying. Advantage on Intimidation vs. non-fiends/undead; disadvantage on all other Charisma checks." },
    { roll: '15',   name: 'Malfunctioning Self-Preservation', effect: 'On a critical hit against you, make a Con save or become a CR 0 creature for 1 hour (as polymorph).' },
    { roll: '16',   name: 'Gullibility',          effect: 'Disadvantage on Insight checks.' },
    { roll: '17',   name: 'Hunted',               effect: 'Creatures of a random type can detect this item within 300 ft and will seek to obtain it.' },
    { roll: '18',   name: 'Truthfulness',         effect: 'Each time you willingly speak a lie, take 1d6 psychic damage (once per minute).' },
    { roll: '19',   name: 'Alcoholic Potency',    effect: 'Magical liquids you consume become extremely alcoholic. Con save or gain a level of drunkenness.' },
    { roll: '20',   name: 'Forced Attunement',    effect: "Requires attunement regardless of its normal rules. You can't unattune until a GM-determined task is completed." },
  ];

  readonly enchantingBoons = [
    { roll: '1',    name: 'Hairology',                    effect: 'You can change your hair colour at will over 1 minute.' },
    { roll: '2',    name: 'Favourable Pheromones',        effect: 'Advantage on Animal Handling checks.' },
    { roll: '3',    name: 'Gambler',                      effect: 'Proficiency with all gaming sets.' },
    { roll: '4',    name: 'Gravity Void',                 effect: 'When prone, you can stand up using only 5 feet of movement.' },
    { roll: '5',    name: 'Fleet',                        effect: 'Your speed increases by 5 feet.' },
    { roll: '6',    name: 'Composed',                     effect: 'Illusory magic masks visual tics. Advantage on Deception checks (truesight sees through it).' },
    { roll: '7',    name: 'Geolocational Position Sense', effect: 'You always know which direction is north and your elevation above/below sea level.' },
    { roll: '8',    name: 'Ray of Sunshine',              effect: 'As a bonus action, shed bright light 20 ft radius and dim light 20 ft further. Extinguish as a bonus action.' },
    { roll: '9',    name: "Cat's Landing",                effect: 'You take half damage from falling.' },
    { roll: '10',   name: 'Eye for Weakness',             effect: 'As a bonus action, identify the two lowest saving throw modifiers of a creature within 60 ft.' },
    { roll: '11',   name: 'Proficient',                   effect: 'Gain proficiency in one skill (determined by a roll on the Random Skill table).' },
    { roll: '12',   name: 'Sustenance',                   effect: 'Require half as much food and water. Reroll 1s on HP regained from spells.' },
    { roll: '13',   name: 'Creature Slaying',             effect: 'Attacks against a random creature type deal extra damage equal to your proficiency bonus on a critical hit.' },
    { roll: '14',   name: 'Insightful',                   effect: 'Advantage on Insight checks to detect if someone is lying.' },
    { roll: '15',   name: 'Oxygen Refiner',               effect: 'You can breathe underwater.' },
    { roll: '16',   name: 'Energy Repulsor',              effect: 'A random damage type has disadvantage on attack rolls against you and you have advantage on saves vs. it.' },
    { roll: '17',   name: 'Self-Preservation System',     effect: 'Reaction when critically hit: polymorph into a creature of CR equal to your proficiency bonus until dawn (no concentration).' },
    { roll: '18',   name: 'Sidekick',                     effect: 'When you use the Help action for a check or attack, the creature adds 1d4 to its roll.' },
    { roll: '19',   name: 'Power',                        effect: '+1 bonus to attack rolls and spell/effect save DCs.' },
    { roll: '20',   name: 'Additional Attunement',        effect: 'The number of magic items you can attune to increases by one.' },
  ];

  readonly craftingQuirkSectionOpts = [
    { value: 'all' as CraftingQuirkSection,           label: 'All' },
    { value: 'manufacturing' as CraftingQuirkSection, label: 'Manufacturing' },
    { value: 'enchanting' as CraftingQuirkSection,    label: 'Enchanting' },
  ];

  readonly craftingQuirkTypeOpts = [
    { value: 'all' as QuirkFilter,  label: 'All' },
    { value: 'flaw' as QuirkFilter, label: 'Flaws' },
    { value: 'boon' as QuirkFilter, label: 'Boons' },
  ];

  readonly visibleManufacturingFlaws = computed(() => {
    if (this.craftingQuirkType() === 'boon') return [];
    const s = this.craftingQuirkSection();
    return (s === 'all' || s === 'manufacturing') ? this.manufacturingFlaws : [];
  });

  readonly visibleManufacturingBoons = computed(() => {
    if (this.craftingQuirkType() === 'flaw') return [];
    const s = this.craftingQuirkSection();
    return (s === 'all' || s === 'manufacturing') ? this.manufacturingBoons : [];
  });

  readonly visibleEnchantingFlaws = computed(() => {
    if (this.craftingQuirkType() === 'boon') return [];
    const s = this.craftingQuirkSection();
    return (s === 'all' || s === 'enchanting') ? this.enchantingFlaws : [];
  });

  readonly visibleEnchantingBoons = computed(() => {
    if (this.craftingQuirkType() === 'flaw') return [];
    const s = this.craftingQuirkSection();
    return (s === 'all' || s === 'enchanting') ? this.enchantingBoons : [];
  });
}
