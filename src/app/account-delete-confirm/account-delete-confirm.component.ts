import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { fetchAPIDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-delete-confirm',
  templateUrl: './account-delete-confirm.component.html',
  styleUrls: ['./account-delete-confirm.component.scss'],
})
export class AccountDeleteConfirmComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      userID: string;
    },
    public fetchApiData: fetchAPIDataService,
    public dialogRef: MatDialogRef<AccountDeleteConfirmComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  deleteUser(): void {
    this.fetchApiData.deleteUser(this.data.userID).subscribe(
      (response) => {
        localStorage.clear();
        this.dialogRef.close();
        this.snackBar.open('Account deleted', 'OK', {
          duration: 5000,
        });
        setTimeout(() => {
          this.router.navigate(['welcome']).then(() => {
            window.location.reload();
          });
        }, 1000);
      },
      (response) => {
        console.log('Response', response);
        this.snackBar.open(response, 'OK', {
          duration: 5000,
        });
      }
    );
  }
}
