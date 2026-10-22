import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SESSION_ROLE_STORAGE_KEY, SESSION_STORAGE_KEY, SessionService } from './session.service';

describe('SessionService', () => {
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it('restores the explicitly marked session from sessionStorage', () => {
    sessionStorage.setItem(SESSION_STORAGE_KEY, 'active');
    sessionStorage.setItem(SESSION_ROLE_STORAGE_KEY, 'office-worker');

    const session = TestBed.inject(SessionService);

    expect(session.hasSession()).toBe(true);
    expect(session.roleId()).toBe('office-worker');
  });

  it('enters a session and persists it only for the current browser tab', () => {
    const session = TestBed.inject(SessionService);

    session.enterSession('administrator');

    expect(session.hasSession()).toBe(true);
    expect(session.roleId()).toBe('administrator');
    expect(sessionStorage.getItem(SESSION_STORAGE_KEY)).toBe('active');
    expect(sessionStorage.getItem(SESSION_ROLE_STORAGE_KEY)).toBe('administrator');
    expect(localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull();
  });

  it('clears the session on exit', () => {
    sessionStorage.setItem(SESSION_STORAGE_KEY, 'active');
    const session = TestBed.inject(SessionService);

    session.leaveSession();

    expect(session.hasSession()).toBe(false);
    expect(sessionStorage.getItem(SESSION_STORAGE_KEY)).toBeNull();
    expect(sessionStorage.getItem(SESSION_ROLE_STORAGE_KEY)).toBeNull();
  });

  it('does not restore an unrecognized session value', () => {
    sessionStorage.setItem(SESSION_STORAGE_KEY, 'authenticated');

    const session = TestBed.inject(SessionService);

    expect(session.hasSession()).toBe(false);
  });

  it('reports storage failures without blocking entry into the current-tab session', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage is disabled.', 'SecurityError');
    });

    const session = TestBed.inject(SessionService);
    session.enterSession('office-worker');

    expect(session.hasSession()).toBe(true);
    expect(warning).toHaveBeenCalledWith(
      'Unable to save the session to sessionStorage.',
      expect.any(DOMException),
    );
  });

  it('reports failures when clearing storage but leaves the session', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new DOMException('Storage is disabled.', 'SecurityError');
    });

    const session = TestBed.inject(SessionService);
    session.enterSession('office-worker');
    session.leaveSession();

    expect(session.hasSession()).toBe(false);
    expect(warning).toHaveBeenCalledWith(
      'Unable to clear the session from sessionStorage.',
      expect.any(DOMException),
    );
  });

  it('reports failures when reading the saved session', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Storage is disabled.', 'SecurityError');
    });

    const session = TestBed.inject(SessionService);
    expect(session.hasSession()).toBe(false);
    expect(warning).toHaveBeenCalledWith(
      'Unable to read the session from sessionStorage.',
      expect.any(DOMException),
    );
  });

  it('does not restore an unknown role from sessionStorage', () => {
    sessionStorage.setItem(SESSION_STORAGE_KEY, 'active');
    sessionStorage.setItem(SESSION_ROLE_STORAGE_KEY, 'superuser');

    const session = TestBed.inject(SessionService);

    expect(session.hasSession()).toBe(true);
    expect(session.roleId()).toBeNull();
  });
});
