import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { apiConfig } from '../config/api.config';
import { AuthTokenService } from './auth-token.service';
import { HttpErrorStore } from './http-error.store';

export const apiInterceptor: HttpInterceptorFn = (request, next) => {
  const isApiRequest =
    request.url === apiConfig.basePath || request.url.startsWith(`${apiConfig.basePath}/`);
  const tokenService = inject(AuthTokenService);
  const httpErrorStore = inject(HttpErrorStore);
  const token = isApiRequest ? tokenService.getAccessToken() : null;
  const outgoingRequest =
    token === null
      ? request
      : request.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        });

  return next(outgoingRequest).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          tokenService.clearAccessToken();
        }
        httpErrorStore.report(error.status);
      }

      return throwError(() => error);
    }),
  );
};
