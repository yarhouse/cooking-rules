import {
  Component, inject, signal, OnInit, ViewChild,
} from '@angular/core';
import {
  FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA, MatDialogModule, MatDialogRef,
} from '@angular/material/dialog';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { CookingDataService } from '../../../services/cooking-data.service';
import { CookingCreateService } from '../../../services/cooking-create.service';
import { HarvestComponent } from '../../../models/harvest-component.model';
import { Monster, MonsterRarity } from '../../../models/monster.model';
import {
  CreateMonsterPayload, UpdateMonsterPayload,
} from '../../../models/create-payloads.model';
import { ComponentTypeName } from '../../../models/component-type.model';

@Component({
  selector: 'app-create-ingredient-source-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatListModule,
  ],
  templateUrl: './create-ingredient-source-dialog.component.html',
  styleUrl: './create-ingredient-source-dialog.component.scss',
})
export class CreateIngredientSourceDialogComponent implements OnInit {
  private dialogRef    = inject(MatDialogRef<CreateIngredientSourceDialogComponent>);
  private dialogData   = inject<{ monster?: Monster } | null>(MAT_DIALOG_DATA, { optional: true });
  private dataService  = inject(CookingDataService);
  private createService = inject(CookingCreateService);

  // ── Edit mode ──────────────────────────────────────────────────────────────
  get editMonster(): Monster | null { return this.dialogData?.monster ?? null; }
  get isEditMode(): boolean { return !!this.dialogData?.monster; }

  // ── Reference data ─────────────────────────────────────────────────────────
  readonly creatureTypes = this.dataService.getCreatureTypes();
  readonly rarities: MonsterRarity[] = ['common', 'uncommon', 'rare', 'very-rare', 'legendary'];

  // ── Step 1: Source details ─────────────────────────────────────────────────
  readonly step1 = new FormGroup({
    name:           new FormControl('',  [Validators.required, Validators.maxLength(200)]),
    creatureTypeId: new FormControl('',  Validators.required),
    rarity:         new FormControl<MonsterRarity>('common', Validators.required),
    isBoss:         new FormControl(false),
    notes:          new FormControl(''),
  });

  // ── Step 2: Harvestable components ─────────────────────────────────────────
  readonly availableHarvestComponents = signal<HarvestComponent[]>([]);
  readonly selectedComponents         = signal<Set<string>>(new Set());
  step2Error = signal<string | null>(null);

  // Edit mode: harvest_component IDs that were originally on the monster
  readonly originalSelectedIds = signal<Set<string>>(new Set());
  // Components removed in this edit session (for step 3 warning + server diff)
  readonly removedComponents   = signal<{ id: string; name: string }[]>([]);

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
    this.dialogRef.disableClose = true;

    if (this.isEditMode) {
      const m = this.editMonster!;
      this.step1.patchValue({
        name:           m.name,
        creatureTypeId: m.creatureTypeId,
        rarity:         m.rarity,
        isBoss:         m.isBoss ?? false,
        notes:          m.notes ?? '',
      });
      // Creature type can't change after creation — components are type-specific
      this.step1.get('creatureTypeId')!.disable();
    }
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
    if (event.selectedIndex === 1) {
      const creatureTypeId = this.step1.getRawValue().creatureTypeId ?? '';
      const components = this.dataService
        .getHarvestComponentsByCreatureType(creatureTypeId)
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name));
      this.availableHarvestComponents.set(components);

      if (this.isEditMode) {
        const m = this.editMonster!;
        // Use stored selectedHarvestComponentIds if available; fall back to edibleAs matching
        let originalIds = new Set(m.selectedHarvestComponentIds ?? []);
        if (originalIds.size === 0) {
          const originalTypes = new Set(m.harvestableComponents);
          components
            .filter(hc => hc.isEdible && hc.edibleAs && originalTypes.has(hc.edibleAs as ComponentTypeName))
            .forEach(hc => originalIds.add(hc.id));
        }
        this.originalSelectedIds.set(originalIds);
        this.selectedComponents.set(new Set(originalIds));
      } else {
        this.selectedComponents.set(new Set());
      }
      this.step2Error.set(null);
    }

    if (event.selectedIndex === 2) {
      if (this.selectedComponents().size === 0 && !this.isEditMode) {
        this.step2Error.set('Select at least one component.');
        setTimeout(() => this.stepper.previous(), 0);
        return;
      }
      this.buildIngredientRows();
    }
  }

  private buildIngredientRows(): void {
    while (this.ingredientRows.length) this.ingredientRows.removeAt(0);
    this.ingredientRowMeta = [];

    const monsterName = this.step1.value.name?.trim() ?? '';

    if (this.isEditMode) {
      const original = this.originalSelectedIds();

      // Track removed components for the warning panel
      const removed = [...original].filter(id => !this.selectedComponents().has(id));
      this.removedComponents.set(
        removed
          .map(id => this.availableHarvestComponents().find(h => h.id === id))
          .filter((hc): hc is HarvestComponent => !!hc)
          .map(hc => ({ id: hc.id, name: hc.name })),
      );

      // Only build form rows for NEWLY added components
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
    } else {
      for (const id of this.selectedComponents()) {
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
  }

  submit(): void {
    if (this.step1.invalid || this.step3.invalid) return;

    this.submitting.set(true);
    this.errorMessage.set(null);

    const s1 = this.step1.getRawValue();

    if (this.isEditMode) {
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

      this.createService.updateMonster(this.editMonster!.id, payload).subscribe({
        next: (result) => {
          this.submitting.set(false);
          this.dialogRef.close(result);
        },
        error: (err) => {
          this.submitting.set(false);
          this.errorMessage.set(err?.message ?? 'Something went wrong. Please try again.');
        },
      });
      return;
    }

    if (this.selectedComponents().size === 0) { this.submitting.set(false); return; }

    const payload: CreateMonsterPayload = {
      name:           s1.name!.trim(),
      creatureTypeId: s1.creatureTypeId!,
      rarity:         s1.rarity!,
      isBoss:         s1.isBoss ?? false,
      notes:          s1.notes?.trim() || null,
      harvestableComponents: [...this.selectedComponents()]
        .map(id => this.availableHarvestComponents().find(h => h.id === id))
        .filter((hc): hc is HarvestComponent => !!(hc?.isEdible && hc.edibleAs))
        .map(hc => hc.edibleAs) as ComponentTypeName[],
      selectedHarvestComponentIds: [...this.selectedComponents()],
      ingredients: this.ingredientRows.controls.map((row, i) => ({
        name:            row.value.name.trim(),
        componentTypeId: (this.ingredientRowMeta[i].isEdible
          ? this.ingredientRowMeta[i].edibleAs
          : null) as ComponentTypeName | null,
        notes:           row.value.notes?.trim() || null,
      })),
    };

    this.createService.createMonster(payload).subscribe({
      next: (result) => {
        this.submitting.set(false);
        this.dialogRef.close(result);
      },
      error: (err) => {
        this.submitting.set(false);
        this.errorMessage.set(err?.message ?? 'Something went wrong. Please try again.');
      },
    });
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
