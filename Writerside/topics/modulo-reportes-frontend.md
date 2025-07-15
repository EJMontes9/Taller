# 3.3.3. Módulo de Reportes

El Módulo de Reportes es responsable de proporcionar funcionalidades para la generación, visualización y exportación de informes y estadísticas en el sistema de Gestión de Taller. Este módulo permite a los usuarios obtener información valiosa sobre las operaciones del taller, incluyendo ventas, servicios, inventario y rendimiento general.

## Componentes

### Componentes Principales

#### DashboardComponent

**Ruta**: `reports/dashboard`

**Descripción**: Componente principal que muestra un panel de control con resúmenes y gráficos de los principales indicadores del taller.

**Funcionalidades**:
- Visualización de KPIs (Indicadores Clave de Rendimiento)
- Gráficos interactivos de ventas, servicios e inventario
- Filtros por período de tiempo
- Tarjetas de resumen con información relevante
- Acceso rápido a reportes detallados

**Ejemplo de uso**:
```typescript
// dashboard.component.ts
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // Datos para gráficos
  salesChartData: any;
  servicesChartData: any;
  inventoryChartData: any;
  
  // KPIs
  kpis = {
    totalSales: 0,
    totalServices: 0,
    averageTicket: 0,
    pendingServices: 0,
    lowStockItems: 0
  };
  
  // Filtros
  dateRange: DateRange = {
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date()
  };
  
  loading = false;
  error: string = null;
  
  constructor(
    private reportService: ReportService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;
    
    // Cargar KPIs
    this.dashboardService.getKpis(this.dateRange).subscribe(
      data => {
        this.kpis = data;
        this.loading = false;
      },
      error => {
        this.error = 'Error al cargar los indicadores';
        this.loading = false;
      }
    );
    
    // Cargar datos para gráficos
    this.loadCharts();
  }
  
  loadCharts() {
    // Cargar gráfico de ventas
    this.reportService.getSalesReport(this.dateRange).subscribe(
      data => {
        this.salesChartData = {
          labels: data.map(item => item.date),
          datasets: [{
            label: 'Ventas',
            data: data.map(item => item.amount),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        };
      }
    );
    
    // Cargar gráfico de servicios
    this.reportService.getServicesReport(this.dateRange).subscribe(
      data => {
        this.servicesChartData = {
          labels: data.map(item => item.date),
          datasets: [{
            label: 'Servicios',
            data: data.map(item => item.count),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }]
        };
      }
    );
    
    // Cargar gráfico de inventario
    this.reportService.getInventoryStatusReport().subscribe(
      data => {
        this.inventoryChartData = {
          labels: data.map(item => item.category),
          datasets: [{
            label: 'Elementos en inventario',
            data: data.map(item => item.count),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
          }]
        };
      }
    );
  }
  
  onDateRangeChange() {
    this.loadDashboardData();
  }
}
```

#### SalesReportComponent

**Ruta**: `reports/sales`

**Descripción**: Componente que permite generar y visualizar informes detallados de ventas.

**Funcionalidades**:
- Filtrado por rango de fechas, cliente, tipo de venta
- Gráficos de tendencias de ventas
- Tabla detallada de ventas
- Cálculo de totales y promedios
- Exportación a Excel, PDF y CSV

#### ServiceReportComponent

**Ruta**: `reports/services`

**Descripción**: Componente que permite generar y visualizar informes detallados de servicios y reparaciones.

**Funcionalidades**:
- Filtrado por rango de fechas, cliente, tipo de servicio, técnico
- Gráficos de servicios por tipo y estado
- Tabla detallada de servicios
- Análisis de tiempos de servicio
- Exportación a diferentes formatos

#### InventoryReportComponent

**Ruta**: `reports/inventory`

**Descripción**: Componente que permite generar y visualizar informes detallados del inventario.

**Funcionalidades**:
- Análisis de stock actual
- Identificación de elementos con bajo stock
- Valoración del inventario
- Análisis de rotación de inventario
- Exportación a diferentes formatos

#### ClientReportComponent

**Ruta**: `reports/clients`

**Descripción**: Componente que permite generar y visualizar informes detallados sobre clientes.

**Funcionalidades**:
- Análisis de clientes más frecuentes
- Historial de compras por cliente
- Segmentación de clientes
- Análisis de retención de clientes
- Exportación a diferentes formatos

## Servicios

### ReportService

**Descripción**: Servicio principal que gestiona la generación y obtención de informes.

**Métodos principales**:
- `getSalesReport(dateRange: DateRange, filters?: SalesReportFilters): Observable<SalesReportItem[]>`
- `getServicesReport(dateRange: DateRange, filters?: ServiceReportFilters): Observable<ServiceReportItem[]>`
- `getInventoryReport(filters?: InventoryReportFilters): Observable<InventoryReportItem[]>`
- `getClientReport(dateRange: DateRange, filters?: ClientReportFilters): Observable<ClientReportItem[]>`
- `exportReport(reportType: string, data: any[], format: string): Observable<Blob>`

