import { Inject, Injectable } from '@angular/core';
import { CrudService } from '../../../helpers/crud/crud.service';
import { AUTH_CONFIG_PROVIDER, AuthConfigType, RoleScopeType } from '../types';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class RoleScopeService extends CrudService<RoleScopeType> {
  public override identifier: string = 'id';

  constructor(httpClient: HttpClient, messageService$: MessageService, @Inject(AUTH_CONFIG_PROVIDER) private authConfig: AuthConfigType) {
    super(httpClient, messageService$);
    this.set_url(`${authConfig.apiHost}/api/role-scopes/`);
    this.setQueryParams({
      _query: {
        include: ["Role", "Scope"],
      },
      page: 1,
      pageSize: 50
    })
  }
}
