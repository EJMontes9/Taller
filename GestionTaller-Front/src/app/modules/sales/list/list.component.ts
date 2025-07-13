import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { CurrencyPipe, NgIf, NgFor, NgClass } from "@angular/common";
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface Vehicle {
  id: number;
  brand: string;
  model: string;
  year: number;
  vin: string;
}

interface Part {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface Sale {
  id: number;
  date: Date;
  customer: Customer;
  vehicle?: Vehicle;
  parts?: Part[];
  total: number;
  status: string;
  paymentMethod: string;
  invoiceNumber: string;
  salesperson: string;
}

@Component({
  selector: 'app-list',
  standalone: true,
    imports: [
        TableModule,
        ButtonModule,
        InputTextModule,
        DialogModule,
        ToastModule,
        ConfirmDialogModule,
        FormsModule,
        CalendarModule,
        TagModule,
        DropdownModule,
        CurrencyPipe,
        NgIf,
        NgFor,
        NgClass,
        IconFieldModule,
        InputIconModule
    ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
  sales: Sale[] = [];
  sale: Sale | null = null;
  selectedSales: Sale[] = [];
  saleDialog: boolean = false;
  detailsDialog: boolean = false;
  statuses: any[] = [];
  paymentMethods: any[] = [];
  dateFilters: any = {
    start: null,
    end: null
  };

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    // Simular datos que vendrían del backend
    this.sales = [
      {
        id: 1,
        date: new Date('2023-06-15'),
        customer: { id: 1, name: 'Juan Pérez', email: 'juan.perez@email.com', phone: '555-1234' },
        vehicle: { id: 1, brand: 'Toyota', model: 'Corolla', year: 2023, vin: 'ABC123456789' },
        total: 25000,
        status: 'completada',
        paymentMethod: 'credito',
        invoiceNumber: 'INV-2023-001',
        salesperson: 'Carlos Gómez'
      },
      {
        id: 2,
        date: new Date('2023-06-20'),
        customer: { id: 2, name: 'María García', email: 'maria.garcia@email.com', phone: '555-5678' },
        parts: [
          { id: 1, name: 'Filtro de aceite', quantity: 2, price: 15.99 },
          { id: 2, name: 'Pastillas de freno', quantity: 1, price: 45.50 },
          { id: 3, name: 'Servicio de cambio de aceite', quantity: 1, price: 73.01 }
        ],
        total: 150.49,
        status: 'completada',
        paymentMethod: 'efectivo',
        invoiceNumber: 'INV-2023-002',
        salesperson: 'Ana Martínez'
      },
      {
        id: 3,
        date: new Date('2023-06-25'),
        customer: { id: 3, name: 'Carlos Rodríguez', email: 'carlos.rodriguez@email.com', phone: '555-9012' },
        vehicle: { id: 3, brand: 'Ford', model: 'Mustang', year: 2023, vin: 'GHI456789123' },
        total: 45000,
        status: 'pendiente',
        paymentMethod: 'transferencia',
        invoiceNumber: 'INV-2023-003',
        salesperson: 'Roberto Sánchez'
      },
      {
        id: 4,
        date: new Date('2023-06-30'),
        customer: { id: 4, name: 'Ana Martínez', email: 'ana.martinez@email.com', phone: '555-3456' },
        parts: [
          { id: 1, name: 'Batería 12V', quantity: 1, price: 89.99 }
        ],
        total: 89.99,
        status: 'completada',
        paymentMethod: 'debito',
        invoiceNumber: 'INV-2023-004',
        salesperson: 'Laura Díaz'
      },
      {
        id: 5,
        date: new Date('2023-07-05'),
        customer: { id: 5, name: 'Roberto Sánchez', email: 'roberto.sanchez@email.com', phone: '555-7890' },
        vehicle: { id: 2, brand: 'Honda', model: 'Civic', year: 2022, vin: 'DEF987654321' },
        total: 23500,
        status: 'cancelada',
        paymentMethod: 'credito',
        invoiceNumber: 'INV-2023-005',
        salesperson: 'Carlos Gómez'
      }
    ];

    this.statuses = [
      { label: 'Completada', value: 'completada' },
      { label: 'Pendiente', value: 'pendiente' },
      { label: 'Cancelada', value: 'cancelada' }
    ];

    this.paymentMethods = [
      { label: 'Efectivo', value: 'efectivo' },
      { label: 'Tarjeta de crédito', value: 'credito' },
      { label: 'Tarjeta de débito', value: 'debito' },
      { label: 'Transferencia bancaria', value: 'transferencia' }
    ];
  }

  viewSale(sale: Sale) {
    this.sale = { ...sale };
    this.detailsDialog = true;
  }

  filterByDate() {
    // Aquí iría la lógica para filtrar por fecha
    // En un caso real, esto se haría en el backend
    this.messageService.add({ severity: 'info', summary: 'Información', detail: 'Filtrando ventas por fecha', life: 3000 });
  }

  clearDateFilters() {
    this.dateFilters = {
      start: null,
      end: null
    };
    // Aquí iría la lógica para limpiar los filtros
    this.messageService.add({ severity: 'info', summary: 'Información', detail: 'Filtros de fecha limpiados', life: 3000 });
  }

  hideDialog() {
    this.detailsDialog = false;
    this.sale = null;
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString();
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'completada':
        return 'success';
      case 'pendiente':
        return 'warning';
      case 'cancelada':
        return 'danger';
      default:
        return 'info';
    }
  }

  getStatusLabel(status: string): string {
    const statusObj = this.statuses.find(s => s.value === status);
    return statusObj ? statusObj.label : status;
  }

  getPaymentMethodLabel(method: string): string {
    const methodObj = this.paymentMethods.find(m => m.value === method);
    return methodObj ? methodObj.label : method;
  }

  getSaleType(sale: Sale): string {
    if (sale.vehicle) {
      return 'Vehículo';
    } else if (sale.parts && sale.parts.length > 0) {
      return 'Repuestos';
    } else {
      return 'Otro';
    }
  }

  getSaleDescription(sale: Sale): string {
    if (sale.vehicle) {
      return `${sale.vehicle.brand} ${sale.vehicle.model} (${sale.vehicle.year})`;
    } else if (sale.parts && sale.parts.length > 0) {
      if (sale.parts.length === 1) {
        return sale.parts[0].name;
      } else {
        return `${sale.parts[0].name} y ${sale.parts.length - 1} artículo(s) más`;
      }
    } else {
      return 'Sin detalles';
    }
  }

  onFilterInput(event: Event, dt: any): void {
    const target = event.target as HTMLInputElement;
    dt.filterGlobal(target.value, 'contains');
  }
}
