# 3.1. Estructura del Proyecto

El frontend del sistema de Gestión de Taller está organizado siguiendo una estructura de proyecto estándar para aplicaciones Angular, con una clara separación de responsabilidades y una organización modular. A continuación, se detalla la estructura de directorios y archivos principales del proyecto.

## Estructura de Directorios

```
GestionTaller-Front/
├── src/                      # Código fuente de la aplicación
│   ├── app/                  # Componentes, servicios y módulos de la aplicación
│   │   ├── components/       # Componentes compartidos
│   │   ├── core/             # Servicios core, guards, interceptors
│   │   ├── models/           # Interfaces y clases de modelos
│   │   ├── modules/          # Módulos funcionales de la aplicación
│   │   │   ├── auth/         # Módulo de autenticación
│   │   │   ├── inventory/    # Módulo de inventario
│   │   │   ├── reports/      # Módulo de reportes
│   │   │   ├── sales/        # Módulo de ventas
│   │   │   └── service/      # Módulo de servicio
│   │   ├── shared/           # Componentes, pipes y directivas compartidas
│   │   ├── app-routing.module.ts  # Configuración de rutas principales
│   │   └── app.module.ts     # Módulo principal de la aplicación
│   ├── assets/               # Recursos estáticos (imágenes, fuentes, etc.)
│   ├── environments/         # Configuraciones de entorno
│   ├── styles/               # Estilos globales
│   ├── index.html            # Página HTML principal
│   └── main.ts               # Punto de entrada de la aplicación
├── angular.json              # Configuración de Angular CLI
├── package.json              # Dependencias y scripts
├── tsconfig.json             # Configuración de TypeScript
└── Dockerfile                # Configuración para Docker
```

## Componentes Principales

### Módulos

La aplicación está organizada en módulos funcionales que encapsulan características relacionadas:

- **AuthModule**: Gestión de autenticación y autorización
- **InventoryModule**: Gestión de inventario y repuestos
- **ReportsModule**: Generación y visualización de reportes
- **SalesModule**: Gestión de ventas y facturación
- **ServiceModule**: Gestión de servicios y reparaciones

Cada módulo sigue una estructura similar:

```
module-name/
├── components/       # Componentes específicos del módulo
├── pages/            # Páginas o vistas principales
├── services/         # Servicios específicos del módulo
├── models/           # Interfaces y tipos específicos
└── module-name.module.ts  # Definición del módulo
```

### Core

El directorio `core` contiene servicios e interceptores fundamentales para la aplicación:

- **AuthService**: Gestión de autenticación
- **HttpInterceptor**: Interceptor para añadir tokens a las peticiones HTTP
- **ErrorHandlerService**: Manejo centralizado de errores
- **ApiService**: Servicio base para comunicación con la API

### Shared

El directorio `shared` contiene componentes, directivas y pipes reutilizables en toda la aplicación:

- **Componentes UI**: Botones, tarjetas, modales, etc.
- **Directivas**: Validadores personalizados, control de acceso, etc.
- **Pipes**: Formateo de datos, filtros, etc.

## Archivos de Configuración

### angular.json

Define la configuración del proyecto Angular, incluyendo:
- Configuración de compilación
- Configuración de pruebas
- Configuración de linting
- Configuración de assets y estilos

### package.json

Contiene:
- Dependencias del proyecto
- Scripts para desarrollo, compilación y despliegue
- Configuración de herramientas adicionales

### tsconfig.json

Configuración de TypeScript para el proyecto, incluyendo:
- Opciones del compilador
- Rutas de alias
- Configuración de tipos

### Dockerfile

Define cómo se construye y ejecuta la aplicación en un contenedor Docker, utilizando un proceso de compilación multi-etapa para optimizar el tamaño de la imagen final.

## Patrones de Diseño Implementados

El proyecto sigue varios patrones de diseño comunes en aplicaciones Angular:

- **Patrón Módulo**: Organización del código en módulos funcionales
- **Patrón Servicio**: Encapsulación de la lógica de negocio en servicios
- **Patrón Repositorio**: Abstracción del acceso a datos mediante servicios
- **Patrón Observador**: Uso de RxJS para manejo de eventos y datos asincrónicos
- **Patrón Contenedor/Presentador**: Separación de componentes en contenedores (con lógica) y presentadores (solo UI)