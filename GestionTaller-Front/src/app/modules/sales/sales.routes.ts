import { Routes } from '@angular/router';

export const SALES_ROUTES: Routes = [
  {
    path: 'register',
    loadComponent: () => import('./register/register.component').then(c => c.RegisterComponent)
  },
  {
    path: 'customers',
    loadComponent: () => import('./customers/customers.component').then(c => c.CustomersComponent)
  },
  {
    path: 'invoices',
    loadComponent: () => import('./invoices/invoices.component').then(c => c.InvoicesComponent)
  },
  {
    path: 'list',
    loadComponent: () => import('./list/list.component').then(c => c.ListComponent)
  }
];