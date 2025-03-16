import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private auth: Auth
  ) {}

  canActivate(): Observable<boolean> {
    return from(
      new Promise<boolean>(resolve => {
        this.auth.onAuthStateChanged(user => {
          if (user) {
            resolve(true); // ✅ User is authenticated → allow navigation
          } else {
            this.router.navigate(['/intro']);
            resolve(false); // ✅ User is not authenticated → redirect to intro
          }
        });
      })
    ).pipe(take(1)); // ✅ Complete the observable after the first value
  }
}
