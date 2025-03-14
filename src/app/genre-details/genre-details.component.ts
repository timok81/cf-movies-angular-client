import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Component for displaying details of a movie genre in a dialog.
 */
@Component({
  selector: 'app-genre-details',
  templateUrl: './genre-details.component.html',
  styleUrls: ['./genre-details.component.scss']
})
export class GenreDetailsComponent {
  /**
   * Creates an instance of GenreDetailsComponent.
   * @param data Injected data containing genre name and description.
   */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      genreName: string;
      genreDescription: string;
    }
  ) {}
}
