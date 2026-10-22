import { describe, expect, it } from 'vitest';

import {
  getRoleDefinition,
  hasPermission,
  isRoleId,
  PERMISSION_DEFINITIONS,
  ROLE_DEFINITIONS,
} from './role-permissions';

describe('role-permissions catalog', () => {
  it('contains the four requested roles with English names and stable IDs', () => {
    expect(Object.values(ROLE_DEFINITIONS).map(({ id, name }) => ({ id, name }))).toEqual([
      { id: 'administrator', name: 'Administrator' },
      { id: 'office-worker', name: 'Office Worker' },
      { id: 'warehouse-clerk', name: 'Warehouse Clerk' },
      { id: 'warehouse-operative', name: 'Warehouse Operative' },
    ]);
  });

  it('grants user management to office workers and administrators only', () => {
    expect(PERMISSION_DEFINITIONS.map(({ id }) => id)).toEqual([
      'users.assign-administrator',
      'users.manage',
      'products.catalog.read',
      'products.create',
      'products.edit',
    ]);
    expect(hasPermission('administrator', 'users.manage')).toBe(true);
    expect(hasPermission('office-worker', 'users.manage')).toBe(true);
    expect(hasPermission('warehouse-clerk', 'users.manage')).toBe(false);
    expect(hasPermission('warehouse-operative', 'users.manage')).toBe(false);
    expect(hasPermission('administrator', 'users.assign-administrator')).toBe(true);
    expect(hasPermission('office-worker', 'users.assign-administrator')).toBe(false);
    expect(hasPermission('administrator', 'products.catalog.read')).toBe(true);
    expect(hasPermission('office-worker', 'products.catalog.read')).toBe(true);
    expect(hasPermission('warehouse-clerk', 'products.catalog.read')).toBe(true);
    expect(hasPermission('warehouse-operative', 'products.catalog.read')).toBe(true);
    expect(hasPermission('administrator', 'products.create')).toBe(true);
    expect(hasPermission('office-worker', 'products.create')).toBe(true);
    expect(hasPermission('warehouse-clerk', 'products.create')).toBe(false);
    expect(hasPermission('warehouse-operative', 'products.create')).toBe(false);
    expect(hasPermission('administrator', 'products.edit')).toBe(true);
    expect(hasPermission('office-worker', 'products.edit')).toBe(true);
    expect(hasPermission('warehouse-clerk', 'products.edit')).toBe(false);
    expect(hasPermission('warehouse-operative', 'products.edit')).toBe(false);
  });

  it('resolves known roles and returns undefined for unknown role IDs', () => {
    expect(isRoleId('administrator')).toBe(true);
    expect(getRoleDefinition('office-worker')?.name).toBe('Office Worker');
    expect(isRoleId('superuser')).toBe(false);
    expect(getRoleDefinition('superuser')).toBeUndefined();
  });

  it('fails closed for unassigned permissions and unknown roles', () => {
    expect(hasPermission('administrator', 'inventory.read')).toBe(false);
    expect(hasPermission('unknown-role', 'inventory.read')).toBe(false);
  });
});
