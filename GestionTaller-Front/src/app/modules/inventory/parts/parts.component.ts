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
import { InputNumberModule } from 'primeng/inputnumber';
import { CurrencyPipe, NgClass } from "@angular/common";
import { Tag } from "primeng/tag";
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InventoryService, Part } from '../../../core/inventory.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-parts',
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
    InputNumberModule,
    NgClass,
    Tag,
    CurrencyPipe,
    IconFieldModule,
    InputIconModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './parts.component.html'
})
export class PartsComponent implements OnInit {
  parts: Part[] = [];
  part: Part = this.initializeNewPart();
  selectedParts: Part[] = [];
  partDialog: boolean = false;
  submitted: boolean = false;
  categories: any[] = [];

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private inventoryService: InventoryService
  ) {}

  ngOnInit() {
    // Cargar datos desde el backend
    this.loadParts();

    this.categories = [
      { label: 'Filtros', value: 'filtros' },
      { label: 'Frenos', value: 'frenos' },
      { label: 'Electricidad', value: 'electricidad' },
      { label: 'Suspensión', value: 'suspension' },
      { label: 'Lubricantes', value: 'lubricantes' },
      { label: 'Motor', value: 'motor' },
      { label: 'Transmisión', value: 'transmision' },
      { label: 'Carrocería', value: 'carroceria' }
    ];
  }

  openNew() {
    this.part = this.initializeNewPart();
    this.submitted = false;
    this.partDialog = true;
  }

  loadParts() {
    this.inventoryService.getParts().subscribe({
      next: (data) => {
        this.parts = data;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar repuestos', life: 3000 });
        console.error('Error loading parts', error);
      }
    });
  }

  deleteSelectedParts() {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar los repuestos seleccionados?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Crear un array de observables para eliminar cada repuesto
        const deleteObservables = this.selectedParts.map(part => 
          this.inventoryService.deletePart(part.id)
        );

        // Usar forkJoin para esperar a que todas las eliminaciones se completen
        if (deleteObservables.length > 0) {
          forkJoin(deleteObservables).subscribe({
            next: () => {
              this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Repuestos eliminados', life: 3000 });
              this.selectedParts = [];
              this.loadParts();
            },
            error: (error) => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar repuestos', life: 3000 });
              console.error('Error deleting parts', error);
            }
          });
        }
      }
    });
  }

  editPart(part: Part) {
    this.part = { ...part };
    this.partDialog = true;
  }

  deletePart(part: Part) {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar este repuesto?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.inventoryService.deletePart(part.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Repuesto eliminado', life: 3000 });
            this.loadParts();
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar repuesto', life: 3000 });
            console.error('Error deleting part', error);
          }
        });
      }
    });
  }

  hideDialog() {
    this.partDialog = false;
    this.submitted = false;
  }

  savePart() {
    this.submitted = true;

    if (this.part.name.trim()) {
      if (this.part.id) {
        // Actualizar repuesto existente
        this.inventoryService.updatePart(this.part).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Repuesto actualizado', life: 3000 });
            this.loadParts();
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar repuesto', life: 3000 });
            console.error('Error updating part', error);
          }
        });
      } else {
        // Crear nuevo repuesto
        this.inventoryService.createPart(this.part).subscribe({
          next: (part) => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Repuesto creado', life: 3000 });
            this.loadParts();
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear repuesto', life: 3000 });
            console.error('Error creating part', error);
          }
        });
      }

      this.partDialog = false;
      this.part = this.initializeNewPart();
    }
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.parts.length; i++) {
      if (this.parts[i].id === id) {
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

  initializeNewPart(): Part {
    return {
      id: 0,
      name: '',
      category: '',
      sku: '',
      price: 0,
      stock: 0,
      minStock: 0,
      supplier: ''
    };
  }

  getStockSeverity(part: Part): string {
    if (part.stock <= 0) {
      return 'danger';
    } else if (part.stock <= part.minStock) {
      return 'warning';
    }
    return 'success';
  }
}
