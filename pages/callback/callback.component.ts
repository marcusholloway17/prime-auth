import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  Subject,
  catchError,
  filter,
  map,
  switchMap,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import { AUTH_SERVICE } from '../../types';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css'],
})
export class CallbackComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public displayRetryBtn: boolean = false;

  constructor(
    @Inject(AUTH_SERVICE) private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.callback();
  }

  callback() {
    this.displayRetryBtn = false;
    this.route.queryParams
      .pipe(
        takeUntil(this.destroy$),
        map((routeState) => {
          const authToken = routeState['authToken'];
          if (!authToken) {
            this.router.navigateByUrl('/');
          }
          return authToken;
        }),
        switchMap((authToken) =>
          this.authService.callback(authToken).pipe(
            catchError((err) => {
              this.displayRetryBtn = true;
              return throwError(() => err);
            }),
            filter((state) => (state && state?.authToken ? true : false)),
            switchMap((state) =>
              this.authService.getUser(state?.authToken).pipe(
                tap(() => {
                  this.router.navigateByUrl('/');
                })
              )
            )
          )
        )
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
