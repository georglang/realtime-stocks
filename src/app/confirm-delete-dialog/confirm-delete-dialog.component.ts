import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirm-delete-dialog',
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrls: ['./confirm-delete-dialog.component.sass']
})
export class ConfirmDeleteDialogComponent {
  public modalTitle: string;
  constructor(public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>) { }

  onNoClick(): void {
    this.dialogRef.close({
      data: false
    });
  }

  onYesClick(): void {
    this.dialogRef.close({
      data: true
    });
  }
}
