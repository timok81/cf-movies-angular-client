import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { fetchAPIDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss'],
})
export class UserRegistrationFormComponent implements OnInit {
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  constructor(
    public fetchApiData: fetchAPIDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {}

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
        //Refresh page so that navbar conditional links are refreshed
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
