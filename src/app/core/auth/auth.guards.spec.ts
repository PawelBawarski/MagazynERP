import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { describe, expect, it } from 'vitest';

import {
  guestOnlyGuard,
  productCatalogReadGuard,
  sessionGuard,
  userManagementGuard,
} from './auth.guards';
import { SessionService } from './session.service';

@Component({ template: 'login' })
class LoginStubComponent {}

@Component({ template: 'dashboard' })
class DashboardStubComponent {}

describe('authentication route guards', () => {
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      imports: [LoginStubComponent, DashboardStubComponent],
      providers: [
        provideRouter([
          {
            path: 'login',
            canActivate: [guestOnlyGuard],
            component: LoginStubComponent,
          },
          {
            path: 'app/dashboard',
            canActivate: [sessionGuard],
            component: DashboardStubComponent,
          },
          {
            path: 'app/users',
            canActivate: [userManagementGuard],
            component: DashboardStubComponent,
          },
          {
            path: 'app/products',
            canActivate: [productCatalogReadGuard],
            component: DashboardStubComponent,
          },
        ]),
      ],
    });
  });

  it('redirects a visitor away from a protected page and preserves the internal return URL', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/app/dashboard');

    const router = TestBed.inject(Router);
    expect(router.url).toBe('/login?returnUrl=%2Fapp%2Fdashboard');
    expect(harness.routeNativeElement?.textContent).toContain('login');
  });

  it('allows a visitor with an active session to open the protected page', async () => {
    TestBed.inject(SessionService).enterSession('office-worker');
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/app/dashboard');

    expect(TestBed.inject(Router).url).toBe('/app/dashboard');
    expect(harness.routeNativeElement?.textContent).toContain('dashboard');
  });

  it('redirects an active session away from the login page', async () => {
    TestBed.inject(SessionService).enterSession('office-worker');
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/login');

    expect(TestBed.inject(Router).url).toBe('/app/dashboard');
    expect(harness.routeNativeElement?.textContent).toContain('dashboard');
  });

  it('allows user management only for the approved roles', async () => {
    TestBed.inject(SessionService).enterSession('warehouse-clerk');
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/app/users');

    expect(TestBed.inject(Router).url).toBe('/app/dashboard');
  });

  it('allows an administrator to open user management', async () => {
    TestBed.inject(SessionService).enterSession('administrator');
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/app/users');

    expect(TestBed.inject(Router).url).toBe('/app/users');
  });

  it('allows an office worker to open user management', async () => {
    TestBed.inject(SessionService).enterSession('office-worker');
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/app/users');

    expect(TestBed.inject(Router).url).toBe('/app/users');
  });

  it('allows each approved role to read the product catalog', async () => {
    const harness = await RouterTestingHarness.create();

    for (const roleId of [
      'administrator',
      'office-worker',
      'warehouse-clerk',
      'warehouse-operative',
    ] as const) {
      TestBed.inject(SessionService).enterSession(roleId);
      await harness.navigateByUrl('/app/dashboard');
      await harness.navigateByUrl('/app/products');
      expect(TestBed.inject(Router).url).toBe('/app/products');
    }
  });

  it('redirects to the dashboard when no role is available for the product catalog', async () => {
    TestBed.inject(SessionService).hasSession.set(true);
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/app/products');

    expect(TestBed.inject(Router).url).toBe('/app/dashboard');
    expect(harness.routeNativeElement?.textContent).toContain('dashboard');
  });
});
