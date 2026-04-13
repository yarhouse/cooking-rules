import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CookingDataService } from '../../../services/cooking-data.service';
import { CookingCreateService } from '../../../services/cooking-create.service';
import { ComponentTypeName } from '../../../models/component-type.model';
import { CreateIngredientPayload } from '../../../models/create-payloads.model';

@Component({
  selector: 'app-create-ingredient-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './create-ingredient-dialog.component.html',
  styleUrl: './create-ingredient-dialog.component.scss',
})
export class CreateIngredientDialogComponent {
  private dialogRef = inject(MatDialogRef<CreateIngredientDialogComponent>);
  private dataService = inject(CookingDataService);
  private createService = inject(CookingCreateService);

  readonly creatureTypes  = this.dataService.getCreatureTypes();
  readonly componentTypes = this.dataService.getComponentTypes();
  readonly monsters       = this.dataService.getMonsters();

  readonly form = new FormGroup({
    name:            new FormControl('',  [Validators.required, Validators.maxLength(200)]),
    componentTypeId: new FormControl<ComponentTypeName | ''>('', Validators.required),
    creatureTypeId:  new FormControl('',  Validators.required),
    notes:           new FormControl(''),
    sourceMonsterIds: new FormControl<string[]>([]),
  });

  readonly submitting    = signal(false);
  readonly errorMessage  = signal<string | null>(null);

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    const v = this.form.value;
    const payload: CreateIngredientPayload = {
      name:             v.name!.trim(),
      componentTypeId:  v.componentTypeId! as ComponentTypeName,
      creatureTypeId:   v.creatureTypeId!,
      notes:            v.notes?.trim() || null,
      sourceMonsterIds: v.sourceMonsterIds ?? [],
    };

    this.createService.createIngredient(payload).subscribe({
      next: (ingredient) => {
        this.submitting.set(false);
        this.dialogRef.close(ingredient);
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
