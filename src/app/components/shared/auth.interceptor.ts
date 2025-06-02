import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { KeycloakService } from './auth.keycloak.service';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private keycloak: KeycloakService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.keycloak.getToken()).pipe(
      switchMap((token: string | undefined) => {
        const cloned = token
          ? req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          })
          : req;
        return next.handle(cloned);
      })
    );
  }
}
