import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

/** Thin HTTP wrapper used by every service that talks to the API.
 *  Prepends `environment.apiBaseUrl` to every path so callers only
 *  pass relative paths (e.g. `'/monsters'`).
 *  All errors are normalised and re-thrown as plain `Error` objects. */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  /**
   * Issues a GET request to `{apiBaseUrl}{path}`.
   * @param path - Relative API path, e.g. `'/monsters'`
   * @returns Observable that emits the parsed response body as `T`
   */
  get<T>(path: string): Observable<T> {
    return this.http
      .get<T>(`${environment.apiBaseUrl}${path}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Issues a POST request to `{apiBaseUrl}{path}`.
   * @param path - Relative API path, e.g. `'/monsters'`
   * @param body - Request body, serialised to JSON by `HttpClient`
   * @returns Observable that emits the parsed response body as `T`
   */
  post<T>(path: string, body: unknown): Observable<T> {
    return this.http
      .post<T>(`${environment.apiBaseUrl}${path}`, body)
      .pipe(catchError(this.handleError));
  }

  /**
   * Issues a PUT request to `{apiBaseUrl}{path}`.
   * @param path - Relative API path, e.g. `'/monsters/abc123'`
   * @param body - Replacement body, serialised to JSON by `HttpClient`
   * @returns Observable that emits the parsed response body as `T`
   */
  put<T>(path: string, body: unknown): Observable<T> {
    return this.http
      .put<T>(`${environment.apiBaseUrl}${path}`, body)
      .pipe(catchError(this.handleError));
  }

  /**
   * Issues a DELETE request to `{apiBaseUrl}{path}`.
   * @param path - Relative API path, e.g. `'/monsters/abc123'`
   * @param params - Optional query parameters appended to the URL
   * @returns Observable that emits the parsed response body as `T`
   */
  delete<T>(path: string, params?: Record<string, string>): Observable<T> {
    return this.http
      .delete<T>(`${environment.apiBaseUrl}${path}`, { params })
      .pipe(catchError(this.handleError));
  }

  /** Normalises HTTP errors into a plain `Error` and logs to the console. */
  private handleError(err: HttpErrorResponse): Observable<never> {
    const message =
      err.error instanceof ErrorEvent
        ? err.error.message
        : `HTTP ${err.status}: ${err.message}`;
    console.error('[ApiService]', message, err);
    return throwError(() => new Error(message));
  }
}
