import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true, // Make it standalone
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  rememberMe: boolean = false;
  showLoginForm: boolean = true;

  registerUsername: string = '';
  registerEmail: string = '';
  registerPassword: string = '';
  registerConfirmPassword: string = '';
  termsAccepted: boolean = false;

  constructor(@Inject(Router) private router: Router) {}

  toggleForm() {
    this.showLoginForm = !this.showLoginForm;
  }

  login() {
    if (this.username === 'admin' && this.password === 'password') {
      localStorage.setItem('isLoggedIn', 'true');
      if (this.rememberMe) {
        localStorage.setItem('username', this.username);
      }
      this.router.navigate(['/home']);
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
    this.toggleForm();
  }
}
