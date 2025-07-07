import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subject, take, takeUntil, tap } from 'rxjs';
import { RoleService } from '../../../services/role.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-role-list',
    templateUrl: './role-list.component.html',
    styleUrl: './role-list.component.css',
    standalone: false
})
export class RoleListComponent implements OnInit, OnDestroy {
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
    public roleService$: RoleService,
    private router: Router,
    private activatedRoute: ActivatedRoute
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

        this.roleService$.setQueryParams({
          _query: this.roleService$.queryParams._query,
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

  refresh() {
    this.roleService$.list().pipe(
      takeUntil(this.destroy$),
      take(1)
    ).subscribe()
  }

  detail(event: any) {
    this.roleService$.set_active_data(event?.data);
    this.router.navigate(['/auth', 'manage', 'role', event?.data[this.roleService$.identifier]]);
  }

  onPageChange(event: any) {
    this.router.navigate([], { queryParams: { page: event?.page + 1, pageSize: event?.rows } });
  }
}
