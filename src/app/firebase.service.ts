import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { environment } from '../environments/environment';
import { Firestore, getFirestore, collection, doc, setDoc } from '@angular/fire/firestore';

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
    this.firestore = getFirestore(app);
  }

  getAuthInstance() {
    return this.auth;
  }

  async logLoginEvent(email: string, loginMethod: string, success: boolean): Promise<void> {
    // Sanitize the email to make it suitable for use as a Firestore document ID.
    const sanitizedEmail = email.replace(/[.#\[\]\/]/g, '_'); // Replace invalid characters with underscores.

    const logData = {
      email: email || 'Unknown',
      timestamp: new Date().toISOString(),
      device: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      loginMethod,
      success,
    };

    try {
      const logRef = doc(collection(this.firestore, 'loginLogs'), sanitizedEmail); // Use doc() with sanitized email.
      await setDoc(logRef, logData); // Use setDoc() to specify the document ID.
      console.log('Login log saved to Firestore with ID:', sanitizedEmail, logData);
    } catch (error) {
      console.error('Error logging login event:', error);
    }
  }
}
