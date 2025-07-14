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
import { TextareaModule } from 'primeng/textarea';
import { CurrencyPipe, NgClass, DatePipe } from "@angular/common";
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InventoryService, InventoryItem } from '../../../core/inventory.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-other',
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
    TextareaModule,
    NgClass,
    CurrencyPipe,
    DatePipe,
    IconFieldModule,
    InputIconModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './other.component.html'
})
export class OtherComponent implements OnInit {
  items: InventoryItem[] = [];
  item: InventoryItem = this.initializeNewItem();
  selectedItems: InventoryItem[] = [];
  itemDialog: boolean = false;
  submitted: boolean = false;
  categories: any[] = [];

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private inventoryService: InventoryService
  ) {}

  ngOnInit() {
    // Cargar datos desde el backend
    this.loadInventoryItems();

    this.categories = [
      { label: 'Herramientas', value: 'herramientas' },
      { label: 'Limpieza', value: 'limpieza' },
      { label: 'Equipamiento', value: 'equipamiento' },
      { label: 'Seguridad', value: 'seguridad' },
      { label: 'Oficina', value: 'oficina' },
      { label: 'Otros', value: 'otros' }
    ];
  }

  openNew() {
    this.item = this.initializeNewItem();
    this.submitted = false;
    this.itemDialog = true;
  }

  loadInventoryItems() {
    this.inventoryService.getInventoryItems().subscribe({
      next: (data) => {
        this.items = data;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar artículos', life: 3000 });
        console.error('Error loading inventory items', error);
      }
    });
  }

  deleteSelectedItems() {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar los artículos seleccionados?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Crear un array de observables para eliminar cada artículo
        const deleteObservables = this.selectedItems.map(item => 
          this.inventoryService.deleteInventoryItem(item.id)
        );

        // Usar forkJoin para esperar a que todas las eliminaciones se completen
        if (deleteObservables.length > 0) {
          forkJoin(deleteObservables).subscribe({
            next: () => {
              this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Artículos eliminados', life: 3000 });
              this.selectedItems = [];
              this.loadInventoryItems();
            },
            error: (error) => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar artículos', life: 3000 });
              console.error('Error deleting inventory items', error);
            }
          });
        }
      }
    });
  }

  editItem(item: InventoryItem) {
    this.item = { ...item };
    this.itemDialog = true;
  }

  deleteItem(item: InventoryItem) {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar este artículo?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.inventoryService.deleteInventoryItem(item.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Artículo eliminado', life: 3000 });
            this.loadInventoryItems();
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar artículo', life: 3000 });
            console.error('Error deleting inventory item', error);
          }
        });
      }
    });
  }

  hideDialog() {
    this.itemDialog = false;
    this.submitted = false;
  }

  saveItem() {
    this.submitted = true;

    if (this.item.name.trim()) {
      if (this.item.id) {
        // Actualizar artículo existente
        this.inventoryService.updateInventoryItem(this.item).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Artículo actualizado', life: 3000 });
            this.loadInventoryItems();
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar artículo', life: 3000 });
            console.error('Error updating inventory item', error);
          }
        });
      } else {
        // Crear nuevo artículo
        this.inventoryService.createInventoryItem(this.item).subscribe({
          next: (item) => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Artículo creado', life: 3000 });
            this.loadInventoryItems();
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear artículo', life: 3000 });
            console.error('Error creating inventory item', error);
          }
        });
      }

      this.itemDialog = false;
      this.item = this.initializeNewItem();
    }
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].id === id) {
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

  initializeNewItem(): InventoryItem {
    return {
      id: 0,
      name: '',
      category: '',
      description: '',
      quantity: 0,
      location: '',
      purchaseDate: new Date(),
      purchasePrice: 0
    };
  }

  formatDate(date: Date | string): string {
    if (!date) {
      return '';
    }

    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  }
}
