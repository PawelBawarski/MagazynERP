export interface PermissionDefinition {
  readonly id: string;
  readonly description: string;
}

export interface RoleDefinition {
  readonly id: string;
  readonly name: string;
  readonly permissionIds: readonly string[];
}

export const USER_MANAGEMENT_PERMISSION = 'users.manage';
export const ASSIGN_ADMINISTRATOR_PERMISSION = 'users.assign-administrator';
export const PRODUCT_CATALOG_READ_PERMISSION = 'products.catalog.read';
export const PRODUCT_CREATE_PERMISSION = 'products.create';
export const PRODUCT_EDIT_PERMISSION = 'products.edit';

/**
 * Centralne miejsce definicji uprawnień ERP.
 */
export const PERMISSION_DEFINITIONS: readonly PermissionDefinition[] = [
  {
    id: ASSIGN_ADMINISTRATOR_PERMISSION,
    description: 'Przypisywanie roli Administratora nowemu użytkownikowi.',
  },
  {
    id: USER_MANAGEMENT_PERMISSION,
    description: 'Przeglądanie, dodawanie i dezaktywowanie użytkowników.',
  },
  {
    id: PRODUCT_CATALOG_READ_PERMISSION,
    description: 'Przeglądanie i wyszukiwanie katalogu produktów.',
  },
  {
    id: PRODUCT_CREATE_PERMISSION,
    description: 'Dodawanie produktów do katalogu.',
  },
  {
    id: PRODUCT_EDIT_PERMISSION,
    description: 'Edycja danych produktów w katalogu.',
  },
];

/**
 * Katalog ról z angielskimi, stabilnymi identyfikatorami i nazwami.
 */
export const ROLE_DEFINITIONS = {
  administrator: {
    id: 'administrator',
    name: 'Administrator',
    permissionIds: [
      USER_MANAGEMENT_PERMISSION,
      ASSIGN_ADMINISTRATOR_PERMISSION,
      PRODUCT_CATALOG_READ_PERMISSION,
      PRODUCT_CREATE_PERMISSION,
      PRODUCT_EDIT_PERMISSION,
    ],
  },
  'office-worker': {
    id: 'office-worker',
    name: 'Office Worker',
    permissionIds: [
      USER_MANAGEMENT_PERMISSION,
      PRODUCT_CATALOG_READ_PERMISSION,
      PRODUCT_CREATE_PERMISSION,
      PRODUCT_EDIT_PERMISSION,
    ],
  },
  'warehouse-clerk': {
    id: 'warehouse-clerk',
    name: 'Warehouse Clerk',
    permissionIds: [PRODUCT_CATALOG_READ_PERMISSION],
  },
  'warehouse-operative': {
    id: 'warehouse-operative',
    name: 'Warehouse Operative',
    permissionIds: [PRODUCT_CATALOG_READ_PERMISSION],
  },
} as const satisfies Record<string, RoleDefinition>;

export type RoleId = keyof typeof ROLE_DEFINITIONS;

export function isRoleId(roleId: string): roleId is RoleId {
  return Object.hasOwn(ROLE_DEFINITIONS, roleId);
}

export function getRoleDefinition(roleId: string): RoleDefinition | undefined {
  return isRoleId(roleId) ? ROLE_DEFINITIONS[roleId] : undefined;
}

/**
 * Zwraca true wyłącznie dla znanej roli, zarejestrowanego uprawnienia i jawnego
 * przypisania go tej roli. Nieznane role/uprawnienia domyślnie nie dają dostępu.
 */
export function hasPermission(roleId: string, permissionId: string): boolean {
  const role = getRoleDefinition(roleId);
  const permissionExists = PERMISSION_DEFINITIONS.some(
    (permission) => permission.id === permissionId,
  );

  return role !== undefined && permissionExists && role.permissionIds.includes(permissionId);
}
