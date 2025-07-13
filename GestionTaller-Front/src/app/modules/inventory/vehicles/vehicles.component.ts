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
import { SelectModule } from 'primeng/select';
import { CurrencyPipe, NgClass } from "@angular/common";
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

interface Vehicle {
  id: number;
  brand: string;
  model: string;
  year: number;
  color: string;
  price: number;
  status: string;
  vin: string;
}

@Component({
  selector: 'app-vehicles',
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
    SelectModule,
    NgClass,
    CurrencyPipe,
    IconFieldModule,
    InputIconModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './vehicles.component.html'
})
export class VehiclesComponent implements OnInit {
  vehicles: Vehicle[] = [];
  vehicle: Vehicle = this.initializeNewVehicle();
  selectedVehicles: Vehicle[] = [];
  vehicleDialog: boolean = false;
  submitted: boolean = false;
  statuses: any[] = [];

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    // Simular datos que vendrían del backend
    this.vehicles = [
      {
        id: 1,
        brand: 'Toyota',
        model: 'Corolla',
        year: 2023,
        color: 'Blanco',
        price: 25000,
        status: 'disponible',
        vin: 'ABC123456789'
      },
      {
        id: 2,
        brand: 'Honda',
        model: 'Civic',
        year: 2022,
        color: 'Negro',
        price: 23500,
        status: 'disponible',
        vin: 'DEF987654321'
      },
      {
        id: 3,
        brand: 'Ford',
        model: 'Mustang',
        year: 2023,
        color: 'Rojo',
        price: 45000,
        status: 'vendido',
        vin: 'GHI456789123'
      },
      {
        id: 4,
        brand: 'Chevrolet',
        model: 'Camaro',
        year: 2022,
        color: 'Amarillo',
        price: 48000,
        status: 'disponible',
        vin: 'JKL789123456'
      },
      {
        id: 5,
        brand: 'Nissan',
        model: 'Sentra',
        year: 2023,
        color: 'Gris',
        price: 22000,
        status: 'disponible',
        vin: 'MNO321654987'
      }
    ];

    this.statuses = [
      { label: 'Disponible', value: 'disponible' },
      { label: 'Vendido', value: 'vendido' },
      { label: 'En mantenimiento', value: 'mantenimiento' }
    ];
  }

  openNew() {
    this.vehicle = this.initializeNewVehicle();
    this.submitted = false;
    this.vehicleDialog = true;
  }

  deleteSelectedVehicles() {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar los vehículos seleccionados?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.vehicles = this.vehicles.filter(val => !this.selectedVehicles.includes(val));
        this.selectedVehicles = [];
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Vehículos eliminados', life: 3000 });
      }
    });
  }

  editVehicle(vehicle: Vehicle) {
    this.vehicle = { ...vehicle };
    this.vehicleDialog = true;
  }

  deleteVehicle(vehicle: Vehicle) {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar este vehículo?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.vehicles = this.vehicles.filter(val => val.id !== vehicle.id);
        this.vehicle = this.initializeNewVehicle();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Vehículo eliminado', life: 3000 });
      }
    });
  }

  hideDialog() {
    this.vehicleDialog = false;
    this.submitted = false;
  }

  saveVehicle() {
    this.submitted = true;

    if (this.vehicle.brand.trim() && this.vehicle.model.trim()) {
      if (this.vehicle.id) {
        // Actualizar vehículo existente
        const index = this.findIndexById(this.vehicle.id);
        if (index !== -1) {
          this.vehicles[index] = this.vehicle;
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Vehículo actualizado', life: 3000 });
        }
      } else {
        // Crear nuevo vehículo
        this.vehicle.id = this.createId();
        this.vehicles.push(this.vehicle);
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Vehículo creado', life: 3000 });
      }

      this.vehicles = [...this.vehicles];
      this.vehicleDialog = false;
      this.vehicle = this.initializeNewVehicle();
    }
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.vehicles.length; i++) {
      if (this.vehicles[i].id === id) {
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

  initializeNewVehicle(): Vehicle {
    return {
      id: 0,
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      color: '',
      price: 0,
      status: 'disponible',
      vin: ''
    };
  }
}
