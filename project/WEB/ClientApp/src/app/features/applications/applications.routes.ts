import { Routes } from '@angular/router';

export const applicationsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./application-list/application-list.component').then(m => m.ApplicationListComponent)
  }
];