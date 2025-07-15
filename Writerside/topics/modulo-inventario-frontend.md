# 3.3.2. Módulo de Inventario

El Módulo de Inventario es responsable de gestionar todo lo relacionado con el inventario y los repuestos en el sistema de Gestión de Taller. Este módulo proporciona funcionalidades para el listado, búsqueda, creación, edición y eliminación de elementos de inventario, así como el control de stock y el registro de mantenimientos.

## Componentes

### Componentes Principales

#### InventoryListComponent

**Ruta**: `inventory/list`

**Descripción**: Componente que muestra una lista paginada de todos los elementos de inventario con opciones de filtrado y búsqueda.

**Funcionalidades**:
- Listado paginado de elementos
- Filtrado por tipo, categoría, estado
- Búsqueda por nombre o código
- Ordenación por diferentes campos
- Acciones rápidas (ver detalles, editar, eliminar)

**Ejemplo de uso**:
```typescript
// inventory-list.component.ts
@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss']
})
export class InventoryListComponent implements OnInit {
  inventoryItems: InventoryItem[] = [];
  filteredItems: InventoryItem[] = [];
  loading = false;
  error: string = null;
  
  // Parámetros de paginación
  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  
  // Filtros
  searchTerm = '';
  selectedType = '';
  selectedStatus = '';
  
  constructor(
    private inventoryService: InventoryService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadInventoryItems();
  }

  loadInventoryItems() {
    this.loading = true;
    this.inventoryService.getInventoryItems(
      this.currentPage,
      this.pageSize,
      this.searchTerm,
      this.selectedType,
      this.selectedStatus
    ).subscribe(
      response => {
        this.inventoryItems = response.items;
        this.filteredItems = response.items;
        this.totalItems = response.totalItems;
        this.loading = false;
      },
      error => {
        this.error = 'Error al cargar los elementos de inventario';
        this.loading = false;
      }
    );
  }
  
  onPageChange(page: number) {
    this.currentPage = page;
    this.loadInventoryItems();
  }
  
  onSearch() {
    this.currentPage = 1;
    this.loadInventoryItems();
  }
  
  onViewDetails(id: string) {
    this.router.navigate(['/inventory/details', id]);
  }
  
  onEdit(id: string) {
    this.router.navigate(['/inventory/edit', id]);
  }
  
  onDelete(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirmar eliminación', message: '¿Está seguro de que desea eliminar este elemento?' }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.inventoryService.deleteInventoryItem(id).subscribe(
          () => {
            this.loadInventoryItems();
          },
          error => {
            this.error = 'Error al eliminar el elemento';
          }
        );
      }
    });
  }
}
```

#### InventoryDetailsComponent

**Ruta**: `inventory/details/:id`

**Descripción**: Componente que muestra los detalles completos de un elemento de inventario, incluyendo su historial de mantenimientos.

**Funcionalidades**:
- Visualización de todos los datos del elemento
- Historial de mantenimientos
- Acciones disponibles (editar, eliminar, registrar mantenimiento)
- Visualización de estado actual

#### InventoryFormComponent

**Ruta**: `inventory/create` y `inventory/edit/:id`

**Descripción**: Componente reutilizable que proporciona un formulario para crear o editar elementos de inventario.

**Funcionalidades**:
- Validación de campos
- Carga de datos existentes en modo edición
- Subida de imágenes
- Selección de categorías y tipos predefinidos
- Guardado automático de borradores

