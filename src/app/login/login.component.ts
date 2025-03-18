import { Component, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { MfaComponent } from '../mfa/mfa.component';
import { FirebaseService } from '../firebase.service';
import { PhoneAuthProvider, signInWithCredential } from '@firebase/auth';
import { AuthService } from '../services/auth.service'; // Ensure AuthService is imported

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, MfaComponent]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  showLoginForm: boolean = true;

  registerEmail: string = '';
  registerPassword: string = '';
  registerConfirmPassword: string = '';
  registerPhoneNumber: string = '+91'+'';
  termsAccepted: boolean = false;
  verificationId: string = '';  // Store the verification ID received from Firebase
  registrationInProgress: boolean = false;  // To track if registration is ongoing
  verificationSuccess: EventEmitter<void> = new EventEmitter(); // To emit success events
  verificationFailed: EventEmitter<any> = new EventEmitter(); // To emit failure events

  isVerifyingPhone: boolean = false;

  constructor(
    private router: Router,
    private auth: Auth,
    private firebaseService: FirebaseService,
    private authService: AuthService // Inject AuthService
  ) {}

  // Toggle between Login and Register forms
  toggleForm() {
    this.showLoginForm = !this.showLoginForm;
  }

  // Handle Login with Firebase
  async login() {
    if (!this.email || !this.password) {
      alert('Please enter both email and password.');
      return;
    }

    try {
      await signInWithEmailAndPassword(this.auth, this.email, this.password);
      localStorage.setItem('isLoggedIn', 'true');
      if (this.rememberMe) {
        localStorage.setItem('email', this.email);
      }
      alert('Login successful!');
      
      // Set authentication status in AuthService
      this.authService.login();

      // Redirect to the intended URL or default to '/home'
      const redirectUrl = this.authService.redirectUrl ? this.authService.redirectUrl : '/home';
      this.router.navigate([redirectUrl]);
    } catch (error: any) {
      console.error('Login error:', error);
      alert(`Login failed: ${error.message}`);
    }
  }

  // Handle Registration with Firebase and MFA
  async register() {
    if (!this.termsAccepted) {
      alert('You must agree to the terms and conditions.');
      return;
    }

    if (this.registerPassword !== this.registerConfirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    if (!this.registerPhoneNumber) {
      alert('Phone number is required.');
      return;
    }

    // At this point, you're just preparing for phone verification
    this.isVerifyingPhone = true; // Indicate that the phone number is being verified
  }

  async verifyCode(code: string) {
    const auth: Auth = this.firebaseService.getAuthInstance();
    try {
      if (!this.verificationId || !code) {
        console.error('Verification ID or code is missing');
        return;
      }

      const credential = PhoneAuthProvider.credential(this.verificationId, code);
      await signInWithCredential(auth, credential); 
      console.log('Phone number verified successfully');
      
      // Wait for successful verification before triggering registration
      this.onMfaSuccess();  // Now we can safely call the registration process
    } catch (error) {
      console.error('Failed to verify the code:', error);
      this.verificationFailed.emit(error);
      this.registrationInProgress = false; // Reset on failure
    }
  }

  // Handle MFA Success
  async onMfaSuccess() {
    try {
      // Make sure the phone number verification was successful before proceeding.
      if (!this.registerEmail || !this.registerPassword) {
        console.error('Email or password is missing.');
        alert('Please provide a valid email and password.');
        return;
      }

      // Create the user with email/password after phone verification
      await createUserWithEmailAndPassword(this.auth, this.registerEmail, this.registerPassword);
      alert('Registration successful! Now login.');
      this.isVerifyingPhone = false;
      this.toggleForm(); // Switch to login form
    } catch (error: any) {
      console.error('Registration error:', error);
      alert(`Registration failed: ${error.message}`);
    }
  }

  // Handle MFA Failure
  onMfaFailed(error: any) {
    console.error('MFA verification failed:', error);
    alert(`MFA verification failed: ${error.message}`);
    this.isVerifyingPhone = false;
  }

  // Handle Google Sign-In
  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      alert(`Welcome ${result.user.displayName}`);
      
      // Set authentication status in AuthService
      this.authService.login();

      // Redirect to the intended URL or default to '/home'
      const redirectUrl = this.authService.redirectUrl ? this.authService.redirectUrl : '/home';
      this.router.navigate([redirectUrl]);
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      alert(`Login failed: ${error.message}`);
    }
  }

  // Handle Logout
  async logout() {
    try {
      await signOut(this.auth);
      localStorage.removeItem('isLoggedIn');
      this.authService.logout(); // Update AuthService on logout
      this.router.navigate(['/intro']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}
