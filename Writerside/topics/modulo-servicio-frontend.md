# 3.3.5. Módulo de Servicio

El Módulo de Servicio es responsable de gestionar todo lo relacionado con los servicios de taller, citas, órdenes de reparación y seguimiento de servicios en el sistema de Gestión de Taller. Este módulo proporciona funcionalidades para la programación de citas, gestión de órdenes de reparación, seguimiento del estado de los servicios y visualización del historial de servicios.

## Componentes

### Componentes Principales

#### AppointmentsComponent

**Ruta**: `service/appointments`

**Descripción**: Componente que permite gestionar las citas de servicio, incluyendo la creación, edición y cancelación de citas.

**Funcionalidades**:
- Programación de nuevas citas
- Visualización de citas en formato calendario
- Edición de citas existentes
- Cancelación de citas
- Notificaciones de citas próximas

**Ejemplo de uso**:
```typescript
// appointments.component.ts
@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  calendarEvents: CalendarEvent[] = [];
  loading = false;
  error: string = null;
  
  constructor(
    private serviceService: ServiceService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.loading = true;
    this.serviceService.getAppointments().subscribe(
      appointments => {
        this.appointments = appointments;
        this.calendarEvents = this.mapAppointmentsToEvents(appointments);
        this.loading = false;
      },
      error => {
        this.error = 'Error al cargar las citas';
        this.loading = false;
      }
    );
  }
  
  mapAppointmentsToEvents(appointments: Appointment[]): CalendarEvent[] {
    return appointments.map(appointment => ({
      id: appointment.id,
      title: `${appointment.client.name} - ${appointment.serviceType}`,
      start: new Date(appointment.date),
      end: new Date(new Date(appointment.date).getTime() + appointment.duration * 60000),
      color: this.getStatusColor(appointment.status)
    }));
  }
  
  getStatusColor(status: string): any {
    switch (status) {
      case 'Scheduled':
        return { primary: '#1e90ff', secondary: '#d1e8ff' };
      case 'Confirmed':
        return { primary: '#28a745', secondary: '#c8e6c9' };
      case 'Cancelled':
        return { primary: '#dc3545', secondary: '#f8d7da' };
      default:
        return { primary: '#6c757d', secondary: '#e9ecef' };
    }
  }
  
  onCreateAppointment() {
    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      width: '600px',
      data: { title: 'Nueva Cita' }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.serviceService.createAppointment(result).subscribe(
          () => {
            this.loadAppointments();
          },
          error => {
            this.error = 'Error al crear la cita';
          }
        );
      }
    });
  }
  
  onEditAppointment(id: string) {
    const appointment = this.appointments.find(a => a.id === id);
    
    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      width: '600px',
      data: { title: 'Editar Cita', appointment }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.serviceService.updateAppointment(id, result).subscribe(
          () => {
            this.loadAppointments();
          },
          error => {
            this.error = 'Error al actualizar la cita';
          }
        );
      }
    });
  }
  
  onCancelAppointment(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirmar cancelación', message: '¿Está seguro de que desea cancelar esta cita?' }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.serviceService.cancelAppointment(id).subscribe(
          () => {
            this.loadAppointments();
          },
          error => {
            this.error = 'Error al cancelar la cita';
          }
        );
      }
    });
  }
  
  onViewDetails(id: string) {
    this.router.navigate(['/service/appointments', id]);
  }
}
```

#### RepairOrdersComponent

**Ruta**: `service/repair-orders`

**Descripción**: Componente que permite gestionar las órdenes de reparación, incluyendo la creación, edición y seguimiento de órdenes.

**Funcionalidades**:
- Creación de nuevas órdenes de reparación
- Asignación de técnicos
- Seguimiento del progreso de reparación
- Registro de piezas utilizadas
- Cálculo de costos de reparación
- Generación de informes de servicio

