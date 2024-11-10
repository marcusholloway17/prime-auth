import { Inject, Injectable } from '@angular/core';
import { CrudService } from '../../../helpers/crud/crud.service';
import { HttpClient } from '@angular/common/http';
import { AUTH_CONFIG_PROVIDER, AuthConfigType, ScopeType } from '../types';

@Injectable({
  providedIn: 'root'
})
export class ScopeService extends CrudService<ScopeType> {
  public override identifier: string = 'id';

  constructor(httpClient: HttpClient, @Inject(AUTH_CONFIG_PROVIDER) private authConfig: AuthConfigType) {
    super(httpClient);
    this.set_url(`${authConfig.apiHost}/api/scopes/`);
    this.setQueryParams({
      _query: {
        include: ["Roles"],
      },
      page: 1,
      pageSize: 50
    })
  }
}
