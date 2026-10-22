import { Routes } from '@angular/router';

import { guestOnlyGuard } from '../core/auth/auth.guards';

export const publicRoutes: Routes = [
  {
    path: '',
    canActivate: [guestOnlyGuard],
    loadComponent: () =>
      import('../pages/auth/login/login.component').then((module) => module.LoginComponent),
  },
  {
    path: 'login',
    canActivate: [guestOnlyGuard],
    loadComponent: () =>
      import('../pages/auth/login/login.component').then((module) => module.LoginComponent),
  },
  {
    path: 'errors/:status',
    loadComponent: () =>
      import('../pages/errors/error-page/error-page.component').then(
        (module) => module.ErrorPageComponent,
      ),
  },
];
