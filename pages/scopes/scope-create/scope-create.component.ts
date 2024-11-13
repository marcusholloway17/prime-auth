import { Component, OnDestroy } from '@angular/core';
import { ScopeService } from '../../../services/scope.service';
import { ConfirmationService } from 'primeng/api';
import { Subject, takeUntil, tap, catchError, throwError, take } from 'rxjs';
import { ScopeType } from '../../../types';

@Component({
  selector: 'app-scope-create',
  templateUrl: './scope-create.component.html',
  styleUrl: './scope-create.component.css'
})
export class ScopeCreateComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  public scope: Partial<ScopeType> = {};
  public success_alert: boolean = false;


  constructor(public scopeService$: ScopeService, private confirmationService: ConfirmationService,) { }

  ngOnDestroy(): void {
    this.destroy$.next();
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
        this.scopeService$.create(this.scope).pipe(
          takeUntil(this.destroy$),
          take(1),
          catchError((err) => {
            return throwError(() => err)
          }), tap((response) => {
            this.success_alert = true;
            this.scope = {}
          })).subscribe();
      },
      reject: () => { },
    })
  }
}
