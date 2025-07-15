# 3.3.1. Módulo de Autenticación

El Módulo de Autenticación es responsable de gestionar todo lo relacionado con la autenticación y autorización de usuarios en el sistema de Gestión de Taller. Este módulo proporciona funcionalidades para el inicio de sesión, registro de usuarios, recuperación de contraseñas, gestión de perfiles y control de acceso basado en roles.

## Componentes

### Componentes Principales

#### LoginComponent

**Ruta**: `auth/login`

**Descripción**: Componente que muestra el formulario de inicio de sesión y gestiona el proceso de autenticación.

**Funcionalidades**:
- Validación de credenciales
- Manejo de errores de autenticación
- Redirección tras inicio de sesión exitoso
- Opción "Recordarme" para mantener la sesión

**Ejemplo de uso**:
```typescript
// login.component.ts
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  error: string = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;
    const rememberMe = this.loginForm.value.rememberMe;

    this.isLoading = true;
    this.authService.login(username, password, rememberMe).subscribe(
      response => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      errorMessage => {
        this.isLoading = false;
        this.error = errorMessage;
      }
    );
  }
}
```

#### RegisterComponent

**Ruta**: `auth/register`

**Descripción**: Componente que muestra el formulario de registro de nuevos usuarios.

**Funcionalidades**:
- Validación de datos de registro
- Verificación de disponibilidad de nombre de usuario y email
- Selección de rol (si el usuario tiene permisos)
- Confirmación de registro exitoso

#### ProfileComponent

**Ruta**: `auth/profile`

**Descripción**: Componente que permite al usuario ver y editar su información de perfil.

**Funcionalidades**:
- Visualización de datos del usuario
- Edición de información personal
- Cambio de contraseña
- Gestión de preferencias

#### ForgotPasswordComponent

**Ruta**: `auth/forgot-password`

**Descripción**: Componente que permite a los usuarios solicitar el restablecimiento de su contraseña.

**Funcionalidades**:
- Solicitud de restablecimiento mediante email
- Validación de email
- Confirmación de envío de instrucciones

#### ResetPasswordComponent

**Ruta**: `auth/reset-password`

**Descripción**: Componente que permite a los usuarios establecer una nueva contraseña después de recibir un enlace de restablecimiento.

**Funcionalidades**:
- Validación de token de restablecimiento
- Establecimiento de nueva contraseña
- Confirmación de cambio exitoso

## Servicios

### AuthService

**Descripción**: Servicio principal que gestiona la autenticación y autorización de usuarios.

**Métodos principales**:
- `login(username: string, password: string, rememberMe: boolean): Observable<AuthResponse>`
- `register(userData: RegisterUser): Observable<User>`
- `logout(): void`
- `forgotPassword(email: string): Observable<any>`
- `resetPassword(token: string, newPassword: string): Observable<any>`
- `getUser(): Observable<User>`
- `updateProfile(userData: UpdateUser): Observable<User>`
- `isAuthenticated(): boolean`
- `hasRole(role: string): boolean`

**Ejemplo de implementación**:
```typescript
// auth.service.ts
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.autoLogin();
  }

  login(username: string, password: string, rememberMe: boolean): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, {
      username,
      password
    }).pipe(
      tap(response => {
        this.handleAuthentication(
          response.user.id,
          response.user.username,
          response.user.email,
          response.user.fullName,
          response.user.role,
          response.token,
          response.expiration,
          rememberMe
        );
      })
    );
  }

  logout() {
    localStorage.removeItem(environment.authTokenKey);
    localStorage.removeItem(environment.tokenExpiryKey);
    this.currentUser.next(null);
    this.router.navigate(['/auth/login']);
    
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  // Otros métodos...

  private handleAuthentication(
    id: string,
    username: string,
    email: string,
    fullName: string,
    role: string,
    token: string,
    expirationDate: string,
    rememberMe: boolean
  ) {
    const expiration = new Date(expirationDate);
    const user = new User(id, username, email, fullName, role, token, expiration);
    
    this.currentUser.next(user);
    this.autoLogout(new Date(expirationDate).getTime() - new Date().getTime());
    
    if (rememberMe) {
      localStorage.setItem(environment.authTokenKey, token);
      localStorage.setItem(environment.tokenExpiryKey, expirationDate);
    }
  }

  // Otros métodos...
}
```

