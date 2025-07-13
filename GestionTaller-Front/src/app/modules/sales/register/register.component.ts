import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { StepsModule } from 'primeng/steps';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import {CurrencyPipe, NgClass} from "@angular/common";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface Vehicle {
  id: number;
  brand: string;
  model: string;
  year: number;
  vin: string;
  price: number;
}

interface Part {
  id: number;
  name: string;
  price: number;
  quantity: number;
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
  notes: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    FormsModule,
    DropdownModule,
    InputNumberModule,
    CalendarModule,
    StepsModule,
    CardModule,
    DividerModule,
    CurrencyPipe,
    NgClass
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  activeIndex: number = 0;
  steps: any[] = [];

  customers: Customer[] = [];
  vehicles: Vehicle[] = [];
  parts: Part[] = [];

  selectedCustomer: Customer | null = null;
  selectedVehicle: Vehicle | null = null;
  selectedParts: Part[] = [];

  sale: Sale = this.initializeNewSale();

  paymentMethods: any[] = [];

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.steps = [
      { label: 'Cliente' },
      { label: 'Productos' },
      { label: 'Pago' },
      { label: 'Confirmación' }
    ];

    // Simular datos que vendrían del backend
    this.customers = [
      { id: 1, name: 'Juan Pérez', email: 'juan.perez@email.com', phone: '555-1234', address: 'Calle Principal 123' },
      { id: 2, name: 'María García', email: 'maria.garcia@email.com', phone: '555-5678', address: 'Avenida Central 456' },
      { id: 3, name: 'Carlos Rodríguez', email: 'carlos.rodriguez@email.com', phone: '555-9012', address: 'Plaza Mayor 789' }
    ];

    this.vehicles = [
      { id: 1, brand: 'Toyota', model: 'Corolla', year: 2023, vin: 'ABC123456789', price: 25000 },
      { id: 2, brand: 'Honda', model: 'Civic', year: 2022, vin: 'DEF987654321', price: 23500 },
      { id: 3, brand: 'Ford', model: 'Mustang', year: 2023, vin: 'GHI456789123', price: 45000 }
    ];

    this.parts = [
      { id: 1, name: 'Filtro de aceite', price: 15.99, quantity: 1 },
      { id: 2, name: 'Pastillas de freno', price: 45.50, quantity: 1 },
      { id: 3, name: 'Batería 12V', price: 89.99, quantity: 1 }
    ];

    this.paymentMethods = [
      { label: 'Efectivo', value: 'efectivo' },
      { label: 'Tarjeta de crédito', value: 'credito' },
      { label: 'Tarjeta de débito', value: 'debito' },
      { label: 'Transferencia bancaria', value: 'transferencia' }
    ];
  }

  nextStep() {
    this.activeIndex++;
  }

  prevStep() {
    this.activeIndex--;
  }

  selectCustomer(customer: Customer) {
    this.selectedCustomer = customer;
    this.sale.customer = customer;
  }

  selectVehicle(vehicle: Vehicle) {
    this.selectedVehicle = vehicle;
    this.sale.vehicle = vehicle;
    this.calculateTotal();
  }

  togglePartSelection(part: Part) {
    const index = this.selectedParts.findIndex(p => p.id === part.id);
    if (index !== -1) {
      this.selectedParts.splice(index, 1);
    } else {
      this.selectedParts.push({...part});
    }
    this.sale.parts = [...this.selectedParts];
    this.calculateTotal();
  }

  isPartSelected(part: Part): boolean {
    return this.selectedParts.some(p => p.id === part.id);
  }

  getPartQuantity(part: Part): number {
    const selectedPart = this.selectedParts.find(p => p.id === part.id);
    return selectedPart ? selectedPart.quantity : 1;
  }

  updatePartQuantity(part: Part, quantity: number) {
    const selectedPart = this.selectedParts.find(p => p.id === part.id);
    if (selectedPart) {
      selectedPart.quantity = quantity;
      this.calculateTotal();
    }
  }

  getPaymentMethodLabel(value: string): string {
    const method = this.paymentMethods.find(m => m.value === value);
    return method ? method.label : '';
  }

  calculateTotal() {
    let total = 0;

    if (this.selectedVehicle) {
      total += this.selectedVehicle.price;
    }

    this.selectedParts.forEach(part => {
      total += part.price * part.quantity;
    });

    this.sale.total = total;
  }

  confirmSale() {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea registrar esta venta?',
      header: 'Confirmar Venta',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Aquí se enviaría la venta al backend
        this.sale.id = this.createId();
        this.sale.date = new Date();
        this.sale.status = 'completada';

        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Venta registrada correctamente', life: 3000 });

        // Reiniciar el formulario
        setTimeout(() => {
          this.resetForm();
        }, 2000);
      }
    });
  }

  resetForm() {
    this.activeIndex = 0;
    this.selectedCustomer = null;
    this.selectedVehicle = null;
    this.selectedParts = [];
    this.sale = this.initializeNewSale();
  }

  createId(): number {
    return Math.floor(Math.random() * 1000);
  }

  initializeNewSale(): Sale {
    return {
      id: 0,
      date: new Date(),
      customer: null as unknown as Customer,
      vehicle: undefined,
      parts: [],
      total: 0,
      status: 'pendiente',
      paymentMethod: '',
      notes: ''
    };
  }
}
