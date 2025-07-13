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
import { DropdownModule } from 'primeng/dropdown';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';
import { InputMaskModule } from 'primeng/inputmask';
import {NgClass, NgIf} from "@angular/common";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface Vehicle {
  id: number;
  brand: string;
  model: string;
  year: number;
  vin: string;
}

interface Appointment {
  id: number;
  customer: Customer;
  vehicle: Vehicle;
  date: Date;
  time: string;
  serviceType: string;
  description: string;
  status: string;
  technician?: string;
}

@Component({
  selector: 'app-appointments',
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
    DropdownModule,
    TextareaModule,
    TagModule,
    InputMaskModule,
    NgClass,
    NgIf
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './appointments.component.html'
})
export class AppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  appointment: Appointment = this.initializeNewAppointment();
  selectedAppointments: Appointment[] = [];
  appointmentDialog: boolean = false;
  submitted: boolean = false;

  serviceTypes: any[] = [];
  statuses: any[] = [];
  customers: Customer[] = [];
  vehicles: Vehicle[] = [];
  timeSlots: any[] = [];
  technicians: any[] = [];

  dateFilter: Date | null = null;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    // Simular datos que vendrían del backend
    this.appointments = [
      {
        id: 1,
        customer: { id: 1, name: 'Juan Pérez', email: 'juan.perez@email.com', phone: '555-1234' },
        vehicle: { id: 1, brand: 'Toyota', model: 'Corolla', year: 2023, vin: 'ABC123456789' },
        date: new Date('2023-07-15'),
        time: '09:00 AM',
        serviceType: 'mantenimiento',
        description: 'Cambio de aceite y filtros',
        status: 'confirmada',
        technician: 'Roberto Sánchez'
      },
      {
        id: 2,
        customer: { id: 2, name: 'María García', email: 'maria.garcia@email.com', phone: '555-5678' },
        vehicle: { id: 2, brand: 'Honda', model: 'Civic', year: 2022, vin: 'DEF987654321' },
        date: new Date('2023-07-15'),
        time: '11:30 AM',
        serviceType: 'reparacion',
        description: 'Revisión de frenos',
        status: 'pendiente'
      },
      {
        id: 3,
        customer: { id: 3, name: 'Carlos Rodríguez', email: 'carlos.rodriguez@email.com', phone: '555-9012' },
        vehicle: { id: 3, brand: 'Ford', model: 'Mustang', year: 2023, vin: 'GHI456789123' },
        date: new Date('2023-07-16'),
        time: '10:00 AM',
        serviceType: 'diagnostico',
        description: 'Problema con el motor, se apaga en marcha',
        status: 'confirmada',
        technician: 'Laura Ramírez'
      },
      {
        id: 4,
        customer: { id: 4, name: 'Ana Martínez', email: 'ana.martinez@email.com', phone: '555-3456' },
        vehicle: { id: 4, brand: 'Chevrolet', model: 'Camaro', year: 2022, vin: 'JKL789123456' },
        date: new Date('2023-07-17'),
        time: '02:00 PM',
        serviceType: 'mantenimiento',
        description: 'Mantenimiento de 10,000 km',
        status: 'confirmada',
        technician: 'Carlos Gómez'
      },
      {
        id: 5,
        customer: { id: 5, name: 'Roberto Sánchez', email: 'roberto.sanchez@email.com', phone: '555-7890' },
        vehicle: { id: 5, brand: 'Nissan', model: 'Sentra', year: 2023, vin: 'MNO321654987' },
        date: new Date('2023-07-14'),
        time: '03:30 PM',
        serviceType: 'garantia',
        description: 'Problema con el aire acondicionado',
        status: 'cancelada'
      }
    ];

    this.serviceTypes = [
      { label: 'Mantenimiento', value: 'mantenimiento' },
      { label: 'Reparación', value: 'reparacion' },
      { label: 'Diagnóstico', value: 'diagnostico' },
      { label: 'Garantía', value: 'garantia' }
    ];

    this.statuses = [
      { label: 'Pendiente', value: 'pendiente' },
      { label: 'Confirmada', value: 'confirmada' },
      { label: 'En Progreso', value: 'en_progreso' },
      { label: 'Completada', value: 'completada' },
      { label: 'Cancelada', value: 'cancelada' }
    ];

    this.customers = [
      { id: 1, name: 'Juan Pérez', email: 'juan.perez@email.com', phone: '555-1234' },
      { id: 2, name: 'María García', email: 'maria.garcia@email.com', phone: '555-5678' },
      { id: 3, name: 'Carlos Rodríguez', email: 'carlos.rodriguez@email.com', phone: '555-9012' },
      { id: 4, name: 'Ana Martínez', email: 'ana.martinez@email.com', phone: '555-3456' },
      { id: 5, name: 'Roberto Sánchez', email: 'roberto.sanchez@email.com', phone: '555-7890' }
    ];

    this.vehicles = [
      { id: 1, brand: 'Toyota', model: 'Corolla', year: 2023, vin: 'ABC123456789' },
      { id: 2, brand: 'Honda', model: 'Civic', year: 2022, vin: 'DEF987654321' },
      { id: 3, brand: 'Ford', model: 'Mustang', year: 2023, vin: 'GHI456789123' },
      { id: 4, brand: 'Chevrolet', model: 'Camaro', year: 2022, vin: 'JKL789123456' },
      { id: 5, brand: 'Nissan', model: 'Sentra', year: 2023, vin: 'MNO321654987' }
    ];

    this.timeSlots = [
      { label: '09:00 AM', value: '09:00 AM' },
      { label: '10:00 AM', value: '10:00 AM' },
      { label: '11:00 AM', value: '11:00 AM' },
      { label: '12:00 PM', value: '12:00 PM' },
      { label: '01:00 PM', value: '01:00 PM' },
      { label: '02:00 PM', value: '02:00 PM' },
      { label: '03:00 PM', value: '03:00 PM' },
      { label: '04:00 PM', value: '04:00 PM' },
      { label: '05:00 PM', value: '05:00 PM' }
    ];

    this.technicians = [
      { label: 'Roberto Sánchez', value: 'Roberto Sánchez' },
      { label: 'Laura Ramírez', value: 'Laura Ramírez' },
      { label: 'Carlos Gómez', value: 'Carlos Gómez' },
      { label: 'Ana López', value: 'Ana López' },
      { label: 'Miguel Torres', value: 'Miguel Torres' }
    ];
  }

  openNew() {
    this.appointment = this.initializeNewAppointment();
    this.submitted = false;
    this.appointmentDialog = true;
  }

  deleteSelectedAppointments() {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar las citas seleccionadas?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.appointments = this.appointments.filter(val => !this.selectedAppointments.includes(val));
        this.selectedAppointments = [];
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Citas eliminadas', life: 3000 });
      }
    });
  }

  editAppointment(appointment: Appointment) {
    this.appointment = { ...appointment };
    this.appointmentDialog = true;
  }

  deleteAppointment(appointment: Appointment) {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar esta cita?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.appointments = this.appointments.filter(val => val.id !== appointment.id);
        this.appointment = this.initializeNewAppointment();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cita eliminada', life: 3000 });
      }
    });
  }

  hideDialog() {
    this.appointmentDialog = false;
    this.submitted = false;
  }

  saveAppointment() {
    this.submitted = true;

    if (this.isValidAppointment()) {
      if (this.appointment.id) {
        // Actualizar cita existente
        const index = this.findIndexById(this.appointment.id);
        if (index !== -1) {
          this.appointments[index] = this.appointment;
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cita actualizada', life: 3000 });
        }
      } else {
        // Crear nueva cita
        this.appointment.id = this.createId();
        this.appointments.push(this.appointment);
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cita creada', life: 3000 });
      }

      this.appointments = [...this.appointments];
      this.appointmentDialog = false;
      this.appointment = this.initializeNewAppointment();
    }
  }

  isValidAppointment(): boolean {
    return !!this.appointment.customer && !!this.appointment.vehicle && !!this.appointment.date && !!this.appointment.time && !!this.appointment.serviceType;
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.appointments.length; i++) {
      if (this.appointments[i].id === id) {
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

  initializeNewAppointment(): Appointment {
    return {
      id: 0,
      customer: null as unknown as Customer,
      vehicle: null as unknown as Vehicle,
      date: new Date(),
      time: '',
      serviceType: '',
      description: '',
      status: 'pendiente'
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
      case 'en_progreso':
        return 'info';
      case 'completada':
        return 'success';
      case 'cancelada':
        return 'danger';
      default:
        return 'info';
    }
  }

  getStatusLabel(status: string): string {
    const statusObj = this.statuses.find(s => s.value === status);
    return statusObj ? statusObj.label : status;
  }

  getServiceTypeLabel(type: string): string {
    const typeObj = this.serviceTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  }

  filterByDate() {
    // Aquí iría la lógica para filtrar por fecha
    // En un caso real, esto se haría en el backend
    this.messageService.add({ severity: 'info', summary: 'Información', detail: 'Filtrando citas por fecha', life: 3000 });
  }

  clearDateFilter() {
    this.dateFilter = null;
    // Aquí iría la lógica para limpiar el filtro
    this.messageService.add({ severity: 'info', summary: 'Información', detail: 'Filtro de fecha limpiado', life: 3000 });
  }

  getVehicleInfo(vehicle: Vehicle | null): string {
    if (!vehicle) return 'N/A';
    return `${vehicle.brand} ${vehicle.model} (${vehicle.year})`;
  }

  onFilterInput(event: Event, dt: any): void {
    const target = event.target as HTMLInputElement;
    dt.filterGlobal(target.value, 'contains');
  }
}
