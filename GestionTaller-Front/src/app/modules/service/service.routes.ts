import { Routes } from '@angular/router';

export const SERVICE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./service-dashboard/service-dashboard.component').then(c => c.ServiceDashboardComponent)
  },
  {
    path: 'appointments',
    loadComponent: () => import('./appointments/appointments.component').then(c => c.AppointmentsComponent)
  },
  {
    path: 'history',
    loadComponent: () => import('./service-history/service-history.component').then(c => c.ServiceHistoryComponent)
  },
  {
    path: 'repair-orders',
    loadComponent: () => import('./repair-orders/repair-orders.component').then(c => c.RepairOrdersComponent)
  }
];