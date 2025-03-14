import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { fetchAPIDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

/**
 * Component for user login form.
 * Allows users to enter credentials and log in.
 */
@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'],
})
export class UserLoginFormComponent implements OnInit {
  /**
   * User credentials input object.
   */
  @Input() userData = { Username: '', Password: '' };

  /**
   * Creates an instance of UserLoginFormComponent.
   * @param fetchApiData Service to handle API requests.
   * @param dialogRef Reference to the opened login dialog.
   * @param snackBar Snackbar service for user notifications.
   * @param router Angular Router for navigation.
   */
  constructor(
    public fetchApiData: fetchAPIDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  /**
   * Lifecycle hook that runs when the component is initialized.
   */
  ngOnInit(): void {}

  /**
   * Logs in the user by sending credentials to the API.
   * If successful, stores the user data and token, closes the dialog,
   * displays a success message, and navigates to the movies page.
   */
  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe(
      (response) => {
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
        this.dialogRef.close();
        this.snackBar.open('Logged in', 'OK', {
          duration: 5000,
        });
        // Refresh page so that navbar conditional links are updated
        setTimeout(() => {
          this.router.navigate(['movies']).then(() => {
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
