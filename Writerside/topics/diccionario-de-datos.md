# 4.2. Diccionario de Datos

Esta sección proporciona un diccionario detallado de todas las tablas y campos de la base de datos del sistema de Gestión de Taller. El diccionario de datos es una referencia esencial para entender la estructura y el significado de los datos almacenados en el sistema.

## Tablas y Campos

### Cliente

| Campo | Tipo de Dato | Descripción | Restricciones |
|-------|-------------|-------------|---------------|
| Id | int | Identificador único del cliente | PK, Auto-incremento |
| Nombre | nvarchar(100) | Nombre del cliente | Not Null |
| Apellido | nvarchar(100) | Apellido del cliente | Not Null |
| Email | nvarchar(150) | Correo electrónico del cliente | Unique |
| Telefono | nvarchar(20) | Número de teléfono del cliente | |
| Direccion | nvarchar(200) | Dirección física del cliente | |
| FechaRegistro | datetime | Fecha de registro del cliente | Default: GetDate() |

### Vehicle (Vehículo)

| Campo | Tipo de Dato | Descripción | Restricciones |
|-------|-------------|-------------|---------------|
| Id | int | Identificador único del vehículo | PK, Auto-incremento |
| Brand | nvarchar(50) | Marca del vehículo | Not Null |
| Model | nvarchar(50) | Modelo del vehículo | Not Null |
| Year | int | Año de fabricación | Not Null |
| Color | nvarchar(30) | Color del vehículo | |
| VIN | nvarchar(17) | Número de identificación del vehículo | Unique |
| Price | decimal(18,2) | Precio del vehículo | |
| Status | nvarchar(20) | Estado del vehículo (disponible, vendido, en reparación) | |
| ClienteId | int | ID del cliente propietario | FK -> Cliente(Id) |

### Part (Repuesto)

| Campo | Tipo de Dato | Descripción | Restricciones |
|-------|-------------|-------------|---------------|
| Id | int | Identificador único del repuesto | PK, Auto-incremento |
| Name | nvarchar(100) | Nombre del repuesto | Not Null |
| Category | nvarchar(50) | Categoría del repuesto | |
| SKU | nvarchar(20) | Código de identificación del producto | Unique |
| Price | decimal(18,2) | Precio de venta | Not Null |
| Stock | int | Cantidad disponible en inventario | Default: 0 |
| MinStock | int | Nivel mínimo de stock | Default: 5 |
| Supplier | nvarchar(100) | Proveedor del repuesto | |

### InventoryItem (Ítem de Inventario)

| Campo | Tipo de Dato | Descripción | Restricciones |
|-------|-------------|-------------|---------------|
| Id | int | Identificador único del ítem | PK, Auto-incremento |
| Name | nvarchar(100) | Nombre del ítem | Not Null |
| Category | nvarchar(50) | Categoría del ítem | |
| Description | nvarchar(500) | Descripción detallada | |
| Quantity | int | Cantidad disponible | Default: 1 |
| Location | nvarchar(100) | Ubicación física en el taller | |
| PurchaseDate | datetime | Fecha de compra | |
| PurchasePrice | decimal(18,2) | Precio de compra | |

### Sale (Venta)

| Campo | Tipo de Dato | Descripción | Restricciones |
|-------|-------------|-------------|---------------|
| Id | int | Identificador único de la venta | PK, Auto-incremento |
| Date | datetime | Fecha de la venta | Default: GetDate() |
| ClienteId | int | ID del cliente | FK -> Cliente(Id) |
| VehicleId | int | ID del vehículo (si aplica) | FK -> Vehicle(Id), Nullable |
| Total | decimal(18,2) | Monto total de la venta | Not Null |
| PaymentMethod | nvarchar(50) | Método de pago utilizado | |
| Status | nvarchar(20) | Estado de la venta (completada, pendiente, cancelada) | |
| UserId | int | ID del usuario que registró la venta | FK -> User(Id) |

### SalePart (Repuesto en Venta)

| Campo | Tipo de Dato | Descripción | Restricciones |
|-------|-------------|-------------|---------------|
| Id | int | Identificador único | PK, Auto-incremento |
| SaleId | int | ID de la venta | FK -> Sale(Id) |
| PartId | int | ID del repuesto | FK -> Part(Id) |
| Quantity | int | Cantidad vendida | Default: 1 |
| UnitPrice | decimal(18,2) | Precio unitario al momento de la venta | Not Null |
| Subtotal | decimal(18,2) | Subtotal (Quantity * UnitPrice) | Computed |

### User (Usuario)

| Campo | Tipo de Dato | Descripción | Restricciones |
|-------|-------------|-------------|---------------|
| Id | int | Identificador único del usuario | PK, Auto-incremento |
| Username | nvarchar(50) | Nombre de usuario | Unique, Not Null |
| PasswordHash | nvarchar(256) | Hash de la contraseña | Not Null |
| Name | nvarchar(100) | Nombre completo | Not Null |
| Email | nvarchar(150) | Correo electrónico | Unique, Not Null |
| Role | nvarchar(20) | Rol del usuario (admin, vendedor, técnico) | Not Null |
| LastLogin | datetime | Última fecha de inicio de sesión | Nullable |

## Índices

| Tabla | Nombre del Índice | Campos | Tipo | Descripción |
|-------|------------------|--------|------|-------------|
| Cliente | IX_Cliente_Email | Email | Unique | Asegura emails únicos y optimiza búsquedas por email |
| Vehicle | IX_Vehicle_VIN | VIN | Unique | Asegura VINs únicos y optimiza búsquedas por VIN |
| Vehicle | IX_Vehicle_ClienteId | ClienteId | Non-Unique | Optimiza búsquedas de vehículos por cliente |
| Part | IX_Part_SKU | SKU | Unique | Asegura SKUs únicos y optimiza búsquedas por SKU |
| Sale | IX_Sale_ClienteId | ClienteId | Non-Unique | Optimiza búsquedas de ventas por cliente |
| Sale | IX_Sale_Date | Date | Non-Unique | Optimiza búsquedas de ventas por fecha |
| SalePart | IX_SalePart_SaleId | SaleId | Non-Unique | Optimiza búsquedas de detalles por venta |
| User | IX_User_Username | Username | Unique | Asegura nombres de usuario únicos |