import { Component, OnInit, Input } from '@angular/core';
import { fetchAPIDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AccountDeleteConfirmComponent } from '../account-delete-confirm/account-delete-confirm.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  constructor(
    public fetchApiData: fetchAPIDataService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  user = JSON.parse(localStorage.getItem('user') || '{}');
  userFavs: any[] = [];
  movies: any[] = [];

  @Input() userData = {
    Username: this.user.Username || '',
    Password: '',
    Email: this.user.Email || '',
    Birthday: this.user.Birthday.slice(0, 10) || '',
  };

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((response) => {
      this.movies = response;
      if (this.user.FavouriteMovies && this.movies.length > 0) {
        this.userFavs = this.movies.filter((movie) =>
          this.user.FavouriteMovies.includes(movie._id)
        );
      }
    });
  }

  confirmDeleteAccount(): void {
    this.dialog.open(AccountDeleteConfirmComponent, {
      maxWidth: '400px',
      data: {
        userID: this.user._id,
      },
    });
  }

  editUser(userID: string, userData: any): void {
    const updatedData = {
      ...userData,
      Birthday: new Date(userData.Birthday).toISOString(),
    };

    Object.keys(updatedData).forEach((key) => {
      if (updatedData[key] === '') {
        delete updatedData[key];
      }
    });
    this.fetchApiData.editUser(userID, updatedData).subscribe(
      (response) => {
        localStorage.setItem('user', JSON.stringify(response));
        this.user = JSON.parse(localStorage.getItem('user') || '{}');

        this.snackBar.open('Profile updated', 'OK', {
          duration: 5000,
        });
      },
      (response) => {
        this.snackBar.open(response, 'OK', {
          duration: 5000,
        });
      }
    );
  }
}
