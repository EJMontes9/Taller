# 2.3. Documentación de APIs por Módulo

Esta sección proporciona documentación detallada de las APIs disponibles en el sistema de Gestión de Taller, organizadas por módulos funcionales. Para cada módulo, se describen los endpoints disponibles, los modelos de datos utilizados, los controladores que implementan la lógica y los servicios asociados.

La API del sistema está construida siguiendo los principios RESTful, utilizando los verbos HTTP estándar (GET, POST, PUT, DELETE) para las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre los recursos del sistema.

## Estructura de la Documentación

Para cada módulo, la documentación sigue la siguiente estructura:

- **Endpoints**: Lista de URLs disponibles con sus métodos HTTP, parámetros y respuestas.
- **Modelos de Datos**: Descripción de las entidades y DTOs utilizados por el módulo.
- **Controladores**: Detalles sobre la implementación de los controladores que manejan las solicitudes.
- **Servicios**: Información sobre los servicios que implementan la lógica de negocio (cuando aplica).

## Autenticación y Autorización

Todos los endpoints protegidos requieren autenticación mediante tokens JWT (JSON Web Tokens). Para obtener un token, se debe utilizar el endpoint de autenticación descrito en la sección [Autenticación y Autorización](autenticacion-autorizacion.md).

## Módulos Disponibles

El sistema de Gestión de Taller está organizado en los siguientes módulos principales:

- [Autenticación y Autorización](autenticacion-autorizacion.md): Gestión de usuarios, inicio de sesión y control de acceso.
- [Clientes](modulo-clientes.md): Gestión de clientes y sus vehículos asociados.
- [Ventas](modulo-ventas.md): Gestión de ventas, facturas y pagos.
- [Vehículos](modulo-vehiculos.md): Gestión de vehículos y su historial de servicios.
- [Repuestos](modulo-repuestos.md): Gestión de repuestos y piezas para reparaciones y ventas.
- [Inventario](modulo-inventario.md): Gestión de herramientas, equipos y otros activos del taller.

Todos estos módulos se integran entre sí para proporcionar una solución completa para la gestión del taller.
