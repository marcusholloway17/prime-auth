import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AUTH_SERVICE } from '../types';

@Injectable({
  providedIn: 'root',
})
export class HasScopeGuardService implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private authService: AuthService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let allowed: boolean = false;
    if (route.data['scopes'] && Array.isArray(route.data['scopes'])) {
      allowed = this.authService.hasScopes(route.data['scopes']);
    }
    return allowed;
  }
}
