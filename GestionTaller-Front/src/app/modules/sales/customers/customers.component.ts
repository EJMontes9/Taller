import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
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

// Interfaz del cliente que coincide con el modelo del backend
interface Customer {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
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

  private apiUrl = environment.apiUrl;
  private xmlHeaders = new HttpHeaders({
    'Content-Type': 'application/xml',
    'Accept': 'application/xml'
  });

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  // XML parser helper
  private parseXml(xml: string): any {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');
    return this.xmlToJson(xmlDoc);
  }

  // Convert XML to JSON
  private xmlToJson(xml: Document | Element): any {
    // Define result with index signature to allow dynamic property access
    const result: { [key: string]: any } = {};

    // Check if the node is an Element (not a Document) before accessing attributes
    if (xml.nodeType === Node.ELEMENT_NODE && 'attributes' in xml) {
      const element = xml as Element;
      if (element.attributes && element.attributes.length > 0) {
        for (let i = 0; i < element.attributes.length; i++) {
          const attribute = element.attributes[i];
          result[attribute.nodeName] = attribute.nodeValue;
        }
      }
    }

    if (xml.hasChildNodes()) {
      for (let i = 0; i < xml.childNodes.length; i++) {
        const item = xml.childNodes[i];
        const nodeName = item.nodeName;

        if (nodeName === '#text') {
          // Add null check for nodeValue
          if (item.nodeValue && item.nodeValue.trim() !== '') {
            return item.nodeValue;
          }
        } else {
          const obj = this.xmlToJson(item as Element);

          if (result[nodeName]) {
            if (!Array.isArray(result[nodeName])) {
              result[nodeName] = [result[nodeName]];
            }
            result[nodeName].push(obj);
          } else {
            result[nodeName] = obj;
          }
        }
      }
    }

    return result;
  }

  // Convert JSON to XML
  private jsonToXml(obj: any, rootName: string): string {
    let xml = `<?xml version="1.0" encoding="UTF-8"?><${rootName}>`;

    for (const prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        const value = obj[prop];
        if (value !== null && value !== undefined) {
          if (typeof value === 'object' && !(value instanceof Date)) {
            xml += `<${prop}>${this.jsonToXml(value, '')}</${prop}>`;
          } else {
            let formattedValue = value;
            if (value instanceof Date) {
              formattedValue = value.toISOString();
            }
            xml += `<${prop}>${formattedValue}</${prop}>`;
          }
        }
      }
    }

