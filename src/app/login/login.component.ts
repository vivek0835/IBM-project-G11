import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  rememberMe: boolean = false;
  showLoginForm: boolean = true;

  // Register form fields
  registerUsername: string = '';
  registerEmail: string = '';
  registerPassword: string = '';
  registerConfirmPassword: string = '';
  termsAccepted: boolean = false;

  constructor(private router: Router) {}

  toggleForm() {
    this.showLoginForm = !this.showLoginForm;
  }

  login() {
    if (this.username === 'admin' && this.password === 'password') {
      localStorage.setItem('isLoggedIn', 'true');
      if (this.rememberMe) {
        localStorage.setItem('username', this.username);
      }
      this.router.navigate(['/home']); // Redirect to home page after login
    } else {
      alert('Invalid username or password');
    }
  }

  register() {
    if (!this.termsAccepted) {
      alert('You must agree to the terms and conditions.');
      return;
    }
    if (this.registerPassword !== this.registerConfirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    alert('Registration successful! Now login.');
    this.toggleForm(); // Switch to login form after successful registration
  }
}
