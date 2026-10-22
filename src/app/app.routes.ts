import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./routes/public.routes').then((module) => module.publicRoutes),
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./routes/workspace.routes').then((module) => module.workspaceRoutes),
  },
  {
    path: '**',
    redirectTo: 'errors/404',
  },
];
