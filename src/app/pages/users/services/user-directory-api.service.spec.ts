import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { apiConfig } from '../../../core/config/api.config';
import { Employee, EmployeePage, EmployeeQuery } from '../../../core/users/user-directory.models';
import { UserDirectoryApiService } from './user-directory-api.service';

const query: EmployeeQuery = {
  offset: 20,
  limit: 20,
  search: 'ana',
  status: 'active',
  sortBy: 'lastName',
  sortDirection: 'asc',
};

describe('UserDirectoryApiService', () => {
  let service: UserDirectoryApiService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(UserDirectoryApiService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('posts a new employee and returns the created record', () => {
    const newEmployee = { firstName: 'Anna', lastName: 'Adams', roleId: 'office-worker' as const };
    const createdEmployee: Employee = {
      id: 'user-1',
      ...newEmployee,
      isActive: true,
    };
    let receivedEmployee: Employee | undefined;

    service.add(newEmployee).subscribe((employee) => {
      receivedEmployee = employee;
    });

    const request = httpTesting.expectOne(`${apiConfig.basePath}/users`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(newEmployee);
    request.flush(createdEmployee);

    expect(receivedEmployee).toEqual(createdEmployee);
  });

  it('requests deactivation for the selected user', () => {
    const deactivatedEmployee: Employee = {
      id: 'user/1',
      firstName: 'Anna',
      lastName: 'Adams',
      roleId: 'office-worker',
      isActive: false,
    };
    let receivedEmployee: Employee | undefined;

    service.deactivate(deactivatedEmployee.id).subscribe((employee) => {
      receivedEmployee = employee;
    });

    const request = httpTesting.expectOne(`${apiConfig.basePath}/users/user%2F1/deactivate`);
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({});
    request.flush(deactivatedEmployee);

    expect(receivedEmployee).toEqual(deactivatedEmployee);
  });

  it('requests the selected user page with filters and sorting', () => {
    const page: EmployeePage = {
      items: [
        {
          id: 'user-1',
          firstName: 'Ana',
          lastName: 'Adams',
          roleId: 'office-worker',
          isActive: true,
        },
      ],
      totalCount: 1,
    };
    let receivedPage: EmployeePage | undefined;

    service.getPage(query).subscribe((result) => {
      receivedPage = result;
    });

    const request = httpTesting.expectOne(
      (candidate) => candidate.url === `${apiConfig.basePath}/users`,
    );
    expect(request.request.method).toBe('GET');
    expect(request.request.params.keys()).toEqual([
      'offset',
      'limit',
      'search',
      'status',
      'sortBy',
      'sortDirection',
    ]);
    expect(request.request.params.get('offset')).toBe('20');
    expect(request.request.params.get('limit')).toBe('20');
    expect(request.request.params.get('search')).toBe('ana');
    expect(request.request.params.get('status')).toBe('active');
    expect(request.request.params.get('sortBy')).toBe('lastName');
    expect(request.request.params.get('sortDirection')).toBe('asc');
    request.flush(page);

    expect(receivedPage).toEqual(page);
  });
});
