import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CookingDataService } from '../../services/cooking-data.service';
import { InventoryService } from '../../services/inventory.service';
import { MagicItem, MagicItemCategory, MAGIC_ITEM_CATEGORY_LABELS } from '../../models/magic-item.model';
import { CraftConfirmDialogComponent, CraftConfirmData } from './craft-confirm-dialog.component';

type QuirkSection = 'all' | 'manufacturing' | 'enchanting';
type QuirkFilter  = 'all' | 'flaw' | 'boon';

@Component({
  selector: 'app-crafting',
  imports: [
    FormsModule,
    TitleCasePipe,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatDividerModule,
    MatTooltipModule,
    MatExpansionModule,
  ],
  templateUrl: './crafting.component.html',
  styleUrl: './crafting.component.scss',
})
export class CraftingComponent {
  private dataService  = inject(CookingDataService);
  private inventory    = inject(InventoryService);
  private dialog       = inject(MatDialog);
  private snackBar     = inject(MatSnackBar);

  readonly CATEGORY_LABELS = MAGIC_ITEM_CATEGORY_LABELS;
  readonly ALL_CATEGORIES: MagicItemCategory[] = [
    'ammunition', 'armour', 'potion', 'ring', 'rod', 'scroll', 'staff', 'wand', 'weapon', 'wondrous',
  ];
  readonly ALL_RARITIES = ['common', 'uncommon', 'rare', 'very-rare', 'legendary', 'artifact'];

