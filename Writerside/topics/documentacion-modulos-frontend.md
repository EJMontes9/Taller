# 3.3. Documentación por Módulos

Esta sección proporciona documentación detallada sobre los diferentes módulos funcionales que componen el frontend del sistema de Gestión de Taller. Cada módulo encapsula un conjunto de funcionalidades relacionadas y está diseñado siguiendo los principios de modularidad y reutilización de Angular.

## Estructura General de los Módulos

Cada módulo en la aplicación sigue una estructura similar:

```
module-name/
├── components/       # Componentes específicos del módulo
├── pages/            # Páginas o vistas principales
├── services/         # Servicios específicos del módulo
├── models/           # Interfaces y tipos específicos
├── guards/           # Guards de rutas (si aplica)
└── module-name.module.ts  # Definición del módulo
```

## Módulos Principales

La aplicación está organizada en los siguientes módulos principales:

### Módulo de Autenticación

El [Módulo de Autenticación](modulo-autenticacion-frontend.md) gestiona todo lo relacionado con la autenticación y autorización de usuarios, incluyendo:

- Inicio de sesión
- Registro de usuarios
- Recuperación de contraseñas
- Gestión de perfiles de usuario
- Control de acceso basado en roles

### Módulo de Inventario

El [Módulo de Inventario](modulo-inventario-frontend.md) proporciona funcionalidades para la gestión de inventario y repuestos, incluyendo:

- Listado y búsqueda de elementos de inventario
- Gestión de repuestos
- Control de stock
- Registro de mantenimientos
- Alertas de nivel bajo de stock

### Módulo de Reportes

El [Módulo de Reportes](modulo-reportes-frontend.md) permite la generación y visualización de diversos informes y estadísticas, incluyendo:

- Reportes de ventas
- Estadísticas de servicios
- Análisis de inventario
- Exportación de datos en diferentes formatos
- Visualización de gráficos y dashboards

### Módulo de Ventas

El [Módulo de Ventas](modulo-ventas-frontend.md) gestiona todo lo relacionado con ventas y facturación, incluyendo:

- Registro de ventas
- Generación de facturas
- Gestión de pagos
- Historial de ventas
- Descuentos y promociones

### Módulo de Servicio

El [Módulo de Servicio](modulo-servicio-frontend.md) proporciona funcionalidades para la gestión de servicios y reparaciones, incluyendo:

- Registro de órdenes de servicio
- Seguimiento de reparaciones
- Asignación de técnicos
- Historial de servicios por vehículo
- Notificaciones de estado

## Comunicación entre Módulos

Los módulos se comunican entre sí mediante:

1. **Servicios compartidos**: Servicios inyectados en múltiples módulos
2. **Estado global**: Utilizando servicios de estado o NgRx para gestionar el estado de la aplicación
3. **Eventos**: Utilizando el patrón Observable/Observer con RxJS
4. **Routing**: Navegación entre módulos mediante el sistema de rutas de Angular

## Lazy Loading

La aplicación implementa lazy loading (carga perezosa) para mejorar el rendimiento inicial. Esto significa que cada módulo se carga solo cuando es necesario, reduciendo el tiempo de carga inicial de la aplicación.

Configuración en el archivo de rutas principal (`app-routing.module.ts`):

```typescript
const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) },
  { path: 'inventory', loadChildren: () => import('./modules/inventory/inventory.module').then(m => m.InventoryModule) },
  { path: 'reports', loadChildren: () => import('./modules/reports/reports.module').then(m => m.ReportsModule) },
  { path: 'sales', loadChildren: () => import('./modules/sales/sales.module').then(m => m.SalesModule) },
  { path: 'service', loadChildren: () => import('./modules/service/service.module').then(m => m.ServiceModule) }
];
```

## Extensibilidad

La arquitectura modular de la aplicación permite:

1. **Añadir nuevos módulos** sin afectar a los existentes
2. **Modificar módulos existentes** con impacto mínimo en otros módulos
3. **Reutilizar componentes y servicios** entre diferentes módulos
4. **Testear módulos de forma aislada**

En las siguientes secciones, se detalla cada uno de los módulos principales, incluyendo sus componentes, servicios, modelos e interfaces de usuario.