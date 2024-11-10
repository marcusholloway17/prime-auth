import { Inject, Injectable } from '@angular/core';
import { CrudService } from '../../../helpers/crud/crud.service';
import { AUTH_CONFIG_PROVIDER, AuthConfigType, RoleType } from '../types';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends CrudService<RoleType> {
  public override identifier: string = 'id';

  constructor(httpClient: HttpClient, @Inject(AUTH_CONFIG_PROVIDER) private authConfig: AuthConfigType) {
    super(httpClient);
    this.set_url(`${authConfig.apiHost}/api/roles/`);
    this.setQueryParams({
      _query: {
        include: ["Scopes"],
      },
      page: 1,
      pageSize: 50
    })
  }
}
