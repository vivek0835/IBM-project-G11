import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();
  redirectUrl: string | null = null; // Store the attempted URL
  user: User | null = null;

  constructor(private auth: Auth, private router: Router) {
    //Listen for Firebase authentication state changes
    onAuthStateChanged(this.auth, (user) => {
      this.updateAuthState(user);
    });
  }

  get isAuthenticated() {
    return this.isAuthenticatedSubject.value;
  }

  async login(email: string, password: string) {
    try {
      //Sign in with email & password
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      
      //Update authentication state after successful login
      this.updateAuthState(userCredential.user);
      
      console.log('User logged in:', userCredential.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Allow component to handle errors
    }
  }

  checkAuthState(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  updateAuthState(user: User | null) {
    this.user = user;
    this.isAuthenticatedSubject.next(!!user); //Update authentication status
  }

  async logout() {
    try {
      await signOut(this.auth);
      this.updateAuthState(null); //Reset authentication state
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
}
