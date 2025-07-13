import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import {CurrencyPipe} from "@angular/common";

@Component({
  selector: 'app-reports-dashboard',
  standalone: true,
    imports: [
        CardModule,
        ChartModule,
        DropdownModule,
        TableModule,
        TagModule,
        FormsModule,
        ButtonModule,
        CurrencyPipe
    ],
  templateUrl: './reports-dashboard.component.html'
})
export class ReportsDashboardComponent implements OnInit {
  // Filtros de tiempo
  timeRanges: any[] = [];
  selectedTimeRange: string = 'month';

  // Datos para gráficos
  salesData: any;
  salesOptions: any;
  
  inventoryData: any;
  inventoryOptions: any;
  
  serviceData: any;
  serviceOptions: any;
  
  financialData: any;
  financialOptions: any;

  // Datos para tablas
  lowStockItems: any[] = [];
  topSellingVehicles: any[] = [];
  topSellingParts: any[] = [];
  upcomingServices: any[] = [];

  constructor() {}

  ngOnInit() {
    this.initFilters();
    this.initChartData();
    this.initTableData();
  }

  initFilters() {
    this.timeRanges = [
      { label: 'Últimos 7 días', value: 'week' },
      { label: 'Último mes', value: 'month' },
      { label: 'Último trimestre', value: 'quarter' },
      { label: 'Último año', value: 'year' }
    ];
  }

  initChartData() {
    // Datos de ventas
    const salesLabels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'];
    
    this.salesData = {
      labels: salesLabels,
      datasets: [
        {
          label: 'Vehículos',
          data: [65, 59, 80, 81, 56, 55, 40],
          backgroundColor: '#42A5F5',
          borderColor: '#42A5F5',
          fill: false,
          tension: 0.4
        },
        {
          label: 'Repuestos',
          data: [28, 48, 40, 19, 86, 27, 90],
          backgroundColor: '#66BB6A',
          borderColor: '#66BB6A',
          fill: false,
          tension: 0.4
        }
      ]
    };

    this.salesOptions = {
      plugins: {
        legend: {
          position: 'top'
        },
        title: {
          display: true,
          text: 'Ventas Mensuales'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Ventas (USD)'
          }
        }
      }
    };

    // Datos de inventario
    this.inventoryData = {
      labels: ['Vehículos', 'Repuestos', 'Otros'],
      datasets: [
        {
          data: [300, 150, 50],
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'],
          hoverBackgroundColor: ['#64B5F6', '#81C784', '#FFB74D']
        }
      ]
    };

    this.inventoryOptions = {
      plugins: {
        legend: {
          position: 'right'
        },
        title: {
          display: true,
          text: 'Estado del Inventario'
        }
      }
    };

    // Datos de servicios
    this.serviceData = {
      labels: salesLabels,
      datasets: [
        {
          label: 'Citas Programadas',
          data: [28, 48, 40, 19, 86, 27, 90],
          backgroundColor: '#42A5F5',
          borderColor: '#42A5F5'
        },
        {
          label: 'Servicios Completados',
          data: [25, 45, 38, 15, 80, 25, 85],
          backgroundColor: '#66BB6A',
          borderColor: '#66BB6A'
        }
      ]
    };

