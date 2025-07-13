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
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { CurrencyPipe } from "@angular/common";
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

interface Customer {
  id: number;
  name: string;
  email: string;
}

interface Invoice {
  id: number;
  number: string;
  date: Date;
  customer: Customer;
  amount: number;
  status: string;
  paymentMethod: string;
  dueDate?: Date;
  items: InvoiceItem[];
}

interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

@Component({
  selector: 'app-invoices',
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
        TagModule,
        DropdownModule,
        CurrencyPipe,
        IconFieldModule,
        InputIconModule
    ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './invoices.component.html'
})
export class InvoicesComponent implements OnInit {
  invoices: Invoice[] = [];
  invoice: Invoice | null = null;
  selectedInvoices: Invoice[] = [];
  invoiceDialog: boolean = false;
  detailsDialog: boolean = false;
  statuses: any[] = [];
  paymentMethods: any[] = [];

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    // Simular datos que vendrían del backend
    this.invoices = [
      {
        id: 1,
        number: 'INV-2023-001',
        date: new Date('2023-06-15'),
        customer: { id: 1, name: 'Juan Pérez', email: 'juan.perez@email.com' },
        amount: 25000,
        status: 'pagada',
        paymentMethod: 'credito',
        items: [
          { id: 1, description: 'Toyota Corolla 2023', quantity: 1, unitPrice: 25000, total: 25000 }
        ]
      },
      {
        id: 2,
        number: 'INV-2023-002',
        date: new Date('2023-06-20'),
        customer: { id: 2, name: 'María García', email: 'maria.garcia@email.com' },
        amount: 150.49,
        status: 'pagada',
        paymentMethod: 'efectivo',
        items: [
          { id: 1, description: 'Filtro de aceite', quantity: 2, unitPrice: 15.99, total: 31.98 },
          { id: 2, description: 'Pastillas de freno', quantity: 1, unitPrice: 45.50, total: 45.50 },
          { id: 3, description: 'Servicio de cambio de aceite', quantity: 1, unitPrice: 73.01, total: 73.01 }
        ]
      },
      {
        id: 3,
        number: 'INV-2023-003',
        date: new Date('2023-06-25'),
        customer: { id: 3, name: 'Carlos Rodríguez', email: 'carlos.rodriguez@email.com' },
        amount: 45000,
        status: 'pendiente',
        paymentMethod: 'transferencia',
        dueDate: new Date('2023-07-25'),
        items: [
          { id: 1, description: 'Ford Mustang 2023', quantity: 1, unitPrice: 45000, total: 45000 }
        ]
      },
      {
        id: 4,
        number: 'INV-2023-004',
        date: new Date('2023-06-30'),
        customer: { id: 4, name: 'Ana Martínez', email: 'ana.martinez@email.com' },
        amount: 89.99,
        status: 'pagada',
        paymentMethod: 'debito',
        items: [
          { id: 1, description: 'Batería 12V', quantity: 1, unitPrice: 89.99, total: 89.99 }
        ]
      },
      {
        id: 5,
        number: 'INV-2023-005',
        date: new Date('2023-07-05'),
        customer: { id: 5, name: 'Roberto Sánchez', email: 'roberto.sanchez@email.com' },
        amount: 23500,
        status: 'anulada',
        paymentMethod: 'credito',
        items: [
          { id: 1, description: 'Honda Civic 2022', quantity: 1, unitPrice: 23500, total: 23500 }
        ]
      }
    ];

    this.statuses = [
      { label: 'Pagada', value: 'pagada' },
      { label: 'Pendiente', value: 'pendiente' },
      { label: 'Anulada', value: 'anulada' }
    ];

    this.paymentMethods = [
      { label: 'Efectivo', value: 'efectivo' },
      { label: 'Tarjeta de crédito', value: 'credito' },
      { label: 'Tarjeta de débito', value: 'debito' },
      { label: 'Transferencia bancaria', value: 'transferencia' }
    ];
  }

  viewInvoice(invoice: Invoice) {
    console.log('viewInvoice called with invoice:', invoice);
    // Create a deep copy of the invoice object
    this.invoice = {
      id: invoice.id,
      number: invoice.number,
      date: invoice.date,
      customer: { ...invoice.customer },
      amount: invoice.amount,
      status: invoice.status,
      paymentMethod: invoice.paymentMethod,
      dueDate: invoice.dueDate,
      items: invoice.items.map(item => ({ ...item }))
    };
    console.log('this.invoice set to:', this.invoice);
    this.detailsDialog = true;
  }

  printInvoice(invoice: Invoice) {
    // Aquí iría la lógica para imprimir la factura
    if (invoice && invoice.number) {
      console.log('Printing invoice:', invoice);
      this.messageService.add({ severity: 'info', summary: 'Información', detail: 'Imprimiendo factura ' + invoice.number, life: 3000 });
    } else {
      console.error('Cannot print invoice: invoice is null or has no number');
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se puede imprimir la factura', life: 3000 });
    }
  }

  sendInvoice(invoice: Invoice) {
    // Aquí iría la lógica para enviar la factura por email
    if (invoice && invoice.customer && invoice.customer.email) {
      console.log('Sending invoice to:', invoice.customer.email);
      this.messageService.add({ severity: 'info', summary: 'Información', detail: 'Enviando factura a ' + invoice.customer.email, life: 3000 });
    } else {
      console.error('Cannot send invoice: invoice is null or customer has no email');
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se puede enviar la factura', life: 3000 });
    }
  }

  cancelInvoice(invoice: Invoice) {
    if (invoice && invoice.id) {
      console.log('Cancelling invoice:', invoice);
      this.confirmationService.confirm({
        message: '¿Está seguro de que desea anular esta factura?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          // Aquí iría la lógica para anular la factura
          const index = this.findIndexById(invoice.id);
          if (index !== -1) {
            this.invoices[index].status = 'anulada';
            this.invoices = [...this.invoices];
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Factura anulada', life: 3000 });
          }
        }
      });
    } else {
      console.error('Cannot cancel invoice: invoice is null or has no id');
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se puede anular la factura', life: 3000 });
    }
  }

  hideDialog() {
    this.detailsDialog = false;
    this.invoice = null;
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.invoices.length; i++) {
      if (this.invoices[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return date.toLocaleDateString();
  }

  getStatusSeverity(status: string | undefined): string {
    if (!status) return 'info';
    switch (status) {
      case 'pagada':
        return 'success';
      case 'pendiente':
        return 'warning';
      case 'anulada':
        return 'danger';
      default:
        return 'info';
    }
  }

  getStatusLabel(status: string | undefined): string {
    if (!status) return 'N/A';
    const statusObj = this.statuses.find(s => s.value === status);
    return statusObj ? statusObj.label : status;
  }

  getPaymentMethodLabel(method: string | undefined): string {
    if (!method) return 'N/A';
    const methodObj = this.paymentMethods.find(m => m.value === method);
    return methodObj ? methodObj.label : method;
  }

  calculateTotal(items: InvoiceItem[]): number {
    return items.reduce((sum, item) => sum + item.total, 0);
  }
}
