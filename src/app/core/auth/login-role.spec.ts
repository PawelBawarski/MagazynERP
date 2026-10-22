import { describe, expect, it } from 'vitest';

import { getLoginRole } from './login-role';

describe('getLoginRole', () => {
  it('selects Administrator only for the configured login pair', () => {
    expect(getLoginRole('admin@admin.pl', 'admin')).toBe('administrator');
    expect(getLoginRole('ADMIN@ADMIN.PL', 'admin')).toBe('administrator');
  });

  it('selects Office Worker for other valid login inputs', () => {
    expect(getLoginRole('person@example.com', 'password')).toBe('office-worker');
    expect(getLoginRole('admin@admin.pl', 'not-admin')).toBe('office-worker');
  });
});
