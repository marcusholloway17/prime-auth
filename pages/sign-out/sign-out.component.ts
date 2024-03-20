import { Component, Inject } from '@angular/core';
import { AUTH_SERVICE } from '../../types';
import { Subject, catchError, takeUntil, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-out',
  templateUrl: './sign-out.component.html',
  styleUrls: ['./sign-out.component.css'],
})
export class SignOutComponent {
  private destroy$ = new Subject<void>();
  public displayRetryBtn: boolean = false;

  constructor(@Inject(AUTH_SERVICE) private authService: AuthService) {}

  ngOnInit(): void {
    this.signOut();
  }

  signOut() {
    this.displayRetryBtn = false;
    this.authService
      .signOut()
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          this.displayRetryBtn = true;
          return throwError(() => err);
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
