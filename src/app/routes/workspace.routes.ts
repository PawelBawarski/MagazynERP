import { Routes } from '@angular/router';

import {
  productCatalogReadGuard,
  sessionGuard,
  userManagementGuard,
} from '../core/auth/auth.guards';

export const workspaceRoutes: Routes = [
  {
    path: '',
    canActivate: [sessionGuard],
    canActivateChild: [sessionGuard],
    loadComponent: () =>
      import('../core/layout/app-shell/app-shell.component').then(
        (module) => module.AppShellComponent,
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../pages/dashboard/dashboard.component').then(
            (module) => module.DashboardComponent,
          ),
      },
      {
        path: 'users',
        canActivate: [userManagementGuard],
        loadComponent: () =>
          import('../pages/users/user-management.component').then(
            (module) => module.UserManagementComponent,
          ),
      },
      {
        path: 'products',
        canActivate: [productCatalogReadGuard],
        loadComponent: () =>
          import('../pages/products/product-catalog.component').then(
            (module) => module.ProductCatalogComponent,
          ),
      },
    ],
  },
];
