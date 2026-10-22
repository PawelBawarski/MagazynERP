import { Employee } from '../../core/users/user-directory.models';

export function serializeEmployeesCsv(
  employees: readonly Employee[],
  translate: (key: string) => string,
): string {
  const rows = [
    [
      translate('users.firstName'),
      translate('users.lastName'),
      translate('users.position'),
      translate('users.status'),
    ],
    ...employees.map((employee) => [
      employee.firstName,
      employee.lastName,
      translate(`users.roles.${employee.roleId}`),
      translate(employee.isActive ? 'users.active' : 'users.inactive'),
    ]),
  ];

  return `\uFEFF${rows.map((row) => row.map(escapeCsvField).join(',')).join('\r\n')}`;
}

function escapeCsvField(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}
