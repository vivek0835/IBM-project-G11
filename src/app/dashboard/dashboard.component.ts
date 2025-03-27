import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../services/auth.service'; // Import AuthService

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    standalone: false
})
export class DashboardComponent implements OnInit {
  totalReviews: number = 144;
  positivePercentage: number = 75;
  negativePercentage: number = 25;

  reviews = [
    { name: 'Sunil Cooper', stars: '★★★★★', title: 'Amazing Product', comment: 'This is hands down the best purchase I have made this year.' },
    { name: 'Raghav Roy', stars: '★★★★★', title: 'Amazing Product', comment: 'The product exceeded expectations in every way.' },
    { name: 'Mukesh Ambani', stars: '★☆☆☆☆', title: 'Bad Product', comment: 'The product does not perform as advertised.' }
  ];

  constructor(
    private router: Router,
    private auth: Auth,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  // Logout Function
  async logout() {
    try {
      await this.auth.signOut(); // Sign out from Firebase
      localStorage.removeItem('isLoggedIn'); // Remove login state
      this.authService.logout(); // Update AuthService status
      this.router.navigate(['/intro']); // Redirect to intro page
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}
