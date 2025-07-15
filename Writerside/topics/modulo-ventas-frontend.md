# 3.3.4. Módulo de Ventas

El Módulo de Ventas es responsable de gestionar todo lo relacionado con las ventas y facturación en el sistema de Gestión de Taller. Este módulo proporciona funcionalidades para el registro de ventas, generación de facturas, gestión de pagos, historial de ventas y aplicación de descuentos.

## Componentes

### Componentes Principales

#### SalesListComponent

**Ruta**: `sales/list`

**Descripción**: Componente que muestra una lista paginada de todas las ventas realizadas con opciones de filtrado y búsqueda.

**Funcionalidades**:
- Listado paginado de ventas
- Filtrado por fecha, cliente, estado de pago
- Búsqueda por número de factura o cliente
- Ordenación por diferentes campos
- Acciones rápidas (ver detalles, editar, anular)

**Ejemplo de uso**:
```typescript
// sales-list.component.ts
@Component({
  selector: 'app-sales-list',
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.scss']
})
export class SalesListComponent implements OnInit {
  sales: Sale[] = [];
  filteredSales: Sale[] = [];
  loading = false;
  error: string = null;
  
  // Parámetros de paginación
  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  
  // Filtros
  searchTerm = '';
  dateRange: DateRange = {
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date()
  };
  selectedStatus = '';
  
  constructor(
    private salesService: SalesService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadSales();
  }

  loadSales() {
    this.loading = true;
    this.salesService.getSales(
      this.currentPage,
      this.pageSize,
      this.searchTerm,
      this.dateRange,
      this.selectedStatus
    ).subscribe(
      response => {
        this.sales = response.items;
        this.filteredSales = response.items;
        this.totalItems = response.totalItems;
        this.loading = false;
      },
      error => {
        this.error = 'Error al cargar las ventas';
        this.loading = false;
      }
    );
  }
  
  onPageChange(page: number) {
    this.currentPage = page;
    this.loadSales();
  }
  
  onSearch() {
    this.currentPage = 1;
    this.loadSales();
  }
  
  onViewDetails(id: string) {
    this.router.navigate(['/sales/details', id]);
  }
  
  onEdit(id: string) {
    this.router.navigate(['/sales/edit', id]);
  }
  
  onCancel(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirmar anulación', message: '¿Está seguro de que desea anular esta venta?' }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.salesService.cancelSale(id).subscribe(
          () => {
            this.loadSales();
          },
          error => {
            this.error = 'Error al anular la venta';
          }
        );
      }
    });
  }
  
  getTotalAmount() {
    return this.filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  }
}
```

#### SalesRegisterComponent

**Ruta**: `sales/register`

**Descripción**: Componente que permite registrar una nueva venta, seleccionando cliente, productos y método de pago.

**Funcionalidades**:
- Selección de cliente (existente o nuevo)
- Búsqueda y selección de productos
- Cálculo automático de subtotales, impuestos y total
- Aplicación de descuentos
- Selección de método de pago
- Generación de factura

