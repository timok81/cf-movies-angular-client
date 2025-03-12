import { Component, OnInit, Input } from '@angular/core';
import { fetchAPIDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  constructor(
    public fetchApiData: fetchAPIDataService,
    public snackBar: MatSnackBar
  ) {}

  user = JSON.parse(localStorage.getItem('user') || '{}');
  userFavs: any[] = [];
  movies: any[] = [];

  @Input() userData = {
    Username: this.user.Username || '',
    Password: '',
    Email: this.user.Email || '',
    Birthday: this.user.Birthday || '',
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

  editUser(userID: string, userData: any): void {
    this.fetchApiData.editUser(userID, userData).subscribe(
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
