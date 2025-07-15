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

    return this.http.post(`${this.apiUrl}/auth/login`, xmlData, { 
      headers, 
      responseType: 'text' 
    })
      .pipe(
        map(xmlResponse => this.parseXmlResponse(xmlResponse)),
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

    return this.http.post(`${this.apiUrl}/auth/register`, xmlData, { 
      headers, 
      responseType: 'text' 
    })
      .pipe(
        map(xmlResponse => this.parseXmlResponse(xmlResponse)),
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

  /**
   * Parses an XML response string into an AuthResponse object
   */
  private parseXmlResponse(xmlString: string): AuthResponse {
    // Create a new DOMParser
    const parser = new DOMParser();
    // Parse the XML string
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

    // Check if we have an anyType element (which is the root in the response)
    const anyTypeElement = xmlDoc.getElementsByTagName('anyType')[0];

    if (anyTypeElement) {
      // Extract the success value
      const successElement = anyTypeElement.getElementsByTagName('success')[0];
      const success = successElement ? successElement.textContent === 'true' : false;

      // Extract the message
      const messageElement = anyTypeElement.getElementsByTagName('message')[0];
      const message = messageElement ? messageElement.textContent || '' : '';

      // Extract the token
      const tokenElement = anyTypeElement.getElementsByTagName('token')[0];
      const token = tokenElement ? tokenElement.textContent || '' : '';

      // Extract the user information
      const userElement = anyTypeElement.getElementsByTagName('user')[0];
      let user: User = {
        username: '',
        name: '',
        role: ''
      };

      if (userElement) {
        const usernameElement = userElement.getElementsByTagName('username')[0];
        const nameElement = userElement.getElementsByTagName('name')[0];
        const roleElement = userElement.getElementsByTagName('role')[0];
        const emailElement = userElement.getElementsByTagName('email')[0];

        user = {
          username: usernameElement ? usernameElement.textContent || '' : '',
          name: nameElement ? nameElement.textContent || '' : '',
          role: roleElement ? roleElement.textContent || '' : '',
          email: emailElement ? emailElement.textContent || '' : undefined
        };
      }

      return {
        success,
        message,
        token,
        user
      };
    } else {
      // If we don't have an anyType element, try to find AuthResponse element
      const authResponseElement = xmlDoc.getElementsByTagName('AuthResponse')[0];

      if (authResponseElement) {
        // Extract the success value
        const successElement = authResponseElement.getElementsByTagName('success')[0];
        const success = successElement ? successElement.textContent === 'true' : false;

        // Extract the message
        const messageElement = authResponseElement.getElementsByTagName('message')[0];
        const message = messageElement ? messageElement.textContent || '' : '';

        // Extract the token
        const tokenElement = authResponseElement.getElementsByTagName('token')[0];
        const token = tokenElement ? tokenElement.textContent || '' : '';

        // Extract the user information
        const userElement = authResponseElement.getElementsByTagName('user')[0];
        let user: User = {
          username: '',
          name: '',
          role: ''
        };

        if (userElement) {
          const usernameElement = userElement.getElementsByTagName('username')[0];
          const nameElement = userElement.getElementsByTagName('name')[0];
          const roleElement = userElement.getElementsByTagName('role')[0];
          const emailElement = userElement.getElementsByTagName('email')[0];

          user = {
            username: usernameElement ? usernameElement.textContent || '' : '',
            name: nameElement ? nameElement.textContent || '' : '',
            role: roleElement ? roleElement.textContent || '' : '',
            email: emailElement ? emailElement.textContent || '' : undefined
          };
        }

        return {
          success,
          message,
          token,
          user
        };
      }

      // If we couldn't find either element, return a default error response
      console.error('Failed to parse XML response:', xmlString);
      return {
        success: false,
        message: 'Failed to parse server response',
        token: '',
        user: { username: '', name: '', role: '' }
      };
    }
  }
}
