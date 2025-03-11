import { Component, OnInit } from '@angular/core';
import { fetchAPIDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent {
  movies: any[] = [];

  constructor(public fetchApiData: fetchAPIDataService) {}

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((response) => {
      this.movies = response;
      console.log(this.movies);
      return this.movies;
    });
  }
}
