import { Component, OnInit, Input } from '@angular/core';
import { fetchAPIDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AccountDeleteConfirmComponent } from '../account-delete-confirm/account-delete-confirm.component';

/**
 * Component for displaying and managing the user's profile.
 * Allows users to view their information, update their profile, and delete their account.
 */
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  /**
   * Stores the currently logged-in user data retrieved from localStorage.
   */
  user = JSON.parse(localStorage.getItem('user') || '{}');
  
  /**
   * List of the user's favorite movies.
   */
  userFavs: any[] = [];
  
  /**
   * List of all available movies.
   */
  movies: any[] = [];
  
  /**
   * User's birthday in a formatted string.
   */
  userBirthday = this.user.Birthday || '';

  /**
   * User profile data for editing.
   */
  @Input() userData = {
    Username: this.user.Username || '',
    Password: '',
    Email: this.user.Email || '',
    Birthday: this.userBirthday.slice(0, 10) || '',
  };

  /**
   * Creates an instance of ProfileComponent.
   * @param fetchApiData Service to handle API requests.
   * @param snackBar Snackbar service for displaying notifications.
   * @param dialog Material Dialog service for opening modal dialogs.
   */
  constructor(
    public fetchApiData: fetchAPIDataService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  /**
   * Lifecycle hook that runs when the component is initialized.
   * Fetches movies to populate the user's favorite list.
   */
  ngOnInit(): void {
    this.getMovies();
  }

  /**
   * Retrieves the list of movies and filters the user's favorite movies.
   */
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

  /**
   * Opens a confirmation dialog for account deletion.
   */
  confirmDeleteAccount(): void {
    this.dialog.open(AccountDeleteConfirmComponent, {
      maxWidth: '400px',
      data: {
        userID: this.user._id,
      },
    });
  }

  /**
   * Updates the user's profile information.
   * @param userID The ID of the user to update.
   * @param userData The updated user data.
   */
  editUser(userID: string, userData: any): void {
    const updatedData = {
      ...userData,
      Birthday: new Date(userData.Birthday).toISOString(),
    };

    // Remove empty fields from the updated data
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
