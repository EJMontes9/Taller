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

interface Part {
  id: number;
  name: string;
  category: string;
  sku: string;
  price: number;
  stock: number;
  minStock: number;
  supplier: string;
}

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
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    // Simular datos que vendrían del backend
    this.parts = [
      {
        id: 1,
        name: 'Filtro de aceite',
        category: 'filtros',
        sku: 'FIL-001',
        price: 15.99,
        stock: 45,
        minStock: 10,
        supplier: 'AutoPartes S.A.'
      },
      {
        id: 2,
        name: 'Pastillas de freno',
        category: 'frenos',
        sku: 'FRE-002',
        price: 45.50,
        stock: 20,
        minStock: 5,
        supplier: 'Frenos Seguros Inc.'
      },
      {
        id: 3,
        name: 'Batería 12V',
        category: 'electricidad',
        sku: 'BAT-003',
        price: 89.99,
        stock: 15,
        minStock: 3,
        supplier: 'ElectroAuto'
      },
      {
        id: 4,
        name: 'Amortiguador delantero',
        category: 'suspension',
        sku: 'SUS-004',
        price: 120.00,
        stock: 8,
        minStock: 2,
        supplier: 'Suspensiones Pro'
      },
      {
        id: 5,
        name: 'Aceite de motor 5W-30',
        category: 'lubricantes',
        sku: 'LUB-005',
        price: 25.99,
        stock: 50,
        minStock: 10,
        supplier: 'LubriMax'
      }
    ];

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

  deleteSelectedParts() {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar los repuestos seleccionados?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.parts = this.parts.filter(val => !this.selectedParts.includes(val));
        this.selectedParts = [];
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Repuestos eliminados', life: 3000 });
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
        this.parts = this.parts.filter(val => val.id !== part.id);
        this.part = this.initializeNewPart();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Repuesto eliminado', life: 3000 });
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
        const index = this.findIndexById(this.part.id);
        if (index !== -1) {
          this.parts[index] = this.part;
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Repuesto actualizado', life: 3000 });
        }
      } else {
        // Crear nuevo repuesto
        this.part.id = this.createId();
        this.parts.push(this.part);
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Repuesto creado', life: 3000 });
      }

      this.parts = [...this.parts];
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
