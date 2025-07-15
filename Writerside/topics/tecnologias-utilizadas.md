# 1.4. Tecnologías Utilizadas

Este proyecto integra diversas tecnologías modernas para el desarrollo de aplicaciones web. A continuación, se detallan las principales tecnologías utilizadas en cada componente del sistema.

## Frontend

### Angular
- **Versión**: Angular 17+
- **Descripción**: Framework de desarrollo para construir aplicaciones web de una sola página (SPA).
- **Características utilizadas**:
  - Componentes reutilizables
  - Servicios para la lógica de negocio
  - Enrutamiento para navegación entre vistas
  - Formularios reactivos para validación avanzada
  - Observables para manejo asíncrono de datos

### Bibliotecas Adicionales
- **Angular Material**: Componentes de UI siguiendo las directrices de Material Design
- **NgRx**: Para gestión del estado de la aplicación
- **RxJS**: Programación reactiva para operaciones asíncronas
- **Chart.js**: Visualización de datos en gráficos y reportes

## Backend

### .NET
- **Versión**: .NET 9.0
- **Descripción**: Framework de desarrollo para construir aplicaciones y servicios web.
- **Características utilizadas**:
  - ASP.NET Core para APIs RESTful
  - Entity Framework Core como ORM
  - Inyección de dependencias nativa
  - Middleware para procesamiento de solicitudes
  - Identity para autenticación y autorización

### Bibliotecas Adicionales
- **AutoMapper**: Mapeo entre objetos de dominio y DTOs
- **FluentValidation**: Validación avanzada de modelos
- **Swagger/OpenAPI**: Documentación interactiva de la API
- **Serilog**: Registro estructurado de eventos y errores

## Base de Datos

### SQL Server
- **Versión**: SQL Server 2022 Express
- **Descripción**: Sistema de gestión de bases de datos relacionales.
- **Características utilizadas**:
  - Procedimientos almacenados
  - Transacciones
  - Índices optimizados
  - Restricciones de integridad referencial

## Infraestructura y Despliegue

### Docker
- **Descripción**: Plataforma de containerización para empaquetar, distribuir y ejecutar aplicaciones.
- **Componentes utilizados**:
  - Dockerfile para cada servicio
  - Docker Compose para orquestación
  - Volúmenes para persistencia de datos
  - Redes para comunicación entre servicios

### Nginx
- **Descripción**: Servidor web de alto rendimiento utilizado para servir la aplicación Angular.
- **Características utilizadas**:
  - Configuración para Single Page Applications
  - Caché de recursos estáticos
  - Compresión de respuestas

## Herramientas de Desarrollo

### Control de Versiones
- **Git**: Sistema de control de versiones distribuido
- **GitHub**: Plataforma para alojamiento de repositorios Git

### Herramientas de Desarrollo
- **Visual Studio 2022**: IDE principal para desarrollo backend
- **Visual Studio Code**: Editor para desarrollo frontend
- **JetBrains Rider**: IDE alternativo para desarrollo .NET
- **npm**: Gestor de paquetes para JavaScript

### Herramientas de Pruebas
- **xUnit**: Framework de pruebas para .NET
- **Jasmine/Karma**: Framework de pruebas para Angular
- **Postman**: Pruebas de API REST

## Metodología de Desarrollo

El proyecto ha sido desarrollado siguiendo metodologías ágiles, específicamente Scrum, con:

- Sprints de dos semanas
- Reuniones diarias de seguimiento
- Revisiones de código mediante pull requests
- Integración continua con GitHub Actions
- Despliegue continuo a entornos de desarrollo y pruebas