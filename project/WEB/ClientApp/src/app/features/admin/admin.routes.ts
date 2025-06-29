import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'jobs/new',
    loadComponent: () => import('./job-form/job-form.component').then(m => m.JobFormComponent)
  },
  {
    path: 'jobs/edit/:id',
    loadComponent: () => import('./job-form/job-form.component').then(m => m.JobFormComponent)
  }
];