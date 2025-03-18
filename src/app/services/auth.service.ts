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
    // Initialize authentication status based on sessionStorage
    const token = sessionStorage.getItem('authToken');
    this.isAuthenticatedSubject.next(!!token);
  }

  get isAuthenticated() {
    return this.isAuthenticatedSubject.value;
  }

  login() {
    // Implement your login logic here
    // On successful login:
    sessionStorage.setItem('authToken', 'your-auth-token');
    this.isAuthenticatedSubject.next(true);
  }

  logout() {
    // Implement your logout logic here
    // On logout:
    sessionStorage.removeItem('authToken');
    this.isAuthenticatedSubject.next(false);
  }
}
