import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserApplicationRoleService } from '../../../services/user-application-role.service';
import { Router } from '@angular/router';
import { Subject, switchMap, take, takeUntil } from 'rxjs';
import { UserApplicationRoleType } from '../../../types';
import { RoleService } from '../../../services/role.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css'
})
export class UserDetailComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    public userApplicationRole$: UserApplicationRoleService,
    public roleService$: RoleService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.load_select_data();
  }

  load_select_data() {
    this.roleService$.list({ page: undefined, pageSize: undefined, _query: {} }).pipe(takeUntil(this.destroy$), take(1)).subscribe();
  }

  edit(item: UserApplicationRoleType) {
    this.userApplicationRole$.set_active_data(item);
    this.router.navigate(['/auth', 'manage', 'user', item?.userApplicationRoleId, 'edit']);
  }

  update_role(event: any) {
    this.userApplicationRole$.active_data$.pipe(
      take(1),
      switchMap(
        (user_application_role) =>
          this.userApplicationRole$.update(user_application_role?.userApplicationRoleId ?? '', { roleId: event }).pipe(
            takeUntil(this.destroy$),
            take(1),
          ))
    ).subscribe();
  }

  update(value: Partial<UserApplicationRoleType>) {
    // todo: only update active field
    this.userApplicationRole$.update(value.userApplicationRoleId ?? '', {}).pipe(
      takeUntil(this.destroy$),
      take(1),
      switchMap(() => this.userApplicationRole$.refresh_active_data().pipe(takeUntil(this.destroy$), take(1)))
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
