import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

import { isRoleId, RoleId } from '../access-control/role-permissions';

export const SESSION_STORAGE_KEY = 'stockflow.session';
export const SESSION_ROLE_STORAGE_KEY = 'stockflow.session-role';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  readonly hasSession = signal(this.readSession());
  readonly roleId = signal<RoleId | null>(this.readRole());

  enterSession(roleId: RoleId): void {
    this.hasSession.set(true);
    this.roleId.set(roleId);
    this.persistSession(roleId);
  }

  leaveSession(): void {
    this.hasSession.set(false);
    this.roleId.set(null);
    this.clearPersistedSession();
  }

  private readSession(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    try {
      return this.document.defaultView?.sessionStorage.getItem(SESSION_STORAGE_KEY) === 'active';
    } catch (error: unknown) {
      console.warn('Unable to read the session from sessionStorage.', error);
      return false;
    }
  }

  private readRole(): RoleId | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    try {
      const roleId = this.document.defaultView?.sessionStorage.getItem(SESSION_ROLE_STORAGE_KEY);
      return roleId && isRoleId(roleId) ? roleId : null;
    } catch (error: unknown) {
      console.warn('Unable to read the session role from sessionStorage.', error);
      return null;
    }
  }

  private persistSession(roleId: RoleId): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      this.document.defaultView?.sessionStorage.setItem(SESSION_STORAGE_KEY, 'active');
      this.document.defaultView?.sessionStorage.setItem(SESSION_ROLE_STORAGE_KEY, roleId);
    } catch (error: unknown) {
      console.warn('Unable to save the session to sessionStorage.', error);
    }
  }

  private clearPersistedSession(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      this.document.defaultView?.sessionStorage.removeItem(SESSION_STORAGE_KEY);
      this.document.defaultView?.sessionStorage.removeItem(SESSION_ROLE_STORAGE_KEY);
    } catch (error: unknown) {
      console.warn('Unable to clear the session from sessionStorage.', error);
    }
  }
}
