import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AUTH_CONFIG_PROVIDER, AUTH_SERVICE, AuthConfigType } from './types';
import { AuthService } from './services/auth.service';
import { CallbackComponent } from './pages/callback/callback.component';
import { SignOutComponent } from './pages/sign-out/sign-out.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { AuthRoutingModule } from './auth-routing.module';
import { SplitButtonModule } from 'primeng/splitbutton';
import { UserCreateComponent } from './pages/users/user-create/user-create.component';
import { UserListComponent } from './pages/users/user-list/user-list.component';
import { UserEditComponent } from './pages/users/user-edit/user-edit.component';
import { UserDetailComponent } from './pages/users/user-detail/user-detail.component';

@NgModule({
  declarations: [CallbackComponent, SignOutComponent, UserCreateComponent, UserListComponent, UserEditComponent, UserDetailComponent],
  imports: [CommonModule, AuthRoutingModule, ProgressSpinnerModule, ButtonModule, TranslateModule, SplitButtonModule],
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
