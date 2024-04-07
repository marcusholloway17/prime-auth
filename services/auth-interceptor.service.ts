import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AUTH_SERVICE } from "../types";
import { AuthService } from "./auth.service";
import { Observable, catchError, throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(
    private router: Router,
    @Inject(AUTH_SERVICE) private authService: AuthService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Si le code d'erreur est 401, rediriger vers la page de connexion
          this.authService.clearSessionStorage();
          setTimeout(() => {
            this.router.navigate(["/"]);
          }, 100);
        }
        // Propager l'erreur si elle ne doit pas être traitée ici
        return throwError(() => error);
      })
    );
  }
}

export const UnauthenticatedInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptorService,
  multi: true,
};
