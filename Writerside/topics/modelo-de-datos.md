# 4.1. Modelo de Datos

Esta sección presenta el modelo de datos utilizado en el sistema de Gestión de Taller. El modelo está diseñado para soportar todas las operaciones necesarias para la gestión eficiente de un taller mecánico, incluyendo la gestión de clientes, vehículos, inventario, ventas y servicios.

## Diagrama Entidad-Relación

![Diagrama Entidad-Relación](../images/er-diagram.png)

*Nota: El diagrama anterior es una representación visual de las relaciones entre las entidades principales del sistema.*

## Entidades Principales

### Cliente

Almacena información sobre los clientes del taller.

**Relaciones**:
- Un cliente puede tener múltiples vehículos
- Un cliente puede tener múltiples ventas
- Un cliente puede tener múltiples servicios

### Vehicle (Vehículo)

Almacena información sobre los vehículos que son atendidos o vendidos en el taller.

**Relaciones**:
- Un vehículo pertenece a un cliente
- Un vehículo puede tener múltiples servicios
- Un vehículo puede estar asociado a una venta

### Part (Repuesto)

Almacena información sobre los repuestos disponibles para venta o uso en servicios.

**Relaciones**:
- Un repuesto puede estar incluido en múltiples ventas
- Un repuesto puede ser utilizado en múltiples servicios

### InventoryItem (Ítem de Inventario)

Almacena información sobre los elementos de inventario del taller, como herramientas y equipos.

**Relaciones**:
- Un ítem de inventario puede ser utilizado en múltiples servicios

### Sale (Venta)

Almacena información sobre las ventas realizadas, ya sea de vehículos o repuestos.

**Relaciones**:
- Una venta está asociada a un cliente
- Una venta puede incluir múltiples repuestos
- Una venta puede incluir un vehículo

### SalePart (Repuesto en Venta)

Tabla de relación que conecta ventas con repuestos, permitiendo una relación muchos a muchos.

**Relaciones**:
- Pertenece a una venta
- Está asociada a un repuesto

### User (Usuario)

Almacena información sobre los usuarios del sistema.

**Relaciones**:
- Un usuario puede crear múltiples ventas
- Un usuario puede registrar múltiples servicios

## Consideraciones de Diseño

- **Integridad Referencial**: Se mantiene a través de claves foráneas y restricciones de integridad.
- **Normalización**: El esquema está normalizado hasta la tercera forma normal para minimizar la redundancia.
- **Índices**: Se han creado índices en campos frecuentemente consultados para optimizar el rendimiento.
- **Auditoría**: Se incluyen campos de auditoría (createdAt, updatedAt) en las entidades principales.