import { Injectable } from '@angular/core';

import { isRoleId, ROLE_DEFINITIONS } from '../access-control/role-permissions';
import {
  Employee,
  EmployeeDirectoryError,
  EmployeePage,
  EmployeeQuery,
  NewEmployee,
} from '../users/user-directory.models';
import { UserDirectoryPort } from '../users/user-directory.port';

@Injectable({ providedIn: 'root' })
export class MockUserDirectoryAdapter implements UserDirectoryPort {
  private nextId = 1;
  private employees: Employee[] = [];

  add(input: NewEmployee): Employee {
    const firstName = input.firstName.trim();
    const lastName = input.lastName.trim();
    if (!firstName || !lastName || !isRoleId(input.roleId)) {
      throw new EmployeeDirectoryError('invalid-input');
    }

    const employee: Employee = {
      id: `employee-${this.nextId}`,
      firstName,
      lastName,
      roleId: input.roleId,
      isActive: true,
    };
    this.nextId += 1;
    this.employees = [...this.employees, employee];
    return employee;
  }

  deactivate(id: string): Employee {
    const employee = this.employees.find((candidate) => candidate.id === id);
    if (!employee) {
      throw new EmployeeDirectoryError('not-found');
    }
    if (!employee.isActive) {
      throw new EmployeeDirectoryError('already-inactive');
    }

    const deactivatedEmployee = { ...employee, isActive: false };
    this.employees = this.employees.map((candidate) =>
      candidate.id === id ? deactivatedEmployee : candidate,
    );
    return deactivatedEmployee;
  }

  getAll(): readonly Employee[] {
    return this.employees.map((employee) => ({ ...employee }));
  }

  getPage(query: EmployeeQuery): EmployeePage {
    const search = query.search.trim().toLocaleLowerCase();
    const filtered = this.employees.filter((employee) => {
      const matchesSearch =
        !search ||
        `${employee.firstName} ${employee.lastName} ${ROLE_DEFINITIONS[employee.roleId].name}`
          .toLocaleLowerCase()
          .includes(search);
      const matchesStatus =
        query.status === 'all' ||
        (query.status === 'active' && employee.isActive) ||
        (query.status === 'inactive' && !employee.isActive);
      return matchesSearch && matchesStatus;
    });

    filtered.sort((first, second) => {
      const compared = compareEmployees(first, second, query.sortBy);
      const primary = query.sortDirection === 'asc' ? compared : -compared;
      return (
        primary ||
        first.lastName.localeCompare(second.lastName) ||
        first.firstName.localeCompare(second.firstName) ||
        first.id.localeCompare(second.id)
      );
    });

    return {
      items: filtered.slice(query.offset, query.offset + query.limit).map((employee) => ({
        ...employee,
      })),
      totalCount: filtered.length,
    };
  }
}

function compareEmployees(
  first: Employee,
  second: Employee,
  field: EmployeeQuery['sortBy'],
): number {
  switch (field) {
    case 'firstName':
      return first.firstName.localeCompare(second.firstName);
    case 'lastName':
      return first.lastName.localeCompare(second.lastName);
    case 'roleId':
      return ROLE_DEFINITIONS[first.roleId].name.localeCompare(
        ROLE_DEFINITIONS[second.roleId].name,
      );
    case 'isActive':
      return Number(first.isActive) - Number(second.isActive);
  }
}
