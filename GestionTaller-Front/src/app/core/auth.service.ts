import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export interface User {
  username: string;
  name: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  
  // Hardcoded user credentials as requested
  private readonly validCredentials = {
    username: 'admin',
    password: 'admin123'
  };

  constructor() {
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
    // Check if credentials match the hardcoded values
    if (username === this.validCredentials.username && 
        password === this.validCredentials.password) {
      
      // Create user object
      const user: User = {
        username: username,
        name: 'Administrator',
        role: 'admin'
      };
      
      // Store user in localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      // Update the BehaviorSubject
      this.currentUserSubject.next(user);
      
      // Return the user with a small delay to simulate API call
      return of(user).pipe(
        delay(500),
        tap(() => console.log('User logged in successfully'))
      );
    } else {
      // Throw error for invalid credentials
      throw new Error('Username or password is incorrect');
    }
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