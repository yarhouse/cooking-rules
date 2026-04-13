import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  get<T>(path: string): Observable<T> {
    return this.http
      .get<T>(`${environment.apiBaseUrl}${path}`)
      .pipe(catchError(this.handleError));
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http
      .post<T>(`${environment.apiBaseUrl}${path}`, body)
      .pipe(catchError(this.handleError));
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http
      .put<T>(`${environment.apiBaseUrl}${path}`, body)
      .pipe(catchError(this.handleError));
  }

  delete<T>(path: string, params?: Record<string, string>): Observable<T> {
    return this.http
      .delete<T>(`${environment.apiBaseUrl}${path}`, { params })
      .pipe(catchError(this.handleError));
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    const message =
      err.error instanceof ErrorEvent
        ? err.error.message
        : `HTTP ${err.status}: ${err.message}`;
    console.error('[ApiService]', message, err);
    return throwError(() => new Error(message));
  }
}
