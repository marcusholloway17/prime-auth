import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, take, takeUntil, tap } from 'rxjs';
import { UserApplicationRoleService } from '../../../services/user-application-role.service';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public actions_menu: MenuItem[] = [
    {
      label: 'Actualiser',
      icon: 'pi pi-refresh',
      command: () => {
        this.refresh();
      }
    }
  ]

  // data table
  public dt_search_value: string = '';

  // request state handler
  public page: number = 1;
  public pageSize: number = 50;


  constructor(
    public userApplicationRole$: UserApplicationRoleService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public authService$: AuthService
  ) { }

  ngOnInit(): void {
    this.handleQueryParamMap();
  }

  handleQueryParamMap() {
    this.activatedRoute.queryParamMap.pipe(
      takeUntil(this.destroy$),
      tap((state) => {
        // handle page & pageSize
        if (state.get('page') && state.get('pageSize')) {
          this.page = Number(state.get('page'));
          this.pageSize = Number(state.get('pageSize'));
        }

        this.userApplicationRole$.setQueryParams({
          _query: this.userApplicationRole$.queryParams._query,
          page: this.page,
          pageSize: this.pageSize
        });

        this.refresh();
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  create() {
    this.router.navigate(['/', ''])
  }

  refresh() {
    this.userApplicationRole$.list().pipe(
      takeUntil(this.destroy$),
      take(1)
    ).subscribe()
  }

  detail(event: any) {
    this.userApplicationRole$.set_active_data(event?.data);
    this.router.navigate(['/auth', 'manage', 'user', event?.data[this.userApplicationRole$.identifier]]);
  }

  onPageChange(event: any) {
    this.router.navigate([], { queryParams: { page: event?.page + 1, pageSize: event?.rows } });
  }
}
