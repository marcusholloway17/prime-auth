import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AUTH_CONFIG_PROVIDER, AUTH_SERVICE, AuthConfigType } from './types';
import { AuthService } from './services/auth.service';
import { CallbackComponent } from './pages/callback/callback.component';
import { SignOutComponent } from './pages/sign-out/sign-out.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [CallbackComponent, SignOutComponent],
  imports: [CommonModule, ProgressSpinnerModule, ButtonModule, TranslateModule],
})
export class AuthModule {
  static forRoot(config: AuthConfigType): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule,
      providers: [
        {
          provide: AUTH_CONFIG_PROVIDER,
          useValue: config,
        },
        {
          provide: AUTH_SERVICE,
          useClass: AuthService,
        },
      ],
    };
  }
}