**Ejemplo de uso**:
```typescript
// inventory-form.component.ts
@Component({
  selector: 'app-inventory-form',
  templateUrl: './inventory-form.component.html',
  styleUrls: ['./inventory-form.component.scss']
})
export class InventoryFormComponent implements OnInit, OnDestroy {
  @Input() editMode = false;
  @Input() itemId: string;
  
  inventoryForm: FormGroup;
  loading = false;
  error: string = null;
  types: string[] = ['Herramienta', 'Equipo', 'Repuesto', 'Otro'];
  statuses: string[] = ['Disponible', 'En uso', 'En mantenimiento', 'Fuera de servicio', 'Dado de baja'];
  
  private autoSaveSubscription: Subscription;
  
  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.initForm();
    
    if (this.editMode && this.itemId) {
      this.loadInventoryItem();
    }
    
    // Configurar guardado automático
    this.autoSaveSubscription = this.inventoryForm.valueChanges.pipe(
      debounceTime(3000),
      distinctUntilChanged()
    ).subscribe(() => {
      if (this.inventoryForm.valid) {
        this.saveAsDraft();
      }
    });
  }
  
  ngOnDestroy() {
    if (this.autoSaveSubscription) {
      this.autoSaveSubscription.unsubscribe();
    }
  }
  
  initForm() {
    this.inventoryForm = this.fb.group({
      nombre: ['', Validators.required],
      codigo: ['', Validators.required],
      descripcion: [''],
      tipo: ['', Validators.required],
      estado: ['Disponible', Validators.required],
      ubicacion: [''],
      fechaAdquisicion: [new Date(), Validators.required],
      valorAdquisicion: [0, [Validators.required, Validators.min(0)]],
      responsable: [''],
      notas: ['']
    });
  }
  
  loadInventoryItem() {
    this.loading = true;
    this.inventoryService.getInventoryItem(this.itemId).subscribe(
      item => {
        this.inventoryForm.patchValue({
          nombre: item.nombre,
          codigo: item.codigo,
          descripcion: item.descripcion,
          tipo: item.tipo,
          estado: item.estado,
          ubicacion: item.ubicacion,
          fechaAdquisicion: new Date(item.fechaAdquisicion),
          valorAdquisicion: item.valorAdquisicion,
          responsable: item.responsable,
          notas: item.notas
        });
        this.loading = false;
      },
      error => {
        this.error = 'Error al cargar el elemento de inventario';
        this.loading = false;
      }
    );
  }
  
  onSubmit() {
    if (this.inventoryForm.invalid) {
      return;
    }
    
    this.loading = true;
    
    const inventoryData = {
      ...this.inventoryForm.value,
      fechaAdquisicion: this.inventoryForm.value.fechaAdquisicion.toISOString()
    };
    
    if (this.editMode) {
      this.inventoryService.updateInventoryItem(this.itemId, inventoryData).subscribe(
        response => {
          this.loading = false;
          this.router.navigate(['/inventory/details', this.itemId]);
        },
        error => {
          this.error = 'Error al actualizar el elemento de inventario';
          this.loading = false;
        }
      );
    } else {
      this.inventoryService.createInventoryItem(inventoryData).subscribe(
        response => {
          this.loading = false;
          this.router.navigate(['/inventory/details', response.id]);
        },
        error => {
          this.error = 'Error al crear el elemento de inventario';
          this.loading = false;
        }
      );
    }
  }
  
  saveAsDraft() {
    // Implementación del guardado automático
    localStorage.setItem('inventoryFormDraft', JSON.stringify(this.inventoryForm.value));
  }
}
```

#### MaintenanceFormComponent

**Ruta**: `inventory/maintenance/:id`

**Descripción**: Componente que permite registrar un nuevo mantenimiento para un elemento de inventario.

**Funcionalidades**:
- Formulario para registrar detalles del mantenimiento
- Selección de fecha y responsable
- Registro de costos
- Actualización automática del estado del elemento

## Servicios

### InventoryService

**Descripción**: Servicio principal que gestiona las operaciones relacionadas con el inventario.

**Métodos principales**:
- `getInventoryItems(page: number, pageSize: number, search?: string, type?: string, status?: string): Observable<PagedResult<InventoryItem>>`
- `getInventoryItem(id: string): Observable<InventoryItem>`
- `createInventoryItem(data: CreateInventoryItem): Observable<InventoryItem>`
- `updateInventoryItem(id: string, data: UpdateInventoryItem): Observable<InventoryItem>`
- `deleteInventoryItem(id: string): Observable<void>`
- `updateInventoryItemStatus(id: string, status: string): Observable<InventoryItemStatus>`
- `getMaintenanceRecords(itemId: string): Observable<MaintenanceRecord[]>`
- `addMaintenanceRecord(itemId: string, data: CreateMaintenanceRecord): Observable<MaintenanceRecord>`

**Ejemplo de implementación**:
```typescript
// inventory.service.ts
@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  constructor(private http: HttpClient) {}
  
  getInventoryItems(
    page: number = 1,
    pageSize: number = 10,
    search?: string,
    type?: string,
    status?: string
  ): Observable<PagedResult<InventoryItem>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
      
    if (search) {
      params = params.set('search', search);
    }
    
    if (type) {
      params = params.set('tipo', type);
    }
    
    if (status) {
      params = params.set('estado', status);
    }
    
    return this.http.get<PagedResult<InventoryItem>>(`${environment.apiUrl}/inventoryitems`, { params });
  }
  
  getInventoryItem(id: string): Observable<InventoryItem> {
    return this.http.get<InventoryItem>(`${environment.apiUrl}/inventoryitems/${id}`);
  }
  
  createInventoryItem(data: CreateInventoryItem): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(`${environment.apiUrl}/inventoryitems`, data);
  }
  
  updateInventoryItem(id: string, data: UpdateInventoryItem): Observable<InventoryItem> {
    return this.http.put<InventoryItem>(`${environment.apiUrl}/inventoryitems/${id}`, data);
  }
  
  deleteInventoryItem(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/inventoryitems/${id}`);
  }
  
  updateInventoryItemStatus(id: string, status: string): Observable<InventoryItemStatus> {
    return this.http.put<InventoryItemStatus>(`${environment.apiUrl}/inventoryitems/${id}/status`, { estado: status });
  }
  
  getMaintenanceRecords(itemId: string): Observable<MaintenanceRecord[]> {
    return this.http.get<MaintenanceRecord[]>(`${environment.apiUrl}/inventoryitems/${itemId}/maintenance`);
  }
  
  addMaintenanceRecord(itemId: string, data: CreateMaintenanceRecord): Observable<MaintenanceRecord> {
    return this.http.post<MaintenanceRecord>(`${environment.apiUrl}/inventoryitems/${itemId}/maintenance`, data);
  }
}
```

### InventoryCategoriesService

**Descripción**: Servicio que gestiona las categorías y tipos de elementos de inventario.

**Métodos principales**:
- `getCategories(): Observable<string[]>`
- `getTypes(): Observable<string[]>`
- `getStatuses(): Observable<string[]>`

## Modelos

### InventoryItem

**Descripción**: Modelo que representa un elemento de inventario.

```typescript
// inventory-item.model.ts
export interface InventoryItem {
  id: string;
  nombre: string;
  codigo: string;
  descripcion: string;
  tipo: string;
  estado: string;
  ubicacion: string;
  fechaAdquisicion: string;
  valorAdquisicion: number;
  fechaUltimoMantenimiento?: string;
  responsable: string;
  notas: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}
