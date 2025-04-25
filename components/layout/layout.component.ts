import { Component, Inject } from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { AUTH_SERVICE } from '../../types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  public menuBar: MenuItem[] = [
    {
      icon: 'pi pi-user mr-2',
      label: 'UTILISATEURS',
      routerLink: ['users']
    },
    {
      icon: 'pi pi-mars mr-2',
      label: 'RÔLES',
      routerLink: ['roles']
    },
    {
      icon: 'pi pi-shield mr-2',
      label: 'PERMISSIONS',
      routerLink: ['scopes']
    },
  ];
  public profilMenu: MenuItem[] = [
    {
      label: 'Mon compte',
      icon: 'pi pi-user mr-2',
      routerLink: ['/auth/account']
    },
    {
      label: 'Déconnexion',
      icon: 'pi pi-sign-out mr-2',
      command: (event) => {
        this.logout(event as Event)
      },
    }
  ]

  constructor(@Inject(AUTH_SERVICE) public authService$: AuthService, private confirmationService: ConfirmationService, private router: Router) { }

  logout(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Vous êtes sur le point de vous déconnecter de l'application. Voulez-vous procéde ?",
      header: 'Zone dangereuse',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'Annuler',
      rejectButtonProps: {
        label: 'Annuler',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Me déconnecter',
        severity: 'danger',
      },
      accept: () => {
        this.router.navigate(['/auth', 'sign-out'])
      },
    });
  }
}