**Ejemplo de implementación**:
```typescript
// report.service.ts
@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(private http: HttpClient) {}
  
  getSalesReport(
    dateRange: DateRange,
    filters?: SalesReportFilters
  ): Observable<SalesReportItem[]> {
    let params = new HttpParams()
      .set('startDate', dateRange.startDate.toISOString())
      .set('endDate', dateRange.endDate.toISOString());
      
    if (filters) {
      if (filters.clientId) {
        params = params.set('clientId', filters.clientId);
      }
      
      if (filters.saleType) {
        params = params.set('saleType', filters.saleType);
      }
      
      if (filters.groupBy) {
        params = params.set('groupBy', filters.groupBy);
      }
    }
    
    return this.http.get<SalesReportItem[]>(`${environment.apiUrl}/reports/sales`, { params });
  }
  
  getServicesReport(
    dateRange: DateRange,
    filters?: ServiceReportFilters
  ): Observable<ServiceReportItem[]> {
    let params = new HttpParams()
      .set('startDate', dateRange.startDate.toISOString())
      .set('endDate', dateRange.endDate.toISOString());
      
    if (filters) {
      if (filters.clientId) {
        params = params.set('clientId', filters.clientId);
      }
      
      if (filters.serviceType) {
        params = params.set('serviceType', filters.serviceType);
      }
      
      if (filters.technicianId) {
        params = params.set('technicianId', filters.technicianId);
      }
      
      if (filters.status) {
        params = params.set('status', filters.status);
      }
      
      if (filters.groupBy) {
        params = params.set('groupBy', filters.groupBy);
      }
    }
    
    return this.http.get<ServiceReportItem[]>(`${environment.apiUrl}/reports/services`, { params });
  }
  
  getInventoryReport(
    filters?: InventoryReportFilters
  ): Observable<InventoryReportItem[]> {
    let params = new HttpParams();
      
    if (filters) {
      if (filters.category) {
        params = params.set('category', filters.category);
      }
      
      if (filters.status) {
        params = params.set('status', filters.status);
      }
      
      if (filters.lowStock) {
        params = params.set('lowStock', filters.lowStock.toString());
      }
    }
    
    return this.http.get<InventoryReportItem[]>(`${environment.apiUrl}/reports/inventory`, { params });
  }
  
  getClientReport(
    dateRange: DateRange,
    filters?: ClientReportFilters
  ): Observable<ClientReportItem[]> {
    let params = new HttpParams()
      .set('startDate', dateRange.startDate.toISOString())
      .set('endDate', dateRange.endDate.toISOString());
      
    if (filters) {
      if (filters.minPurchases) {
        params = params.set('minPurchases', filters.minPurchases.toString());
      }
      
      if (filters.sortBy) {
        params = params.set('sortBy', filters.sortBy);
      }
      
      if (filters.top) {
        params = params.set('top', filters.top.toString());
      }
    }
    
    return this.http.get<ClientReportItem[]>(`${environment.apiUrl}/reports/clients`, { params });
  }
  
  exportReport(reportType: string, data: any[], format: string): Observable<Blob> {
    return this.http.post(`${environment.apiUrl}/reports/export`, {
      reportType,
      data,
      format
    }, {
      responseType: 'blob'
    });
  }
  
  getInventoryStatusReport(): Observable<InventoryCategoryCount[]> {
    return this.http.get<InventoryCategoryCount[]>(`${environment.apiUrl}/reports/inventory/status`);
  }
}
```

### DashboardService

**Descripción**: Servicio que proporciona datos para el panel de control.

**Métodos principales**:
- `getKpis(dateRange: DateRange): Observable<DashboardKpis>`
- `getRecentSales(count: number): Observable<Sale[]>`
- `getRecentServices(count: number): Observable<Service[]>`
- `getLowStockItems(count: number): Observable<InventoryItem[]>`

### ChartService

**Descripción**: Servicio que proporciona funcionalidades para la creación y configuración de gráficos.

**Métodos principales**:
- `createLineChart(canvas: HTMLCanvasElement, data: any, options?: any): Chart`
- `createBarChart(canvas: HTMLCanvasElement, data: any, options?: any): Chart`
- `createPieChart(canvas: HTMLCanvasElement, data: any, options?: any): Chart`
- `createDoughnutChart(canvas: HTMLCanvasElement, data: any, options?: any): Chart`
- `updateChartData(chart: Chart, data: any): void`

### ExportService

**Descripción**: Servicio que gestiona la exportación de informes a diferentes formatos.

**Métodos principales**:
- `exportToExcel(data: any[], fileName: string): void`
- `exportToPdf(data: any[], fileName: string, options?: PdfExportOptions): void`
- `exportToCsv(data: any[], fileName: string): void`

## Modelos

### DateRange

**Descripción**: Interfaz que define un rango de fechas para filtrar informes.

```typescript
// date-range.model.ts
export interface DateRange {
  startDate: Date;
  endDate: Date;
}
```

### SalesReportItem

**Descripción**: Interfaz que define un elemento en un informe de ventas.

```typescript
// sales-report-item.model.ts
export interface SalesReportItem {
  date: string;
  amount: number;
  count: number;
  clientId?: string;
  clientName?: string;
  saleType?: string;
}
```

