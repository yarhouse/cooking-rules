import { Component, inject, signal, computed, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { CookingDataService } from '../../services/cooking-data.service';
import { InventoryService } from '../../services/inventory.service';
import { Recipe, RecipeTier } from '../../models/recipe.model';
import { ComponentTypeName, Rarity, RarityScaling } from '../../models/component-type.model';
import { MonsterRarity } from '../../models/monster.model';

type TierRarityKey = keyof RarityScaling;

const TIER_RARITY: Record<RecipeTier, TierRarityKey> = {
  novice:     'uncommon',
  journeyman: 'rare',
  expert:     'veryRare',
  artisan:    'legendary',
  boss:       'legendary',
};

// Maps a rarity string → RarityScaling key (common/artifact/unknown → null)
function rarityToScalingKey(rarity: string): TierRarityKey | null {
  const map: Record<string, TierRarityKey> = {
    uncommon: 'uncommon', rare: 'rare', 'very-rare': 'veryRare', legendary: 'legendary',
  };
  return map[rarity] ?? null;
}

const COOKING_ESSENCE_RARITIES: Rarity[] = ['uncommon', 'rare', 'very-rare', 'legendary'];
const ESSENCE_NAMES: Record<string, string> = {
  uncommon: 'Frail', rare: 'Robust', 'very-rare': 'Potent', legendary: 'Mythic',
};

const TIER_ORDER: Record<RecipeTier, number> = {
  novice: 0, journeyman: 1, expert: 2, artisan: 3, boss: 4,
};

interface CookingQuirk {
  roll: number;
  name: string;
  type: 'flaw' | 'boon';
  effect: string;
}

const COOKING_FLAWS: CookingQuirk[] = [
  { roll: 1, name: "Rottworth's Revenge",  type: 'flaw', effect: "Explosive emissions leave you poisoned and unable to benefit from short or long rests. Spells or magical effects that remove the poisoned condition suppress this effect for 1 hour only." },
  { roll: 2, name: "Nauseating Nightmare", type: 'flaw', effect: "Visual and audible hallucinations. Disadvantage on Intelligence, Wisdom, and Charisma checks, and on initiative rolls." },
  { roll: 3, name: "Tongue Tied",          type: 'flaw', effect: "Tongue becomes enchanted; you can speak only in a language associated with one of the creature types whose component you ingested (GM's choice)." },
  { roll: 4, name: "Flatulence",           type: 'flaw', effect: "Foetid gases erupt uncontrollably. Disadvantage on Charisma checks against creatures within 30 feet that can smell; disadvantage on Stealth checks against creatures that can smell or hear." },
  { roll: 5, name: "Borborygmus Bomb",     type: 'flaw', effect: "Disadvantage on saving throws to maintain concentration. After 1d8 hours (GM secret), release a pungent miasma with the effects of the cloudkill spell centered on yourself, lasting 1 minute." },
  { roll: 6, name: "High Glycemic Index",  type: 'flaw', effect: "After 1d4 hours (GM secret), you crash. Disadvantage on Dexterity checks and Dexterity saving throws." },
  { roll: 7, name: "Allergic Reaction",    type: 'flaw', effect: "Skin puckers into an irritating rash. DC 10 Constitution saving throw at the start of each turn or use your action or bonus action to scratch." },
  { roll: 8, name: "Food Baby",            type: 'flaw', effect: "Meal leaves you bloated. Speed reduced by 5 feet." },
];

const COOKING_BOONS: CookingQuirk[] = [
  { roll: 1, name: "Iron Gut",            type: 'boon', effect: "Resistance to poison damage and advantage on saving throws against the poisoned condition." },
  { roll: 2, name: "Sweet Breath",        type: 'boon', effect: "Aroma perfumes your breath. Advantage on Charisma checks against creatures within 30 feet that can smell." },
  { roll: 3, name: "Linguistic Learning", type: 'boon', effect: "Gain the ability to speak one language associated with the creature type of each magical component consumed (GM's choice)." },
  { roll: 4, name: "Slow Release Energy", type: 'boon', effect: "Advantage on saving throws to maintain concentration." },
  { roll: 5, name: "Fearless Fancy",      type: 'boon', effect: "Immune to the frightened condition." },
  { roll: 6, name: "Hearty Harvest",      type: 'boon', effect: "Advantage on Strength checks; count as one size larger for carrying capacity and weight pushed, dragged, or lifted." },
  { roll: 7, name: "Peaceful Digestion",  type: 'boon', effect: "Next short rest: +1 HP per Hit Die rolled. Next long rest: recover extra Hit Dice equal to your proficiency bonus." },
  { roll: 8, name: "Fast Food",           type: 'boon', effect: "Meal leaves you energised. Speed increases by 5 feet." },
];

// A unified cooking candidate — either a direct inventory ingredient or an edible harvest component.
// isUnique: true  → id is ingredientId, deduct via updateQuantity
// isUnique: false → id is "componentId:rarity" (compound key), deduct via updateHarvestQuantity
interface CookingCandidate {
  id: string;           // compound "componentId:rarity" for harvest; ingredientId for unique
  componentId: string;  // the underlying component/ingredient id
  name: string;
  componentTypeId: ComponentTypeName;
  creatureTypeId: string;
  creatureTypeName: string;
  isUnique: boolean;
  rarity: MonsterRarity | null; // null for named ingredients (use recipe-tier scaling)
  qty: number;
  effectText: string;
  effectDescription: string;
  hasEffect: boolean;
  isSelected: boolean;
  available: boolean;
}

interface ResolvedSlot {
  slotIndex: number;
  componentTypeId: ComponentTypeName;
  componentTypeName: string;
  componentTypeDescription: string;       // rulebook description for the slot
  specificIngredientId?: string;
  selectedId: string | null;
  candidates: CookingCandidate[];
}

interface ResultIngredient {
  id: string;
  name: string;
  effectText: string;
  creatureTypeName: string;
  componentTypeName: string;
  rarity: MonsterRarity | null;
  hasEffect: boolean;
}

@Component({
  selector: 'app-cook-session',
  imports: [
    FormsModule,
    MatStepperModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatDividerModule,
  ],
  templateUrl: './cook-session.component.html',
  styleUrl: './cook-session.component.scss',
})
export class CookSessionComponent {
  @ViewChild('stepper') stepper!: MatStepper;

  private dataService = inject(CookingDataService);
  protected inventoryService = inject(InventoryService);

  // ── Step 1: Recipe selection ───────────────────────────────────────────
  selectedRecipe = signal<Recipe | null>(null);
  selectedEssence = signal<Rarity | null>(null);

  readonly cookingEssenceRarities = COOKING_ESSENCE_RARITIES;
  readonly essenceNames = ESSENCE_NAMES;

  readonly craftableRecipes = computed((): Recipe[] => {
    const essence = this.inventoryService.essence();
    const hasEssence = COOKING_ESSENCE_RARITIES.some(r => (essence[r] ?? 0) > 0);
    if (!hasEssence) return [];
    const inventoryMap = this.inventoryService.inventoryMap();
    const harvestTotalMap = this.inventoryService.harvestTotalMap();
    return this.dataService.getRecipes()
      .filter(recipe => this.isRecipeCraftable(recipe, inventoryMap, harvestTotalMap))
      .sort((a, b) => (TIER_ORDER[a.tier] ?? 0) - (TIER_ORDER[b.tier] ?? 0) || a.name.localeCompare(b.name));
  });

  private isRecipeCraftable(
    recipe: Recipe,
    inventoryMap: Map<string, number>,
    harvestTotalMap: Map<string, number>,
  ): boolean {
    const typeNeeded = new Map<ComponentTypeName, number>();
    for (const ri of recipe.ingredients) {
      if (ri.ingredientId) {
        if ((inventoryMap.get(ri.ingredientId) ?? 0) < 1) return false;
      } else {
        typeNeeded.set(ri.componentTypeId, (typeNeeded.get(ri.componentTypeId) ?? 0) + 1);
      }
    }
    for (const [typeId, needed] of typeNeeded) {
      const fromIngredients = this.dataService
        .getIngredientsByComponentType(typeId)
        .reduce((sum, ing) => sum + (inventoryMap.get(ing.id) ?? 0), 0);
      const fromHarvest = this.dataService
        .getEdibleHarvestComponents()
        .filter(hc => hc.edibleAs === typeId)
        .reduce((sum, hc) => sum + (harvestTotalMap.get(hc.id) ?? 0), 0);
      if (fromIngredients + fromHarvest < needed) return false;
    }
    return true;
  }

  selectRecipe(recipe: Recipe): void {
    if (this.selectedRecipe()?.id === recipe.id) {
      this.selectedRecipe.set(null);
      this.selectedSlots.set([]);
    } else {
      this.selectedRecipe.set(recipe);
      this.selectedSlots.set(recipe.ingredients.map(() => null));
    }
    this.selectedEssence.set(null);
  }

  tierLabel(tier: RecipeTier): string {
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  }

  readonly selectedRecipeTierRarityLabel = computed((): string => {
    const labels: Record<TierRarityKey, string> = {
      uncommon: 'Uncommon', rare: 'Rare', veryRare: 'Very Rare', legendary: 'Legendary',
    };
    const essenceRarity = this.selectedEssence();
    if (essenceRarity) {
      const key = rarityToScalingKey(essenceRarity);
      return key ? labels[key] : 'Uncommon';
    }
    const tier = this.selectedRecipe()?.tier ?? 'novice';
    return labels[TIER_RARITY[tier as RecipeTier]];
  });

  readonly selectedRecipeIngredientNames = computed((): string[] => {
    const recipe = this.selectedRecipe();
    if (!recipe) return [];
    return recipe.ingredients.map(ri =>
      this.dataService.getComponentType(ri.componentTypeId)?.name ?? ri.componentTypeId
    );
  });

  readonly selectedRecipeIngredientDetails = computed(() => {
    const recipe = this.selectedRecipe();
    if (!recipe) return [];

    const inventoryMap  = this.inventoryService.inventoryMap();
    const harvestStock  = this.inventoryService.harvestStock();

    interface StockItem {
      name: string;
      creatureTypeName: string;
      rarity: MonsterRarity | null;
      effectDesc: string;    // flavor: effect.description
      scalingText: string;   // technical: effect.scaling[rarityKey]
      qty: number;
    }
    interface SlotDetail {
      componentTypeId: ComponentTypeName;
      componentTypeName: string;
      componentTypeDescription: string;
      slotsNeeded: number;
      totalInStock: number;
      items: StockItem[];
    }

    const byType = new Map<ComponentTypeName, SlotDetail>();

    for (const ri of recipe.ingredients) {
      const existing = byType.get(ri.componentTypeId);
      if (existing) { existing.slotsNeeded++; continue; }

      const ct = this.dataService.getComponentType(ri.componentTypeId);
      const detail: SlotDetail = {
        componentTypeId: ri.componentTypeId,
        componentTypeName: ct?.name ?? ri.componentTypeId,
        componentTypeDescription: ct?.description ?? '',
        slotsNeeded: 1,
        totalInStock: 0,
        items: [],
      };

      const essenceRarity = this.selectedEssence();
      const tierRarityKey = essenceRarity
        ? (rarityToScalingKey(essenceRarity) ?? TIER_RARITY[recipe.tier])
        : TIER_RARITY[recipe.tier];

      // Named ingredients (specific items)
      for (const ing of this.dataService.getIngredientsByComponentType(ri.componentTypeId)) {
        const qty = inventoryMap.get(ing.id) ?? 0;
        if (qty <= 0) continue;
        const effect = this.dataService.getEffectFor(ri.componentTypeId, ing.creatureTypeId);
        detail.items.push({
          name: ing.name,
          creatureTypeName: this.dataService.getCreatureType(ing.creatureTypeId)?.name ?? ing.creatureTypeId,
          rarity: null,
          effectDesc: effect?.description ?? '',
          scalingText: effect?.scaling?.[tierRarityKey] ?? '',
          qty,
        });
        detail.totalInStock += qty;
      }

      // Harvest components — one row per (componentId × rarity) in stock
      for (const hc of this.dataService.getEdibleHarvestComponents()) {
        if (hc.edibleAs !== ri.componentTypeId) continue;
        for (const entry of harvestStock) {
          if (entry.harvestComponentId !== hc.id || entry.quantity <= 0) continue;
          const effect = this.dataService.getEffectFor(ri.componentTypeId, hc.creatureTypeId);
          const scalingKey = rarityToScalingKey(entry.rarity);
          detail.items.push({
            name: hc.name,
            creatureTypeName: hc.creatureTypeName,
            rarity: entry.rarity,
            effectDesc: effect?.description ?? '',
            scalingText: (scalingKey ? (effect?.scaling?.[scalingKey] ?? '') : ''),
            qty: entry.quantity,
          });
          detail.totalInStock += entry.quantity;
        }
      }

      byType.set(ri.componentTypeId, detail);
    }

    return Array.from(byType.values());
  });

  // ── Step 2: Ingredient assignment ──────────────────────────────────────
  selectedSlots = signal<(string | null)[]>([]);

  readonly slotUsageMap = computed((): Map<string, number> => {
    const map = new Map<string, number>();
    for (const id of this.selectedSlots()) {
      if (id) map.set(id, (map.get(id) ?? 0) + 1);
    }
    return map;
  });

  readonly resolvedSlots = computed((): ResolvedSlot[] => {
    const recipe = this.selectedRecipe();
    if (!recipe) return [];
    const inventoryMap = this.inventoryService.inventoryMap();
    const harvestStock = this.inventoryService.harvestStock();
    const usageMap = this.slotUsageMap();
    const currentSlots = this.selectedSlots();
    const essenceRarity = this.selectedEssence();
    const tierRarity = essenceRarity
      ? (rarityToScalingKey(essenceRarity) ?? TIER_RARITY[recipe.tier])
      : TIER_RARITY[recipe.tier];

    return recipe.ingredients.map((ri, slotIndex) => {
      const selectedId = currentSlots[slotIndex] ?? null;

      type RawCandidate = {
        id: string; componentId: string; name: string;
        creatureTypeId: string; creatureTypeName: string;
        isUnique: boolean; rarity: MonsterRarity | null; qty: number;
      };
      const rawCandidates: RawCandidate[] = [];

      if (ri.ingredientId) {
        const ing = this.dataService.getIngredient(ri.ingredientId);
        if (ing) {
          rawCandidates.push({
            id: ing.id, componentId: ing.id,
            name: ing.name,
            creatureTypeId: ing.creatureTypeId,
            creatureTypeName: this.dataService.getCreatureType(ing.creatureTypeId)?.name ?? ing.creatureTypeId,
            isUnique: true, rarity: null,
            qty: inventoryMap.get(ing.id) ?? 0,
          });
        }
      } else {
        for (const ing of this.dataService.getIngredientsByComponentType(ri.componentTypeId)) {
          const qty = inventoryMap.get(ing.id) ?? 0;
          if (qty > 0) {
            rawCandidates.push({
              id: ing.id, componentId: ing.id,
              name: ing.name,
              creatureTypeId: ing.creatureTypeId,
              creatureTypeName: this.dataService.getCreatureType(ing.creatureTypeId)?.name ?? ing.creatureTypeId,
              isUnique: true, rarity: null, qty,
            });
          }
        }
        // Expand harvest components by rarity — one candidate per (componentId × rarity) in stock
        for (const hc of this.dataService.getEdibleHarvestComponents()) {
          if (hc.edibleAs !== ri.componentTypeId) continue;
          for (const entry of harvestStock) {
            if (entry.harvestComponentId !== hc.id || entry.quantity <= 0) continue;
            rawCandidates.push({
              id: `${hc.id}:${entry.rarity}`,
              componentId: hc.id,
              name: hc.name,
              creatureTypeId: hc.creatureTypeId,
              creatureTypeName: hc.creatureTypeName,
              isUnique: false,
              rarity: entry.rarity,
              qty: entry.quantity,
            });
          }
        }
      }

      const candidates: CookingCandidate[] = rawCandidates.map(rc => {
        const currentUsage = usageMap.get(rc.id) ?? 0;
        const isSelected = selectedId === rc.id;
        const effectiveUsage = isSelected ? currentUsage : currentUsage + 1;
        const available = effectiveUsage <= rc.qty;

        // Harvest components use their own rarity; named ingredients use recipe tier
        const scalingKey = rc.rarity ? rarityToScalingKey(rc.rarity) : tierRarity;
        const effect = this.dataService.getEffectFor(ri.componentTypeId, rc.creatureTypeId);
        let effectText = '';
        if (effect) {
          effectText = (scalingKey ? (effect.scaling?.[scalingKey] ?? '') : '') || effect.description;
        }

        return {
          ...rc,
          componentTypeId: ri.componentTypeId,
          effectText,
          effectDescription: effect?.description ?? '',
          hasEffect: !!effect,
          isSelected,
          available,
        };
      });

      return {
        slotIndex,
        componentTypeId: ri.componentTypeId,
        componentTypeName: this.dataService.getComponentType(ri.componentTypeId)?.name ?? ri.componentTypeId,
        componentTypeDescription: this.dataService.getComponentType(ri.componentTypeId)?.description ?? '',
        specificIngredientId: ri.ingredientId,
        selectedId,
        candidates,
      };
    });
  });

  // Maps candidate id → deduction metadata; built from resolved slots
  readonly candidateSourceMap = computed((): Map<string, { isUnique: boolean; componentId: string; rarity: MonsterRarity | null }> => {
    const map = new Map<string, { isUnique: boolean; componentId: string; rarity: MonsterRarity | null }>();
    for (const slot of this.resolvedSlots()) {
      for (const c of slot.candidates) {
        map.set(c.id, { isUnique: c.isUnique, componentId: c.componentId, rarity: c.rarity });
      }
    }
    return map;
  });

  selectIngredient(slotIndex: number, candidateId: string): void {
    const slots = [...this.selectedSlots()];
    slots[slotIndex] = slots[slotIndex] === candidateId ? null : candidateId;
    this.selectedSlots.set(slots);
  }

  readonly slotsComplete = computed((): boolean =>
    this.selectedSlots().length > 0 && this.selectedSlots().every(s => s !== null)
  );

  // ── Step 3: Cook check ─────────────────────────────────────────────────
  cookRoll = signal(0);
  sousChefBonus = signal(0);

  readonly cookTotal = computed(() => this.cookRoll() + this.sousChefBonus());
  readonly recipeDc = computed(() => this.selectedRecipe()?.dc ?? 0);
  readonly cookMargin = computed(() => this.cookTotal() - this.recipeDc());
  readonly cookPassed = computed(() => this.cookMargin() >= 0);

  // ── Step 4: Results & Quirks ───────────────────────────────────────────

  readonly quirkOutcome = computed((): { type: 'flaw' | 'boon'; count: number } | null => {
    if (this.cookRoll() === 0) return null;
    const margin = this.cookMargin();
    if (margin < 0) {
      const abs = Math.abs(margin);
      if (abs >= 15) return { type: 'flaw', count: 4 };
      if (abs >= 10) return { type: 'flaw', count: 3 };
      if (abs >= 5)  return { type: 'flaw', count: 2 };
      return { type: 'flaw', count: 1 };
    }
    if (margin >= 15) return { type: 'boon', count: 3 };
    if (margin >= 10) return { type: 'boon', count: 2 };
    if (margin >= 5)  return { type: 'boon', count: 1 };
    return null;
  });

  rolledQuirks = signal<(CookingQuirk | null)[]>([]);
  ingredientsConsumed = signal(false);

  goToResults(): void {
    const outcome = this.quirkOutcome();
    this.rolledQuirks.set(outcome ? new Array(outcome.count).fill(null) : []);
    this.stepper.next();
  }

  rollQuirk(index: number): void {
    const outcome = this.quirkOutcome();
    if (!outcome) return;
    const d8 = Math.floor(Math.random() * 8) + 1;
    const table = outcome.type === 'flaw' ? COOKING_FLAWS : COOKING_BOONS;
    const quirk = table.find(q => q.roll === d8) ?? table[0];
    const slots = [...this.rolledQuirks()];
    slots[index] = quirk;
    this.rolledQuirks.set(slots);
  }

  deductIngredients(): void {
    if (this.ingredientsConsumed()) return;
    const sourceMap = this.candidateSourceMap();
    for (const id of this.selectedSlots()) {
      if (!id) continue;
      const source = sourceMap.get(id);
      if (!source) continue;
      if (source.isUnique) {
        this.inventoryService.updateQuantity(source.componentId, -1);
      } else {
        this.inventoryService.updateHarvestQuantity(source.componentId, source.rarity!, -1);
      }
    }
    const essence = this.selectedEssence();
    if (essence) this.inventoryService.adjustEssence(essence, -1);
    this.ingredientsConsumed.set(true);
  }

  readonly resultsIngredients = computed((): ResultIngredient[] =>
    this.resolvedSlots()
      .map(slot => {
        if (!slot.selectedId) return null;
        const c = slot.candidates.find(x => x.id === slot.selectedId);
        if (!c) return null;
        return {
          id: c.id,
          name: c.name,
          effectText: c.effectText,
          creatureTypeName: c.creatureTypeName,
          componentTypeName: slot.componentTypeName,
          rarity: c.rarity,
          hasEffect: c.hasEffect,
        };
      })
      .filter((x): x is ResultIngredient => x !== null)
  );

  quirkRange(count: number): number[] {
    return Array.from({ length: count }, (_, i) => i);
  }

  reset(): void {
    this.selectedRecipe.set(null);
    this.selectedEssence.set(null);
    this.selectedSlots.set([]);
    this.cookRoll.set(0);
    this.sousChefBonus.set(0);
    this.rolledQuirks.set([]);
    this.ingredientsConsumed.set(false);
    this.stepper.reset();
  }
}