**Ejemplo de uso**:
```typescript
// repair-orders.component.ts
@Component({
  selector: 'app-repair-orders',
  templateUrl: './repair-orders.component.html',
  styleUrls: ['./repair-orders.component.scss']
})
export class RepairOrdersComponent implements OnInit {
  repairOrders: RepairOrder[] = [];
  filteredOrders: RepairOrder[] = [];
  loading = false;
  error: string = null;
  
  // Parámetros de filtrado
  searchTerm = '';
  selectedStatus = '';
  dateRange: DateRange = {
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date()
  };
  
  constructor(
    private serviceService: ServiceService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadRepairOrders();
  }

  loadRepairOrders() {
    this.loading = true;
    this.serviceService.getRepairOrders(
      this.searchTerm,
      this.selectedStatus,
      this.dateRange
    ).subscribe(
      orders => {
        this.repairOrders = orders;
        this.filteredOrders = orders;
        this.loading = false;
      },
      error => {
        this.error = 'Error al cargar las órdenes de reparación';
        this.loading = false;
      }
    );
  }
  
  onSearch() {
    this.loadRepairOrders();
  }
  
  onCreateOrder() {
    this.router.navigate(['/service/repair-orders/new']);
  }
  
  onViewDetails(id: string) {
    this.router.navigate(['/service/repair-orders', id]);
  }
  
  onUpdateStatus(id: string, status: string) {
    this.serviceService.updateRepairOrderStatus(id, status).subscribe(
      () => {
        this.loadRepairOrders();
      },
      error => {
        this.error = 'Error al actualizar el estado de la orden';
      }
    );
  }
  
  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending':
        return 'status-pending';
      case 'In Progress':
        return 'status-in-progress';
      case 'Completed':
        return 'status-completed';
      case 'Delivered':
        return 'status-delivered';
      case 'Cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }
  
  getTotalOrders(): number {
    return this.filteredOrders.length;
  }
  
  getCompletedOrders(): number {
    return this.filteredOrders.filter(order => 
      order.status === 'Completed' || order.status === 'Delivered'
    ).length;
  }
  
  getPendingOrders(): number {
    return this.filteredOrders.filter(order => 
      order.status === 'Pending' || order.status === 'In Progress'
    ).length;
  }
}
```

#### ServiceDashboardComponent

**Ruta**: `service/dashboard`

**Descripción**: Componente que muestra un panel de control con información resumida sobre los servicios, citas y órdenes de reparación.

**Funcionalidades**:
- Visualización de estadísticas de servicio
- Gráficos de rendimiento
- Listado de citas del día
- Órdenes de reparación en progreso
- Alertas y notificaciones

#### ServiceHistoryComponent

**Ruta**: `service/history`

**Descripción**: Componente que permite consultar el historial de servicios realizados a un vehículo o para un cliente específico.

**Funcionalidades**:
- Búsqueda por cliente o vehículo
- Filtrado por fecha o tipo de servicio
- Visualización detallada del historial
- Exportación de historial en diferentes formatos

## Servicios

### ServiceService

**Descripción**: Servicio principal que gestiona las operaciones relacionadas con servicios, citas y órdenes de reparación.

**Métodos principales**:
- `getAppointments(search?: string, dateRange?: DateRange): Observable<Appointment[]>`
- `getAppointment(id: string): Observable<Appointment>`
- `createAppointment(data: CreateAppointment): Observable<Appointment>`
- `updateAppointment(id: string, data: UpdateAppointment): Observable<Appointment>`
- `cancelAppointment(id: string): Observable<void>`
- `getRepairOrders(search?: string, status?: string, dateRange?: DateRange): Observable<RepairOrder[]>`
- `getRepairOrder(id: string): Observable<RepairOrder>`
- `createRepairOrder(data: CreateRepairOrder): Observable<RepairOrder>`
- `updateRepairOrder(id: string, data: UpdateRepairOrder): Observable<RepairOrder>`
- `updateRepairOrderStatus(id: string, status: string): Observable<void>`
- `getServiceHistory(clientId?: string, vehicleId?: string): Observable<ServiceHistory[]>`

