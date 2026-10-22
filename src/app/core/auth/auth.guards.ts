import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import {
  PRODUCT_CATALOG_READ_PERMISSION,
  USER_MANAGEMENT_PERMISSION,
  hasPermission,
} from '../access-control/role-permissions';
import { SessionService } from './session.service';

export const sessionGuard: CanActivateFn = (_route, state) => {
  const session = inject(SessionService);
  const router = inject(Router);

  return session.hasSession()
    ? true
    : router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

export const guestOnlyGuard: CanActivateFn = () => {
  const session = inject(SessionService);
  const router = inject(Router);

  return session.hasSession() ? router.createUrlTree(['/app/dashboard']) : true;
};

export const userManagementGuard: CanActivateFn = () => {
  const session = inject(SessionService);
  const router = inject(Router);
  const roleId = session.roleId();

  return roleId && hasPermission(roleId, USER_MANAGEMENT_PERMISSION)
    ? true
    : router.createUrlTree(['/app/dashboard']);
};

export const productCatalogReadGuard: CanActivateFn = () => {
  const session = inject(SessionService);
  const router = inject(Router);
  const roleId = session.roleId();

  return roleId && hasPermission(roleId, PRODUCT_CATALOG_READ_PERMISSION)
    ? true
    : router.createUrlTree(['/app/dashboard']);
};
