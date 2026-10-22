import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { EmployeeDirectoryError, EmployeeQuery } from '../users/user-directory.models';
import { MockUserDirectoryAdapter } from './mock-user-directory.adapter';

const query: EmployeeQuery = {
  offset: 0,
  limit: 20,
  search: '',
  status: 'all',
  sortBy: 'lastName',
  sortDirection: 'asc',
};

describe('MockUserDirectoryAdapter', () => {
  let directory: MockUserDirectoryAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    directory = TestBed.inject(MockUserDirectoryAdapter);
  });

  it('adds trimmed users as active and returns a page sorted by last name', () => {
    directory.add({ firstName: ' Zoe ', lastName: 'Zulu', roleId: 'office-worker' });
    directory.add({ firstName: ' Anna', lastName: 'Adams ', roleId: 'warehouse-clerk' });

    expect(directory.getPage(query)).toMatchObject({
      items: [
        { firstName: 'Anna', lastName: 'Adams', isActive: true },
        { firstName: 'Zoe', lastName: 'Zulu', isActive: true },
      ],
      totalCount: 2,
    });
  });

  it('filters by case-insensitive name, position, and active status', () => {
    const first = directory.add({
      firstName: 'Anna',
      lastName: 'Adams',
      roleId: 'office-worker',
    });
    directory.add({ firstName: 'Zoe', lastName: 'Zulu', roleId: 'warehouse-clerk' });
    directory.deactivate(first.id);

    expect(
      directory
        .getPage({
          ...query,
          search: 'office worker',
          status: 'inactive',
        })
        .items.map(({ id }) => id),
    ).toEqual([first.id]);
  });

  it('returns only the requested page and reports the full filtered count', () => {
    for (let index = 0; index < 5; index += 1) {
      directory.add({
        firstName: `First${index}`,
        lastName: `Last${index}`,
        roleId: 'office-worker',
      });
    }

    const page = directory.getPage({ ...query, limit: 2, offset: 2 });

    expect(page.items).toHaveLength(2);
    expect(page.totalCount).toBe(5);
  });

  it('does not allow repeated deactivation or silently accept an unknown user', () => {
    const user = directory.add({
      firstName: 'Anna',
      lastName: 'Adams',
      roleId: 'office-worker',
    });
    directory.deactivate(user.id);

    expect(() => directory.deactivate(user.id)).toThrowError(
      new EmployeeDirectoryError('already-inactive'),
    );
    expect(() => directory.deactivate('unknown')).toThrowError(
      new EmployeeDirectoryError('not-found'),
    );
  });

  it('rejects blank names and unknown roles', () => {
    expect(() =>
      directory.add({ firstName: ' ', lastName: 'Adams', roleId: 'office-worker' }),
    ).toThrowError(new EmployeeDirectoryError('invalid-input'));
  });
});
