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
                path: 'user/:user_application_id',
                component: UserDetailComponent
            },
            {
                path: 'user/:user_application_id/edit',
                component: UserEditComponent
            },
        ],
        canActivate: [AuthGuardService]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }