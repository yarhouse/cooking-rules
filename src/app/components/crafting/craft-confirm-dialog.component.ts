import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface CraftConfirmData {
  itemName: string;
  lines: Array<{ label: string; qty: number }>;
}

@Component({
  selector: 'app-craft-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>Craft {{ data.itemName }}?</h2>
    <mat-dialog-content>
      <p class="consume-intro">The following will be consumed:</p>
      <ul class="consume-list">
        @for (line of data.lines; track line.label) {
          <li>
            <span class="consume-label">{{ line.label }}</span>
            <span class="consume-qty">×{{ line.qty }}</span>
          </li>
        }
      </ul>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="cancel()">Cancel</button>
      <button mat-flat-button color="primary" type="button" (click)="confirm()">
        <mat-icon>construction</mat-icon> Craft
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2 { margin-bottom: 4px; }
    .consume-intro { margin: 0 0 8px; font-size: 0.875rem; color: var(--mat-sys-on-surface-variant); }
    .consume-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .consume-list li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 0;
      border-bottom: 1px solid var(--mat-sys-outline-variant);
      font-size: 0.9rem;
    }
    .consume-list li:last-child { border-bottom: none; }
    .consume-label { font-weight: 500; }
    .consume-qty { color: var(--mat-sys-primary); font-weight: 700; }
  `],
})
export class CraftConfirmDialogComponent {
  readonly data = inject<CraftConfirmData>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<CraftConfirmDialogComponent>);

  cancel(): void  { this.dialogRef.close(false); }
  confirm(): void { this.dialogRef.close(true);  }
}
