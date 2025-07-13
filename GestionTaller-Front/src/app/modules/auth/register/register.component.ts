import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService, RegisterRequest } from '../../../core/auth.service';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    ToastModule,
    IconFieldModule,
    InputIconModule,
    RouterModule
  ],
  providers: [MessageService],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  name: string = '';
  email: string = '';
  loading: boolean = false;
  logoPath: string = '/assets/images/logo.png';

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    // Redirect to home if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  onSubmit() {
    // Validate form
    if (!this.username || !this.password || !this.confirmPassword || !this.name) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor complete todos los campos obligatorios'
      });
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Las contraseñas no coinciden'
      });
      return;
    }

    this.loading = true;

    const registerData: RegisterRequest = {
      username: this.username,
      password: this.password,
      name: this.name,
      email: this.email
    };

    this.authService.register(registerData)
      .subscribe({
        next: () => {
          // Navigate to home page
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Error al registrar usuario'
          });
          this.loading = false;
        }
      });
  }
}
