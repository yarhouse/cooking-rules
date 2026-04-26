import {
  Component, inject, signal, OnInit, ViewChild,
} from '@angular/core';
import {
  FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators,
} from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { CookingDataService } from '../../../services/cooking-data.service';
import { CookingCreateService } from '../../../services/cooking-create.service';
import { HarvestComponent } from '../../../models/harvest-component.model';
import { Monster, MonsterRarity } from '../../../models/monster.model';
import { UpdateMonsterPayload } from '../../../models/create-payloads.model';
import { ComponentTypeName } from '../../../models/component-type.model';

@Component({
  selector: 'app-monster-edit-page',
  imports: [
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatListModule,
  ],
  templateUrl: './monster-edit-page.component.html',
  styleUrl: './monster-edit-page.component.scss',
})
export class MonsterEditPageComponent implements OnInit {
  private route         = inject(ActivatedRoute);
  private router        = inject(Router);
  readonly location     = inject(Location);
  private dataService   = inject(CookingDataService);
  private createService = inject(CookingCreateService);

  // ── Resolved monster ───────────────────────────────────────────────────────
  readonly monster = signal<Monster | null>(null);

  // ── Reference data ─────────────────────────────────────────────────────────
  readonly rarities: MonsterRarity[] = ['common', 'uncommon', 'rare', 'very-rare', 'legendary'];

  // ── Step 1: Source details ─────────────────────────────────────────────────
  readonly step1 = new FormGroup({
    name:           new FormControl('',       [Validators.required, Validators.maxLength(200)]),
    creatureTypeId: new FormControl('',       Validators.required),
    rarity:         new FormControl<MonsterRarity>('common', Validators.required),
    isBoss:         new FormControl(false),
    notes:          new FormControl(''),
  });

  // ── Step 2: Harvestable components ─────────────────────────────────────────
  readonly availableHarvestComponents = signal<HarvestComponent[]>([]);
  readonly selectedComponents         = signal<Set<string>>(new Set());
  readonly step2Error                 = signal<string | null>(null);
  readonly originalSelectedIds        = signal<Set<string>>(new Set());
  readonly removedComponents          = signal<{ id: string; name: string }[]>([]);

  // ── Step 3: Name each ingredient ───────────────────────────────────────────
  readonly step3 = new FormGroup({
    ingredients: new FormArray<FormGroup>([]),
  });

  get ingredientRows(): FormArray<FormGroup> {
    return this.step3.get('ingredients') as FormArray<FormGroup>;
  }

  ingredientRowMeta: HarvestComponent[] = [];

  @ViewChild('stepper') stepper!: MatStepper;

  // ── UI state ───────────────────────────────────────────────────────────────
  readonly submitting   = signal(false);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const monsterId = this.route.snapshot.paramMap.get('monsterId');
    if (!monsterId) { this.router.navigate(['/browse']); return; }

    const m = this.dataService.getMonster(monsterId);
    if (!m) { this.router.navigate(['/browse']); return; }

    this.monster.set(m);

    this.step1.patchValue({
      name:           m.name,
      creatureTypeId: m.creatureTypeId,
      rarity:         m.rarity,
      isBoss:         m.isBoss ?? false,
      notes:          m.notes ?? '',
    });
    this.step1.get('creatureTypeId')!.disable();

    // Load harvest components eagerly — creature type is locked
    const components = this.dataService
      .getHarvestComponentsByCreatureType(m.creatureTypeId)
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name));
    this.availableHarvestComponents.set(components);

    // Resolve original selected IDs
    let originalIds = new Set(m.selectedHarvestComponentIds ?? []);
    if (originalIds.size === 0) {
      const originalTypes = new Set(m.harvestableComponents);
      components
        .filter(hc => hc.isEdible && hc.edibleAs && originalTypes.has(hc.edibleAs as ComponentTypeName))
        .forEach(hc => originalIds.add(hc.id));
    }
    this.originalSelectedIds.set(originalIds);
    this.selectedComponents.set(new Set(originalIds));
  }

  onHarvestSelectionChange(event: MatSelectionListChange): void {
    const selected = new Set<string>(
      event.source.selectedOptions.selected.map(opt => opt.value as string),
    );
    this.selectedComponents.set(selected);
    this.step2Error.set(null);
  }

  isSelected(id: string): boolean {
    return this.selectedComponents().has(id);
  }

  onStepChange(event: StepperSelectionEvent): void {
    if (event.selectedIndex === 2) {
      this.buildIngredientRows();
    }
  }

  private buildIngredientRows(): void {
    while (this.ingredientRows.length) this.ingredientRows.removeAt(0);
    this.ingredientRowMeta = [];

    const monsterName = this.step1.value.name?.trim() ?? '';
    const original    = this.originalSelectedIds();

    const removed = [...original].filter(id => !this.selectedComponents().has(id));
    this.removedComponents.set(
      removed
        .map(id => this.availableHarvestComponents().find(h => h.id === id))
        .filter((hc): hc is HarvestComponent => !!hc)
        .map(hc => ({ id: hc.id, name: hc.name })),
    );

    for (const id of this.selectedComponents()) {
      if (original.has(id)) continue;
      const hc = this.availableHarvestComponents().find(h => h.id === id);
      if (!hc) continue;
      this.ingredientRowMeta.push(hc);
      const defaultName = monsterName ? `${monsterName} ${hc.name}` : hc.name;
      this.ingredientRows.push(new FormGroup({
        name:  new FormControl(defaultName, [Validators.required, Validators.maxLength(200)]),
        notes: new FormControl(''),
      }));
    }
  }

  submit(): void {
    if (this.step1.invalid || this.step3.invalid) return;
    const m = this.monster();
    if (!m) return;

    this.submitting.set(true);
    this.errorMessage.set(null);

    const s1 = this.step1.getRawValue();

    const selectedEdibleTypes = [...this.selectedComponents()]
      .map(id => this.availableHarvestComponents().find(h => h.id === id))
      .filter((hc): hc is HarvestComponent => !!(hc?.isEdible && hc.edibleAs))
      .map(hc => hc.edibleAs) as ComponentTypeName[];

    const payload: UpdateMonsterPayload = {
      name:                        s1.name!.trim(),
      rarity:                      s1.rarity!,
      isBoss:                      s1.isBoss ?? false,
      notes:                       s1.notes?.trim() || null,
      harvestableComponents:       selectedEdibleTypes,
      selectedHarvestComponentIds: [...this.selectedComponents()],
      newIngredients:              this.ingredientRows.controls.map((row, i) => ({
        name:            row.value.name.trim(),
        componentTypeId: (this.ingredientRowMeta[i].isEdible
          ? this.ingredientRowMeta[i].edibleAs
          : null) as ComponentTypeName | null,
        notes:           row.value.notes?.trim() || null,
      })),
    };

    this.createService.updateMonster(m.id, payload).subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigate(['/browse']);
      },
      error: (err) => {
        this.submitting.set(false);
        this.errorMessage.set(err?.message ?? 'Something went wrong. Please try again.');
      },
    });
  }
}
