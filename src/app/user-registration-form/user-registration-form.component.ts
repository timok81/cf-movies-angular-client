import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { fetchAPIDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

/**
 * Component for user registration form.
 */
@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss'],
})
export class UserRegistrationFormComponent implements OnInit {
  /**
   * Object holding user registration data.
   */
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  /**
   * Creates an instance of UserRegistrationFormComponent.
   * @param fetchApiData Service for API calls.
   * @param dialogRef Reference to the dialog.
   * @param snackBar Service for displaying notifications.
   * @param router Router for navigation.
   */
  constructor(
    public fetchApiData: fetchAPIDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  /**
   * Lifecycle hook that is called after component initialization.
   */
  ngOnInit(): void {}

  /**
   * Registers a new user.
   * Closes the dialog and logs in the user upon success.
   * Displays an error message upon failure.
   */
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe(
      (response) => {
        this.dialogRef.close();
        this.snackBar.open('Account created, logging in...', 'OK', {
          duration: 5000,
        });
        setTimeout(() => {
          this.loginUser();
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

  /**
   * Logs in the user.
   * Stores user details in local storage and navigates to the movies page.
   * Refreshes the page to update the navbar.
   */
  loginUser(): void {
    const loginUser = {
      Username: this.userData.Username,
      Password: this.userData.Password,
    };

    this.fetchApiData.userLogin(loginUser).subscribe(
      (response) => {
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
        this.dialogRef.close();
        this.snackBar.open('Logged in', 'OK', {
          duration: 5000,
        });
        
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
