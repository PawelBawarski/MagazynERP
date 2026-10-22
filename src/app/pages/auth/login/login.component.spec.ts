import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { afterEach } from 'vitest';

import { routes } from '../../../app.routes';
import { SESSION_ROLE_STORAGE_KEY, SESSION_STORAGE_KEY } from '../../../core/auth/session.service';

import { LoginComponent } from './login.component';

function getLoginElement(harness: RouterTestingHarness): HTMLElement {
  const element = harness.routeNativeElement;
  if (!element) {
    throw new Error('The login route did not render.');
  }

  return element;
}

describe('LoginComponent', () => {
  afterEach(() => {
    sessionStorage.clear();
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideRouter(routes), provideTranslateService({ fallbackLang: 'pl' })],
    }).compileComponents();
  });

  it('shows the login form and language picker', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('input[type="email"]')).not.toBeNull();
    expect(element.querySelector('input[type="password"]')).not.toBeNull();
    expect(element.querySelector('select[aria-label]')).not.toBeNull();
  });

  it('renders the submit action icon as an accessible decorative SVG', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('.submit-button svg');
    expect(icon).not.toBeNull();
    expect(icon?.getAttribute('aria-hidden')).toBe('true');
    expect(icon?.querySelectorAll('path').length).toBeGreaterThan(0);
  });

  it('shows the current application version', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('wersja 0.0.1');
  });

  it('marks required fields invalid after an empty submission', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#email')?.getAttribute('aria-invalid')).toBe(
      'true',
    );
    expect(fixture.nativeElement.querySelector('#password')?.getAttribute('aria-invalid')).toBe(
      'true',
    );
  });

  it('opens the workspace after valid form input', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/login?returnUrl=%2Fapp%2Fdashboard');
    harness.detectChanges();

    const element = getLoginElement(harness);
    const email = element.querySelector('#email') as HTMLInputElement;
    const password = element.querySelector('#password') as HTMLInputElement;
    email.value = 'operator@example.com';
    email.dispatchEvent(new Event('input', { bubbles: true }));
    password.value = 'example-password';
    password.dispatchEvent(new Event('input', { bubbles: true }));

    const form = element.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    harness.detectChanges();
    await harness.fixture.whenStable();

    expect(sessionStorage.getItem(SESSION_STORAGE_KEY)).toBe('active');
    expect(sessionStorage.getItem(SESSION_ROLE_STORAGE_KEY)).toBe('office-worker');
    expect(TestBed.inject(Router).url).toBe('/app/dashboard');
  });

  it('assigns the Administrator interface role only for the configured login pair', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/login');
    harness.detectChanges();

    const element = getLoginElement(harness);
    const email = element.querySelector('#email') as HTMLInputElement;
    const password = element.querySelector('#password') as HTMLInputElement;
    email.value = 'admin@admin.pl';
    email.dispatchEvent(new Event('input', { bubbles: true }));
    password.value = 'admin';
    password.dispatchEvent(new Event('input', { bubbles: true }));
    element
      .querySelector('form')
      ?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    harness.detectChanges();
    await harness.fixture.whenStable();

    expect(sessionStorage.getItem(SESSION_ROLE_STORAGE_KEY)).toBe('administrator');
  });

  it('does not enter the workspace while form validation fails', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/login');
    harness.detectChanges();

    const element = getLoginElement(harness);
    const form = element.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    harness.detectChanges();
    await harness.fixture.whenStable();

    expect(sessionStorage.getItem(SESSION_STORAGE_KEY)).toBeNull();
    expect(TestBed.inject(Router).url).toBe('/login');
  });

  it('does not navigate to an external return URL', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/login?returnUrl=%2F%2Fexternal.example');
    harness.detectChanges();

    const element = getLoginElement(harness);
    const email = element.querySelector('#email') as HTMLInputElement;
    const password = element.querySelector('#password') as HTMLInputElement;
    email.value = 'operator@example.com';
    email.dispatchEvent(new Event('input', { bubbles: true }));
    password.value = 'example-password';
    password.dispatchEvent(new Event('input', { bubbles: true }));

    const form = element.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    harness.detectChanges();
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/app/dashboard');
  });
});
