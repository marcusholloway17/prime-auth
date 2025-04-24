import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Subject, take, takeUntil, tap } from 'rxjs';
import { ScopeService } from '../../../services/scope.service';
import { ScopeType } from '../../../types';

@Component({
  selector: 'app-scope-detail',
  templateUrl: './scope-detail.component.html',
  styleUrl: './scope-detail.component.css'
})
export class ScopeDetailComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public success_alert: boolean = false;
  public items: MenuItem[] = [
    {
      label: "Supprimer",
      command: (event) => {
        this.delete(event as Event);
      }
    }
  ]

  constructor(public scopeService$: ScopeService, private router: Router, private confirmationService: ConfirmationService, private messageService: MessageService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  edit(scope: ScopeType) {
    this.scopeService$.set_active_data(scope);
    this.router.navigate(['/auth', 'manage', 'scope', scope.id, 'edit']);
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
        this.scopeService$.delete_active()
          .pipe(
            takeUntil(this.destroy$),
            take(1),
            tap(() => {
              this.messageService.add(
                { severity: 'success', summary: 'Succès', detail: 'Cette permission a bien été supprimée', life: 3000 }
              );
              this.router.navigate(['/auth', 'manage', 'scopes'])
            })
          )
          .subscribe();
      },
      reject: () => { },
    });
  }
}
