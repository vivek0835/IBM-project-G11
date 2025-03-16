import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService) {}

  login() {
    this.authService.loginWithEmail(this.email, this.password)
      .then(() => {
        console.log('Login successful');
      })
      .catch(err => {
        this.errorMessage = err.message;
      });
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle()
      .then(() => {
        console.log('Google login successful');
      })
      .catch(err => {
        this.errorMessage = err.message;
      });
  }
}
