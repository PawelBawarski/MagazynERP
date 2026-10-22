import { RoleId } from '../access-control/role-permissions';

export type UserStatusFilter = 'all' | 'active' | 'inactive';
export type UserSortField = 'firstName' | 'lastName' | 'roleId' | 'isActive';
export type SortDirection = 'asc' | 'desc';

export interface Employee {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly roleId: RoleId;
  readonly isActive: boolean;
}

export interface NewEmployee {
  readonly firstName: string;
  readonly lastName: string;
  readonly roleId: RoleId;
}

export interface EmployeeQuery {
  readonly offset: number;
  readonly limit: number;
  readonly search: string;
  readonly status: UserStatusFilter;
  readonly sortBy: UserSortField;
  readonly sortDirection: SortDirection;
}

export interface EmployeePage {
  readonly items: readonly Employee[];
  readonly totalCount: number;
}

export type EmployeeDirectoryErrorCode = 'not-found' | 'already-inactive' | 'invalid-input';

export class EmployeeDirectoryError extends Error {
  constructor(readonly code: EmployeeDirectoryErrorCode) {
    super(code);
    this.name = 'EmployeeDirectoryError';
  }
}
