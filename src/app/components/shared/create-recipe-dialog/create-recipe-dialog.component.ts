import { Component, inject, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { CookingDataService } from '../../../services/cooking-data.service';
import { CookingCreateService } from '../../../services/cooking-create.service';
import { ComponentTypeName } from '../../../models/component-type.model';
import { RecipeTier, TIER_DC } from '../../../models/recipe.model';
import { CreateRecipePayload } from '../../../models/create-payloads.model';

@Component({
  selector: 'app-create-recipe-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
  ],
  templateUrl: './create-recipe-dialog.component.html',
  styleUrl: './create-recipe-dialog.component.scss',
})
export class CreateRecipeDialogComponent {
  private dialogRef = inject(MatDialogRef<CreateRecipeDialogComponent>);
  private dataService = inject(CookingDataService);
  private createService = inject(CookingCreateService);

  readonly componentTypes = this.dataService.getComponentTypes();
  readonly tiers: RecipeTier[] = ['novice', 'journeyman', 'expert', 'artisan', 'boss'];

  readonly form = new FormGroup({
    name:         new FormControl('', [Validators.required, Validators.maxLength(200)]),
    tier:         new FormControl<RecipeTier>('novice', Validators.required),
    dc:           new FormControl<number>(TIER_DC['novice'], [Validators.required, Validators.min(0)]),
    requiresHeat: new FormControl(true),
    bossEffect:   new FormControl(''),
    notes:        new FormControl(''),
    ingredients:  new FormArray<FormGroup>([], Validators.minLength(1)),
  });

  get ingredientRows(): FormArray<FormGroup> {
    return this.form.get('ingredients') as FormArray<FormGroup>;
  }

  get isBoss(): boolean {
    return this.form.get('tier')?.value === 'boss';
  }

  readonly submitting   = signal(false);
  readonly errorMessage = signal<string | null>(null);

  constructor() {
    // Auto-fill DC when tier changes
    this.form.get('tier')!.valueChanges.subscribe(tier => {
      if (tier) this.form.patchValue({ dc: TIER_DC[tier] });
    });
    // Add one ingredient row by default
    this.addIngredientRow();
  }

  addIngredientRow(): void {
    this.ingredientRows.push(new FormGroup({
      componentTypeId: new FormControl<ComponentTypeName | ''>('', Validators.required),
      bossSpecific:    new FormControl(''),
    }));
  }

  removeIngredientRow(index: number): void {
    if (this.ingredientRows.length > 1) {
      this.ingredientRows.removeAt(index);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    const v = this.form.value;
    const payload: CreateRecipePayload = {
      name:         v.name!.trim(),
      tier:         v.tier!,
      dc:           v.dc!,
      requiresHeat: v.requiresHeat ?? true,
      bossEffect:   v.bossEffect?.trim() || null,
      notes:        v.notes?.trim() || null,
      imageUrl:     null,
      ingredients:  (v.ingredients as Array<{ componentTypeId: string; bossSpecific: string }>).map(i => ({
        componentTypeId: i.componentTypeId as ComponentTypeName,
        ...(i.bossSpecific?.trim() && { bossSpecific: i.bossSpecific.trim() }),
      })),
    };

    this.createService.createRecipe(payload).subscribe({
      next: (recipe) => {
        this.submitting.set(false);
        this.dialogRef.close(recipe);
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
