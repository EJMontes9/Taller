import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { AccordionModule } from 'primeng/accordion';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { CurrencyPipe } from '@angular/common';

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
  licensePlate?: string;
}

interface ServiceRecord {
  id: number;
  date: Date;
  vehicle: Vehicle;
  customer: Customer;
  serviceType: string;
  description: string;
  technician: string;
  status: string;
  cost: number;
  notes?: string;
  parts?: ServicePart[];
  laborHours?: number;
  mileage?: number;
}

interface ServicePart {
  id: number;
  name: string;
  quantity: number;
  unitPrice: number;
}

@Component({
  selector: 'app-service-history',
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
    DropdownModule,
    TagModule,
    AccordionModule,
    TimelineModule,
    CardModule,
    DividerModule,
    CurrencyPipe
  ],
  providers: [MessageService],
  templateUrl: './service-history.component.html'
})
export class ServiceHistoryComponent implements OnInit {
  serviceRecords: ServiceRecord[] = [];
  selectedRecord: ServiceRecord | null = null;
  detailsDialog: boolean = false;

  vehicles: Vehicle[] = [];
  selectedVehicle: Vehicle | null = null;

  dateRange: any = {
    start: null,
    end: null
  };

  serviceTypes: any[] = [];

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    // Simular datos que vendrían del backend
    this.vehicles = [
      { id: 1, brand: 'Toyota', model: 'Corolla', year: 2023, vin: 'ABC123456789', licensePlate: 'ABC-123' },
      { id: 2, brand: 'Honda', model: 'Civic', year: 2022, vin: 'DEF987654321', licensePlate: 'DEF-456' },
      { id: 3, brand: 'Ford', model: 'Mustang', year: 2023, vin: 'GHI456789123', licensePlate: 'GHI-789' },
      { id: 4, brand: 'Chevrolet', model: 'Camaro', year: 2022, vin: 'JKL789123456', licensePlate: 'JKL-012' },
      { id: 5, brand: 'Nissan', model: 'Sentra', year: 2023, vin: 'MNO321654987', licensePlate: 'MNO-345' }
    ];

    this.serviceRecords = [
      {
        id: 1,
        date: new Date('2023-06-10'),
        vehicle: this.vehicles[0],
        customer: { id: 1, name: 'Juan Pérez', email: 'juan.perez@email.com', phone: '555-1234' },
        serviceType: 'mantenimiento',
        description: 'Cambio de aceite y filtros',
        technician: 'Roberto Sánchez',
        status: 'completado',
        cost: 150.99,
        notes: 'Se recomendó cambio de frenos en próximo servicio',
        parts: [
          { id: 1, name: 'Filtro de aceite', quantity: 1, unitPrice: 15.99 },
          { id: 2, name: 'Aceite 5W-30', quantity: 5, unitPrice: 12.50 }
        ],
        laborHours: 1.5,
        mileage: 10500
      },
      {
        id: 2,
        date: new Date('2023-05-15'),
        vehicle: this.vehicles[0],
        customer: { id: 1, name: 'Juan Pérez', email: 'juan.perez@email.com', phone: '555-1234' },
        serviceType: 'reparacion',
        description: 'Cambio de pastillas de freno',
        technician: 'Laura Ramírez',
        status: 'completado',
        cost: 250.50,
        parts: [
          { id: 3, name: 'Pastillas de freno delanteras', quantity: 1, unitPrice: 85.75 },
          { id: 4, name: 'Pastillas de freno traseras', quantity: 1, unitPrice: 79.99 }
        ],
        laborHours: 2,
        mileage: 9800
      },
      {
        id: 3,
        date: new Date('2023-04-22'),
        vehicle: this.vehicles[1],
        customer: { id: 2, name: 'María García', email: 'maria.garcia@email.com', phone: '555-5678' },
        serviceType: 'diagnostico',
        description: 'Diagnóstico de problema eléctrico',
        technician: 'Carlos Gómez',
        status: 'completado',
        cost: 75.00,
        notes: 'Se detectó problema en alternador',
        laborHours: 1,
        mileage: 15200
      },
      {
        id: 4,
        date: new Date('2023-06-05'),
        vehicle: this.vehicles[1],
        customer: { id: 2, name: 'María García', email: 'maria.garcia@email.com', phone: '555-5678' },
        serviceType: 'reparacion',
        description: 'Reemplazo de alternador',
        technician: 'Carlos Gómez',
        status: 'completado',
        cost: 350.25,
        parts: [
          { id: 5, name: 'Alternador', quantity: 1, unitPrice: 275.50 }
        ],
        laborHours: 2.5,
        mileage: 15500
      },
      {
        id: 5,
        date: new Date('2023-06-15'),
        vehicle: this.vehicles[2],
        customer: { id: 3, name: 'Carlos Rodríguez', email: 'carlos.rodriguez@email.com', phone: '555-9012' },
        serviceType: 'mantenimiento',
        description: 'Mantenimiento de 20,000 km',
        technician: 'Roberto Sánchez',
        status: 'completado',
        cost: 320.75,
        notes: 'Todo en buen estado',
        parts: [
          { id: 6, name: 'Filtro de aceite', quantity: 1, unitPrice: 15.99 },
          { id: 7, name: 'Aceite 5W-30', quantity: 6, unitPrice: 12.50 },
          { id: 8, name: 'Filtro de aire', quantity: 1, unitPrice: 25.99 },
          { id: 9, name: 'Filtro de combustible', quantity: 1, unitPrice: 35.50 }
        ],
        laborHours: 3,
        mileage: 20100
      }
    ];

