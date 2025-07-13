import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { NgClass } from "@angular/common";
import { AuthService } from '../core/auth.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MenubarModule, NgClass, ButtonModule],
  templateUrl: './main-layout.component.html'
})
export class MainLayoutComponent {
  items: MenuItem[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Inicializar los elementos del menú
    this.items = [
      {
        label: 'Inventario',
        icon: 'pi pi-box',
        items: [
          {
            label: 'Vehículos',
            icon: 'pi pi-car',
            routerLink: '/inventory/vehicles'
          },
          {
            label: 'Repuestos',
            icon: 'pi pi-cog',
            routerLink: '/inventory/parts'
          },
          {
            label: 'Otros',
            icon: 'pi pi-list',
            routerLink: '/inventory/other'
          }
        ]
      },
      {
        label: 'Ventas',
        icon: 'pi pi-shopping-cart',
        items: [
          {
            label: 'Registro de Ventas',
            icon: 'pi pi-plus-circle',
            routerLink: '/sales/register'
          },
          {
            label: 'Clientes',
            icon: 'pi pi-users',
            routerLink: '/sales/customers'
          },
          {
            label: 'Facturación',
            icon: 'pi pi-file',
            routerLink: '/sales/invoices'
          },
          {
            label: 'Listado de Ventas',
            icon: 'pi pi-list',
            routerLink: '/sales/list'
          }
        ]
      },
      {
        label: 'Servicios',
        icon: 'pi pi-wrench',
        routerLink: '/service'
      },
      {
        label: 'Informes',
        icon: 'pi pi-chart-bar',
        routerLink: '/reports'
      }
    ];
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
