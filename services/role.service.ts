import { Inject, Injectable } from '@angular/core';
import { CrudService } from '../../../helpers/crud/crud.service';
import { AUTH_CONFIG_PROVIDER, AuthConfigType, RoleType } from '../types';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends CrudService<RoleType> {
  public override identifier: string = 'id';

  constructor(httpClient: HttpClient, messageService$: MessageService, @Inject(AUTH_CONFIG_PROVIDER) private authConfig: AuthConfigType) {
    super(httpClient, messageService$);
    this.set_url(`${authConfig.apiHost}/api/roles/`);
    this.setQueryParams({
      _query: {
        include: ["Scopes"],
        order: [
          ["createdAt", "DESC"]
        ]
      },
      page: 1,
      pageSize: 50
    })
  }
}
