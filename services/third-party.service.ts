import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CacheProvider } from '@azlabsjs/ngx-azl-cache';
import {
  BehaviorSubject,
  catchError,
  mergeMap,
  of,
  tap,
  throwError,
} from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ThirdPartyType } from '../types';
import { SessionStorageService } from 'src/app/helpers/session-storage.service';
import { APP_STATE_CACHE_KEY } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class ThirdPartyService {
  private _app$ = new BehaviorSubject<ThirdPartyType | null>(null);
  public app$ = this._app$.asObservable();

  public url: string = environment.thirdParty.endpoints.apps;
  constructor(
    // private cacheProvider: CacheProvider,
    private httpClient: HttpClient,
    private sessionStorageService: SessionStorageService
  ) {
    try {
      let _app;

      _app = this.sessionStorageService.getItem(APP_STATE_CACHE_KEY);
      if (_app) {
        _app = JSON.parse(_app);
        this.setCurrentApp(_app);
      }
    } catch (error) {
      console.log('RELOADING APP DETAILS');
    }
  }

  setCurrentApp(app: ThirdPartyType) {
    this._app$.next(app);
  }
  getCurrentApp() {
    return this._app$.getValue();
  }

  get(
    client: { clientId: string; clientSecret: string } = {
      clientId: environment.auth.clientId,
      clientSecret: environment.auth.clientSecret,
    }
  ) {
    return this.httpClient
      .get<ThirdPartyType>(this.url, {
        headers: new HttpHeaders()
          .set('x-client-id', client.clientId)
          .set('x-client-secret', client.clientSecret),
      })
      .pipe(catchError((err) => throwError(() => err)));
  }
}
