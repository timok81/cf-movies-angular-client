import { Component, OnInit, Input } from '@angular/core';
import { fetchAPIDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { DirectorDetailsComponent } from '../director-details/director-details.component';
import { GenreDetailsComponent } from '../genre-details/genre-details.component';

/**
 * Component for displaying movie cards with details, favorite toggling, and related info.
 */
@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  /**
   * List of movies to display.
   */
  @Input() movies: any[] = [];

  /**
   * List of user's favorite movies.
   */
  userFavs: any[] = [];

  /**
   * User data retrieved from local storage.
   */
  user = JSON.parse(localStorage.getItem('user') || '{}');

  /**
   * Creates an instance of MovieCardComponent.
   * @param fetchApiData Service to fetch movie data.
   * @param dialog Material dialog service for displaying modals.
   */
  constructor(
    public fetchApiData: fetchAPIDataService,
    public dialog: MatDialog
  ) {}

  /**
   * Initializes component by fetching movies and user's favorite list.
   */
  ngOnInit(): void {
    if (this.movies.length === 0) this.getMovies();
    this.getUserFavs();
  }

  /**
   * Retrieves user's favorite movies from the API.
   */
  getUserFavs(): void {
    this.fetchApiData
      .getUserFavouriteMovies(this.user.Username)
      .subscribe((response) => {
        this.userFavs = response;
        this.updateLocalStorageUser();
      });
  }

  /**
   * Checks if a movie is in the user's favorite list.
   * @param movie The movie to check.
   * @returns True if the movie is a favorite, false otherwise.
   */
  isFav(movie: any): boolean {
    return this.userFavs.includes(movie._id);
  }

  /**
   * Updates user data in local storage with updated favorites.
   */
  updateLocalStorageUser(): void {
    const newUser = {
      ...this.user,
      FavouriteMovies: this.userFavs,
    };
    localStorage.setItem('user', JSON.stringify(newUser));
  }

  /**
   * Toggles a movie as a favorite or removes it from the favorites list.
   * @param movie The movie to toggle.
   */
  toggleFavouriteMovie(movie: any): void {
    if (this.isFav(movie)) {
      this.fetchApiData
        .deleteFavMovie(this.user._id, movie._id)
        .subscribe((response) => {
          this.userFavs = response.FavouriteMovies;
          this.updateLocalStorageUser();
        });
    } else {
      this.fetchApiData
        .addFavMovie(this.user._id, movie._id)
        .subscribe((response) => {
          this.userFavs = response.FavouriteMovies;
          this.updateLocalStorageUser();
        });
    }
  }

  /**
   * Opens a dialog displaying movie details.
   * @param movie The movie to display details for.
   */
  getMovieDetails(movie: any): void {
    this.dialog.open(MovieDetailsComponent, {
      maxWidth: '600px',
      data: {
        name: movie.Name,
        description: movie.Description,
        genre: movie.Genre.Name,
        released: movie.Released,
        directorName: movie.Director.Name,
        directorBio: movie.Director.Bio,
        directorBirthyear: movie.Director.BirthYear,
        directorDeathyear: movie.Director.DeathYear,
        directorImagepath: movie.Director.ImagePath,
      },
    });
  }

  /**
   * Opens a dialog displaying director details.
   * @param movie The movie whose director details to display.
   */
  getDirectorDetails(movie: any): void {
    this.dialog.open(DirectorDetailsComponent, {
      maxWidth: '800px',
      data: {
        directorName: movie.Director.Name,
        directorBio: movie.Director.Bio,
        directorBirthyear: movie.Director.BirthYear,
        directorDeathyear: movie.Director.DeathYear,
        directorImagepath: movie.Director.ImagePath,
      },
    });
  }

  /**
   * Opens a dialog displaying genre details.
   * @param movie The movie whose genre details to display.
   */
  getGenreDetails(movie: any): void {
    this.dialog.open(GenreDetailsComponent, {
      maxWidth: '800px',
      data: {
        genreName: movie.Genre.Name,
        genreDescription: movie.Genre.Description,
      },
    });
  }

  /**
   * Fetches all movies from the API.
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((response) => {
      this.movies = response;
      return this.movies;
    });
  }
}
