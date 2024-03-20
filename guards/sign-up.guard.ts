import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { ThirdPartyService } from '../services/third-party.service';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SignUpGuard implements CanActivate {
  constructor(
    private thirdpartyService: ThirdPartyService,
    private router: Router
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.thirdpartyService.app$.pipe(
      map((app) => app?.allowRegistration ?? false),
      tap((allowRegistration) => {
        if (!allowRegistration)
          this.router.navigate([environment.app.routing.auth.signIn], {
            queryParamsHandling: 'merge',
          });
      })
    );
  }
}
