import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment.development';
import { AUTH_SERVICE } from '../types';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const isLoggedIn = this.authService.isLoggedIn();
    if (!isLoggedIn) {
      window.location.href = `${
        this.authService.appHost
      }/#/auth/sign-in?clientId=${this.authService.clientId}&clientSecret=${
        this.authService.clientSecret
      }&redirectTo=${encodeURIComponent(this.authService.redirectTo)}`;
    }

    return isLoggedIn;
  }
}
