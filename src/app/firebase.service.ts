import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private auth;

  constructor() {
    // Initialize Firebase app
    const firebaseConfig = environment.firebaseConfig; // Store the Firebase config in environment.ts
    const app = initializeApp(firebaseConfig);
    this.auth = getAuth(app);
  }

  getAuthInstance() {
    return this.auth;
  }
}
