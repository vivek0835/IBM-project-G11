import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  showLoginForm: boolean = true;

  registerEmail: string = '';
  registerPassword: string = '';
  registerConfirmPassword: string = '';
  termsAccepted: boolean = false;

  constructor(private router: Router, private auth: Auth) {}

  toggleForm() {
    this.showLoginForm = !this.showLoginForm;
  }

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
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Login error:', error);
      alert(`Login failed: ${error.message}`);
    }
  }

  async register() {
    if (!this.termsAccepted) {
      alert('You must agree to the terms and conditions.');
      return;
    }

    if (this.registerPassword !== this.registerConfirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      await createUserWithEmailAndPassword(this.auth, this.registerEmail, this.registerPassword);
      alert('Registration successful! Now login.');
      this.toggleForm();
    } catch (error: any) {
      console.error('Registration error:', error);
      alert(`Registration failed: ${error.message}`);
    }
  }

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      alert(`Welcome ${result.user.displayName}`);
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      alert(`Login failed: ${error.message}`);
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
      localStorage.removeItem('isLoggedIn');
      this.router.navigate(['/intro']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}
