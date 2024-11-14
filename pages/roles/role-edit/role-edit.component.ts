import { Component, ViewChild } from '@angular/core';
import { catchError, filter, forkJoin, of, Subject, switchMap, take, takeUntil, tap, throwError } from 'rxjs';
import { RoleScopeType, RoleType, ScopeType } from '../../../types';
import { ScopeService } from '../../../services/scope.service';
import { RoleService } from '../../../services/role.service';
import { ConfirmationService } from 'primeng/api';
import { RoleScopeService } from '../../../services/role-scope.service';
import { Popover } from 'primeng/popover';

@Component({
  selector: 'app-role-edit',
  templateUrl: './role-edit.component.html',
  styleUrl: './role-edit.component.css'
})
export class RoleEditComponent {
  private destroy$ = new Subject<void>();
  public role: Partial<RoleType> = {};
  public available_scopes: ScopeType[] = [];
  public selected_scopes: ScopeType[] = [];
  public success_alert: boolean = false;

  // popover
  @ViewChild('op', { static: false }) op!: Popover;


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
    return forkJoin(
      [
        this.roleService$.active_data$.pipe(tap((state) => { if (state && state.id) { this.role = state } })),
        this.scopeService$.list<ScopeType>({ page: undefined, pageSize: undefined, _query: { order: [["createdAt", "DESC"]] } }).pipe(takeUntil(this.destroy$), take(1))
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

  on_scope_removed(scope: ScopeType) {
    if (scope && scope.RoleScope) {
      this.roleScopeService$.delete(scope.RoleScope.id).pipe(
        takeUntil(this.destroy$),
        take(1),
        switchMap(() => of(this.load_select_data()))
      ).subscribe();
    }
  }
  on_scope_added() {
    if (this.selected_scopes?.length)
      forkJoin(this.selected_scopes.map(
        scope => this.roleService$.active_data$.pipe(
          takeUntil(this.destroy$),
          take(1),
          filter((role) => role != null),
          switchMap((role) => this.roleScopeService$.create<RoleScopeType>({ roleId: role.id, scopeId: scope.id }).pipe(
            takeUntil(this.destroy$),
            take(1),
          ))
        ))).pipe(
          takeUntil(this.destroy$),
          switchMap(() => this.roleService$.refresh_active_data().pipe(take(1))),
          tap(() => this.selected_scopes = [])
        )
        .subscribe();
  }

  toggle_popover(event: Event, selected_scopes: ScopeType[]) {
    this.scopeService$.data$.pipe(
      tap((state) => {
        this.available_scopes = state.data.filter(scope => !selected_scopes.find(e => e.id == scope.id));
        this.op.toggle(event);
      })
    ).subscribe();
  }
}
