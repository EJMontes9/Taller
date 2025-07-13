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
import { CurrencyPipe, NgClass } from "@angular/common";
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  description: string;
  quantity: number;
  location: string;
  purchaseDate: Date;
  purchasePrice: number;
}

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
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    // Simular datos que vendrían del backend
    this.items = [
      {
        id: 1,
        name: 'Compresor de aire',
        category: 'herramientas',
        description: 'Compresor de aire para taller',
        quantity: 2,
        location: 'Almacén principal',
        purchaseDate: new Date('2023-01-15'),
        purchasePrice: 350.00
      },
      {
        id: 2,
        name: 'Kit de limpieza de interiores',
        category: 'limpieza',
        description: 'Kit completo para limpieza de interiores de vehículos',
        quantity: 5,
        location: 'Estante B3',
        purchaseDate: new Date('2023-03-22'),
        purchasePrice: 45.99
      },
      {
        id: 3,
        name: 'Gato hidráulico',
        category: 'herramientas',
        description: 'Gato hidráulico de 3 toneladas',
        quantity: 3,
        location: 'Área de servicio',
        purchaseDate: new Date('2022-11-05'),
        purchasePrice: 120.50
      },
      {
        id: 4,
        name: 'Cera para automóviles',
        category: 'limpieza',
        description: 'Cera de carnauba premium',
        quantity: 15,
        location: 'Estante A2',
        purchaseDate: new Date('2023-05-10'),
        purchasePrice: 18.75
      },
      {
        id: 5,
        name: 'Juego de llaves',
        category: 'herramientas',
        description: 'Juego de llaves métricas y estándar',
        quantity: 4,
        location: 'Caja de herramientas',
        purchaseDate: new Date('2023-02-18'),
        purchasePrice: 85.00
      }
    ];

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

  deleteSelectedItems() {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar los artículos seleccionados?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.items = this.items.filter(val => !this.selectedItems.includes(val));
        this.selectedItems = [];
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Artículos eliminados', life: 3000 });
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
        this.items = this.items.filter(val => val.id !== item.id);
        this.item = this.initializeNewItem();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Artículo eliminado', life: 3000 });
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
        const index = this.findIndexById(this.item.id);
        if (index !== -1) {
          this.items[index] = this.item;
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Artículo actualizado', life: 3000 });
        }
      } else {
        // Crear nuevo artículo
        this.item.id = this.createId();
        this.items.push(this.item);
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Artículo creado', life: 3000 });
      }

      this.items = [...this.items];
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

  formatDate(date: Date): string {
    return date.toLocaleDateString();
  }
}