    xml += `</${rootName}>`;
    return xml;
  }

  // Métodos para comunicarse con el backend

  // Obtener todos los clientes
  private fetchCustomers(): Observable<Customer[]> {
    return this.http.get(`${this.apiUrl}/clientes`, { 
      headers: this.xmlHeaders,
      responseType: 'text'
    }).pipe(
      map(xml => {
        const parsed = this.parseXml(xml);
        console.log('Parsed Customers XML:', parsed); // Debug log

        // Navigate through the nested structure:
        // anyType -> ClientesWrapper -> Clientes -> ClienteWrapper -> Cliente
        if (parsed.anyType && parsed.anyType.Clientes && parsed.anyType.Clientes.ClienteWrapper) {
          // Extract customers from the wrapper structure
          return parsed.anyType.Clientes.ClienteWrapper.map((wrapper: any) => wrapper.Cliente);
        }

        // Fallback to the original path in case the structure changes
        return parsed.Clientes?.Cliente || [];
      }),
      catchError(error => {
        console.error('Error fetching customers', error);
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Error al cargar clientes', 
          life: 3000 
        });
        return [];
      })
    );
  }

  // Obtener un cliente por su ID
  private fetchCustomer(id: number): Observable<Customer> {
    return this.http.get(`${this.apiUrl}/clientes/${id}`, { 
      headers: this.xmlHeaders,
      responseType: 'text'
    }).pipe(
      map(xml => this.parseXml(xml).Cliente),
      catchError(error => {
        console.error(`Error fetching customer ${id}`, error);
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: `Error al cargar cliente ${id}`, 
          life: 3000 
        });
        throw error;
      })
    );
  }

  // Crear un nuevo cliente
  private createCustomerOnServer(customer: Customer): Observable<Customer> {
    const xml = this.jsonToXml(customer, 'Cliente');
    return this.http.post(`${this.apiUrl}/clientes`, xml, { 
      headers: this.xmlHeaders,
      responseType: 'text'
    }).pipe(
      map(xml => this.parseXml(xml).Cliente),
      catchError(error => {
        console.error('Error creating customer', error);
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Error al crear cliente', 
          life: 3000 
        });
        throw error;
      })
    );
  }

  // Actualizar un cliente existente
  private updateCustomerOnServer(customer: Customer): Observable<any> {
    const xml = this.jsonToXml(customer, 'Cliente');
    return this.http.put(`${this.apiUrl}/clientes/${customer.id}`, xml, { 
      headers: this.xmlHeaders
    }).pipe(
      catchError(error => {
        console.error(`Error updating customer ${customer.id}`, error);
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: `Error al actualizar cliente ${customer.id}`, 
          life: 3000 
        });
        throw error;
      })
    );
  }

  // Eliminar un cliente
  private deleteCustomerFromServer(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clientes/${id}`, { 
      headers: this.xmlHeaders
    }).pipe(
      catchError(error => {
        console.error(`Error deleting customer ${id}`, error);
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: `Error al eliminar cliente ${id}`, 
          life: 3000 
        });
        throw error;
      })
    );
  }

  ngOnInit() {
    // Cargar datos desde el backend
    this.loadCustomers();
  }

  // Cargar clientes desde el backend
  loadCustomers() {
    this.fetchCustomers().subscribe({
      next: (data) => {
        this.customers = data;
      },
      error: (error) => {
        console.error('Error loading customers', error);
        // Si hay un error, mostrar un mensaje pero no bloquear la interfaz
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Error al cargar clientes. Usando datos de ejemplo.', 
          life: 3000 
        });

        // Usar datos de ejemplo en caso de error
        this.customers = [
          {
            id: 1,
            nombre: 'Juan',
            apellido: 'Pérez',
            email: 'juan.perez@email.com',
            telefono: '555-1234'
          },
          {
            id: 2,
            nombre: 'María',
            apellido: 'García',
            email: 'maria.garcia@email.com',
            telefono: '555-5678'
          }
        ];
      }
    });
  }

  openNew() {
    this.customer = this.initializeNewCustomer();
    this.submitted = false;
    this.customerDialog = true;
  }

  // Eliminar múltiples clientes seleccionados
  deleteSelectedCustomers() {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar los clientes seleccionados?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Crear un array de observables para eliminar cada cliente
        const deleteObservables = this.selectedCustomers.map(customer => 
          this.deleteCustomerFromServer(customer.id)
        );

        // Usar forkJoin para esperar a que todas las eliminaciones se completen
        if (deleteObservables.length > 0) {
          forkJoin(deleteObservables).subscribe({
            next: () => {
              this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Clientes eliminados', life: 3000 });
              this.selectedCustomers = [];
              this.loadCustomers(); // Recargar la lista de clientes
            },
            error: (error) => {
              console.error('Error deleting selected customers', error);
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar clientes', life: 3000 });
            }
          });
        }
      }
    });
  }

  editCustomer(customer: Customer) {
    this.customer = { ...customer };
    this.customerDialog = true;
  }

  // Eliminar un cliente
  deleteCustomer(customer: Customer) {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar este cliente?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteCustomerFromServer(customer.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente eliminado', life: 3000 });
            this.loadCustomers(); // Recargar la lista de clientes
          },
          error: (error) => {
            console.error(`Error deleting customer ${customer.id}`, error);
            // El mensaje de error ya se muestra en el método deleteCustomerFromServer
          }
        });
      }
    });
  }

  hideDialog() {
    this.customerDialog = false;
    this.submitted = false;
  }

  // Guardar cliente (crear nuevo o actualizar existente)
  saveCustomer() {
    this.submitted = true;

    if (this.customer.nombre.trim() && this.customer.apellido.trim()) {
      if (this.customer.id) {
        // Actualizar cliente existente
        this.updateCustomerOnServer(this.customer).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente actualizado', life: 3000 });
            this.loadCustomers(); // Recargar la lista de clientes
          },
          error: (error) => {
            console.error('Error updating customer', error);
            // El mensaje de error ya se muestra en el método updateCustomerOnServer
          }
        });
      } else {
        // Crear nuevo cliente
        this.createCustomerOnServer(this.customer).subscribe({
          next: (createdCustomer) => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente creado', life: 3000 });
            this.loadCustomers(); // Recargar la lista de clientes
          },
          error: (error) => {
            console.error('Error creating customer', error);
            // El mensaje de error ya se muestra en el método createCustomerOnServer
          }
        });
      }

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

  // Inicializar un nuevo cliente con valores por defecto
  initializeNewCustomer(): Customer {
    return {
      id: 0,
      nombre: '',
      apellido: '',
      email: '',
      telefono: ''
    };
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return date.toLocaleDateString();
  }
}
