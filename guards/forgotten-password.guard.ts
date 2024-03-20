import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { ThirdPartyService } from '../services/third-party.service';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ForgottenPasswordGuard implements CanActivate {
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
    const allowRecovery =
      this.thirdpartyService.getCurrentApp()?.allowRecovery ?? false;
    if (!allowRecovery) {
      console.log('ACTION NOT ALLWED');
      this.router.navigate([environment.app.routing.auth.signIn], {
        queryParamsHandling: 'merge',
      });
    }
    return allowRecovery;
  }
}
