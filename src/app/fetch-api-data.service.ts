import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

const apiUrl = 'https://moviemovie-7703363b92cb.herokuapp.com/';

@Injectable({
  providedIn: 'root',
})
export class fetchAPIDataService {
  constructor(private http: HttpClient) {}

  //Get JWT token
  private getToken() {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    return token;
  }

  //Headers for all requests
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: 'Bearer ' + this.getToken(),
    });
  }

  private getHeadersJSON(): HttpHeaders {
    return new HttpHeaders({
      Authorization: 'Bearer ' + this.getToken(),
      'Content-Type': 'application/json',
    });
  }

  public userRegistration(userDetails: any): Observable<any> {
    return this.http
      .post(`${apiUrl}users`, userDetails)
      .pipe(catchError(this.handleError));
  }

  public userLogin(userDetails: any): Observable<any> {
    return this.http
      .post(`${apiUrl}login`, userDetails)
      .pipe(catchError(this.handleError));
  }

  public getAllMovies(): Observable<any> {
    return this.http
      .get(`${apiUrl}movies`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  public getMovie(movieId: string): Observable<any> {
    return this.http
      .get(`${apiUrl}movies/${movieId}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  public getDirector(director: string): Observable<any> {
    return this.http
      .get(`${apiUrl}directors/${director}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  public getGenre(genre: string): Observable<any> {
    return this.http
      .get(`${apiUrl}genres/${genre}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  public getUser(userName: string): Observable<any> {
    return this.http
      .get(`${apiUrl}users/${userName}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  public deleteUser(userID: string): Observable<any> {
    return this.http
      .delete(`${apiUrl}users/${userID}`, {
        headers: this.getHeaders(),
        responseType: 'text' as 'json',
      })
      .pipe(catchError(this.handleError));
  }

  public editUser(userID: string, userDetails: any): Observable<any> {
    return this.http
      .put(`${apiUrl}users/${userID}`, userDetails, {
        headers: this.getHeadersJSON(),
      })
      .pipe(catchError(this.handleError));
  }

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

  public addFavMovie(userID: any, movieID: any): Observable<any> {
    return this.http
      .patch(
        `${apiUrl}users/${userID}/movies/${movieID}`,
        {},
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(catchError(this.handleError));
  }

  public deleteFavMovie(userID: any, movieID: any): Observable<any> {
    return this.http
      .delete(`${apiUrl}users/${userID}/movies/${movieID}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

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
