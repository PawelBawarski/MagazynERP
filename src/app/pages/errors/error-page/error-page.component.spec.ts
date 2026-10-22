import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { TranslateService, provideTranslateService } from '@ngx-translate/core';
import { describe, expect, it } from 'vitest';

import { routes } from '../../../app.routes';
import { ErrorPageComponent, parseHttpErrorStatus } from './error-page.component';

describe('parseHttpErrorStatus', () => {
  it.each([400, 401, 403, 404, 500] as const)('accepts the supported status %i', (status) => {
    expect(parseHttpErrorStatus(String(status))).toBe(status);
  });

  it.each([null, '418', 'not-a-status'])('uses 404 for unsupported status %s', (status) => {
    expect(parseHttpErrorStatus(status)).toBe(404);
  });
});

describe('ErrorPageComponent routing', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes), provideTranslateService()],
    });

    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      errorPages: {
        400: { title: 'Invalid request', description: 'Request failed.' },
        401: { title: 'Sign-in required', description: 'Please sign in.' },
        403: { title: 'Access denied', description: 'Not allowed.' },
        404: { title: 'Page not found', description: 'No page here.' },
        500: { title: 'Server error', description: 'Try again.' },
        errorCode: 'Error code',
        backToLogin: 'Back to sign in',
      },
    });
    translate.use('en');
  });

  it('shows the matching error page and offers a login route', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/errors/403');

    expect(harness.routeNativeElement?.textContent).toContain('403');
    expect(harness.routeNativeElement?.textContent).toContain('Access denied');
    expect(harness.routeNativeElement?.querySelector('a[routerLink="/login"]')).not.toBeNull();
  });

  it('shows a 404 page for an unsupported error route status', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/errors/418');

    expect(harness.routeNativeElement?.textContent).toContain('404');
    expect(harness.routeNativeElement?.textContent).toContain('Page not found');
  });

  it('can return to the login route', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/errors/401');

    const router = TestBed.inject(Router);
    await router.navigateByUrl('/login');

    expect(router.url).toBe('/login');
  });
});
