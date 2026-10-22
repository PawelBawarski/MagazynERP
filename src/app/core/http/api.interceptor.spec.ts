import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { apiInterceptor } from './api.interceptor';
import { AuthTokenService } from './auth-token.service';
import { HttpErrorStore } from './http-error.store';

describe('apiInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;
  let tokenService: AuthTokenService;
  let httpErrorStore: InstanceType<typeof HttpErrorStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([apiInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(AuthTokenService);
    httpErrorStore = TestBed.inject(HttpErrorStore);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('attaches an in-memory bearer token only to API requests', () => {
    tokenService.setAccessToken('test-token');
    http.get('/api/items').subscribe();
    http.get('/i18n/pl.json').subscribe();

    const apiRequest = httpTesting.expectOne('/api/items');
    const translationRequest = httpTesting.expectOne('/i18n/pl.json');

    expect(apiRequest.request.headers.get('Authorization')).toBe('Bearer test-token');
    expect(translationRequest.request.headers.has('Authorization')).toBe(false);
    apiRequest.flush([]);
    translationRequest.flush({});
  });

  it('clears the token and reports unauthorized responses while rethrowing them', () => {
    tokenService.setAccessToken('test-token');
    let receivedError = false;
    http.get('/api/private').subscribe({
      error: () => {
        receivedError = true;
      },
    });

    httpTesting
      .expectOne('/api/private')
      .flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

    expect(receivedError).toBe(true);
    expect(tokenService.getAccessToken()).toBeNull();
    expect(httpErrorStore.messageKey()).toBe('errors.unauthorized');
  });
});
