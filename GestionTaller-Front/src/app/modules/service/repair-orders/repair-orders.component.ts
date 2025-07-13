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
import { DropdownModule } from 'primeng/dropdown';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';
import { StepsModule } from 'primeng/steps';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { TabViewModule } from 'primeng/tabview';
import { CheckboxModule } from 'primeng/checkbox';
import {CurrencyPipe, NgClass} from "@angular/common";

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

interface RepairPart {
  id: number;
  name: string;
  quantity: number;
  unitPrice: number;
  isApproved: boolean;
}

interface RepairLabor {
  id: number;
  description: string;
  hours: number;
  hourlyRate: number;
  isApproved: boolean;
}

interface RepairOrder {
  id: number;
  orderNumber: string;
  customer: Customer;
  vehicle: Vehicle;
  dateCreated: Date;
  dateCompleted?: Date;
  estimatedCompletionDate: Date;
  description: string;
  status: string;
  technician: string;
  parts: RepairPart[];
  labor: RepairLabor[];
  notes?: string;
  customerApproval: boolean;
  mileage: number;
  totalCost: number;
}

@Component({
  selector: 'app-repair-orders',
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
    TextareaModule,
    TagModule,
    StepsModule,
    CardModule,
    InputNumberModule,
    TabViewModule,
    CheckboxModule,
    CurrencyPipe,
    NgClass
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './repair-orders.component.html'
})
export class RepairOrdersComponent implements OnInit {
  repairOrders: RepairOrder[] = [];
  repairOrder: RepairOrder = this.initializeNewRepairOrder();
  selectedRepairOrders: RepairOrder[] = [];
  repairOrderDialog: boolean = false;
  detailsDialog: boolean = false;
  submitted: boolean = false;

  customers: Customer[] = [];
  vehicles: Vehicle[] = [];
  technicians: any[] = [];
  statuses: any[] = [];

  activeIndex: number = 0;
  steps: any[] = [];

  availableParts: any[] = [];
  selectedPart: any = null;
  newPart: RepairPart = this.initializeNewPart();

  newLabor: RepairLabor = this.initializeNewLabor();

  dateFilter: Date | null = null;
  statusFilter: string | null = null;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.steps = [
      { label: 'Información General' },
      { label: 'Repuestos y Mano de Obra' },
      { label: 'Aprobación y Finalización' }
    ];

    // Simular datos que vendrían del backend
    this.customers = [
      { id: 1, name: 'Juan Pérez', email: 'juan.perez@email.com', phone: '555-1234' },
      { id: 2, name: 'María García', email: 'maria.garcia@email.com', phone: '555-5678' },
      { id: 3, name: 'Carlos Rodríguez', email: 'carlos.rodriguez@email.com', phone: '555-9012' },
      { id: 4, name: 'Ana Martínez', email: 'ana.martinez@email.com', phone: '555-3456' },
      { id: 5, name: 'Roberto Sánchez', email: 'roberto.sanchez@email.com', phone: '555-7890' }
    ];

    this.vehicles = [
      { id: 1, brand: 'Toyota', model: 'Corolla', year: 2023, vin: 'ABC123456789', licensePlate: 'ABC-123' },
      { id: 2, brand: 'Honda', model: 'Civic', year: 2022, vin: 'DEF987654321', licensePlate: 'DEF-456' },
      { id: 3, brand: 'Ford', model: 'Mustang', year: 2023, vin: 'GHI456789123', licensePlate: 'GHI-789' },
      { id: 4, brand: 'Chevrolet', model: 'Camaro', year: 2022, vin: 'JKL789123456', licensePlate: 'JKL-012' },
      { id: 5, brand: 'Nissan', model: 'Sentra', year: 2023, vin: 'MNO321654987', licensePlate: 'MNO-345' }
    ];

    this.technicians = [
      { label: 'Roberto Sánchez', value: 'Roberto Sánchez' },
      { label: 'Laura Ramírez', value: 'Laura Ramírez' },
      { label: 'Carlos Gómez', value: 'Carlos Gómez' },
      { label: 'Ana López', value: 'Ana López' },
      { label: 'Miguel Torres', value: 'Miguel Torres' }
    ];

