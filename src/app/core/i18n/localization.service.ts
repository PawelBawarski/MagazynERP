import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import en from './translations/en.json';
import pl from './translations/pl.json';

export type AppLanguage = 'en' | 'pl';

/** Klucz preferencji językowej zapisanej w localStorage przeglądarki. */
export const LANGUAGE_STORAGE_KEY = 'stockflow.language';

@Injectable({ providedIn: 'root' })
export class LocalizationService {
  private readonly translate = inject(TranslateService);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  readonly language = signal<AppLanguage>(this.readLanguage());

  constructor() {
    this.translate.addLangs(['pl', 'en']);
    this.translate.setTranslation('pl', pl);
    this.translate.setTranslation('en', en);
    this.translate.setFallbackLang('pl');
    this.applyLanguage(this.language());
  }

  setLanguage(language: AppLanguage): void {
    this.language.set(language);
    this.applyLanguage(language);
  }

  private applyLanguage(language: AppLanguage): void {
    this.translate.use(language);
    this.document.documentElement.lang = language;
    this.persistLanguage(language);
  }

  private readLanguage(): AppLanguage {
    if (!isPlatformBrowser(this.platformId)) {
      return 'pl';
    }

    try {
      const storedLanguage = this.document.defaultView?.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      return storedLanguage === 'en' || storedLanguage === 'pl' ? storedLanguage : 'pl';
    } catch (error: unknown) {
      console.warn('Unable to read the saved language preference from localStorage.', error);
      return 'pl';
    }
  }

  private persistLanguage(language: AppLanguage): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      this.document.defaultView?.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (error: unknown) {
      console.warn('Unable to save the language preference to localStorage.', error);
    }
  }
}
