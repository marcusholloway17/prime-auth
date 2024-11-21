import { Inject, Injectable } from '@angular/core';
import { CrudService } from '../../../helpers/crud/crud.service';
import { HttpClient } from '@angular/common/http';
import { AUTH_CONFIG_PROVIDER, AuthConfigType, ScopeType } from '../types';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ScopeService extends CrudService<ScopeType> {
  public override identifier: string = 'id';

  constructor(httpClient: HttpClient, messageService$: MessageService, @Inject(AUTH_CONFIG_PROVIDER) private authConfig: AuthConfigType) {
    super(httpClient, messageService$);
    this.set_url(`${authConfig.apiHost}/api/scopes/`);
    this.setQueryParams({
      _query: {
        order: [
          ["createdAt", "DESC"]
        ]
      },
      page: 1,
      pageSize: 50
    })
  }
}