```

### CreateInventoryItem

**Descripción**: Interfaz que define los datos necesarios para crear un nuevo elemento de inventario.

```typescript
// create-inventory-item.model.ts
export interface CreateInventoryItem {
  nombre: string;
  codigo: string;
  descripcion: string;
  tipo: string;
  estado: string;
  ubicacion: string;
  fechaAdquisicion: string;
  valorAdquisicion: number;
  responsable: string;
  notas: string;
}
```

### UpdateInventoryItem

**Descripción**: Interfaz que define los datos que pueden ser actualizados en un elemento de inventario.

```typescript
// update-inventory-item.model.ts
export interface UpdateInventoryItem {
  nombre?: string;
  codigo?: string;
  descripcion?: string;
  tipo?: string;
  estado?: string;
  ubicacion?: string;
  fechaAdquisicion?: string;
  valorAdquisicion?: number;
  responsable?: string;
  notas?: string;
}
```

### InventoryItemStatus

**Descripción**: Interfaz que define la respuesta al actualizar el estado de un elemento de inventario.

```typescript
// inventory-item-status.model.ts
export interface InventoryItemStatus {
  id: string;
  estado: string;
  fechaActualizacion: string;
}
```

### MaintenanceRecord

**Descripción**: Modelo que representa un registro de mantenimiento.

```typescript
// maintenance-record.model.ts
export interface MaintenanceRecord {
  id: string;
  inventoryItemId: string;
  fecha: string;
  descripcion: string;
  costo: number;
  responsable: string;
  resultado: string;
}
```

### CreateMaintenanceRecord

**Descripción**: Interfaz que define los datos necesarios para crear un nuevo registro de mantenimiento.

```typescript
// create-maintenance-record.model.ts
export interface CreateMaintenanceRecord {
  fecha: string;
  descripcion: string;
  costo: number;
  responsable: string;
  resultado: string;
}
```

### PagedResult

**Descripción**: Interfaz genérica para resultados paginados.

```typescript
// paged-result.model.ts
export interface PagedResult<T> {
  items: T[];
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
```

## Rutas

El módulo de inventario define las siguientes rutas:

```typescript
// inventory-routing.module.ts
const routes: Routes = [
  { 
    path: '', 
    component: InventoryListComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'create', 
    component: InventoryFormComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] }
  },
  { 
    path: 'details/:id', 
    component: InventoryDetailsComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'edit/:id', 
    component: InventoryFormComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] }
  },
  { 
    path: 'maintenance/:id', 
    component: MaintenanceFormComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin', 'Technician'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
```

## Integración con Otros Módulos

El módulo de inventario se integra con otros módulos de la aplicación de las siguientes maneras:

1. **Módulo de Ventas**: Los repuestos gestionados en el inventario pueden ser vendidos a través del módulo de ventas.
2. **Módulo de Servicio**: Los elementos de inventario pueden ser asignados a órdenes de servicio.
3. **Módulo de Reportes**: Los datos de inventario son utilizados para generar informes y estadísticas.

## Características Avanzadas

### Control de Stock

El módulo implementa un sistema de control de stock que:

1. **Actualiza automáticamente** el stock cuando se venden repuestos
2. **Genera alertas** cuando el stock está por debajo de un nivel mínimo
3. **Registra movimientos** de entrada y salida de inventario
4. **Calcula estadísticas** de rotación de inventario

### Gestión de Mantenimientos

Para equipos y herramientas, el módulo permite:

1. **Programar mantenimientos preventivos**
2. **Registrar mantenimientos correctivos**
3. **Generar recordatorios** de mantenimientos pendientes
4. **Calcular costos** asociados a mantenimientos

### Códigos QR/Barras

El sistema permite:

1. **Generar códigos QR/barras** para cada elemento de inventario
2. **Escanear códigos** para acceder rápidamente a la información
3. **Imprimir etiquetas** con códigos y datos básicos

## Consideraciones de Rendimiento

- Implementación de paginación para manejar grandes volúmenes de datos
- Carga perezosa de imágenes y datos detallados
- Caché de datos frecuentemente accedidos
- Optimización de consultas para búsquedas rápidas