    this.statuses = [
      { label: 'Pendiente', value: 'pendiente' },
      { label: 'En Diagnóstico', value: 'diagnostico' },
      { label: 'Esperando Aprobación', value: 'esperando_aprobacion' },
      { label: 'Aprobado', value: 'aprobado' },
      { label: 'En Reparación', value: 'en_reparacion' },
      { label: 'Esperando Repuestos', value: 'esperando_repuestos' },
      { label: 'Completado', value: 'completado' },
      { label: 'Entregado', value: 'entregado' },
      { label: 'Cancelado', value: 'cancelado' }
    ];

    this.availableParts = [
      { id: 1, name: 'Filtro de aceite', price: 15.99 },
      { id: 2, name: 'Pastillas de freno delanteras', price: 85.75 },
      { id: 3, name: 'Pastillas de freno traseras', price: 79.99 },
      { id: 4, name: 'Aceite 5W-30 (1L)', price: 12.50 },
      { id: 5, name: 'Filtro de aire', price: 25.99 },
      { id: 6, name: 'Filtro de combustible', price: 35.50 },
      { id: 7, name: 'Alternador', price: 275.50 },
      { id: 8, name: 'Batería', price: 120.00 },
      { id: 9, name: 'Bujías (juego)', price: 45.99 },
      { id: 10, name: 'Amortiguador delantero', price: 95.50 }
    ];