**Ejemplo de uso**:
```typescript
// sales-register.component.ts
@Component({
  selector: 'app-sales-register',
  templateUrl: './sales-register.component.html',
  styleUrls: ['./sales-register.component.scss']
})
export class SalesRegisterComponent implements OnInit {
  saleForm: FormGroup;
  items: FormArray;
  
  clients: Client[] = [];
  products: Product[] = [];
  filteredProducts: Product[] = [];
  
  loading = false;
  submitting = false;
  error: string = null;
  
  constructor(
    private fb: FormBuilder,
    private salesService: SalesService,
    private clientService: ClientService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadClients();
    this.loadProducts();
  }

  initForm() {
    this.saleForm = this.fb.group({
      clientId: ['', Validators.required],
      items: this.fb.array([this.createItem()]),
      discount: [0, [Validators.min(0), Validators.max(100)]],
      paymentMethod: ['', Validators.required],
      notes: ['']
    });
    
    this.items = this.saleForm.get('items') as FormArray;
  }
  
  createItem(): FormGroup {
    return this.fb.group({
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [{value: 0, disabled: true}],
      subtotal: [{value: 0, disabled: true}]
    });
  }
  
  addItem() {
    this.items.push(this.createItem());
  }
  
  removeItem(index: number) {
    this.items.removeAt(index);
    this.calculateTotal();
  }
  
  loadClients() {
    this.clientService.getClients().subscribe(
      clients => {
        this.clients = clients;
      },
      error => {
        this.error = 'Error al cargar los clientes';
      }
    );
  }
  
  loadProducts() {
    this.productService.getProducts().subscribe(
      products => {
        this.products = products;
        this.filteredProducts = products;
      },
      error => {
        this.error = 'Error al cargar los productos';
      }
    );
  }
  
  onProductSelected(index: number) {
    const itemGroup = this.items.at(index) as FormGroup;
    const productId = itemGroup.get('productId').value;
    const product = this.products.find(p => p.id === productId);
    
    if (product) {
      itemGroup.patchValue({
        unitPrice: product.price,
        subtotal: product.price * itemGroup.get('quantity').value
      });
      
      this.calculateTotal();
    }
  }
  
  onQuantityChanged(index: number) {
    const itemGroup = this.items.at(index) as FormGroup;
    const quantity = itemGroup.get('quantity').value;
    const unitPrice = itemGroup.get('unitPrice').value;
    
    itemGroup.patchValue({
      subtotal: quantity * unitPrice
    });
    
    this.calculateTotal();
  }
  
  calculateTotal() {
    let subtotal = 0;
    
    for (let i = 0; i < this.items.length; i++) {
      const itemGroup = this.items.at(i) as FormGroup;
      subtotal += itemGroup.get('subtotal').value || 0;
    }
    
    const discount = this.saleForm.get('discount').value || 0;
    const discountAmount = subtotal * (discount / 100);
    const total = subtotal - discountAmount;
    
    this.saleForm.patchValue({
      subtotal: subtotal,
      total: total
    });
  }
  
  onSubmit() {
    if (this.saleForm.invalid) {
      return;
    }
    
    this.submitting = true;
    
    const saleData = {
      clientId: this.saleForm.get('clientId').value,
      items: this.items.value.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      })),
      discount: this.saleForm.get('discount').value,
      paymentMethod: this.saleForm.get('paymentMethod').value,
      notes: this.saleForm.get('notes').value
    };
    
    this.salesService.createSale(saleData).subscribe(
      response => {
        this.submitting = false;
        this.router.navigate(['/sales/details', response.id]);
      },
      error => {
        this.error = 'Error al registrar la venta';
        this.submitting = false;
      }
    );
  }
}
```

#### SalesDetailsComponent

**Ruta**: `sales/details/:id`

**Descripción**: Componente que muestra los detalles completos de una venta, incluyendo los productos vendidos, información del cliente y datos de facturación.

**Funcionalidades**:
- Visualización de datos completos de la venta
- Impresión de factura
- Envío de factura por correo electrónico
- Registro de pagos
- Anulación de venta

#### InvoiceComponent

**Ruta**: `sales/invoice/:id`

**Descripción**: Componente que muestra una factura en formato imprimible.

**Funcionalidades**:
- Visualización de factura con formato profesional
- Impresión directa
- Descarga en formato PDF
- Envío por correo electrónico

#### PaymentComponent

**Ruta**: `sales/payment/:id`

**Descripción**: Componente que permite registrar pagos para ventas a crédito o con pagos parciales.

**Funcionalidades**:
- Registro de pagos parciales
- Selección de método de pago
- Cálculo de saldo pendiente
- Generación de recibo de pago

## Servicios

### SalesService

**Descripción**: Servicio principal que gestiona las operaciones relacionadas con ventas.

