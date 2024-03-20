import { Inject, Injectable, OnDestroy, OnInit } from '@angular/core';
import {
  AuthStateType,
  AuthenticatedDataType,
  UserStateType,
  AUTH_CONFIG_PROVIDER,
  AuthConfigType,
} from '../types';
import {
  BehaviorSubject,
  Subject,
  catchError,
  filter,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LanguageService } from 'src/app/helpers/language.service';
import { badRequestErrorType } from '../types';
import { LoaderService } from 'src/app/blocs/loader/loader.service';
import { SessionStorageService } from 'src/app/helpers/session-storage.service';
import {
  AUTH_SIGN_IN_DATA_CACHE_KEY,
  AUTH_USER_STATE_DATA_CACHE_KEY,
} from '../constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private destroy$ = new Subject<void>();

  // region urls
  public host = environment.auth.host;
  public localSignInUrl = `${this.host}/auth/local/sign-in`;
  public localSignUpUrl = `${this.host}/auth/local/sign-up`;
  public localSignOutUrl = `${this.host}/auth/local/sign-out`;
  public localVerifyAccountUrl = `${this.host}/auth/local/verify-account`;
  public localResendOtpUrl = `${this.host}/auth/local/otp`;
  public localForgottenPasswordUrl = `${this.host}/auth/local/forgotten-password`;
  public localCheckOtpUrl = `${this.host}/auth/local/check-otp`;
  public localResetPasswordUrl = `${this.host}/auth/local/reset-password`;
  public localProfilePictureUrl = `${this.host}/api/user/profile-picture`;
  public localProfileUrl = `${this.host}/api/user`;
  public localCallbackUrl = `${this.host}/auth/local/callback`;
  // endregion urls

  // region client credentials
  public clientId!: string;
  public clientSecret!: string;
  public redirectTo!: string;
  public appHost!: string;
  // region client credentials

  // region headers
  public headers!: HttpHeaders;
  // endregion headers

  // region authState
  private _authState$ = new BehaviorSubject<AuthStateType>({
    performingAction: false,
  });
  public authState$ = this._authState$.asObservable();
  // endregion authstate

  // region signInState
  private _signInState$ = new BehaviorSubject<AuthenticatedDataType | null>(
    null
  );
  public signInState$ = this._signInState$.asObservable();
  // endregion signInState

  // region userState
  private _userState$ = new BehaviorSubject<UserStateType | null>(null);
  public userState$ = this._userState$.asObservable();
  // endregion userState

  constructor(
    @Inject(AUTH_CONFIG_PROVIDER) private authConfig: AuthConfigType,
    private httpClient: HttpClient,
    private messageService: MessageService,
    private languageService: LanguageService,
    private loaderService: LoaderService,
    private sessionStorageService: SessionStorageService,
    private router: Router
  ) {
    this.host = this.authConfig.apiHost;
    this.clientId = this.authConfig.clientId;
    this.clientSecret = this.authConfig.clientSecret;
    this.appHost = this.authConfig.appHost;
    this.redirectTo = this.authConfig.redirectTo;
    this.headers = new HttpHeaders()
      .set('x-client-id', this.authConfig.clientId)
      .set('x-client-secret', this.authConfig.clientSecret);
  }

  private setAuthState(state: AuthStateType) {
    this._authState$.next(state);
  }

  signOut() {
    this.loaderService.load();
    return this.signInState$.pipe(
      tap((state) => console.log('signinstate', state)),
      filter((state) => state != null),
      switchMap((state) =>
        this.httpClient
          .post(
            this.localSignOutUrl,
            {},
            {
              headers: this.headers.set(
                'Authorization',
                `Bearer ${state?.authToken as string}`
              ),
            }
          )
          .pipe(
            catchError((err) => {
              this.loaderService.load(false);
              return this.handleError(err);
            }),
            tap((state: any) => {
              // remove signInState & userState in session storage
              this.sessionStorageService.clear();
              this.loaderService.load(false);
              this.messageService.add({
                severity: 'success',
                detail: state?.msg,
              });
              this.router.navigateByUrl('/');
            })
          )
      )
    );
  }

  private getAuthState() {
    return this._authState$.getValue();
  }

  updateUser(data: any) {
    return this.signInState$.pipe(
      filter((state) => state != null),
      switchMap((state) =>
        this.httpClient
          .put(this.localProfileUrl, data, {
            headers: this.headers.set(
              'Authorization',
              `Bearer ${state?.authToken as string}`
            ),
          })
          .pipe(
            catchError((err) => this.handleError(err)),
            tap(() =>
              this.messageService.add({
                severity: 'success',
                detail: this.languageService.instant('app.strings.request-ok'),
              })
            ),
            switchMap(() => this.getUser(state?.authToken))
          )
      )
    );
  }

  updateProfilePicture(profilePictureUrl: string) {
    this.loaderService.load();
    return this.signInState$.pipe(
      filter((state) => state != null),
      switchMap((state) =>
        this.httpClient
          .post(
            this.localProfilePictureUrl,
            {
              profilePictureUrl,
            },
            {
              headers: this.headers.set(
                'Authorization',
                `Bearer ${state?.authToken as string}`
              ),
            }
          )
          .pipe(
            catchError((err) => {
              this.loaderService.load(false);
              return this.handleError(err);
            }),
            tap(() => this.loaderService.load(false)),
            // refresh user state
            switchMap(() => this.getUser(state?.authToken))
          )
      )
    );
  }

  getUser(authToken: string = this._getSignInState()?.authToken) {
    return this.httpClient
      .get<UserStateType>(this.localProfileUrl, {
        headers: this.headers.set('Authorization', `Bearer ${authToken}`),
      })
      .pipe(
        catchError((err) => {
          return this.handleError(err);
        }),
        tap((response) => {
          this.setUserState(response);
        })
      );
  }

  callback(authToken: string) {
    return this.httpClient
      .get<AuthenticatedDataType>(
        `${this.localCallbackUrl}?authToken=${authToken}`,
        {
          headers: this.headers,
        }
      )
      .pipe(
        catchError((err) => this.handleError(err)),
        tap((response) => {
          this.setSignInState(response);
          this.getUser(authToken);
        })
      );
  }

  private _getSignInState() {
    let state;
    try {
      state = JSON.parse(
        this.sessionStorageService.parse(
          this.sessionStorageService.getItem(AUTH_SIGN_IN_DATA_CACHE_KEY)
        )
      );
      return state;
    } catch (error) {
      return null;
    }
  }

  isLoggedIn() {
    const signInState = this.sessionStorageService.parse(
      this.sessionStorageService.getItem(AUTH_SIGN_IN_DATA_CACHE_KEY)
    );
    const userState = this.sessionStorageService.parse(
      this.sessionStorageService.getItem(AUTH_USER_STATE_DATA_CACHE_KEY)
    );
    if (userState && userState?.id) {
      this._userState$.next(userState);
    }
    if (signInState && signInState?.authToken) {
      this._signInState$.next(signInState);
      return true;
    } else {
      return false;
    }
  }

  // get user scopes
  getScopes() {
    return this._signInState$.getValue()?.scopes ?? [];
  }
  hasScopes(scopes: string[]) {
    return this.getScopes().some((scope) => scopes.includes(scope));
  }

  private setSignInState(state: AuthenticatedDataType) {
    this.sessionStorageService.setItem(AUTH_SIGN_IN_DATA_CACHE_KEY, state);
    this._signInState$.next(state);
  }

  private setUserState(state: UserStateType) {
    this.sessionStorageService.setItem(AUTH_USER_STATE_DATA_CACHE_KEY, state);
    this._userState$.next(state);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  private handleError(err: HttpErrorResponse) {
    const _error = err.error;
    if (typeof _error == 'string') {
      this.messageService.add({
        severity: 'error',
        detail: _error,
      });
    } else if (Array.isArray(_error?.errors) && _error?.errors?.length) {
      this.messageService.addAll(
        _error?.errors?.map((err: badRequestErrorType) => {
          return {
            severity: 'warn',
            detail: err?.msg,
            summary: err?.params,
          };
        })
      );
    } else {
      this.messageService.add({
        severity: 'error',
        detail: this.languageService.instant('sign-in.authorizationError'),
      });
    }
    return throwError(() => err);
  }
}