    this.repairOrders = [
      {
        id: 1,
        orderNumber: 'RO-2023-001',
        customer: this.customers[0],
        vehicle: this.vehicles[0],
        dateCreated: new Date('2023-07-10'),
        estimatedCompletionDate: new Date('2023-07-14'),
        description: 'Mantenimiento de 10,000 km y revisión de frenos',
        status: 'en_reparacion',
        technician: 'Roberto Sánchez',
        parts: [
          { id: 1, name: 'Filtro de aceite', quantity: 1, unitPrice: 15.99, isApproved: true },
          { id: 2, name: 'Aceite 5W-30', quantity: 5, unitPrice: 12.50, isApproved: true },
          { id: 3, name: 'Pastillas de freno delanteras', quantity: 1, unitPrice: 85.75, isApproved: true }
        ],
        labor: [
          { id: 1, description: 'Cambio de aceite y filtro', hours: 1, hourlyRate: 45, isApproved: true },
          { id: 2, description: 'Cambio de pastillas de freno', hours: 1.5, hourlyRate: 45, isApproved: true }
        ],
        notes: 'Cliente solicitó revisión adicional del sistema de frenos',
        customerApproval: true,
        mileage: 10500,
        totalCost: 248.74
      },
      {
        id: 2,
        orderNumber: 'RO-2023-002',
        customer: this.customers[1],
        vehicle: this.vehicles[1],
        dateCreated: new Date('2023-07-12'),
        estimatedCompletionDate: new Date('2023-07-18'),
        description: 'Diagnóstico de problema eléctrico y reemplazo de alternador',
        status: 'esperando_repuestos',
        technician: 'Carlos Gómez',
        parts: [
          { id: 4, name: 'Alternador', quantity: 1, unitPrice: 275.50, isApproved: true }
        ],
        labor: [
          { id: 3, description: 'Diagnóstico eléctrico', hours: 1, hourlyRate: 45, isApproved: true },
          { id: 4, description: 'Reemplazo de alternador', hours: 2, hourlyRate: 45, isApproved: true }
        ],
        notes: 'Alternador en pedido, llegará en 3 días',
        customerApproval: true,
        mileage: 15500,
        totalCost: 410.50
      },
      {
        id: 3,
        orderNumber: 'RO-2023-003',
        customer: this.customers[2],
        vehicle: this.vehicles[2],
        dateCreated: new Date('2023-07-13'),
        estimatedCompletionDate: new Date('2023-07-15'),
        description: 'Revisión de sistema de suspensión',
        status: 'esperando_aprobacion',
        technician: 'Laura Ramírez',
        parts: [
          { id: 5, name: 'Amortiguador delantero izquierdo', quantity: 1, unitPrice: 95.50, isApproved: false },
          { id: 6, name: 'Amortiguador delantero derecho', quantity: 1, unitPrice: 95.50, isApproved: false }
        ],
        labor: [
          { id: 5, description: 'Diagnóstico de suspensión', hours: 1, hourlyRate: 45, isApproved: true },
          { id: 6, description: 'Reemplazo de amortiguadores delanteros', hours: 2.5, hourlyRate: 45, isApproved: false }
        ],
        notes: 'Esperando aprobación del cliente para proceder con el reemplazo',
        customerApproval: false,
        mileage: 25300,
        totalCost: 348.50
      }
    ];
  }

  openNew() {
    this.repairOrder = this.initializeNewRepairOrder();
    this.submitted = false;
    this.repairOrderDialog = true;
    this.activeIndex = 0;
  }

  deleteSelectedRepairOrders() {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar las órdenes de reparación seleccionadas?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.repairOrders = this.repairOrders.filter(val => !this.selectedRepairOrders.includes(val));
        this.selectedRepairOrders = [];
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Órdenes de reparación eliminadas', life: 3000 });
      }
    });
  }

  editRepairOrder(repairOrder: RepairOrder) {
    this.repairOrder = { ...repairOrder };
    this.repairOrderDialog = true;
    this.activeIndex = 0;
  }

  viewDetails(repairOrder: RepairOrder) {
    this.repairOrder = { ...repairOrder };
    this.detailsDialog = true;
  }

  deleteRepairOrder(repairOrder: RepairOrder) {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar esta orden de reparación?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.repairOrders = this.repairOrders.filter(val => val.id !== repairOrder.id);
        this.repairOrder = this.initializeNewRepairOrder();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Orden de reparación eliminada', life: 3000 });
      }
    });
  }

  hideDialog() {
    this.repairOrderDialog = false;
    this.detailsDialog = false;
    this.submitted = false;
  }

  nextStep() {
    this.activeIndex++;
  }

  prevStep() {
    this.activeIndex--;
  }

  saveRepairOrder() {
    this.submitted = true;

    if (this.isValidRepairOrder()) {
      // Calcular el costo total
      this.calculateTotalCost();

      if (this.repairOrder.id) {
        // Actualizar orden existente
        const index = this.findIndexById(this.repairOrder.id);
        if (index !== -1) {
          this.repairOrders[index] = this.repairOrder;
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Orden de reparación actualizada', life: 3000 });
        }
      } else {
        // Crear nueva orden
        this.repairOrder.id = this.createId();
        this.repairOrder.orderNumber = this.generateOrderNumber();
        this.repairOrders.push(this.repairOrder);
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Orden de reparación creada', life: 3000 });
      }

      this.repairOrders = [...this.repairOrders];
      this.repairOrderDialog = false;
      this.repairOrder = this.initializeNewRepairOrder();
    }
  }

  isValidRepairOrder(): boolean {
    return !!this.repairOrder.customer && !!this.repairOrder.vehicle && !!this.repairOrder.description && !!this.repairOrder.technician;
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.repairOrders.length; i++) {
      if (this.repairOrders[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  createId(): number {
    // Generar un ID único basado en el timestamp
    return Math.floor(Math.random() * 1000);
  }

  generateOrderNumber(): string {
    // Generar un número de orden basado en el año actual y un número secuencial
    const year = new Date().getFullYear();
    const count = this.repairOrders.length + 1;
    return `RO-${year}-${count.toString().padStart(3, '0')}`;
  }

  initializeNewRepairOrder(): RepairOrder {
    return {
      id: 0,
      orderNumber: '',
      customer: null as unknown as Customer,
      vehicle: null as unknown as Vehicle,
      dateCreated: new Date(),
      estimatedCompletionDate: new Date(new Date().setDate(new Date().getDate() + 3)),
      description: '',
      status: 'pendiente',
      technician: '',
      parts: [],
      labor: [],
      customerApproval: false,
      mileage: 0,
      totalCost: 0
    };
  }

  initializeNewPart(): RepairPart {
    return {
      id: 0,
      name: '',
      quantity: 1,
      unitPrice: 0,
      isApproved: false
    };
  }

  initializeNewLabor(): RepairLabor {
    return {
      id: 0,
      description: '',
      hours: 1,
      hourlyRate: 45,
      isApproved: false
    };
  }

  addPart() {
    if (this.selectedPart && this.newPart.quantity > 0) {
      const part: RepairPart = {
        id: this.createId(),
        name: this.selectedPart.name,
        quantity: this.newPart.quantity,
        unitPrice: this.selectedPart.price,
        isApproved: false
      };

      this.repairOrder.parts.push(part);
      this.selectedPart = null;
      this.newPart = this.initializeNewPart();
      this.calculateTotalCost();
    }
  }

  removePart(part: RepairPart) {
    this.repairOrder.parts = this.repairOrder.parts.filter(p => p.id !== part.id);
    this.calculateTotalCost();
  }

  addLabor() {
    if (this.newLabor.description && this.newLabor.hours > 0) {
      const labor: RepairLabor = {
        id: this.createId(),
        description: this.newLabor.description,
        hours: this.newLabor.hours,
        hourlyRate: this.newLabor.hourlyRate,
        isApproved: false
      };

      this.repairOrder.labor.push(labor);
      this.newLabor = this.initializeNewLabor();
      this.calculateTotalCost();
    }
  }

  removeLabor(labor: RepairLabor) {
    this.repairOrder.labor = this.repairOrder.labor.filter(l => l.id !== labor.id);
    this.calculateTotalCost();
  }

  calculateTotalCost() {
    let partsCost = 0;
    let laborCost = 0;

    // Calcular costo de repuestos
    this.repairOrder.parts.forEach(part => {
      partsCost += part.quantity * part.unitPrice;
    });

    // Calcular costo de mano de obra
    this.repairOrder.labor.forEach(labor => {
      laborCost += labor.hours * labor.hourlyRate;
    });

    this.repairOrder.totalCost = partsCost + laborCost;
  }

  calculatePartsCost(): number {
    return this.repairOrder.parts.reduce((sum, part) => sum + (part.quantity * part.unitPrice), 0);
  }

  calculateLaborCost(): number {
    return this.repairOrder.labor.reduce((sum, labor) => sum + (labor.hours * labor.hourlyRate), 0);
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return date.toLocaleDateString();
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'pendiente':
        return 'warning';
      case 'diagnostico':
        return 'info';
      case 'esperando_aprobacion':
        return 'warning';
      case 'aprobado':
        return 'success';
      case 'en_reparacion':
        return 'info';
      case 'esperando_repuestos':
        return 'warning';
      case 'completado':
        return 'success';
      case 'entregado':
        return 'success';
      case 'cancelado':
        return 'danger';
      default:
        return 'info';
    }
  }

  getStatusLabel(status: string): string {
    const statusObj = this.statuses.find(s => s.value === status);
    return statusObj ? statusObj.label : status;
  }

  getVehicleInfo(vehicle: Vehicle): string {
    return `${vehicle.brand} ${vehicle.model} (${vehicle.year}) - ${vehicle.licensePlate || vehicle.vin}`;
  }

  filterByDate() {
    // Aquí iría la lógica para filtrar por fecha
    // En un caso real, esto se haría en el backend
    this.messageService.add({ severity: 'info', summary: 'Información', detail: 'Filtrando órdenes por fecha', life: 3000 });
  }

  filterByStatus() {
    // Aquí iría la lógica para filtrar por estado
    // En un caso real, esto se haría en el backend
    this.messageService.add({ severity: 'info', summary: 'Información', detail: 'Filtrando órdenes por estado', life: 3000 });
  }

  clearFilters() {
    this.dateFilter = null;
    this.statusFilter = null;
    // Aquí iría la lógica para limpiar los filtros
    this.messageService.add({ severity: 'info', summary: 'Información', detail: 'Filtros limpiados', life: 3000 });
  }

  approveAll() {
    this.repairOrder.parts.forEach(part => part.isApproved = true);
    this.repairOrder.labor.forEach(labor => labor.isApproved = true);
    this.repairOrder.customerApproval = true;
    this.repairOrder.status = 'aprobado';
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Todos los ítems han sido aprobados', life: 3000 });
  }

  completeOrder() {
    this.repairOrder.status = 'completado';
    this.repairOrder.dateCompleted = new Date();
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Orden marcada como completada', life: 3000 });
  }

  deliverOrder() {
    this.repairOrder.status = 'entregado';
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Orden marcada como entregada', life: 3000 });
  }

  onFilterInput(event: Event, dt: any): void {
    const target = event.target as HTMLInputElement;
    dt.filterGlobal(target.value, 'contains');
  }
}