**Ejemplo de implementación**:
```typescript
// service.service.ts
@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  constructor(private http: HttpClient) {}
  
  getAppointments(search?: string, dateRange?: DateRange): Observable<Appointment[]> {
    let params = new HttpParams();
    
    if (search) {
      params = params.set('search', search);
    }
    
    if (dateRange) {
      params = params.set('startDate', dateRange.startDate.toISOString())
             .set('endDate', dateRange.endDate.toISOString());
    }
    
    return this.http.get<Appointment[]>(`${environment.apiUrl}/service/appointments`, { params });
  }
  
  getAppointment(id: string): Observable<Appointment> {
    return this.http.get<Appointment>(`${environment.apiUrl}/service/appointments/${id}`);
  }
  
  createAppointment(data: CreateAppointment): Observable<Appointment> {
    return this.http.post<Appointment>(`${environment.apiUrl}/service/appointments`, data);
  }
  
  updateAppointment(id: string, data: UpdateAppointment): Observable<Appointment> {
    return this.http.put<Appointment>(`${environment.apiUrl}/service/appointments/${id}`, data);
  }
  
  cancelAppointment(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/service/appointments/${id}`);
  }
  
  getRepairOrders(search?: string, status?: string, dateRange?: DateRange): Observable<RepairOrder[]> {
    let params = new HttpParams();
    
    if (search) {
      params = params.set('search', search);
    }
    
    if (status) {
      params = params.set('status', status);
    }
    
    if (dateRange) {
      params = params.set('startDate', dateRange.startDate.toISOString())
             .set('endDate', dateRange.endDate.toISOString());
    }
    
    return this.http.get<RepairOrder[]>(`${environment.apiUrl}/service/repair-orders`, { params });
  }
  
  getRepairOrder(id: string): Observable<RepairOrder> {
    return this.http.get<RepairOrder>(`${environment.apiUrl}/service/repair-orders/${id}`);
  }
  
  createRepairOrder(data: CreateRepairOrder): Observable<RepairOrder> {
    return this.http.post<RepairOrder>(`${environment.apiUrl}/service/repair-orders`, data);
  }
  
  updateRepairOrder(id: string, data: UpdateRepairOrder): Observable<RepairOrder> {
    return this.http.put<RepairOrder>(`${environment.apiUrl}/service/repair-orders/${id}`, data);
  }
  
  updateRepairOrderStatus(id: string, status: string): Observable<void> {
    return this.http.patch<void>(`${environment.apiUrl}/service/repair-orders/${id}/status`, { status });
  }
  
  getServiceHistory(clientId?: string, vehicleId?: string): Observable<ServiceHistory[]> {
    let params = new HttpParams();
    
    if (clientId) {
      params = params.set('clientId', clientId);
    }
    
    if (vehicleId) {
      params = params.set('vehicleId', vehicleId);
    }
    
    return this.http.get<ServiceHistory[]>(`${environment.apiUrl}/service/history`, { params });
  }
}
```

## Modelos

### Appointment

**Descripción**: Modelo que representa una cita de servicio.

```typescript
// appointment.model.ts
export interface Appointment {
  id: string;
  clientId: string;
  client: Client;
  vehicleId: string;
  vehicle: Vehicle;
  date: Date;
  duration: number; // en minutos
  serviceType: string;
  description: string;
  status: 'Scheduled' | 'Confirmed' | 'Completed' | 'Cancelled';
  notes: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### CreateAppointment

**Descripción**: Interfaz que define los datos necesarios para crear una nueva cita.

```typescript
// create-appointment.model.ts
export interface CreateAppointment {
  clientId: string;
  vehicleId: string;
  date: Date;
  duration: number;
  serviceType: string;
  description: string;
  notes: string;
}
```

### UpdateAppointment

**Descripción**: Interfaz que define los datos que pueden ser actualizados en una cita.

```typescript
// update-appointment.model.ts
export interface UpdateAppointment {
  date?: Date;
  duration?: number;
  serviceType?: string;
  description?: string;
  status?: 'Scheduled' | 'Confirmed' | 'Completed' | 'Cancelled';
  notes?: string;
}
```

### RepairOrder

**Descripción**: Modelo que representa una orden de reparación.

```typescript
// repair-order.model.ts
export interface RepairOrder {
  id: string;
  orderNumber: string;
  clientId: string;
  client: Client;
  vehicleId: string;
  vehicle: Vehicle;
  technicianId: string;
  technician: User;
  date: Date;
  estimatedCompletionDate: Date;
  actualCompletionDate?: Date;
  serviceType: string;
  description: string;
  diagnosis: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Delivered' | 'Cancelled';
  items: RepairOrderItem[];
  laborCost: number;
  partsCost: number;
  totalCost: number;
  notes: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### RepairOrderItem

**Descripción**: Modelo que representa un ítem o línea en una orden de reparación.

```typescript
// repair-order-item.model.ts
export interface RepairOrderItem {
  id: string;
  repairOrderId: string;
  type: 'Part' | 'Labor';
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  partId?: string;
  part?: Part;
}
```

### CreateRepairOrder

**Descripción**: Interfaz que define los datos necesarios para crear una nueva orden de reparación.

```typescript
// create-repair-order.model.ts
export interface CreateRepairOrder {
  clientId: string;
  vehicleId: string;
  technicianId: string;
  date: Date;
  estimatedCompletionDate: Date;
  serviceType: string;
  description: string;
  diagnosis: string;
  items: {
    type: 'Part' | 'Labor';
    description: string;
    quantity: number;
    unitPrice: number;
    partId?: string;
  }[];
  notes: string;
}
```

### UpdateRepairOrder

**Descripción**: Interfaz que define los datos que pueden ser actualizados en una orden de reparación.

```typescript
// update-repair-order.model.ts
export interface UpdateRepairOrder {
  technicianId?: string;
  estimatedCompletionDate?: Date;
  actualCompletionDate?: Date;
  diagnosis?: string;
  status?: 'Pending' | 'In Progress' | 'Completed' | 'Delivered' | 'Cancelled';
  items?: {
    id?: string;
    type: 'Part' | 'Labor';
    description: string;
    quantity: number;
    unitPrice: number;
    partId?: string;
  }[];
  notes?: string;
}
```

### ServiceHistory

**Descripción**: Modelo que representa un registro en el historial de servicios.

```typescript
// service-history.model.ts
export interface ServiceHistory {
  id: string;
  date: Date;
  clientId: string;
  client: Client;
  vehicleId: string;
  vehicle: Vehicle;
  serviceType: string;
  description: string;
  cost: number;
  technicianId: string;
  technician: User;
  notes: string;
  repairOrderId?: string;
}
```

## Rutas

El módulo de servicio define las siguientes rutas:

```typescript
// service.routes.ts
const routes: Routes = [
  { 
    path: '', 
    component: ServiceDashboardComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'appointments', 
    component: AppointmentsComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'appointments/:id', 
    component: AppointmentDetailsComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'repair-orders', 
    component: RepairOrdersComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'repair-orders/new', 
    component: RepairOrderFormComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin', 'Technician'] }
  },
  { 
    path: 'repair-orders/:id', 
    component: RepairOrderDetailsComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'repair-orders/:id/edit', 
    component: RepairOrderFormComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin', 'Technician'] }
  },
  { 
    path: 'history', 
    component: ServiceHistoryComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceRoutingModule { }
```

## Integración con Otros Módulos

El módulo de servicio se integra con otros módulos de la aplicación de las siguientes maneras:

1. **Módulo de Clientes**: Obtiene información de clientes para asociarlos a las citas y órdenes de reparación.
2. **Módulo de Inventario**: Verifica y actualiza el stock de repuestos utilizados en las reparaciones.
3. **Módulo de Ventas**: Genera ventas a partir de servicios completados para facturación.
4. **Módulo de Autenticación**: Controla el acceso a las funcionalidades según el rol del usuario.

## Características Avanzadas

### Seguimiento en Tiempo Real

El módulo implementa un sistema de seguimiento en tiempo real que:

1. **Actualiza el estado** de las órdenes de reparación en tiempo real
2. **Notifica a los clientes** sobre cambios en el estado de sus servicios
3. **Proporciona estimaciones precisas** de tiempos de finalización
4. **Permite comunicación directa** entre técnicos y clientes

### Gestión de Repuestos

El sistema permite:

1. **Verificar disponibilidad** de repuestos necesarios
2. **Reservar repuestos** para órdenes específicas
3. **Solicitar pedidos** de repuestos faltantes
4. **Registrar uso de repuestos** en cada reparación

### Programación Inteligente

El módulo incluye funcionalidades avanzadas de programación:

1. **Sugerencia automática** de horarios disponibles
2. **Asignación inteligente** de técnicos según especialidad
3. **Balanceo de carga** de trabajo entre técnicos
4. **Recordatorios automáticos** de citas próximas

## Consideraciones de Rendimiento

- Optimización de consultas para carga rápida del calendario de citas
- Implementación de caché para datos frecuentemente accedidos
- Carga progresiva de historial de servicios extensos
- Procesamiento asíncrono de generación de informes
- Sincronización periódica de datos para funcionamiento offline