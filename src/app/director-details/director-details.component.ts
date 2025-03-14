import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Component for displaying director details in a dialog.
 */
@Component({
  selector: 'app-director-details',
  templateUrl: './director-details.component.html',
  styleUrls: ['./director-details.component.scss'],
})
export class DirectorDetailsComponent {
  /**
   * Constructor for DirectorDetailsComponent.
   * Injects movie director data into the dialog.
   * @param data Contains director details including name, biography, birth year, death year, and image path.
   */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      directorName: string;
      directorBio: string;
      directorBirthyear: string;
      directorDeathyear: string;
      directorImagepath: string;
    }
  ) {}
}
