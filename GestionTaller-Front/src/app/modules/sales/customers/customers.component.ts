import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { InputMaskModule } from 'primeng/inputmask';
import { NgClass } from "@angular/common";
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  registrationDate: Date;
  lastPurchaseDate?: Date;
  totalPurchases: number;
}

@Component({
  selector: 'app-customers',
  standalone: true,
    imports: [
        TableModule,
        ButtonModule,
        InputTextModule,
        DialogModule,
        ToastModule,
        ConfirmDialogModule,
        FormsModule,
        InputMaskModule,
        NgClass,
        IconFieldModule,
        InputIconModule
    ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './customers.component.html'
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  customer: Customer = this.initializeNewCustomer();
  selectedCustomers: Customer[] = [];
  customerDialog: boolean = false;
  submitted: boolean = false;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    // Simular datos que vendrían del backend
    this.customers = [
      {
        id: 1,
        name: 'Juan Pérez',
        email: 'juan.perez@email.com',
        phone: '555-1234',
        address: 'Calle Principal 123',
        city: 'Ciudad de México',
        postalCode: '01000',
        registrationDate: new Date('2022-03-15'),
        lastPurchaseDate: new Date('2023-05-20'),
        totalPurchases: 3
      },
      {
        id: 2,
        name: 'María García',
        email: 'maria.garcia@email.com',
        phone: '555-5678',
        address: 'Avenida Central 456',
        city: 'Guadalajara',
        postalCode: '44100',
        registrationDate: new Date('2022-06-10'),
        lastPurchaseDate: new Date('2023-04-12'),
        totalPurchases: 2
      },
      {
        id: 3,
        name: 'Carlos Rodríguez',
        email: 'carlos.rodriguez@email.com',
        phone: '555-9012',
        address: 'Plaza Mayor 789',
        city: 'Monterrey',
        postalCode: '64000',
        registrationDate: new Date('2022-01-05'),
        lastPurchaseDate: new Date('2023-06-01'),
        totalPurchases: 5
      },
      {
        id: 4,
        name: 'Ana Martínez',
        email: 'ana.martinez@email.com',
        phone: '555-3456',
        address: 'Calle Reforma 234',
        city: 'Puebla',
        postalCode: '72000',
        registrationDate: new Date('2022-09-20'),
        lastPurchaseDate: new Date('2023-02-15'),
        totalPurchases: 1
      },
      {
        id: 5,
        name: 'Roberto Sánchez',
        email: 'roberto.sanchez@email.com',
        phone: '555-7890',
        address: 'Avenida Juárez 567',
        city: 'Querétaro',
        postalCode: '76000',
        registrationDate: new Date('2022-11-30'),
        totalPurchases: 0
      }
    ];
  }

  openNew() {
    this.customer = this.initializeNewCustomer();
    this.submitted = false;
    this.customerDialog = true;
  }

  deleteSelectedCustomers() {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar los clientes seleccionados?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.customers = this.customers.filter(val => !this.selectedCustomers.includes(val));
        this.selectedCustomers = [];
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Clientes eliminados', life: 3000 });
      }
    });
  }

  editCustomer(customer: Customer) {
    this.customer = { ...customer };
    this.customerDialog = true;
  }

  deleteCustomer(customer: Customer) {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar este cliente?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.customers = this.customers.filter(val => val.id !== customer.id);
        this.customer = this.initializeNewCustomer();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente eliminado', life: 3000 });
      }
    });
  }

  hideDialog() {
    this.customerDialog = false;
    this.submitted = false;
  }

  saveCustomer() {
    this.submitted = true;

    if (this.customer.name.trim() && this.customer.email.trim()) {
      if (this.customer.id) {
        // Actualizar cliente existente
        const index = this.findIndexById(this.customer.id);
        if (index !== -1) {
          this.customers[index] = this.customer;
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente actualizado', life: 3000 });
        }
      } else {
        // Crear nuevo cliente
        this.customer.id = this.createId();
        this.customer.registrationDate = new Date();
        this.customers.push(this.customer);
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente creado', life: 3000 });
      }

      this.customers = [...this.customers];
      this.customerDialog = false;
      this.customer = this.initializeNewCustomer();
    }
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.customers.length; i++) {
      if (this.customers[i].id === id) {
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

  initializeNewCustomer(): Customer {
    return {
      id: 0,
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      registrationDate: new Date(),
      totalPurchases: 0
    };
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return date.toLocaleDateString();
  }
}