  readonly SECTION_OPTS: Array<{ value: QuirkSection; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'enchanting', label: 'Enchanting' },
  ];

  readonly FILTER_OPTS: Array<{ value: QuirkFilter; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'flaw', label: 'Flaws' },
    { value: 'boon', label: 'Boons' },
  ];
  readonly RARITY_LABELS: Record<string, string> = {
    common: 'Common', uncommon: 'Uncommon', rare: 'Rare',
    'very-rare': 'Very Rare', legendary: 'Legendary', artifact: 'Artifact',
  };

  // ── Tab 2: Magic Items ────────────────────────────────────────────────

  searchQuery      = signal('');
  selectedCategory = signal<MagicItemCategory | null>(null);
  selectedRarity   = signal<string | null>(null);
  expandedItemId   = signal<string | null>(null);
  craftableOnly    = signal(false);

  readonly craftableItemIds = computed((): Set<string> => {
    const stockMap = this.inventory.harvestStockMap();
    const essence  = this.inventory.essence();
    const ids = new Set<string>();
    for (const item of this.dataService.getMagicItems()) {
      if (this.dataService.isMagicItemCraftable(item, stockMap, essence)) {
        ids.add(item.id);
      }
    }
    return ids;
  });

  readonly filteredMagicItems = computed(() => {
    const q    = this.searchQuery().toLowerCase().trim();
    const cat  = this.selectedCategory();
    const rar  = this.selectedRarity();
    const craftIds = this.craftableOnly() ? this.craftableItemIds() : null;
    return this.dataService.getMagicItems(q || undefined).filter(item => {
      if (cat && item.category !== cat)  return false;
      if (rar && item.rarity   !== rar)  return false;
      if (craftIds && !craftIds.has(item.id)) return false;
      return true;
    });
  });

  selectCategory(cat: MagicItemCategory): void {
    this.selectedCategory.set(this.selectedCategory() === cat ? null : cat);
  }

  selectRarity(rar: string): void {
    this.selectedRarity.set(this.selectedRarity() === rar ? null : rar);
  }

  toggleExpand(id: string): void {
    this.expandedItemId.set(this.expandedItemId() === id ? null : id);
  }

  confirmCraft(item: MagicItem, event: Event): void {
    event.stopPropagation();
    const lines: CraftConfirmData['lines'] = item.components
      .filter(c => c.creatureTypeId)
      .map(c => ({
        label: `${c.creatureTypeId ? c.creatureTypeId.charAt(0).toUpperCase() + c.creatureTypeId.slice(1) : ''} — ${c.componentName}`,
        qty: c.quantity,
      }));
    if (item.essenceType) {
      lines.push({ label: `${item.essenceType} Essence`, qty: 1 });
    }

    const ref = this.dialog.open(CraftConfirmDialogComponent, {
      data: { itemName: item.name, lines } satisfies CraftConfirmData,
      width: '360px',
    });

    ref.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.inventory.craftMagicItem(item, this.dataService.getHarvestComponents());
        this.snackBar.open(`Crafted ${item.name}!`, 'Dismiss', { duration: 3500 });
      }
    });
  }

  // ── Tab 3: Quirks ─────────────────────────────────────────────────────

  quirkSection = signal<QuirkSection>('all');
  quirkFilter  = signal<QuirkFilter>('all');

  readonly manufacturingFlaws = [
    { roll: '1–6',  name: 'Poor Handiwork',     effect: 'Weapon: −1 to attack and damage rolls. Armour: −1 to base AC. Other: gains Fragile.' },
    { roll: '7–8',  name: 'Fragile',             effect: 'Weapon: breaks on a natural 1 attack roll. Other: on a critical hit against you, roll d20 per fragile item; on 1 it breaks.' },
    { roll: '9–10', name: 'Unwieldy',            effect: 'On a natural 1 attack or Dex save/check: weapon flies 10 ft in a random direction; other item causes you to fall prone.' },
    { roll: '11–12',name: 'Degradable',          effect: 'Roll d20 after each submersion in water or hour in a corrosive environment. On 1, the item breaks.' },
    { roll: '13–14',name: 'Noisy',               effect: 'You have disadvantage on Stealth checks while wearing or carrying the item, even if stowed.' },
    { roll: '15',   name: 'Pungent',             effect: 'Disadvantage on Charisma checks against creatures that dislike bad smells; others have advantage on Perception checks to detect you by smell.' },
    { roll: '16',   name: 'Heavy',               effect: 'This item weighs twice as much as normal.' },
    { roll: '17',   name: 'Garish',              effect: 'Disadvantage on Intimidation checks against creatures that can see the item.' },
    { roll: '18',   name: 'Mediocre Finish',     effect: 'The item looks terrible and is worth half its normal value.' },
    { roll: '19',   name: 'Under Insulated',     effect: 'While wearing or carrying this item, whenever you take cold or fire damage you take an additional 1d8 of the same type.' },
    { roll: '20',   name: 'Dangerous',           effect: 'The critical fail range for attacks/checks with this item increases by 1 (e.g. 1–2 instead of 1).' },
  ];

  readonly manufacturingBoons = [
    { roll: '1–2',  name: 'Durable',              effect: 'The hit points of this item are tripled.' },
    { roll: '3–4',  name: 'Unreactive',            effect: 'Resists corrosion and rot. When an effect would damage the item, roll d20; on 11+ the item is unaffected.' },
    { roll: '5–6',  name: 'Lightweight',           effect: 'Weighs half as much. Loses the heavy property (or gains light if it didn\'t have heavy).' },
    { roll: '7–8',  name: 'Magnificent Finish',    effect: 'The item\'s finish is exceptional and worth twice its normal value.' },
    { roll: '9–10', name: 'Flashy',                effect: 'Advantage on Persuasion checks against creatures that can see the item.' },
    { roll: '11–12',name: 'Insulated',             effect: 'Armour/clothing: advantage on Con saves vs. cold weather. Weapon/held: advantage on saves vs. heat metal.' },
    { roll: '13–14',name: 'Grippy',                effect: 'Advantage on checks/saves to resist being disarmed or having the item taken from you.' },
    { roll: '15–16',name: 'Quick Release',         effect: 'Armour/shield: don or doff time is 10× quicker (shield takes a bonus action or action).' },
    { roll: '17–18',name: 'Aerodynamic',           effect: 'Thrown/ammunition: normal and long range increase by 50%.' },
    { roll: '19',   name: 'Perfect Balance',       effect: 'Weapon: reroll natural 1s on attack rolls. Armour/clothing: reroll natural 1s on Acrobatics checks and Dex saves.' },
    { roll: '20',   name: 'Artisanal Craftsmanship',effect: 'Weapon: +1 to damage rolls. Armour: reduce nonmagical B/P/S damage by 1.' },
  ];

  readonly enchantingFlaws = [
    { roll: '1–2',  name: 'Cursed',              effect: 'Item is cursed. You are unwilling to part with it. Roll again on this table to determine the curse\'s nature.' },
    { roll: '3',    name: 'Battlerage',          effect: 'When combat ends, make a Wisdom save or treat all creatures as enemies until the end of your next turn.' },
    { roll: '4',    name: 'Desensitisation',     effect: 'Vision becomes black and white, darkvision reduced by 30 ft, sounds muted. Disadvantage on Perception checks.' },
    { roll: '5',    name: 'Gravity Well',        effect: 'You weigh three times as much. Your speed is reduced by 5 feet.' },
    { roll: '6',    name: 'Falsehood',           effect: 'Each time you willingly speak the truth, take 1d6 psychic damage (once per minute).' },
    { roll: '7',    name: 'Divinable',           effect: 'Any Arcana-proficient creature that knows your name can pinpoint your location as an action.' },
    { roll: '8',    name: 'Illiteracy',          effect: 'You can\'t read or write.' },
    { roll: '9',    name: 'Attraction',          effect: 'Ranged weapon attacks made against you have advantage to hit.' },
    { roll: '10',   name: 'Energy Magnet',       effect: 'A random damage type (roll d10) has advantage on attack rolls against you and you have disadvantage on saves vs. it.' },
    { roll: '11',   name: 'Creature Sustaining', effect: 'You deal only half damage to creatures of a type determined by a d14 roll.' },
    { roll: '12',   name: 'External Monologue',  effect: 'After a long rest, make a Wisdom save or speak all your thoughts aloud until your next long rest.' },
    { roll: '13',   name: 'Chain Reaction',      effect: 'When you take a random damage type, all creatures within 10 ft take 3d6 of the same type (Dex save half; you automatically fail).' },
    { roll: '14',   name: 'Rot',                effect: 'You appear and smell like you\'re decaying. Advantage on Intimidation vs. non-fiends/undead; disadvantage on all other Charisma checks.' },
    { roll: '15',   name: 'Malfunctioning Self-Preservation', effect: 'On a critical hit against you, make a Con save or become a CR 0 creature for 1 hour (as polymorph).' },
    { roll: '16',   name: 'Gullibility',         effect: 'Disadvantage on Insight checks.' },
    { roll: '17',   name: 'Hunted',              effect: 'Creatures of a random type can detect this item within 300 ft and will seek to obtain it.' },
    { roll: '18',   name: 'Truthfulness',        effect: 'Each time you willingly speak a lie, take 1d6 psychic damage (once per minute).' },
    { roll: '19',   name: 'Alcoholic Potency',   effect: 'Magical liquids you consume become extremely alcoholic. Con save or gain a level of drunkenness.' },
    { roll: '20',   name: 'Forced Attunement',   effect: 'Requires attunement regardless of its normal rules. You can\'t unattune until a GM-determined task is completed.' },
  ];

  readonly enchantingBoons = [
    { roll: '1',    name: 'Hairology',            effect: 'You can change your hair colour at will over 1 minute.' },
    { roll: '2',    name: 'Favourable Pheromones',effect: 'Advantage on Animal Handling checks.' },
    { roll: '3',    name: 'Gambler',              effect: 'Proficiency with all gaming sets.' },
    { roll: '4',    name: 'Gravity Void',         effect: 'When prone, you can stand up using only 5 feet of movement.' },
    { roll: '5',    name: 'Fleet',               effect: 'Your speed increases by 5 feet.' },
    { roll: '6',    name: 'Composed',             effect: 'Illusory magic masks visual tics. Advantage on Deception checks (truesight sees through it).' },
    { roll: '7',    name: 'Geolocational Position Sense', effect: 'You always know which direction is north and your elevation above/below sea level.' },
    { roll: '8',    name: 'Ray of Sunshine',      effect: 'As a bonus action, shed bright light 20 ft radius and dim light 20 ft further. Extinguish as a bonus action.' },
    { roll: '9',    name: 'Cat\'s Landing',       effect: 'You take half damage from falling.' },
    { roll: '10',   name: 'Eye for Weakness',     effect: 'As a bonus action, identify the two lowest saving throw modifiers of a creature within 60 ft.' },
    { roll: '11',   name: 'Proficient',           effect: 'Gain proficiency in one skill (determined by a roll on the Random Skill table).' },
    { roll: '12',   name: 'Sustenance',           effect: 'Require half as much food and water. Reroll 1s on HP regained from spells.' },
    { roll: '13',   name: 'Creature Slaying',     effect: 'Attacks against a random creature type deal extra damage equal to your proficiency bonus on a critical hit.' },
    { roll: '14',   name: 'Insightful',           effect: 'Advantage on Insight checks to detect if someone is lying.' },
    { roll: '15',   name: 'Oxygen Refiner',       effect: 'You can breathe underwater.' },
    { roll: '16',   name: 'Energy Repulsor',      effect: 'A random damage type has disadvantage on attack rolls against you and you have advantage on saves vs. it.' },
    { roll: '17',   name: 'Self-Preservation System', effect: 'Reaction when critically hit: polymorph into a creature of CR equal to your proficiency bonus until dawn (no concentration).' },
    { roll: '18',   name: 'Sidekick',             effect: 'When you use the Help action for a check or attack, the creature adds 1d4 to its roll.' },
    { roll: '19',   name: 'Power',               effect: '+1 bonus to attack rolls and spell/effect save DCs.' },
    { roll: '20',   name: 'Additional Attunement',effect: 'The number of magic items you can attune to increases by one.' },
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

  // ── Tab 1: Rules (static reference data) ──────────────────────────────

  readonly enchantingTable = [
    { rarity: 'Common',    essence: '—',     dc: 12, consumable: '0.5 hrs', nonAttunement: '1 hr',   attunement: '2 hrs'       },
    { rarity: 'Uncommon',  essence: 'Frail', dc: 15, consumable: '4 hrs',   nonAttunement: '10 hrs',  attunement: '20 hrs'      },
    { rarity: 'Rare',      essence: 'Robust',dc: 18, consumable: '20 hrs',  nonAttunement: '40 hrs',  attunement: '80 hrs'      },
    { rarity: 'Very Rare', essence: 'Potent',dc: 21, consumable: '80 hrs',  nonAttunement: '160 hrs', attunement: '320 hrs'     },
    { rarity: 'Legendary', essence: 'Mythic',dc: 25, consumable: '320 hrs', nonAttunement: '640 hrs', attunement: '1,280 hrs'   },
    { rarity: 'Artifact',  essence: 'Deific',dc: 30, consumable: '50k hrs', nonAttunement: '100k hrs',attunement: '200k hrs'    },
  ];

  readonly enchantingSkillTable = [
    { type: 'Aberration', skill: 'Arcana'        },
    { type: 'Beast',      skill: 'Survival'      },
    { type: 'Celestial',  skill: 'Religion'      },
    { type: 'Construct',  skill: 'Investigation' },
    { type: 'Dragon',     skill: 'Survival'      },
    { type: 'Elemental',  skill: 'Arcana'        },
    { type: 'Fey',        skill: 'Arcana'        },
    { type: 'Fiend',      skill: 'Religion'      },
    { type: 'Giant',      skill: 'Medicine'      },
    { type: 'Humanoid',   skill: 'Medicine'      },
    { type: 'Monstrosity',skill: 'Survival'      },
    { type: 'Ooze',       skill: 'Nature'        },
    { type: 'Plant',      skill: 'Nature'        },
    { type: 'Undead',     skill: 'Medicine'      },
  ];

  /** Convert display rarity string ('Very Rare') to CSS class suffix ('very-rare') */
  rarityClass(rarity: string): string {
    return rarity.toLowerCase().replace(/\s+/g, '-');
  }

  // ── Filtered quirk lists ───────────────────────────────────────────────

  readonly visibleManufacturingFlaws = computed(() => {
    const f = this.quirkFilter();
    if (f === 'boon') return [];
    const s = this.quirkSection();
    return (s === 'all' || s === 'manufacturing') ? this.manufacturingFlaws : [];
  });

  readonly visibleManufacturingBoons = computed(() => {
    const f = this.quirkFilter();
    if (f === 'flaw') return [];
    const s = this.quirkSection();
    return (s === 'all' || s === 'manufacturing') ? this.manufacturingBoons : [];
  });

  readonly visibleEnchantingFlaws = computed(() => {
    const f = this.quirkFilter();
    if (f === 'boon') return [];
    const s = this.quirkSection();
    return (s === 'all' || s === 'enchanting') ? this.enchantingFlaws : [];
  });

  readonly visibleEnchantingBoons = computed(() => {
    const f = this.quirkFilter();
    if (f === 'flaw') return [];
    const s = this.quirkSection();
    return (s === 'all' || s === 'enchanting') ? this.enchantingBoons : [];
  });
}
