import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { apiConfig } from '../../../../core/config/api.config';
import { LoginResponse } from './auth-api.models';
import { AuthApiService } from './auth-api.service';

describe('AuthApiService', () => {
  let service: AuthApiService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AuthApiService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('posts credentials to the login endpoint and returns the server session data', () => {
    const credentials = { email: 'user@example.com', password: 'secure-password' };
    const response = {
      accessToken: 'access-token',
      user: { id: 'user-1', roleId: 'office-worker' as const },
    };
    let receivedResponse: LoginResponse | undefined;

    service.login(credentials).subscribe((result) => {
      receivedResponse = result;
    });

    const request = httpTesting.expectOne(`${apiConfig.basePath}/auth/login`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(credentials);
    request.flush(response);

    expect(receivedResponse).toEqual(response);
  });

  it('propagates login API errors to the caller', () => {
    let receivedStatus: number | undefined;

    service.login({ email: 'user@example.com', password: 'wrong-password' }).subscribe({
      error: (error: { status: number }) => {
        receivedStatus = error.status;
      },
    });

    httpTesting
      .expectOne(`${apiConfig.basePath}/auth/login`)
      .flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

    expect(receivedStatus).toBe(401);
  });
});
