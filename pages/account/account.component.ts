import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil, take, switchMap, tap } from 'rxjs';
import { RoleService } from '../../services/role.service';
import { AUTH_SERVICE } from '../../types';
import { AuthService } from '../../services/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // password change form
  public pwd = {
    password: '',
    newPassword: '',
    confirmPassword: ''
  }

  // 2FA enbale form
  public two_fa = {
    token: '',
    otp: ''
  }

  constructor(
    @Inject(AUTH_SERVICE) public authService$: AuthService,
    public roleService$: RoleService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.load_select_data();
  }

  load_select_data() {
    this.roleService$.list({ page: undefined, pageSize: undefined, _query: {} }).pipe(takeUntil(this.destroy$), take(1)).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  copyToClipboard(value: any) {
    if (navigator.clipboard && window.isSecureContext) {
      // Utilisation de l'API Clipboard moderne
      navigator.clipboard.writeText(value).then(
        () =>
          this.messageService.add({
            detail: 'Copié dans le papier presse',
            severity: 'success',
          }),
        (err) =>
          this.messageService.add({
            detail: "Impossible de copier dans le papier presse",
            severity: 'warn',
          })
      );
    }
  }

  update_user_informations(event: Event, user: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Voulez-vous mettre à jour vos informations d'identification ?",
      header: 'Zone dangereuse',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'Annuler',
      rejectButtonProps: {
        label: 'Annuler',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Mettre à jour',
        severity: 'danger',
      },
      accept: () => {
        this.authService$.updateUser({
          firstname: user.firstname,
          lastname: user.lastname,
          phoneNumber: user.phoneNumber,
        }).pipe(
          take(1)
        ).subscribe();
      },
    });
  }

  change_password(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Voulez-vous changer votre mot de passe ?",
      header: 'Zone dangereuse',
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'Annuler',
      rejectButtonProps: {
        label: 'Annuler',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Changer mot de passe',
        severity: 'danger',
      },
      accept: () => {
        this.authService$.changePassword(this.pwd).pipe(
          take(1),
          tap(() => {
            this.pwd = {
              password: '',
              newPassword: '',
              confirmPassword: ''
            }
          })
        ).subscribe();
      },
    });
  }

  on_2fa_enabled_change(value: boolean) {
    if (value == true) {
      this.authService$.enable_2fa().pipe(
        take(1),
        tap((response: any) => {
          if (response['token']) {
            this.two_fa.token = response['token']
          }
        })
      ).subscribe()
    } else {
      this.confirmationService.confirm({
        // target: event.target as EventTarget,
        message: "Voulez-vous désactiver l'authentification à double facteur ?",
        header: 'Zone dangereuse',
        icon: 'pi pi-exclamation-triangle',
        rejectLabel: 'Annuler',
        rejectButtonProps: {
          label: 'Annuler',
          severity: 'secondary',
          outlined: true,
        },
        acceptButtonProps: {
          label: 'Désactiver',
          severity: 'danger',
        },
        accept: () => {
          this.authService$.updateUser({
            is2faEnabled: false,
          }).pipe(
            take(1)
          ).subscribe();
        },
      });
    }
  }

  activate_2fa_auth() {
    this.authService$.activate_2fa_auth(this.two_fa).pipe(
      take(1),
      tap((response) => {
        this.two_fa = {
          token: '',
          otp: ''
        }
      })
    ).subscribe();
  }
}
