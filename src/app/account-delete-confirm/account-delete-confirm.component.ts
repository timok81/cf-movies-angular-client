import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { fetchAPIDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

/**
 * Component for confirming account deletion.
 * Displays a confirmation dialog before deleting a user's account.
 */
@Component({
  selector: 'app-account-delete-confirm',
  templateUrl: './account-delete-confirm.component.html',
  styleUrls: ['./account-delete-confirm.component.scss'],
})
export class AccountDeleteConfirmComponent {
  /**
   * Constructor to inject necessary dependencies.
   * @param data Contains user ID to be deleted.
   * @param fetchApiData Service for API calls.
   * @param dialogRef Reference to the dialog for closing it.
   * @param snackBar Service to show notifications.
   * @param router Router for navigation.
   */
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

  /**
   * Closes the confirmation dialog without deleting the account.
   */
  closeDialog(): void {
    this.dialogRef.close();
  }

  /**
   * Deletes the user's account and handles UI updates.
   * - Calls API to delete the user.
   * - Clears local storage.
   * - Closes the dialog.
   * - Shows a snackbar notification.
   * - Redirects to the welcome page after a short delay and reloads the page.
   */
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
