import { Routes } from '@angular/router';

export const INVENTORY_ROUTES: Routes = [
  {
    path: 'vehicles',
    loadComponent: () => import('./vehicles/vehicles.component').then(c => c.VehiclesComponent)
  },
  {
    path: 'parts',
    loadComponent: () => import('./parts/parts.component').then(c => c.PartsComponent)
  },
  {
    path: 'other',
    loadComponent: () => import('./other/other.component').then(c => c.OtherComponent)
  }
];