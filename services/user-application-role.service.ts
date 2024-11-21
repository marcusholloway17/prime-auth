import { Inject, Injectable } from '@angular/core';
import { CrudService } from '../../../helpers/crud/crud.service';
import { AUTH_CONFIG_PROVIDER, AuthConfigType, UserApplicationRoleType } from '../types';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class UserApplicationRoleService extends CrudService<UserApplicationRoleType> {
  public override identifier: string = 'userApplicationRoleId';

  constructor(httpClient: HttpClient, messageService$: MessageService, @Inject(AUTH_CONFIG_PROVIDER) private authConfig: AuthConfigType) {
    super(httpClient, messageService$);
    this.set_url(`${authConfig.apiHost}/api/user-application-roles/`);
    this.setQueryParams({
      _query: {
        include: ["User", "Role"],
      },
      page: 1,
      pageSize: 50
    })
  }
}
