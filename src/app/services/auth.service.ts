// auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  redirectUrl: string | null = null; // Store the attempted URL

  constructor() {
    // Initialize authentication status based on your application's logic
    const token = localStorage.getItem('authToken');
    this.isAuthenticatedSubject.next(!!token); // Set authentication status based on token
  }

  get isAuthenticated() {
    return this.isAuthenticatedSubject.value;
  }

  login() {
    // Implement your login logic here
    // On successful login:
    localStorage.setItem('authToken', 'your-auth-token');  // Store token in localStorage
    this.isAuthenticatedSubject.next(true);  // Mark as authenticated
  }

  logout() {
    // Implement your logout logic here
    // On logout:
    localStorage.removeItem('authToken');
    this.isAuthenticatedSubject.next(false); // Mark as not authenticated
  }
}
