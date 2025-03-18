// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isAuthenticated) {
      // If authenticated, allow access
      return true;
    } else {
      // If not authenticated, store the attempted URL and redirect to the login page
      this.authService.redirectUrl = state.url;  // Store the attempted URL
      this.router.navigate(['/login']);  // Navigate to login page
      return false;
    }
  }
}
