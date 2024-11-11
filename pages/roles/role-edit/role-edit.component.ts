import { Component } from '@angular/core';
import { catchError, forkJoin, Subject, take, takeUntil, tap, throwError } from 'rxjs';
import { RoleType } from '../../../types';
import { ScopeService } from '../../../services/scope.service';
import { RoleService } from '../../../services/role.service';
import { ConfirmationService } from 'primeng/api';
import { RoleScopeService } from '../../../services/role-scope.service';

@Component({
  selector: 'app-role-edit',
  templateUrl: './role-edit.component.html',
  styleUrl: './role-edit.component.css'
})
export class RoleEditComponent {
  private destroy$ = new Subject<void>();
  public role: Partial<RoleType> = {};
  public success_alert: boolean = false;


  constructor(
    public scopeService$: ScopeService,
    public roleService$: RoleService,
    private roleScopeService$: RoleScopeService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
    this.load_select_data();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  load_select_data() {
    forkJoin(
      [
        this.roleService$.active_data$.pipe(tap((state) => { if (state && state.id) { this.role = state } })),
        this.scopeService$.list({ page: undefined, pageSize: undefined, _query: {} }).pipe(takeUntil(this.destroy$), take(1))
      ]
    )
      .subscribe();
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
        if (this.role && this.role.id)
          this.roleService$.update(this.role.id, { ...this.role }).pipe(
            takeUntil(this.destroy$),
            take(1),
            catchError((err) => {
              return throwError(() => err)
            }), tap((response) => {
              this.success_alert = true;
              this.role = {}
            })).subscribe();
      },
      reject: () => { },
    })
  }

  on_scope_select_change(event: any) {
    console.log('scope select change', event);
  }
}