    this.serviceOptions = {
      plugins: {
        legend: {
          position: 'top'
        },
        title: {
          display: true,
          text: 'Rendimiento del Departamento de Servicio'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Número de Servicios'
          }
        }
      }
    };

    // Datos financieros
    this.financialData = {
      labels: salesLabels,
      datasets: [
        {
          label: 'Ingresos',
          data: [65000, 59000, 80000, 81000, 56000, 55000, 40000],
          backgroundColor: '#42A5F5',
          borderColor: '#42A5F5',
          type: 'line',
          fill: false,
          tension: 0.4
        },
        {
          label: 'Gastos',
          data: [28000, 48000, 40000, 19000, 36000, 27000, 20000],
          backgroundColor: '#FFA726',
          borderColor: '#FFA726',
          type: 'line',
          fill: false,
          tension: 0.4
        },
        {
          label: 'Beneficio',
          data: [37000, 11000, 40000, 62000, 20000, 28000, 20000],
          backgroundColor: '#66BB6A',
          type: 'bar'
        }
      ]
    };

    this.financialOptions = {
      plugins: {
        legend: {
          position: 'top'
        },
        title: {
          display: true,
          text: 'Informe Financiero'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Monto (USD)'
          }
        }
      }
    };
  }

  initTableData() {
    // Elementos con bajo stock
    this.lowStockItems = [
      { id: 1, name: 'Filtro de aceite', category: 'Filtros', stock: 5, minStock: 10, supplier: 'AutoPartes S.A.' },
      { id: 2, name: 'Pastillas de freno delanteras', category: 'Frenos', stock: 2, minStock: 5, supplier: 'Frenos Seguros Inc.' },
      { id: 3, name: 'Batería 12V', category: 'Electricidad', stock: 1, minStock: 3, supplier: 'ElectroAuto' }
    ];

    // Vehículos más vendidos
    this.topSellingVehicles = [
      { id: 1, brand: 'Toyota', model: 'Corolla', year: 2023, sales: 15, revenue: 375000 },
      { id: 2, brand: 'Honda', model: 'Civic', year: 2022, sales: 12, revenue: 282000 },
      { id: 3, brand: 'Ford', model: 'Mustang', year: 2023, sales: 8, revenue: 360000 },
      { id: 4, brand: 'Chevrolet', model: 'Camaro', year: 2022, sales: 6, revenue: 288000 },
      { id: 5, brand: 'Nissan', model: 'Sentra', year: 2023, sales: 10, revenue: 220000 }
    ];

    // Repuestos más vendidos
    this.topSellingParts = [
      { id: 1, name: 'Filtro de aceite', category: 'Filtros', sales: 120, revenue: 1918.8 },
      { id: 2, name: 'Aceite de motor 5W-30', category: 'Lubricantes', sales: 100, revenue: 2599 },
      { id: 3, name: 'Pastillas de freno delanteras', category: 'Frenos', sales: 45, revenue: 3858.75 },
      { id: 4, name: 'Batería 12V', category: 'Electricidad', sales: 30, revenue: 2699.7 },
      { id: 5, name: 'Filtro de aire', category: 'Filtros', sales: 80, revenue: 2079.2 }
    ];

    // Próximos servicios
    this.upcomingServices = [
      { id: 1, customer: 'Juan Pérez', vehicle: 'Toyota Corolla 2023', service: 'Mantenimiento 10,000 km', date: new Date('2023-08-15') },
      { id: 2, customer: 'María García', vehicle: 'Honda Civic 2022', service: 'Cambio de frenos', date: new Date('2023-08-16') },
      { id: 3, customer: 'Carlos Rodríguez', vehicle: 'Ford Mustang 2023', service: 'Diagnóstico eléctrico', date: new Date('2023-08-17') },
      { id: 4, customer: 'Ana Martínez', vehicle: 'Chevrolet Camaro 2022', service: 'Alineación y balanceo', date: new Date('2023-08-18') },
      { id: 5, customer: 'Roberto Sánchez', vehicle: 'Nissan Sentra 2023', service: 'Cambio de aceite', date: new Date('2023-08-19') }
    ];
  }

  onTimeRangeChange() {
    // En un caso real, aquí se actualizarían los datos según el rango de tiempo seleccionado
    // Por ahora, solo mostramos un mensaje
    console.log('Rango de tiempo cambiado a:', this.selectedTimeRange);
    // Aquí se llamaría a un servicio para obtener los datos actualizados
  }

  getStockSeverity(item: any): string {
    if (item.stock <= 0) {
      return 'danger';
    } else if (item.stock <= item.minStock) {
      return 'warning';
    }
    return 'success';
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString();
  }

  exportReport(reportType: string) {
    // En un caso real, aquí se generaría y descargaría el informe
    console.log('Exportando informe:', reportType);
    // Aquí se llamaría a un servicio para generar y descargar el informe
  }
}