    this.serviceTypes = [
      { label: 'Mantenimiento', value: 'mantenimiento' },
      { label: 'Reparación', value: 'reparacion' },
      { label: 'Diagnóstico', value: 'diagnostico' },
      { label: 'Garantía', value: 'garantia' }
    ];
  }

  viewDetails(record: ServiceRecord) {
    this.selectedRecord = record;
    this.detailsDialog = true;
  }

  hideDialog() {
    this.detailsDialog = false;
    this.selectedRecord = null;
  }

  filterByVehicle() {
    // Aquí iría la lógica para filtrar por vehículo
    // En un caso real, esto se haría en el backend
    this.messageService.add({ severity: 'info', summary: 'Información', detail: 'Filtrando historial por vehículo', life: 3000 });
  }

  filterByDateRange() {
    // Aquí iría la lógica para filtrar por rango de fechas
    // En un caso real, esto se haría en el backend
    this.messageService.add({ severity: 'info', summary: 'Información', detail: 'Filtrando historial por fechas', life: 3000 });
  }

  clearFilters() {
    this.selectedVehicle = null;
    this.dateRange = {
      start: null,
      end: null
    };
    // Aquí iría la lógica para limpiar los filtros
    this.messageService.add({ severity: 'info', summary: 'Información', detail: 'Filtros limpiados', life: 3000 });
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString();
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'completado':
        return 'success';
      case 'en_progreso':
        return 'info';
      case 'pendiente':
        return 'warning';
      case 'cancelado':
        return 'danger';
      default:
        return 'info';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'completado':
        return 'Completado';
      case 'en_progreso':
        return 'En Progreso';
      case 'pendiente':
        return 'Pendiente';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  }

  getServiceTypeLabel(type: string): string {
    const typeObj = this.serviceTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  }

  getVehicleInfo(vehicle: Vehicle): string {
    return `${vehicle.brand} ${vehicle.model} (${vehicle.year}) - ${vehicle.licensePlate || vehicle.vin}`;
  }

  calculateTotalParts(parts: ServicePart[] | undefined): number {
    if (!parts || parts.length === 0) return 0;
    return parts.reduce((sum, part) => sum + (part.quantity * part.unitPrice), 0);
  }

  calculateLaborCost(hours: number | undefined, hourlyRate: number = 45): number {
    if (!hours) return 0;
    return hours * hourlyRate;
  }

  onFilterInput(event: Event, dt: any): void {
    const target = event.target as HTMLInputElement;
    dt.filterGlobal(target.value, 'contains');
  }
}
