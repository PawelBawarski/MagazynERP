import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { HttpErrorStore } from './http-error.store';

describe('HttpErrorStore', () => {
  it.each([
    [0, 'errors.network'],
    [401, 'errors.unauthorized'],
    [403, 'errors.forbidden'],
    [422, 'errors.generic'],
    [500, 'errors.server'],
  ])('maps HTTP status %i to its message', (status, messageKey) => {
    const store = TestBed.inject(HttpErrorStore);

    store.report(status);

    expect(store.messageKey()).toBe(messageKey);
    expect(store.status()).toBe(status);
  });

  it('clears the current message', () => {
    const store = TestBed.inject(HttpErrorStore);
    store.report(500);

    store.clear();

    expect(store.messageKey()).toBeNull();
    expect(store.status()).toBeNull();
  });
});
