import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout.component';
import { AuthGuard } from './core/auth.guard';
import { LoginComponent } from './modules/auth/login/login.component';

export const routes: Routes = [
  // Auth routes
  {
    path: 'login',
    component: LoginComponent
  },
  // Protected routes
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { 
        path: '', 
        redirectTo: 'inventory/vehicles', 
        pathMatch: 'full' 
      },
      {
        path: 'inventory',
        loadChildren: () => import('./modules/inventory/inventory.routes').then(m => m.INVENTORY_ROUTES)
      },
      {
        path: 'sales',
        loadChildren: () => import('./modules/sales/sales.routes').then(m => m.SALES_ROUTES)
      },
      {
        path: 'service',
        loadChildren: () => import('./modules/service/service.routes').then(m => m.SERVICE_ROUTES)
      },
      {
        path: 'reports',
        loadChildren: () => import('./modules/reports/reports.routes').then(m => m.REPORTS_ROUTES)
      }
    ]
  },
  // Fallback route
  {
    path: '**',
    redirectTo: 'login'
  }
];
