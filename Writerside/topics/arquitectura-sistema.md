# 1.3. Arquitectura del Sistema

## Visión General de la Arquitectura

El sistema de Gestión de Taller está construido siguiendo una arquitectura de microservicios, con una clara separación entre el frontend y el backend. Esta arquitectura proporciona modularidad, escalabilidad y facilidad de mantenimiento.

## Componentes Principales

### Frontend (Cliente)

El frontend está desarrollado en Angular, un framework moderno para aplicaciones web. La aplicación cliente sigue el patrón de arquitectura de componentes, con las siguientes características:

- **Interfaz de Usuario Reactiva**: Actualización dinámica de la interfaz sin necesidad de recargar la página.
- **Estructura Modular**: Organización del código en módulos funcionales (clientes, inventario, servicios, ventas).
- **Gestión de Estado**: Manejo eficiente del estado de la aplicación para una experiencia de usuario fluida.
- **Comunicación con API**: Interacción con el backend a través de servicios HTTP.

### Backend (Servidor)

El backend está implementado con .NET, proporcionando una API RESTful que maneja la lógica de negocio y el acceso a datos:

- **API RESTful**: Endpoints bien definidos para cada funcionalidad del sistema.
- **Arquitectura en Capas**: Separación clara entre controladores, servicios y acceso a datos.
- **Inyección de Dependencias**: Implementación de patrones de diseño para un código más mantenible y testeable.
- **Seguridad**: Autenticación y autorización mediante JWT (JSON Web Tokens).

### Base de Datos

El sistema utiliza SQL Server como sistema de gestión de base de datos relacional:

- **Modelo Relacional**: Diseño normalizado para garantizar la integridad de los datos.
- **Procedimientos Almacenados**: Para operaciones complejas que requieren alto rendimiento.
- **Índices Optimizados**: Para garantizar consultas rápidas incluso con grandes volúmenes de datos.

## Diagrama de Arquitectura

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  Cliente        │      │  Servidor       │      │  Base de Datos  │
│  (Angular)      │◄────►│  (.NET API)     │◄────►│  (SQL Server)   │
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
       Puerto 4200              Puerto 5000             Puerto 1433
```

## Despliegue con Docker

Todo el sistema está containerizado utilizando Docker, lo que facilita su despliegue y garantiza la consistencia entre diferentes entornos:

- **Contenedor Frontend**: Servidor Nginx que sirve la aplicación Angular compilada.
- **Contenedor Backend**: Servidor Kestrel que ejecuta la API .NET.
- **Contenedor Base de Datos**: Instancia de SQL Server 2022 Express.
- **Docker Compose**: Orquestación de todos los servicios, incluyendo redes y volúmenes.

## Comunicación entre Componentes

- El frontend se comunica con el backend a través de peticiones HTTP/HTTPS.
- El backend se comunica con la base de datos utilizando Entity Framework Core como ORM.
- Todos los componentes están en la misma red Docker, lo que facilita la comunicación entre ellos.

## Consideraciones de Seguridad

- **HTTPS**: Comunicación cifrada entre cliente y servidor.
- **Autenticación**: Sistema basado en tokens JWT.
- **Autorización**: Control de acceso basado en roles.
- **Validación de Datos**: Prevención de inyección SQL y otros ataques comunes.
- **Almacenamiento Seguro**: Contraseñas hasheadas y datos sensibles protegidos.