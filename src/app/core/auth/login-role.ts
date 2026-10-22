import { RoleId } from '../access-control/role-permissions';

const ADMINISTRATOR_EMAIL = 'admin@admin.pl';
const ADMINISTRATOR_PASSWORD = 'admin';

export function getLoginRole(email: string, password: string): RoleId {
  return email.trim().toLowerCase() === ADMINISTRATOR_EMAIL && password === ADMINISTRATOR_PASSWORD
    ? 'administrator'
    : 'office-worker';
}
