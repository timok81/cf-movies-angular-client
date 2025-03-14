import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

/**
 * Base URL for the API.
 */
const apiUrl = 'https://moviemovie-7703363b92cb.herokuapp.com/';

/**
 * Service to interact with the movie API.
 */
@Injectable({
  providedIn: 'root',
})
export class fetchAPIDataService {
  /**
   * Creates an instance of fetchAPIDataService.
   * @param http HttpClient for making API requests.
   */
  constructor(private http: HttpClient) {}

  /**
   * Retrieves JWT token from local storage.
   * @returns The JWT token as a string.
   * @throws Error if no token is found.
   */
  private getToken(): string {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    return token;
  }

  /**
   * Generates HTTP headers with authentication token.
   * @returns HttpHeaders object.
   */
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: 'Bearer ' + this.getToken(),
    });
  }

  /**
   * Generates HTTP headers with authentication token and JSON content type.
   * @returns HttpHeaders object.
   */
  private getHeadersJSON(): HttpHeaders {
    return new HttpHeaders({
      Authorization: 'Bearer ' + this.getToken(),
      'Content-Type': 'application/json',
    });
  }

  /**
   * Registers a new user.
   * @param userDetails Object containing user registration data.
   * @returns Observable with server response.
   */
  public userRegistration(userDetails: any): Observable<any> {
    return this.http
      .post(`${apiUrl}users`, userDetails)
      .pipe(catchError(this.handleError));
  }

  /**
   * Logs in a user.
   * @param userDetails Object containing user login credentials.
   * @returns Observable with authentication token and user data.
   */
  public userLogin(userDetails: any): Observable<any> {
    return this.http
      .post(`${apiUrl}login`, userDetails)
      .pipe(catchError(this.handleError));
  }

  /**
   * Fetches all movies.
   * @returns Observable containing movie data.
   */
  public getAllMovies(): Observable<any> {
    return this.http
      .get(`${apiUrl}movies`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Fetches details of a specific movie.
   * @param movieId ID of the movie.
   * @returns Observable containing movie details.
   */
  public getMovie(movieId: string): Observable<any> {
    return this.http
      .get(`${apiUrl}movies/${movieId}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Fetches information about a director.
   * @param director Name of the director.
   * @returns Observable containing director details.
   */
  public getDirector(director: string): Observable<any> {
    return this.http
      .get(`${apiUrl}directors/${director}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Fetches movies of a specific genre.
   * @param genre Name of the genre.
   * @returns Observable containing genre details.
   */
  public getGenre(genre: string): Observable<any> {
    return this.http
      .get(`${apiUrl}genres/${genre}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Fetches user details.
   * @param userName Username of the user.
   * @returns Observable containing user data.
   */
  public getUser(userName: string): Observable<any> {
    return this.http
      .get(`${apiUrl}users/${userName}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Deletes a user account.
   * @param userID ID of the user.
   * @returns Observable containing server response.
   */
  public deleteUser(userID: string): Observable<any> {
    return this.http
      .delete(`${apiUrl}users/${userID}`, {
        headers: this.getHeaders(),
        responseType: 'text' as 'json',
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Updates user details.
   * @param userID ID of the user.
   * @param userDetails Updated user details.
   * @returns Observable containing updated user data.
   */
  public editUser(userID: string, userDetails: any): Observable<any> {
    return this.http
      .put(`${apiUrl}users/${userID}`, userDetails, {
        headers: this.getHeadersJSON(),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Retrieves a user's favorite movies.
   * @param userName Username of the user.
   * @returns Observable containing an array of favorite movies.
   */
  public getUserFavouriteMovies(userName: string): Observable<any> {
    return this.http
      .get<any>(`${apiUrl}users/${userName}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((user) => user.FavouriteMovies || []),
        catchError(this.handleError)
      );
  }

  /**
   * Adds a movie to a user's favorites.
   * @param userID ID of the user.
   * @param movieID ID of the movie.
   * @returns Observable containing server response.
   */
  public addFavMovie(userID: any, movieID: any): Observable<any> {
    return this.http
      .patch(`${apiUrl}users/${userID}/movies/${movieID}`, {}, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Removes a movie from a user's favorites.
   * @param userID ID of the user.
   * @param movieID ID of the movie.
   * @returns Observable containing server response.
   */
  public deleteFavMovie(userID: any, movieID: any): Observable<any> {
    return this.http
      .delete(`${apiUrl}users/${userID}/movies/${movieID}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Handles HTTP errors.
   * @param error HTTP error response.
   * @returns Observable throwing an error message.
   */
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
