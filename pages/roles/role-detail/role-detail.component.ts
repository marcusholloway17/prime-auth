import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil, take, tap } from 'rxjs';
import { ScopeService } from '../../../services/scope.service';
import { RoleService } from '../../../services/role.service';
import { RoleType, ScopeType } from '../../../types';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';

@Component({
  selector: 'app-role-detail',
  templateUrl: './role-detail.component.html',
  styleUrl: './role-detail.component.css'
})
export class RoleDetailComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public success_alert: boolean = false;

  public items: MenuItem[] = [
    {
      label: 'Supprimer',
      command: (event) => {
        this.delete(event as Event)
      },
    }
  ]

  constructor(public scopeService$: ScopeService, public roleService$: RoleService, private router: Router, private confirmationService: ConfirmationService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.load_select_data();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  load_select_data() {
    this.scopeService$.list({ page: undefined, pageSize: undefined, _query: {} }).pipe(takeUntil(this.destroy$), take(1)).subscribe();
  }

  edit(role: RoleType) {
    this.roleService$.set_active_data(role);
    this.router.navigate(['/auth', 'manage', 'role', role.id, 'edit']);
  }

  delete(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Voulez-vous supprimer cet enregistrement ?',
      header: 'Zone dangereuse',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Annuler',
      rejectButtonProps: {
        label: 'Annuler',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Supprimer',
        severity: 'danger',
      },

      accept: () => {
        this.roleService$.delete_active()
          .pipe(
            takeUntil(this.destroy$),
            take(1),
            tap(() => {
              this.messageService.add(
                { severity: 'success', summary: 'Succès', detail: 'Ce rôle a bien été supprimé', life: 3000 }
              );
              this.router.navigate(['/auth', 'manage', 'roles'])
            })
          )
          .subscribe();
      },
      reject: () => { },
    });
  }

  on_scope_select_change(event: any) {
    console.log('change', event);
  }
}
