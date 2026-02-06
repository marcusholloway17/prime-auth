import { Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, Subject, take, takeUntil, tap, throwError } from 'rxjs';
import { ScopeService } from '../../../services/scope.service';
import { RoleService } from '../../../services/role.service';
import { RoleType } from '../../../types';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-role-create',
  templateUrl: './role-create.component.html',
  styleUrl: './role-create.component.css',
  standalone: false
})
export class RoleCreateComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public role: Partial<RoleType> = {};

  constructor(public scopeService$: ScopeService, public roleService$: RoleService, private confirmationService: ConfirmationService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.load_select_data();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  load_select_data() {
    this.scopeService$.list({ page: undefined, pageSize: undefined, _query: { order: [["createdAt", "DESC"]] } }).pipe(takeUntil(this.destroy$), take(1)).subscribe();
  }

  save(event: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Voulez-vous confirmer cet enregistrement ?',
      header: 'Zone dangereuse',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Annuler',
      rejectButtonProps: {
        label: 'Annuler',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Confirmer',
        severity: 'success',
      },


      accept: () => {
        const payload = {
          ...this.role,
          RoleScopes: this.role.RoleScopes?.map(e => { return { scopeId: e } }),
          relations: {
            include: !this.role.RoleScopes?.length ? [] : [
              "RoleScopes"
            ]
          }
        }

        console.log('role', payload);
        this.roleService$.create(payload).pipe(
          takeUntil(this.destroy$),
          take(1),
          catchError((err) => {
            return throwError(() => err)
          }), tap((response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Enregistrement réussi',
              detail: `Le rôle ${this.role.label} a été enregistré avec succès.`,
            });
            for (let key in this.role) {
              this.role[key as keyof RoleType] = '' as any;
            }
          })).subscribe();
      },
      reject: () => { },
    })
  }
}
