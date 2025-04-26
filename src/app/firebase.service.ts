import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { environment } from '../environments/environment';
import { Firestore, getFirestore, collection, addDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private auth;
  private firestore: Firestore;

  constructor() {
    const firebaseConfig = environment.firebaseConfig;
    const app = initializeApp(firebaseConfig);
    this.auth = getAuth(app);
    this.firestore = getFirestore(app); // <-- Store Firestore instance here
  }

  getAuthInstance() {
    return this.auth;
  }

  async logLoginEvent(email: string, loginMethod: string, success: boolean): Promise<void> {
    const logData = {
      email: email || 'Unknown',
      timestamp: new Date().toISOString(),
      device: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      loginMethod,
      success
    };

    try {
      const logRef = collection(this.firestore, 'loginLogs');
      await addDoc(logRef, logData);
      console.log('Login log saved to Firestore:', logData);
    } catch (error) {
      console.error('Error logging login event:', error);
    }
  }
}
