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
import { InventoryService, Vehicle } from '../../../core/inventory.service';
import { forkJoin } from 'rxjs';

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
    private confirmationService: ConfirmationService,
    private inventoryService: InventoryService
  ) {}

  ngOnInit() {
    // Cargar datos desde el backend
    this.loadVehicles();

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
        // Crear un array de observables para eliminar cada vehículo
        const deleteObservables = this.selectedVehicles.map(vehicle => 
          this.inventoryService.deleteVehicle(vehicle.id)
        );

        // Usar forkJoin para esperar a que todas las eliminaciones se completen
        if (deleteObservables.length > 0) {
          forkJoin(deleteObservables).subscribe({
            next: () => {
              this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Vehículos eliminados', life: 3000 });
              this.selectedVehicles = [];
              this.loadVehicles();
            },
            error: (error) => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar vehículos', life: 3000 });
              console.error('Error deleting vehicles', error);
            }
          });
        }
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
        this.inventoryService.deleteVehicle(vehicle.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Vehículo eliminado', life: 3000 });
            this.loadVehicles();
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar vehículo', life: 3000 });
            console.error('Error deleting vehicle', error);
          }
        });
      }
    });
  }

  hideDialog() {
    this.vehicleDialog = false;
    this.submitted = false;
  }

  loadVehicles() {
    this.inventoryService.getVehicles().subscribe({
      next: (data) => {
        this.vehicles = data;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar vehículos', life: 3000 });
        console.error('Error loading vehicles', error);
      }
    });
  }

  saveVehicle() {
    this.submitted = true;

    if (this.vehicle.brand.trim() && this.vehicle.model.trim()) {
      if (this.vehicle.id) {
        // Actualizar vehículo existente
        this.inventoryService.updateVehicle(this.vehicle).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Vehículo actualizado', life: 3000 });
            this.loadVehicles();
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar vehículo', life: 3000 });
            console.error('Error updating vehicle', error);
          }
        });
      } else {
        // Crear nuevo vehículo
        this.inventoryService.createVehicle(this.vehicle).subscribe({
          next: (vehicle) => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Vehículo creado', life: 3000 });
            this.loadVehicles();
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear vehículo', life: 3000 });
            console.error('Error creating vehicle', error);
          }
        });
      }

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
