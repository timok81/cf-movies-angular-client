import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { fetchAPIDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe(
      (response) => {
        //login implementation goes here
        this.dialogRef.close();
        console.log('Signed up successfully, response: ', response);
        this.snackBar.open('New account created', 'OK', {
          duration: 5000,
        });
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
