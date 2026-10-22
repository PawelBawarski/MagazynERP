import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { TranslateService, provideTranslateService } from '@ngx-translate/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LANGUAGE_STORAGE_KEY, LocalizationService } from './localization.service';

describe('LocalizationService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideTranslateService({ fallbackLang: 'pl' })],
    });
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('starts in Polish when no language preference has been saved', () => {
    const localization = TestBed.inject(LocalizationService);
    const document = TestBed.inject(DOCUMENT);

    expect(localization.language()).toBe('pl');
    expect(document.documentElement.lang).toBe('pl');
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('pl');
  });

  it('restores the saved language and applies its translations on startup', () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, 'en');

    const localization = TestBed.inject(LocalizationService);
    const translate = TestBed.inject(TranslateService);
    const document = TestBed.inject(DOCUMENT);

    expect(localization.language()).toBe('en');
    expect(document.documentElement.lang).toBe('en');
    expect(translate.instant('login.title')).toBe('Welcome back');
  });

  it('updates the active translation, document language, and saved preference together', () => {
    const localization = TestBed.inject(LocalizationService);
    const translate = TestBed.inject(TranslateService);
    const document = TestBed.inject(DOCUMENT);

    localization.setLanguage('en');

    expect(localization.language()).toBe('en');
    expect(document.documentElement.lang).toBe('en');
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('en');
    expect(translate.instant('login.submit')).toBe('Continue');
  });

  it('falls back to Polish for an unsupported saved language', () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, 'fr');

    const localization = TestBed.inject(LocalizationService);

    expect(localization.language()).toBe('pl');
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('pl');
  });

  it('starts in Polish and reports when localStorage cannot be read', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Storage is disabled.', 'SecurityError');
    });

    const localization = TestBed.inject(LocalizationService);

    expect(localization.language()).toBe('pl');
    expect(warning).toHaveBeenCalledWith(
      'Unable to read the saved language preference from localStorage.',
      expect.any(DOMException),
    );
  });

  it('continues to switch language and reports when localStorage is unavailable', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage is disabled.', 'SecurityError');
    });

    const localization = TestBed.inject(LocalizationService);
    const document = TestBed.inject(DOCUMENT);

    localization.setLanguage('en');

    expect(localization.language()).toBe('en');
    expect(document.documentElement.lang).toBe('en');
    expect(warning).toHaveBeenCalledWith(
      'Unable to save the language preference to localStorage.',
      expect.any(DOMException),
    );
  });
});
