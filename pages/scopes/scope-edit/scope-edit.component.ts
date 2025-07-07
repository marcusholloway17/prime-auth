import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Subject, takeUntil, tap, take, switchMap } from 'rxjs';
import { ScopeService } from '../../../services/scope.service';
import { ScopeType } from '../../../types';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-scope-edit',
    templateUrl: './scope-edit.component.html',
    styleUrl: './scope-edit.component.css',
    standalone: false
})
export class ScopeEditComponent implements OnDestroy, OnInit {
  private destroy$ = new Subject<void>();
  public scope: Partial<ScopeType> = {};
  public success_alert: boolean = false;


  constructor(
    public scopeService$: ScopeService,
    private confirmationService: ConfirmationService,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.scopeService$.active_data$.pipe(tap(state => { if (state) { this.scope = state } }), takeUntil(this.destroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  update(event: Event) {
    if (this.scope && this.scope.id)
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
          if (this.scope && this.scope.id)
            this.scopeService$.update(this.scope.id, this.scope)
              .pipe(takeUntil(this.destroy$),
                take(1),
                tap((response) => {
                  this.success_alert = true;
                }),
                switchMap(() => this.scopeService$.refresh_active_data().pipe(takeUntil(this.destroy$), take(1))))
              .subscribe()
        },
        reject: () => { },
      })
  }
}
