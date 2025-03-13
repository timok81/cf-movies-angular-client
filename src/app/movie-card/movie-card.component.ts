import { Component, OnInit, Input } from '@angular/core';
import { fetchAPIDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { DirectorDetailsComponent } from '../director-details/director-details.component';
import { GenreDetailsComponent } from '../genre-details/genre-details.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  @Input() movies: any[] = [];

  userFavs: any[] = [];
  user = JSON.parse(localStorage.getItem('user') || '{}');

  constructor(
    public fetchApiData: fetchAPIDataService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (this.movies.length === 0) this.getMovies();
    this.getUserFavs();
  }

  getUserFavs(): void {
    this.fetchApiData
      .getUserFavouriteMovies(this.user.Username)
      .subscribe((response) => {
        this.userFavs = response;
        this.updateLocalStorageUser();
      });
  }

  isFav(movie: any): boolean {
    return this.userFavs.includes(movie._id);
  }

  updateLocalStorageUser(): void {
    const newUser = {
      ...this.user,
      FavouriteMovies: this.userFavs,
    };
    localStorage.setItem('user', JSON.stringify(newUser));
  }

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

  getGenreDetails(movie: any): void {
    this.dialog.open(GenreDetailsComponent, {
      maxWidth: '800px',
      data: {
        genreName: movie.Genre.Name,
        genreDescription: movie.Genre.Description,
      },
    });
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((response) => {
      this.movies = response;
      return this.movies;
    });
  }
}
