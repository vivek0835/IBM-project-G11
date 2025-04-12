import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User, user } from '@angular/fire/auth';
import { BehaviorSubject, filter, firstValueFrom, Observable, map, first } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean | null>(null);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable().pipe(
    filter(value => value !== null) // Prevents null from triggering guards
  );
  redirectUrl: string | null = null; // Store the attempted URL
  user: User | null = null;

  constructor(private auth: Auth, private router: Router) {
    //Listen for Firebase authentication state changes
    onAuthStateChanged(this.auth, (user) => {
      console.log('Auth State Changed:', user);
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
    return this.isAuthenticated$.pipe(
      first(), // Ensures we only take the first value
      map((isAuthenticated) => {
        console.log('Checking Auth State:', isAuthenticated); // Debugging log
        return isAuthenticated === true; // Ensures it doesn't trigger on `null`
      })
    );
  }

  updateAuthState(user: User | null) {
    this.user = user;
    this.isAuthenticatedSubject.next(user !== null); //Update authentication status
  }

  logout(): void {
    signOut(this.auth)
      .then(() => {
        console.log('User logged out');
        this.isAuthenticatedSubject.next(false); // Update authentication state
        this.router.navigate(['/intro']); // Redirect after logout
      })
      .catch(error => console.error('Logout failed:', error));
  }
}