### SalesReportFilters

**Descripción**: Interfaz que define los filtros disponibles para informes de ventas.

```typescript
// sales-report-filters.model.ts
export interface SalesReportFilters {
  clientId?: string;
  saleType?: string;
  groupBy?: 'day' | 'week' | 'month' | 'year';
}
```

### ServiceReportItem

**Descripción**: Interfaz que define un elemento en un informe de servicios.

```typescript
// service-report-item.model.ts
export interface ServiceReportItem {
  date: string;
  count: number;
  averageDuration: number;
  totalCost: number;
  clientId?: string;
  clientName?: string;
  technicianId?: string;
  technicianName?: string;
  serviceType?: string;
  status?: string;
}
```

### ServiceReportFilters

**Descripción**: Interfaz que define los filtros disponibles para informes de servicios.

```typescript
// service-report-filters.model.ts
export interface ServiceReportFilters {
  clientId?: string;
  technicianId?: string;
  serviceType?: string;
  status?: string;
  groupBy?: 'day' | 'week' | 'month' | 'year';
}
```

### InventoryReportItem

**Descripción**: Interfaz que define un elemento en un informe de inventario.

```typescript
// inventory-report-item.model.ts
export interface InventoryReportItem {
  id: string;
  name: string;
  code: string;
  category: string;
  stock: number;
  value: number;
  lastMovement?: string;
  status: string;
}
```

### InventoryReportFilters

**Descripción**: Interfaz que define los filtros disponibles para informes de inventario.

```typescript
// inventory-report-filters.model.ts
export interface InventoryReportFilters {
  category?: string;
  status?: string;
  lowStock?: boolean;
}
```

### ClientReportItem

**Descripción**: Interfaz que define un elemento en un informe de clientes.

```typescript
// client-report-item.model.ts
export interface ClientReportItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalPurchases: number;
  totalSpent: number;
  lastPurchase: string;
  averagePurchase: number;
}
```

### ClientReportFilters

**Descripción**: Interfaz que define los filtros disponibles para informes de clientes.

```typescript
// client-report-filters.model.ts
export interface ClientReportFilters {
  minPurchases?: number;
  sortBy?: 'totalSpent' | 'totalPurchases' | 'lastPurchase';
  top?: number;
}
```

### DashboardKpis

**Descripción**: Interfaz que define los KPIs mostrados en el panel de control.

```typescript
// dashboard-kpis.model.ts
export interface DashboardKpis {
  totalSales: number;
  totalServices: number;
  averageTicket: number;
  pendingServices: number;
  lowStockItems: number;
}
```

### InventoryCategoryCount

**Descripción**: Interfaz que define el conteo de elementos de inventario por categoría.

```typescript
// inventory-category-count.model.ts
export interface InventoryCategoryCount {
  category: string;
  count: number;
}
```

## Rutas

El módulo de reportes define las siguientes rutas:

```typescript
// reports-routing.module.ts
const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin', 'Manager'] }
  },
  { 
    path: 'sales', 
    component: SalesReportComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin', 'Manager'] }
  },
  { 
    path: 'services', 
    component: ServiceReportComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin', 'Manager'] }
  },
  { 
    path: 'inventory', 
    component: InventoryReportComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin', 'Manager'] }
  },
  { 
    path: 'clients', 
    component: ClientReportComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Admin', 'Manager'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
```

## Integración con Otros Módulos

El módulo de reportes se integra con otros módulos de la aplicación de las siguientes maneras:

1. **Módulo de Ventas**: Obtiene datos de ventas para generar informes y estadísticas.
2. **Módulo de Servicio**: Obtiene datos de servicios y reparaciones para análisis.
3. **Módulo de Inventario**: Analiza el estado del inventario y genera alertas.
4. **Módulo de Autenticación**: Controla el acceso a los informes según el rol del usuario.

## Características Avanzadas

### Visualización de Datos

El módulo implementa visualizaciones avanzadas utilizando Chart.js:

1. **Gráficos interactivos** con zoom y tooltips detallados
2. **Múltiples tipos de gráficos**: líneas, barras, circulares, etc.
3. **Personalización de colores y estilos** según la identidad visual del taller
4. **Actualización en tiempo real** de datos cuando cambian los filtros

### Exportación de Informes

El módulo permite exportar informes en diferentes formatos:

1. **Excel**: Para análisis detallado y manipulación de datos
2. **PDF**: Para impresión y distribución formal
3. **CSV**: Para integración con otros sistemas
4. **Imágenes**: Para incluir gráficos en presentaciones

### Informes Programados

El sistema permite:

1. **Programar informes periódicos** (diarios, semanales, mensuales)
2. **Enviar informes por correo electrónico** automáticamente
3. **Guardar informes históricos** para comparación y análisis de tendencias

## Consideraciones de Rendimiento

- Implementación de caché para informes frecuentemente solicitados
- Generación asíncrona de informes complejos
- Paginación de resultados para grandes conjuntos de datos
- Optimización de consultas para minimizar el tiempo de respuesta
- Compresión de datos para reducir el tráfico de red