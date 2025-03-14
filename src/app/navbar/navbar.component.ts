import { Component } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Component representing the navigation bar.
 * Provides links to various pages of the application and handles user logout.
 */
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  /**
   * Indicates whether the user is logged in.
   */
  isLoggedIn = localStorage.getItem('token') !== null;
  
  /**
   * Creates an instance of NavbarComponent.
   * @param router Angular Router for navigation.
   */
  constructor(private router: Router) {}
  
  /**
   * Logs the user out by clearing local storage and navigating to the welcome page.
   */
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/welcome']);
  }
}
