import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { UserApplicationRoleType } from '../types';
import { UserApplicationRoleService } from '../services/user-application-role.service';
import { catchError, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class userApplicationRoleResolver implements Resolve<UserApplicationRoleType> {
  constructor(private userApplicationService$: UserApplicationRoleService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UserApplicationRoleType> {
    const identifier = route.paramMap.get(this.userApplicationService$.identifier);

    return this.userApplicationService$.active_data$.pipe(
      switchMap((state) =>
        !!state
          ? of(state)
          : this.userApplicationService$
            .one<UserApplicationRoleType>(
              identifier ?? '',
              {
                _query: {
                  include: [
                    "User", "Role"
                  ],
                },
                page: 1,
                pageSize: 1,
              },
            )
            .pipe(
              catchError((err) => {
                this.router.navigate(['..']);
                return throwError(() => err);
              }),
              tap((response: UserApplicationRoleType) => {
                this.userApplicationService$.set_active_data(response);
              })
            )
      )
    );
  }
};
