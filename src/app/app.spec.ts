import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';

import { HttpErrorStore } from './core/http/http-error.store';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([]), provideTranslateService()],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the router outlet for future pages', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('router-outlet')).not.toBeNull();
  });

  it('should render the notification dismiss icon as a decorative SVG when an error is shown', () => {
    const fixture = TestBed.createComponent(App);
    TestBed.inject(HttpErrorStore).report(500);
    fixture.detectChanges();

    const icon = (fixture.nativeElement as HTMLElement).querySelector('.http-error__dismiss svg');
    expect(icon).not.toBeNull();
    expect(icon?.getAttribute('aria-hidden')).toBe('true');
    expect(icon?.querySelectorAll('path').length).toBeGreaterThan(0);
  });

  it('should set the application version in the browser tab title', () => {
    TestBed.createComponent(App);

    expect(TestBed.inject(Title).getTitle()).toBe('StockFlow v0.0.1');
  });
});
