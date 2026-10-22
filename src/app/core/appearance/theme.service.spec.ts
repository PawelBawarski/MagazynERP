import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { THEME_STORAGE_KEY, ThemeService } from './theme.service';

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    localStorage.clear();
    delete TestBed.inject(DOCUMENT).documentElement.dataset['theme'];
    TestBed.inject(DOCUMENT).documentElement.style.removeProperty('color-scheme');
    vi.restoreAllMocks();
  });

  it('starts in light mode when no theme preference has been saved', () => {
    const theme = TestBed.inject(ThemeService);
    const document = TestBed.inject(DOCUMENT);

    expect(theme.theme()).toBe('light');
    expect(document.documentElement.dataset['theme']).toBe('light');
    expect(document.documentElement.style.colorScheme).toBe('light');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
  });

  it('restores the saved dark theme and applies it on startup', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');

    const theme = TestBed.inject(ThemeService);
    const document = TestBed.inject(DOCUMENT);

    expect(theme.theme()).toBe('dark');
    expect(document.documentElement.dataset['theme']).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });

  it('updates the theme, document styles, and saved preference together', () => {
    const theme = TestBed.inject(ThemeService);
    const document = TestBed.inject(DOCUMENT);

    theme.setTheme('dark');

    expect(theme.theme()).toBe('dark');
    expect(document.documentElement.dataset['theme']).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
  });

  it('toggles between light and dark modes', () => {
    const theme = TestBed.inject(ThemeService);

    theme.toggleTheme();
    expect(theme.theme()).toBe('dark');

    theme.toggleTheme();
    expect(theme.theme()).toBe('light');
  });

  it('falls back to light mode for an unsupported saved preference', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'system');

    const theme = TestBed.inject(ThemeService);

    expect(theme.theme()).toBe('light');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
  });

  it('starts in light mode and reports when localStorage cannot be read', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Storage is disabled.', 'SecurityError');
    });

    const theme = TestBed.inject(ThemeService);

    expect(theme.theme()).toBe('light');
    expect(warning).toHaveBeenCalledWith(
      'Unable to read the saved theme preference from localStorage.',
      expect.any(DOMException),
    );
  });

  it('continues to switch themes and reports when localStorage is unavailable', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage is disabled.', 'SecurityError');
    });

    const theme = TestBed.inject(ThemeService);
    const document = TestBed.inject(DOCUMENT);

    theme.setTheme('dark');

    expect(theme.theme()).toBe('dark');
    expect(document.documentElement.dataset['theme']).toBe('dark');
    expect(warning).toHaveBeenCalledWith(
      'Unable to save the theme preference to localStorage.',
      expect.any(DOMException),
    );
  });
});
