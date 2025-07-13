import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

interface ServiceAppointment {
  id: number;
  customerName: string;
  vehicleInfo: string;
  date: Date;
  time: string;
  serviceType: string;
  status: string;
}

interface RepairOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  vehicleInfo: string;
  dateCreated: Date;
  status: string;
  technician: string;
  estimatedCompletion: Date;
}

@Component({
  selector: 'app-service-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    CardModule,
    ButtonModule,
    ChartModule,
    TableModule,
    TagModule
  ],
  templateUrl: './service-dashboard.component.html'
})
export class ServiceDashboardComponent implements OnInit {
  upcomingAppointments: ServiceAppointment[] = [];
  activeRepairOrders: RepairOrder[] = [];
  
  serviceStatusData: any;
  serviceTypeData: any;
  serviceStatusOptions: any;
  serviceTypeOptions: any;

  constructor() {
    this.initChartData();
  }

  ngOnInit() {
    // Simular datos que vendrían del backend
    this.upcomingAppointments = [
      {
        id: 1,
        customerName: 'Juan Pérez',
        vehicleInfo: 'Toyota Corolla 2023',
        date: new Date('2023-07-15'),
        time: '09:00 AM',
        serviceType: 'Mantenimiento',
        status: 'confirmada'
      },
      {
        id: 2,
        customerName: 'María García',
        vehicleInfo: 'Honda Civic 2022',
        date: new Date('2023-07-15'),
        time: '11:30 AM',
        serviceType: 'Reparación',
        status: 'pendiente'
      },
      {
        id: 3,
        customerName: 'Carlos Rodríguez',
        vehicleInfo: 'Ford Mustang 2023',
        date: new Date('2023-07-16'),
        time: '10:00 AM',
        serviceType: 'Diagnóstico',
        status: 'confirmada'
      }
    ];

    this.activeRepairOrders = [
      {
        id: 1,
        orderNumber: 'RO-2023-001',
        customerName: 'Ana Martínez',
        vehicleInfo: 'Chevrolet Camaro 2022',
        dateCreated: new Date('2023-07-10'),
        status: 'en progreso',
        technician: 'Roberto Sánchez',
        estimatedCompletion: new Date('2023-07-14')
      },
      {
        id: 2,
        orderNumber: 'RO-2023-002',
        customerName: 'Luis Torres',
        vehicleInfo: 'Nissan Sentra 2023',
        dateCreated: new Date('2023-07-12'),
        status: 'esperando repuestos',
        technician: 'Carlos Gómez',
        estimatedCompletion: new Date('2023-07-18')
      },
      {
        id: 3,
        orderNumber: 'RO-2023-003',
        customerName: 'Elena Díaz',
        vehicleInfo: 'Volkswagen Golf 2021',
        dateCreated: new Date('2023-07-13'),
        status: 'iniciado',
        technician: 'Laura Ramírez',
        estimatedCompletion: new Date('2023-07-15')
      }
    ];
  }

  initChartData() {
    // Datos para el gráfico de estado de servicios
    this.serviceStatusData = {
      labels: ['Completados', 'En Progreso', 'Esperando Repuestos', 'Pendientes'],
      datasets: [
        {
          data: [45, 25, 15, 15],
          backgroundColor: ['#36A2EB', '#FFCE56', '#FF9F40', '#FF6384'],
          hoverBackgroundColor: ['#36A2EB', '#FFCE56', '#FF9F40', '#FF6384']
        }
      ]
    };

    // Datos para el gráfico de tipos de servicio
    this.serviceTypeData = {
      labels: ['Mantenimiento', 'Reparación', 'Diagnóstico', 'Garantía'],
      datasets: [
        {
          data: [40, 30, 20, 10],
          backgroundColor: ['#4BC0C0', '#9966FF', '#FF6384', '#FFCE56'],
          hoverBackgroundColor: ['#4BC0C0', '#9966FF', '#FF6384', '#FFCE56']
        }
      ]
    };

    // Opciones para los gráficos
    this.serviceStatusOptions = {
      plugins: {
        legend: {
          position: 'right'
        },
        title: {
          display: true,
          text: 'Estado de Servicios',
          font: {
            size: 16
          }
        }
      }
    };

    this.serviceTypeOptions = {
      plugins: {
        legend: {
          position: 'right'
        },
        title: {
          display: true,
          text: 'Tipos de Servicio',
          font: {
            size: 16
          }
        }
      }
    };
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString();
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'confirmada':
        return 'success';
      case 'pendiente':
        return 'warning';
      case 'cancelada':
        return 'danger';
      case 'en progreso':
        return 'info';
      case 'esperando repuestos':
        return 'warning';
      case 'iniciado':
        return 'info';
      case 'completado':
        return 'success';
      default:
        return 'info';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'confirmada':
        return 'Confirmada';
      case 'pendiente':
        return 'Pendiente';
      case 'cancelada':
        return 'Cancelada';
      case 'en progreso':
        return 'En Progreso';
      case 'esperando repuestos':
        return 'Esperando Repuestos';
      case 'iniciado':
        return 'Iniciado';
      case 'completado':
        return 'Completado';
      default:
        return status;
    }
  }
}