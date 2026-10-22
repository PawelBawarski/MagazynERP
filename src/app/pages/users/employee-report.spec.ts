import { describe, expect, it } from 'vitest';

import { Employee } from '../../core/users/user-directory.models';
import { serializeEmployeesCsv } from './employee-report';

describe('serializeEmployeesCsv', () => {
  it('includes every record and escapes commas, quotes, and Polish characters', () => {
    const employees: Employee[] = [
      {
        id: 'one',
        firstName: 'Łukasz, "Łuki"',
        lastName: 'Żółć',
        roleId: 'office-worker',
        isActive: false,
      },
    ];

    const csv = serializeEmployeesCsv(employees, (key) => {
      const labels: Record<string, string> = {
        'users.firstName': 'Imię',
        'users.lastName': 'Nazwisko',
        'users.position': 'Stanowisko',
        'users.status': 'Aktywny',
        'users.roles.office-worker': 'Pracownik biurowy',
        'users.inactive': 'Nieaktywny',
      };
      return labels[key] ?? key;
    });

    expect(csv).toBe(
      '\uFEFF"Imię","Nazwisko","Stanowisko","Aktywny"\r\n"Łukasz, ""Łuki""","Żółć","Pracownik biurowy","Nieaktywny"',
    );
  });
});
