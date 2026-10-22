import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { LucideUserRoundX } from '@lucide/angular';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import {
  ASSIGN_ADMINISTRATOR_PERMISSION,
  hasPermission,
  isRoleId,
  ROLE_DEFINITIONS,
  RoleId,
} from '../../core/access-control/role-permissions';
import { SessionService } from '../../core/auth/session.service';
import {
  Employee,
  EmployeeDirectoryError,
  SortDirection,
  UserSortField,
  UserStatusFilter,
} from '../../core/users/user-directory.models';
import { UserDirectoryService } from '../../core/users/user-directory.service';
import { serializeEmployeesCsv } from './employee-report';

const PAGE_SIZE = 20;
const ROLE_IDS = Object.keys(ROLE_DEFINITIONS) as RoleId[];

/**
 * Umożliwia Administratorowi i Pracownikowi biurowemu przeglądanie, dodawanie
 * pracowników w oknie modalnym oraz dezaktywowanie aktywnych kont. Okno zamyka
 * się po zapisie lub anulowaniu, a rola Administratora jest dostępna wyłącznie
 * dla Administratora. Lista i raport obejmują wszystkie pasujące rekordy; dane
 * nie przetrwają odświeżenia strony.
 */
@Component({
  selector: 'app-user-management',
  imports: [LucideUserRoundX, MatTableModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementComponent {
  private readonly document = inject(DOCUMENT);
  private readonly employeeDialog =
    viewChild.required<ElementRef<HTMLDialogElement>>('employeeDialog');
  private readonly formBuilder = inject(FormBuilder);
  private readonly session = inject(SessionService);
  private readonly translate = inject(TranslateService);
  private readonly userDirectory = inject(UserDirectoryService);
  private readonly roleId = this.session.roleId;

  protected readonly columns = ['firstName', 'lastName', 'position', 'isActive', 'actions'];
  protected readonly employees = signal<readonly Employee[]>([]);
  protected readonly reportEmployees = signal<readonly Employee[]>([]);
  protected readonly search = signal('');
  protected readonly statusFilter = signal<UserStatusFilter>('all');
  protected readonly sortBy = signal<UserSortField>('lastName');
  protected readonly sortDirection = signal<SortDirection>('asc');
  protected readonly totalCount = signal(0);
  protected readonly hasMore = signal(false);
  protected readonly errorKey = signal<string | null>(null);
  protected readonly successKey = signal<string | null>(null);
  protected readonly availableRoles = computed(() => {
    const canAssignAdministrator = hasPermission(
      this.roleId() ?? '',
      ASSIGN_ADMINISTRATOR_PERMISSION,
    );
    return ROLE_IDS.filter((roleId) => canAssignAdministrator || roleId !== 'administrator');
  });

  protected readonly employeeForm = this.formBuilder.nonNullable.group({
    firstName: ['', [Validators.required, Validators.pattern(/\S/)]],
    lastName: ['', [Validators.required, Validators.pattern(/\S/)]],
    roleId: ['', Validators.required],
  });

  constructor() {
    this.reload();
  }

  protected roleName(roleId: RoleId): string {
    return this.translate.instant(`users.roles.${roleId}`);
  }

  protected statusName(isActive: boolean): string {
    return this.translate.instant(isActive ? 'users.active' : 'users.inactive');
  }

  protected sort(field: UserSortField): void {
    if (this.sortBy() === field) {
      this.sortDirection.update((direction) => (direction === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortBy.set(field);
      this.sortDirection.set('asc');
    }
    this.reload();
  }

  protected sortAriaValue(field: UserSortField): 'ascending' | 'descending' | 'none' {
    return this.sortBy() !== field
      ? 'none'
      : this.sortDirection() === 'asc'
        ? 'ascending'
        : 'descending';
  }

  protected sortIndicator(field: UserSortField): string {
    return this.sortBy() !== field ? '' : this.sortDirection() === 'asc' ? '↑' : '↓';
  }

  protected onSearch(event: Event): void {
    const target = event.target;
    this.search.set(target instanceof HTMLInputElement ? target.value : '');
    this.reload();
  }

  protected onStatusFilter(event: Event): void {
    const target = event.target;
    const value = target instanceof HTMLSelectElement ? target.value : 'all';
    this.statusFilter.set(isUserStatusFilter(value) ? value : 'all');
    this.reload();
  }

  protected onListScroll(event: Event): void {
    const target = event.target;
    if (
      target instanceof HTMLElement &&
      target.scrollTop + target.clientHeight >= target.scrollHeight - 80
    ) {
      this.loadMore();
    }
  }

  protected loadMore(): void {
    if (!this.hasMore()) {
      return;
    }

    this.loadPage(this.employees().length);
  }

  protected openForm(): void {
    const dialog = this.employeeDialog().nativeElement;
    if (!dialog.open) {
      dialog.showModal();
    }
    this.errorKey.set(null);
    this.successKey.set(null);
  }

  protected closeForm(): void {
    const dialog = this.employeeDialog().nativeElement;
    if (dialog.open) {
      dialog.close();
    }
    this.employeeForm.reset({ firstName: '', lastName: '', roleId: '' });
    this.errorKey.set(null);
  }

  protected preventDialogDismiss(event: Event): void {
    event.preventDefault();
  }

  protected addEmployee(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const value = this.employeeForm.getRawValue();
    if (!isRoleId(value.roleId)) {
      this.errorKey.set('users.errors.invalidInput');
      return;
    }
    if (!this.availableRoles().includes(value.roleId)) {
      this.errorKey.set('users.errors.invalidInput');
      return;
    }

    try {
      this.userDirectory.add({
        firstName: value.firstName,
        lastName: value.lastName,
        roleId: value.roleId,
      });
      this.employeeForm.reset({ firstName: '', lastName: '', roleId: '' });
      this.employeeDialog().nativeElement.close();
      this.successKey.set('users.addSuccess');
      this.reload();
    } catch (error: unknown) {
      this.handleDirectoryError(error, 'users.errors.save');
    }
  }

  protected deactivate(employee: Employee): void {
    try {
      this.userDirectory.deactivate(employee.id);
      this.successKey.set('users.deactivateSuccess');
      this.reload();
    } catch (error: unknown) {
      this.handleDirectoryError(error, 'users.errors.deactivate');
    }
  }

  protected exportCsv(): void {
    const csv = serializeEmployeesCsv(this.reportEmployees(), (key) => this.translate.instant(key));
    const browserWindow = this.document.defaultView;
    if (!browserWindow) {
      throw new Error('CSV export requires a browser document.');
    }

    const url = browserWindow.URL.createObjectURL(
      new Blob([csv], { type: 'text/csv;charset=utf-8' }),
    );
    const link = this.document.createElement('a');
    link.href = url;
    link.download = 'stockflow-employees.csv';
    this.document.body.append(link);
    link.click();
    link.remove();
    browserWindow.setTimeout(() => browserWindow.URL.revokeObjectURL(url), 0);
  }

  protected exportPdf(): void {
    const browserWindow = this.document.defaultView;
    if (!browserWindow) {
      throw new Error('PDF export requires a browser document.');
    }
    browserWindow.print();
  }

  private reload(): void {
    this.errorKey.set(null);
    this.reportEmployees.set(this.userDirectory.getAll());
    this.employees.set([]);
    this.totalCount.set(0);
    this.hasMore.set(false);
    this.loadPage(0);
  }

  private loadPage(offset: number): void {
    try {
      const page = this.userDirectory.getPage({
        offset,
        limit: PAGE_SIZE,
        search: this.search(),
        status: this.statusFilter(),
        sortBy: this.sortBy(),
        sortDirection: this.sortDirection(),
      });
      this.employees.update((current) => (offset === 0 ? page.items : [...current, ...page.items]));
      this.totalCount.set(page.totalCount);
      this.hasMore.set(offset + page.items.length < page.totalCount);
    } catch (error: unknown) {
      this.handleDirectoryError(error, 'users.errors.load');
    }
  }

  private handleDirectoryError(error: unknown, fallbackKey: string): void {
    if (error instanceof EmployeeDirectoryError) {
      this.errorKey.set(directoryErrorKey(error));
      return;
    }
    console.error('The user directory operation failed.', error);
    this.errorKey.set(fallbackKey);
  }
}

function isUserStatusFilter(value: string): value is UserStatusFilter {
  return value === 'all' || value === 'active' || value === 'inactive';
}

function directoryErrorKey(error: EmployeeDirectoryError): string {
  switch (error.code) {
    case 'already-inactive':
      return 'users.errors.alreadyInactive';
    case 'invalid-input':
      return 'users.errors.invalidInput';
    case 'not-found':
      return 'users.errors.notFound';
  }
}
