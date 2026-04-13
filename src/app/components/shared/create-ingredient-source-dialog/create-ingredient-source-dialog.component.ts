import {
  Component, inject, signal, OnInit, ViewChild,
} from '@angular/core';
import {
  FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators,
} from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CookingDataService } from '../../../services/cooking-data.service';
import { CookingCreateService } from '../../../services/cooking-create.service';
import { ComponentType } from '../../../models/component-type.model';
import { MonsterRarity } from '../../../models/monster.model';
import { CreateMonsterPayload } from '../../../models/create-payloads.model';

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
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './create-ingredient-source-dialog.component.html',
  styleUrl: './create-ingredient-source-dialog.component.scss',
})
export class CreateIngredientSourceDialogComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<CreateIngredientSourceDialogComponent>);
  private dataService = inject(CookingDataService);
  private createService = inject(CookingCreateService);

  // ── Reference data ─────────────────────────────────────────────────────────
  readonly creatureTypes = this.dataService.getCreatureTypes();
  readonly componentTypes = this.dataService.getComponentTypes();
  readonly rarities: MonsterRarity[] = ['common', 'uncommon', 'rare', 'very-rare', 'legendary'];

  // ── Step 1: Source details ─────────────────────────────────────────────────
  readonly step1 = new FormGroup({
    name:            new FormControl('',  [Validators.required, Validators.maxLength(200)]),
    creatureTypeId:  new FormControl('',  Validators.required),
    rarity:          new FormControl<MonsterRarity>('common', Validators.required),
    isBoss:          new FormControl(false),
    notes:           new FormControl(''),
  });

  // ── Step 2: Harvestable components ─────────────────────────────────────────
  // Managed as a plain Set — toggled by buttons. Validated on "Next".
  readonly selectedComponents = signal<Set<string>>(new Set());
  step2Error = signal<string | null>(null);

  // ── Step 3: Name each ingredient ───────────────────────────────────────────
  // Built dynamically from selectedComponents when entering step 3.
  readonly step3 = new FormGroup({
    ingredients: new FormArray<FormGroup>([]),
  });

  get ingredientRows(): FormArray<FormGroup> {
    return this.step3.get('ingredients') as FormArray<FormGroup>;
  }

  // Each row in the FormArray is paired with its ComponentType for display.
  ingredientRowMeta: ComponentType[] = [];

  @ViewChild('stepper') stepper!: MatStepper;

  // ── UI state ───────────────────────────────────────────────────────────────
  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    // Ensure dialog closes cleanly on backdrop click without leaving orphan processes
    this.dialogRef.disableClose = true;
  }

  toggleComponent(id: string): void {
    const current = new Set(this.selectedComponents());
    current.has(id) ? current.delete(id) : current.add(id);
    this.selectedComponents.set(current);
    this.step2Error.set(null);
  }

  isSelected(id: string): boolean {
    return this.selectedComponents().has(id);
  }

  /** Called by the stepper's (selectionChange) event.
   *  When moving from step 2 → step 3, validate selection and build the FormArray. */
  onStepChange(event: StepperSelectionEvent): void {
    if (event.selectedIndex === 2) {
      if (this.selectedComponents().size === 0) {
        this.step2Error.set('Select at least one component.');
        // Step back — let the stepper finish its change cycle before reverting.
        setTimeout(() => this.stepper.previous(), 0);
        return;
      }
      this.buildIngredientRows();
    }
  }

  private buildIngredientRows(): void {
    // Rebuild from scratch each time in case the user went back and changed selection.
    while (this.ingredientRows.length) this.ingredientRows.removeAt(0);
    this.ingredientRowMeta = [];

    const monsterName = this.step1.value.name?.trim() ?? '';

    for (const id of this.selectedComponents()) {
      const ct = this.componentTypes.find(c => c.id === id);
      if (!ct) continue;
      this.ingredientRowMeta.push(ct);
      const defaultName = monsterName ? `${monsterName} ${ct.name}` : '';
      this.ingredientRows.push(new FormGroup({
        name:  new FormControl(defaultName, [Validators.required, Validators.maxLength(200)]),
        notes: new FormControl(''),
      }));
    }
  }

  submit(): void {
    if (this.step1.invalid || this.step3.invalid) return;
    if (this.selectedComponents().size === 0) return;

    this.submitting.set(true);
    this.errorMessage.set(null);

    const s1 = this.step1.value;
    const payload: CreateMonsterPayload = {
      name:                  s1.name!.trim(),
      creatureTypeId:        s1.creatureTypeId!,
      rarity:                s1.rarity!,
      isBoss:                s1.isBoss ?? false,
      notes:                 s1.notes?.trim() || null,
      harvestableComponents: [...this.selectedComponents()] as any,
      ingredients: this.ingredientRows.controls.map((row, i) => ({
        name:            row.value.name.trim(),
        componentTypeId: this.ingredientRowMeta[i].id as any,
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