**Métodos principales**:
- `getSales(page: number, pageSize: number, search?: string, dateRange?: DateRange, status?: string): Observable<PagedResult<Sale>>`
- `getSale(id: string): Observable<Sale>`
- `createSale(data: CreateSale): Observable<Sale>`
- `updateSale(id: string, data: UpdateSale): Observable<Sale>`
- `cancelSale(id: string): Observable<void>`
- `getInvoice(id: string): Observable<Invoice>`
- `sendInvoiceByEmail(id: string, email: string): Observable<void>`
- `registerPayment(saleId: string, data: CreatePayment): Observable<Payment>`

**Ejemplo de implementación**:
```typescript
// sales.service.ts
@Injectable({
  providedIn: 'root'
})
export class SalesService {
  constructor(private http: HttpClient) {}
  
  getSales(
    page: number = 1,
    pageSize: number = 10,
    search?: string,
    dateRange?: DateRange,
    status?: string
  ): Observable<PagedResult<Sale>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
      
    if (search) {
      params = params.set('search', search);
    }
    
    if (dateRange) {
      params = params.set('startDate', dateRange.startDate.toISOString())
             .set('endDate', dateRange.endDate.toISOString());
    }
    
    if (status) {
      params = params.set('status', status);
    }
    
    return this.http.get<PagedResult<Sale>>(`${environment.apiUrl}/sales`, { params });
  }
  
  getSale(id: string): Observable<Sale> {
    return this.http.get<Sale>(`${environment.apiUrl}/sales/${id}`);
  }
  
  createSale(data: CreateSale): Observable<Sale> {
    return this.http.post<Sale>(`${environment.apiUrl}/sales`, data);
  }
  
  updateSale(id: string, data: UpdateSale): Observable<Sale> {
    return this.http.put<Sale>(`${environment.apiUrl}/sales/${id}`, data);
  }
  
  cancelSale(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/sales/${id}`);
  }
  
  getInvoice(id: string): Observable<Invoice> {
    return this.http.get<Invoice>(`${environment.apiUrl}/sales/${id}/invoice`);
  }
  
  sendInvoiceByEmail(id: string, email: string): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/sales/${id}/send-invoice`, { email });
  }
  
  registerPayment(saleId: string, data: CreatePayment): Observable<Payment> {
    return this.http.post<Payment>(`${environment.apiUrl}/sales/${saleId}/payments`, data);
  }
  
  getPayments(saleId: string): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${environment.apiUrl}/sales/${saleId}/payments`);
  }
}
```

### ProductService

**Descripción**: Servicio que gestiona la obtención de productos para la venta.

**Métodos principales**:
- `getProducts(search?: string, category?: string): Observable<Product[]>`
- `getProduct(id: string): Observable<Product>`
- `checkStock(id: string, quantity: number): Observable<StockCheckResult>`

### InvoiceService

**Descripción**: Servicio que gestiona la generación y manipulación de facturas.

**Métodos principales**:
- `generateInvoice(saleId: string): Observable<Blob>`
- `printInvoice(saleId: string): void`
- `downloadInvoice(saleId: string, fileName: string): void`
- `sendInvoiceByEmail(saleId: string, email: string): Observable<void>`

## Modelos

### Sale

**Descripción**: Modelo que representa una venta.

```typescript
// sale.model.ts
export interface Sale {
  id: string;
  date: Date;
  invoiceNumber: string;
  status: 'Pending' | 'Paid' | 'Cancelled';
  clientId: string;
  client: Client;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: string;
  notes: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### SaleItem

**Descripción**: Modelo que representa un ítem o línea en una venta.

```typescript
// sale-item.model.ts
export interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}
```

### CreateSale

**Descripción**: Interfaz que define los datos necesarios para crear una nueva venta.

```typescript
// create-sale.model.ts
export interface CreateSale {
  clientId: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
  discount: number;
  paymentMethod: string;
  notes: string;
}
```

### UpdateSale

**Descripción**: Interfaz que define los datos que pueden ser actualizados en una venta.

```typescript
// update-sale.model.ts
export interface UpdateSale {
  status?: 'Pending' | 'Paid' | 'Cancelled';
  discount?: number;
  paymentMethod?: string;
  notes?: string;
}
```

### Invoice

**Descripción**: Modelo que representa una factura.

```typescript
// invoice.model.ts
export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: Date;
  dueDate: Date;
  clientInfo: {
    name: string;
    address: string;
    taxId: string;
    email: string;
    phone: string;
  };
  companyInfo: {
    name: string;
    address: string;
    taxId: string;
    email: string;
    phone: string;
    logo: string;
  };
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: string;
  notes: string;
  terms: string;
}
```

### Payment

**Descripción**: Modelo que representa un pago realizado para una venta.

```typescript
// payment.model.ts
export interface Payment {
  id: string;
  saleId: string;
  date: Date;
  amount: number;
  method: string;
  reference: string;
  notes: string;
  createdBy: string;
  createdAt: Date;
}
```

### CreatePayment

**Descripción**: Interfaz que define los datos necesarios para registrar un nuevo pago.

```typescript
// create-payment.model.ts
export interface CreatePayment {
  date: Date;
  amount: number;
  method: string;
  reference: string;
  notes: string;
}
```

### Product

**Descripción**: Modelo simplificado de un producto para su uso en ventas.

```typescript
// product.model.ts
export interface Product {
  id: string;
  name: string;
  code: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
}
```

### StockCheckResult

**Descripción**: Interfaz que define el resultado de una verificación de stock.

```typescript
// stock-check-result.model.ts
export interface StockCheckResult {
  available: boolean;
  currentStock: number;
  requestedQuantity: number;
}
```

## Rutas

El módulo de ventas define las siguientes rutas:

```typescript
// sales-routing.module.ts
const routes: Routes = [
  { 
    path: '', 
    component: SalesListComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'register', 
    component: SalesRegisterComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin', 'Salesperson'] }
  },
  { 
    path: 'details/:id', 
    component: SalesDetailsComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'edit/:id', 
    component: SalesRegisterComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin', 'Salesperson'] }
  },
  { 
    path: 'invoice/:id', 
    component: InvoiceComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'payment/:id', 
    component: PaymentComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin', 'Salesperson'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
```

## Integración con Otros Módulos

El módulo de ventas se integra con otros módulos de la aplicación de las siguientes maneras:

1. **Módulo de Clientes**: Obtiene información de clientes para asociarlos a las ventas.
2. **Módulo de Inventario**: Verifica y actualiza el stock de productos al realizar ventas.
3. **Módulo de Reportes**: Proporciona datos de ventas para la generación de informes y estadísticas.
4. **Módulo de Autenticación**: Controla el acceso a las funcionalidades según el rol del usuario.

## Características Avanzadas

### Gestión de Impuestos

El módulo implementa un sistema flexible de cálculo de impuestos que:

1. **Calcula automáticamente** los impuestos según las tasas configuradas
2. **Permite exenciones** para ciertos productos o clientes
3. **Soporta múltiples tasas** de impuestos según el tipo de producto
4. **Genera información fiscal** para declaraciones tributarias

### Descuentos y Promociones

El sistema permite:

1. **Aplicar descuentos porcentuales** a toda la venta
2. **Aplicar descuentos por ítem** específico
3. **Configurar promociones** por temporada o tipo de cliente
4. **Gestionar cupones** de descuento con códigos

### Métodos de Pago

El módulo soporta múltiples métodos de pago:

1. **Efectivo**: Con cálculo automático de cambio
2. **Tarjeta de crédito/débito**: Con registro de referencia
3. **Transferencia bancaria**: Con verificación de comprobante
4. **Crédito interno**: Con gestión de pagos parciales y saldos
5. **Métodos mixtos**: Combinación de diferentes formas de pago

## Consideraciones de Rendimiento

- Implementación de caché para productos frecuentemente vendidos
- Optimización de consultas para búsqueda rápida de productos
- Generación asíncrona de facturas en formato PDF
- Validación en tiempo real de disponibilidad de stock
- Persistencia local de ventas en proceso para evitar pérdida de datos