### TokenInterceptor

**Descripción**: Interceptor HTTP que añade el token de autenticación a todas las peticiones salientes.

**Funcionalidades**:
- Añadir token JWT a los headers de las peticiones
- Manejar errores de autenticación (401)
- Redirigir al login cuando el token expira

**Ejemplo de implementación**:
```typescript
// token.interceptor.ts
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Añadir token si el usuario está autenticado
    if (this.authService.isAuthenticated()) {
      const token = this.authService.getToken();
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError(error => {
        // Redirigir al login si hay error de autenticación
        if (error instanceof HttpErrorResponse && error.status === 401) {
          this.authService.logout();
        }
        return throwError(error);
      })
    );
  }
}
```

### AuthGuard

**Descripción**: Guard que protege las rutas que requieren autenticación.

**Funcionalidades**:
- Verificar si el usuario está autenticado
- Redirigir al login si no está autenticado
- Verificar permisos basados en roles

**Ejemplo de implementación**:
```typescript
// auth.guard.ts
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (!this.authService.isAuthenticated()) {
      return this.router.createUrlTree(['/auth/login'], {
        queryParams: { returnUrl: state.url }
      });
    }

    // Verificar roles si están especificados en la ruta
    const requiredRoles = route.data.roles as Array<string>;
    if (requiredRoles && requiredRoles.length > 0) {
      const hasRequiredRole = requiredRoles.some(role => 
        this.authService.hasRole(role)
      );
      
      if (!hasRequiredRole) {
        return this.router.createUrlTree(['/unauthorized']);
      }
    }

    return true;
  }
}
```

## Modelos

### User

**Descripción**: Modelo que representa un usuario autenticado.

```typescript
// user.model.ts
export class User {
  constructor(
    public id: string,
    public username: string,
    public email: string,
    public fullName: string,
    public role: string,
    private _token: string,
    private _tokenExpirationDate: Date
  ) {}

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }
}
```

### RegisterUser

**Descripción**: Interfaz que define los datos necesarios para el registro de un nuevo usuario.

```typescript
// register-user.model.ts
export interface RegisterUser {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role?: string;
}
```

### UpdateUser

**Descripción**: Interfaz que define los datos que pueden ser actualizados en el perfil de usuario.

```typescript
// update-user.model.ts
export interface UpdateUser {
  email?: string;
  fullName?: string;
  currentPassword?: string;
  newPassword?: string;
}
```

### AuthResponse

**Descripción**: Interfaz que define la respuesta del servidor tras una autenticación exitosa.

```typescript
// auth-response.model.ts
export interface AuthResponse {
  token: string;
  expiration: string;
  user: {
    id: string;
    username: string;
    email: string;
    fullName: string;
    role: string;
  };
}
```

## Rutas

El módulo de autenticación define las siguientes rutas:

```typescript
// auth-routing.module.ts
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'profile', 
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
```

## Integración con el Resto de la Aplicación

El módulo de autenticación se integra con el resto de la aplicación de las siguientes maneras:

1. **Protección de rutas**: Utilizando `AuthGuard` para proteger las rutas que requieren autenticación.
2. **Interceptor HTTP**: Añadiendo automáticamente el token JWT a todas las peticiones HTTP.
3. **Componente de navegación**: Mostrando opciones diferentes según el estado de autenticación y el rol del usuario.
4. **Directivas de control de acceso**: Mostrando u ocultando elementos de la interfaz según los permisos del usuario.

## Consideraciones de Seguridad

- Almacenamiento seguro de tokens (preferiblemente en memoria para sesiones temporales)
- Validación de entrada en formularios
- Protección contra ataques CSRF
- Implementación de bloqueo de cuenta tras múltiples intentos fallidos
- Uso de HTTPS para todas las comunicaciones
- Expiración de tokens y sesiones