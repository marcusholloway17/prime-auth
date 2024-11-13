import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CallbackComponent } from './pages/callback/callback.component';
import { SignOutComponent } from './pages/sign-out/sign-out.component';
import { LayoutComponent } from './components/layout/layout.component';
import { UserListComponent } from './pages/users/user-list/user-list.component';
import { UserCreateComponent } from './pages/users/user-create/user-create.component';
import { UserDetailComponent } from './pages/users/user-detail/user-detail.component';
import { UserEditComponent } from './pages/users/user-edit/user-edit.component';
import { AuthGuardService } from './guards/auth.guard';
import { userApplicationRoleResolver } from './resolvers/user-application-role.resolver';
import { RoleListComponent } from './pages/roles/role-list/role-list.component';
import { RoleCreateComponent } from './pages/roles/role-create/role-create.component';
import { RoleDetailComponent } from './pages/roles/role-detail/role-detail.component';
import { RoleEditComponent } from './pages/roles/role-edit/role-edit.component';
import { RoleResolver } from './resolvers/role.resolver';
import { ScopeEditComponent } from './pages/scopes/scope-edit/scope-edit.component';
import { ScopeDetailComponent } from './pages/scopes/scope-detail/scope-detail.component';
import { ScopeCreateComponent } from './pages/scopes/scope-create/scope-create.component';
import { ScopeListComponent } from './pages/scopes/scope-list/scope-list.component';
import { ScopeResolver } from './resolvers/scope.resolver';
import { HasScopeGuardService } from './guards/has-scope.guard';

const routes: Routes = [
    {
        path: 'callback',
        component: CallbackComponent,
    },
    {
        path: 'sign-out',
        component: SignOutComponent,
    },
    {
        path: 'manage',
        component: LayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'users',
                pathMatch: 'full'
            },
            // users
            {
                path: 'users',
                component: UserListComponent
            },
            {
                path: 'users/create',
                component: UserCreateComponent
            },
            {
                path: 'user/:userApplicationRoleId',
                component: UserDetailComponent,
                resolve: {
                    userApplicationRole: userApplicationRoleResolver
                }
            },
            {
                path: 'user/:userApplicationRoleId/edit',
                component: UserEditComponent,
                resolve: {
                    userApplicationRole: userApplicationRoleResolver
                }
            },
            // roles
            {
                path: 'roles',
                component: RoleListComponent
            },
            {
                path: 'roles/create',
                component: RoleCreateComponent
            },
            {
                path: 'role/:id',
                component: RoleDetailComponent,
                resolve: {
                    role: RoleResolver
                }
            },
            {
                path: 'role/:id/edit',
                component: RoleEditComponent,
                resolve: {
                    role: RoleResolver
                }
            },
            // scopes
            {
                path: 'scopes',
                component: ScopeListComponent
            },
            {
                path: 'scopes/create',
                component: ScopeCreateComponent
            },
            {
                path: 'scope/:id',
                component: ScopeDetailComponent,
                resolve: {
                    role: ScopeResolver
                }
            },
            {
                path: 'scope/:id/edit',
                component: ScopeEditComponent,
                resolve: {
                    role: ScopeResolver
                }
            }
        ],
        data: {
            scopes: ['auth:manage']
        },
        canActivate: [AuthGuardService, HasScopeGuardService]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }