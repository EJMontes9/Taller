# 2.1. Estructura del Proyecto

El backend del sistema de Gestión de Taller está organizado siguiendo una estructura de proyecto estándar para aplicaciones ASP.NET Core, con una clara separación de responsabilidades. A continuación, se detalla la estructura de directorios y archivos principales del proyecto.

## Estructura de Directorios

```
GestionTaller-Back/
├── Controllers/       # Controladores de la API
├── Models/            # Modelos de datos y DTOs
├── Data/              # Contexto de base de datos y repositorios
├── Helpers/           # Clases auxiliares y utilidades
├── Formatters/        # Formateadores personalizados
├── Properties/        # Configuración de lanzamiento
├── SQL/               # Scripts SQL para la base de datos
├── bin/               # Archivos binarios compilados
├── obj/               # Archivos temporales de compilación
├── appsettings.json   # Configuración principal
├── appsettings.Development.json  # Configuración para desarrollo
├── Program.cs         # Punto de entrada de la aplicación
├── Dockerfile         # Configuración para Docker
└── GestionTaller-Back.csproj  # Archivo de proyecto .NET
```

## Componentes Principales

### Controllers

Los controladores son responsables de manejar las solicitudes HTTP y devolver las respuestas apropiadas. Cada controlador se enfoca en un área específica de funcionalidad:

- **ClientesController**: Gestión de clientes
- **InventarioController**: Gestión de inventario
- **ServiciosController**: Gestión de servicios y reparaciones
- **VentasController**: Gestión de ventas y facturación
- **AuthController**: Autenticación y autorización

### Models

Los modelos definen la estructura de los datos utilizados en la aplicación:

- **Entidades**: Representan las tablas de la base de datos (Cliente, InventoryItem, Servicio, Venta, etc.)
- **DTOs** (Data Transfer Objects): Objetos utilizados para transferir datos entre capas
- **ViewModels**: Modelos específicos para las vistas o respuestas de la API

### Data

Esta carpeta contiene todo lo relacionado con el acceso a datos:

- **ApplicationDbContext**: Contexto de Entity Framework Core
- **Repositories**: Implementación del patrón repositorio para acceso a datos
- **Migrations**: Migraciones de Entity Framework Core

### Helpers

Contiene clases auxiliares y utilidades:

- **JwtHelper**: Utilidades para la generación y validación de tokens JWT
- **AutoMapperProfile**: Configuración de mapeo entre entidades y DTOs
- **Extensions**: Métodos de extensión para diversas funcionalidades

### Formatters

Contiene formateadores personalizados para la serialización y deserialización de datos en la API.

## Archivos de Configuración

### Program.cs

Este archivo es el punto de entrada de la aplicación y contiene la configuración del host web, servicios, middleware y enrutamiento.

### appsettings.json

Contiene la configuración principal de la aplicación, incluyendo:

- Cadenas de conexión a la base de datos
- Configuración de JWT para autenticación
- Configuración de logging
- Otras configuraciones específicas de la aplicación

### Dockerfile

Define cómo se construye y ejecuta la aplicación en un contenedor Docker, utilizando un proceso de compilación multi-etapa para optimizar el tamaño de la imagen final.

## Patrones de Diseño Implementados

El proyecto sigue varios patrones de diseño comunes en aplicaciones .NET:

- **Patrón Repositorio**: Para abstraer el acceso a datos
- **Inyección de Dependencias**: Para desacoplar componentes y facilitar las pruebas
- **Mediator**: Para implementar CQRS (Command Query Responsibility Segregation)
- **Factory**: Para la creación de objetos complejos