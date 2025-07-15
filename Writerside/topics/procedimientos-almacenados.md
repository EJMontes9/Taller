# 4.3. Procedimientos Almacenados

Esta sección documenta los procedimientos almacenados utilizados en el sistema de Gestión de Taller. Los procedimientos almacenados son rutinas SQL precompiladas que se almacenan en la base de datos y pueden ser invocados por la aplicación para realizar operaciones complejas o críticas para el rendimiento.

## Propósito

Los procedimientos almacenados se utilizan en el sistema por las siguientes razones:

1. **Rendimiento**: Mejoran el rendimiento al precompilar las consultas SQL y reducir el tráfico de red.
2. **Seguridad**: Proporcionan una capa adicional de seguridad al limitar el acceso directo a las tablas.
3. **Mantenibilidad**: Centralizan la lógica de negocio compleja en la base de datos.
4. **Transacciones**: Facilitan la implementación de operaciones transaccionales complejas.

## Convenciones de Nomenclatura

Los procedimientos almacenados en el sistema siguen la siguiente convención de nomenclatura:

- Prefijo `sp_` para indicar que es un procedimiento almacenado
- Seguido por un verbo que indica la acción (Get, Update, Insert, Delete)
- Seguido por el nombre de la entidad o entidades involucradas
- Opcionalmente, un sufijo que indica una condición específica

Ejemplos:
- `sp_GetClientVehicles`
- `sp_UpdateInventory`
- `sp_RegisterSale`
- `sp_GenerateMonthlyReport`

## Lista de Procedimientos Almacenados

A continuación se presenta la lista de procedimientos almacenados disponibles en el sistema:

1. [sp_GetClientVehicles](sp-get-client-vehicles.md): Obtiene todos los vehículos asociados a un cliente específico.
2. [sp_UpdateInventory](sp-update-inventory.md): Actualiza el inventario después de una venta o servicio.
3. [sp_RegisterSale](sp-register-sale.md): Registra una nueva venta con todos sus detalles.
4. [sp_GenerateMonthlyReport](sp-generate-monthly-report.md): Genera un informe mensual de ventas y servicios.

Cada procedimiento almacenado está documentado en detalle en su propia página, incluyendo su descripción, parámetros, lógica de negocio y ejemplos de uso.