import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { beforeEach, describe, expect, it } from 'vitest';

import { SessionService } from '../../core/auth/session.service';
import { MockUserDirectoryAdapter } from '../../core/mocks/mock-user-directory.adapter';
import { USER_DIRECTORY_PORT, UserDirectoryService } from '../../core/users/user-directory.service';
import { UserManagementComponent } from './user-management.component';

function openAddDialog(element: HTMLElement): HTMLDialogElement {
  const dialog = element.querySelector('dialog') as HTMLDialogElement;
  Object.assign(dialog, {
    close: () => dialog.removeAttribute('open'),
    showModal: () => dialog.setAttribute('open', ''),
  });
  element.querySelector('.users__add-button')?.dispatchEvent(new Event('click'));
  return dialog;
}

describe('UserManagementComponent', () => {
  beforeEach(async () => {
    sessionStorage.clear();
    await TestBed.configureTestingModule({
      imports: [UserManagementComponent],
      providers: [
        provideTranslateService({ fallbackLang: 'pl' }),
        { provide: USER_DIRECTORY_PORT, useClass: MockUserDirectoryAdapter },
      ],
    }).compileComponents();
  });

  it('adds a user from the modal form when the form is submitted with Enter', () => {
    TestBed.inject(SessionService).enterSession('office-worker');
    const fixture = TestBed.createComponent(UserManagementComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const dialog = openAddDialog(element);
    fixture.detectChanges();
    expect(dialog.open).toBe(true);

    const firstName = element.querySelector('#employee-first-name') as HTMLInputElement;
    const lastName = element.querySelector('#employee-last-name') as HTMLInputElement;
    const position = element.querySelector('#employee-role') as HTMLSelectElement;
    firstName.value = 'Anna';
    firstName.dispatchEvent(new Event('input', { bubbles: true }));
    firstName.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    lastName.value = 'Kowalska';
    lastName.dispatchEvent(new Event('input', { bubbles: true }));
    position.value = 'office-worker';
    position.dispatchEvent(new Event('change', { bubbles: true }));
    element
      .querySelector('form')
      ?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(element.textContent).toContain('Anna');
    expect(element.textContent).toContain('Kowalska');
    expect(element.querySelector('.users__deactivate svg')?.getAttribute('aria-hidden')).toBe(
      'true',
    );
    expect(dialog.open).toBe(false);
  });

  it('keeps the add-user modal open after Escape or a backdrop cancellation', () => {
    TestBed.inject(SessionService).enterSession('office-worker');
    const fixture = TestBed.createComponent(UserManagementComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const dialog = openAddDialog(element);
    fixture.detectChanges();

    const cancelEvent = new Event('cancel', { cancelable: true });
    dialog.dispatchEvent(cancelEvent);
    dialog.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    expect(cancelEvent.defaultPrevented).toBe(true);
    expect(dialog.open).toBe(true);

    element
      .querySelector('.users__form-actions button[type="button"]')
      ?.dispatchEvent(new Event('click', { bubbles: true }));
    fixture.detectChanges();
    expect(dialog.open).toBe(false);
  });

  it('does not offer the Administrator position to an office worker', () => {
    TestBed.inject(SessionService).enterSession('office-worker');
    const fixture = TestBed.createComponent(UserManagementComponent);
    fixture.detectChanges();

    openAddDialog(fixture.nativeElement as HTMLElement);
    fixture.detectChanges();

    const options = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLOptionElement>(
        '#employee-role option',
      ),
    );
    expect(options.map((option) => option.value)).not.toContain('administrator');
  });

  it('offers the Administrator position to an administrator', () => {
    TestBed.inject(SessionService).enterSession('administrator');
    const fixture = TestBed.createComponent(UserManagementComponent);
    fixture.detectChanges();

    openAddDialog(fixture.nativeElement as HTMLElement);
    fixture.detectChanges();

    const options = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLOptionElement>(
        '#employee-role option',
      ),
    );
    expect(options.map((option) => option.value)).toContain('administrator');
  });

  it('deactivates a user and removes the active action from that row', () => {
    TestBed.inject(SessionService).enterSession('administrator');
    TestBed.inject(UserDirectoryService).add({
      firstName: 'Anna',
      lastName: 'Kowalska',
      roleId: 'office-worker',
    });
    const fixture = TestBed.createComponent(UserManagementComponent);
    fixture.detectChanges();

    (fixture.nativeElement as HTMLElement)
      .querySelector('.users__deactivate')
      ?.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.users__status--inactive')).not.toBeNull();
    expect(element.querySelector('.users__deactivate')).toBeNull();
  });

  it('places deactivation in its own narrow actions column', () => {
    TestBed.inject(SessionService).enterSession('administrator');
    TestBed.inject(UserDirectoryService).add({
      firstName: 'Anna',
      lastName: 'Kowalska',
      roleId: 'office-worker',
    });
    const fixture = TestBed.createComponent(UserManagementComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const headers = Array.from(element.querySelectorAll('th'));
    const actionHeaderIndex = headers.findIndex((header) =>
      header.textContent?.includes('users.actions'),
    );
    const row = element.querySelector('tbody tr');
    const cells = Array.from(row?.querySelectorAll('td') ?? []);

    expect(actionHeaderIndex).toBe(4);
    expect(cells).toHaveLength(5);
    expect(cells[actionHeaderIndex]?.querySelector('.users__deactivate')).not.toBeNull();
  });

  it('loads the next page when the list is scrolled to its end', () => {
    TestBed.inject(SessionService).enterSession('administrator');
    const directory = TestBed.inject(UserDirectoryService);
    for (let index = 0; index < 21; index += 1) {
      directory.add({
        firstName: `First${index}`,
        lastName: `Last${index}`,
        roleId: 'office-worker',
      });
    }

    const fixture = TestBed.createComponent(UserManagementComponent);
    fixture.detectChanges();
    const list = (fixture.nativeElement as HTMLElement).querySelector(
      '.users__table-scroll',
    ) as HTMLElement;
    Object.defineProperties(list, {
      clientHeight: { configurable: true, value: 500 },
      scrollHeight: { configurable: true, value: 1000 },
      scrollTop: { configurable: true, value: 600 },
    });
    list.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();

    expect(list.querySelectorAll('tbody tr')).toHaveLength(21);
  });
});
