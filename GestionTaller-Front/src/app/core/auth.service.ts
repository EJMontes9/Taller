import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface User {
  username: string;
  name: string;
  role: string;
  email?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface RegisterRequest {
  username: string;
  password: string;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<User> {
    // Create XML for the request
    const xmlData = `<?xml version="1.0" encoding="UTF-8"?>
<LoginRequest>
  <username>${username}</username>
  <password>${password}</password>
</LoginRequest>`;

    // Configure headers for XML
    const headers = new HttpHeaders({
      'Content-Type': 'application/xml',
      'Accept': 'application/xml'
    });

    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, xmlData, { headers })
      .pipe(
        tap(response => {
          if (response.success) {
            // Store token and user in localStorage
            localStorage.setItem('token', response.token);
            localStorage.setItem('currentUser', JSON.stringify(response.user));

            // Update the BehaviorSubject
            this.currentUserSubject.next(response.user);

            console.log('User logged in successfully');
          }
        }),
        catchError(this.handleError),
        // Map to return just the user
        map(response => response.user)
      );
  }

  register(registerData: RegisterRequest): Observable<User> {
    // Create XML for the request
    const xmlData = `<?xml version="1.0" encoding="UTF-8"?>
<RegisterRequest>
  <username>${registerData.username}</username>
  <password>${registerData.password}</password>
  <name>${registerData.name}</name>
  <email>${registerData.email}</email>
</RegisterRequest>`;

    // Configure headers for XML
    const headers = new HttpHeaders({
      'Content-Type': 'application/xml',
      'Accept': 'application/xml'
    });

    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, xmlData, { headers })
      .pipe(
        tap(response => {
          if (response.success) {
            // Store token and user in localStorage
            localStorage.setItem('token', response.token);
            localStorage.setItem('currentUser', JSON.stringify(response.user));

            // Update the BehaviorSubject
            this.currentUserSubject.next(response.user);

            console.log('User registered successfully');
          }
        }),
        catchError(this.handleError),
        // Map to return just the user
        map(response => response.user)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.status === 401) {
        errorMessage = 'Username or password is incorrect';
      } else if (error.status === 400) {
        errorMessage = 'Invalid request data';
      }
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  logout(): void {
    // Remove user from localStorage
    localStorage.removeItem('currentUser');

    // Update the BehaviorSubject
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }
}
