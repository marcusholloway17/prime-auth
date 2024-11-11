import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { RoleType } from '../types';
import { RoleService } from '../services/role.service';
import { catchError, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RoleResolver implements Resolve<RoleType> {
  constructor(private roleService$: RoleService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RoleType> {
    const identifier = route.paramMap.get(this.roleService$.identifier);

    return this.roleService$.active_data$.pipe(
      switchMap((state) =>
        !!state
          ? of(state)
          : this.roleService$
            .one<RoleType>(
              identifier ?? '',
              {
                _query: {
                  include: ["Scopes"],
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
              tap((response: RoleType) => {
                this.roleService$.set_active_data(response);
              })
            )
      )
    );
  }
};
