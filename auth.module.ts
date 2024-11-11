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
import { LayoutComponent } from './components/layout/layout.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { RoleListComponent } from './pages/roles/role-list/role-list.component';
import { RoleCreateComponent } from './pages/roles/role-create/role-create.component';
import { RoleDetailComponent } from './pages/roles/role-detail/role-detail.component';
import { RoleEditComponent } from './pages/roles/role-edit/role-edit.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { MessageModule } from 'primeng/message';
import { ChipModule } from 'primeng/chip';
import { CheckboxModule } from 'primeng/checkbox';

@NgModule({
  declarations: [CallbackComponent, SignOutComponent, UserCreateComponent, UserListComponent, UserEditComponent, UserDetailComponent, LayoutComponent, RoleListComponent, RoleCreateComponent, RoleDetailComponent, RoleEditComponent],
  imports: [CommonModule, FormsModule, AuthRoutingModule, ProgressSpinnerModule, ButtonModule, TranslateModule, SplitButtonModule, InputTextareaModule, DividerModule, CardModule, TableModule, InputTextModule, IconFieldModule, InputIconModule, SelectModule, TagModule, PaginatorModule, ToggleSwitchModule, MultiSelectModule, MessageModule, ChipModule, CheckboxModule],
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
