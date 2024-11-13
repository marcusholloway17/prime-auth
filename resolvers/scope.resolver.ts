import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { ScopeType } from '../types';
import { ScopeService } from '../services/scope.service';
import { catchError, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScopeResolver implements Resolve<ScopeType> {
  constructor(private scopeService$: ScopeService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ScopeType> {
    const identifier = route.paramMap.get(this.scopeService$.identifier);

    return this.scopeService$.active_data$.pipe(
      switchMap((state) =>
        !!state
          ? of(state)
          : this.scopeService$
            .one<ScopeType>(
              identifier ?? '',
              {
                _query: {},
                page: 1,
                pageSize: 1,
              },
            )
            .pipe(
              catchError((err) => {
                this.router.navigate(['..']);
                return throwError(() => err);
              }),
              tap((response: ScopeType) => {
                this.scopeService$.set_active_data(response);
              })
            )
      )
    );
  }
};
