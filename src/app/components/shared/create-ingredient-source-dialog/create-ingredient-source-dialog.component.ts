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

/**
 * 3-step stepper dialog for creating or editing a custom monster and its ingredients.
 *
 * ## Modes
 * - **Create** (no `dialogData`): all 3 steps; user names every selected component.
 * - **Edit** (`dialogData.monster` provided): pre-fills Step 1 from the existing monster;
 *   Step 3 only shows rows for *newly added* components; removed components are listed
 *   as a deletion warning. Delegates to `CookingCreateService.updateMonster`.
 *
 * ## Stepper flow
 * 1. **Step 1** — name, creature type, rarity, boss flag, notes.
 *    Creature type is locked in edit mode.
 * 2. **Step 2** — harvest component selection list. Components load lazily when the
 *    user advances to this step (`onStepChange` at index 1).
 * 3. **Step 3** — ingredient naming. Rows are built by `buildIngredientRows` when the
 *    user advances to this step (index 2). Each row maps to a newly selected component.
 *
 * Closed with `CreateMonsterResult` / `UpdateMonsterResult` on success, or `null` on cancel.
 */
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
  /** Optional: when provided, the dialog runs in edit mode for this monster. */
  private dialogData   = inject<{ monster?: Monster } | null>(MAT_DIALOG_DATA, { optional: true });
  private dataService  = inject(CookingDataService);
  private createService = inject(CookingCreateService);

  /** The monster being edited, or `null` in create mode. */
  get editMonster(): Monster | null { return this.dialogData?.monster ?? null; }
  /** `true` when `dialogData.monster` is present. */
  get isEditMode(): boolean { return !!this.dialogData?.monster; }

  readonly creatureTypes = this.dataService.getCreatureTypes();
  readonly rarities: MonsterRarity[] = ['common', 'uncommon', 'rare', 'very-rare', 'legendary'];

  /** Step 1 form — monster scalar fields. `creatureTypeId` is disabled in edit mode. */
  readonly step1 = new FormGroup({
    name:           new FormControl('',  [Validators.required, Validators.maxLength(200)]),
    creatureTypeId: new FormControl('',  Validators.required),
    rarity:         new FormControl<MonsterRarity>('common', Validators.required),
    isBoss:         new FormControl(false),
    notes:          new FormControl(''),
  });

  /** Harvest components for the selected creature type. Loaded lazily in `onStepChange`. */
  readonly availableHarvestComponents = signal<HarvestComponent[]>([]);
  /** IDs currently checked in the Step 2 selection list. */
  readonly selectedComponents         = signal<Set<string>>(new Set());
  step2Error = signal<string | null>(null);

  /** Original component IDs from the existing monster (edit mode only).
   *  Used to diff additions vs. removals in `buildIngredientRows`. */
  readonly originalSelectedIds = signal<Set<string>>(new Set());
  /** Components removed in this session — shown as a deletion warning in Step 3. */
  readonly removedComponents   = signal<{ id: string; name: string }[]>([]);

  /** Step 3 form — one row per newly added edible component. */
  readonly step3 = new FormGroup({
    ingredients: new FormArray<FormGroup>([]),
  });

  /** Typed accessor for the Step 3 ingredients `FormArray`. */
  get ingredientRows(): FormArray<FormGroup> {
    return this.step3.get('ingredients') as FormArray<FormGroup>;
  }

  /** Metadata parallel to `ingredientRows` — `ingredientRowMeta[i]` is the
   *  `HarvestComponent` that `ingredientRows.at(i)` names. */
  ingredientRowMeta: HarvestComponent[] = [];

  @ViewChild('stepper') stepper!: MatStepper;

  /** `true` while the API request is in flight. Disables the submit button. */
  readonly submitting   = signal(false);
  /** Error text shown below the submit button on API failure. */
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

  /** Syncs `selectedComponents` from the Material selection list. */
  onHarvestSelectionChange(event: MatSelectionListChange): void {
    const selected = new Set<string>(
      event.source.selectedOptions.selected.map(opt => opt.value as string),
    );
    this.selectedComponents.set(selected);
    this.step2Error.set(null);
  }

  /** @returns `true` if the harvest component ID is currently selected. */
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

  /**
   * Validates both forms, builds the appropriate payload (create or update),
   * and dispatches via `CookingCreateService`. Closes with the result on success.
   */
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
