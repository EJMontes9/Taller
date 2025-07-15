# 2.3.3. Módulo de Ventas

Esta sección documenta el módulo de Ventas del sistema de Gestión de Taller, que proporciona funcionalidades para la gestión de ventas, facturas y pagos relacionados con servicios y repuestos.

## Endpoints

### Ventas

#### Obtener Todas las Ventas

**Endpoint**: `GET /api/sales`

**Descripción**: Obtiene una lista de todas las ventas registradas en el sistema.

**Parámetros de Consulta**:
- `page` (opcional): Número de página para paginación
- `pageSize` (opcional): Tamaño de página para paginación
- `startDate` (opcional): Fecha de inicio para filtrar ventas
- `endDate` (opcional): Fecha de fin para filtrar ventas
- `clienteId` (opcional): ID del cliente para filtrar ventas

**Respuesta Exitosa (200 OK)**:
```json
{
  "items": [
    {
      "id": "guid",
      "fecha": "datetime",
      "total": "decimal",
      "estado": "string",
      "clienteId": "guid",
      "cliente": {
        "id": "guid",
        "nombre": "string",
        "apellido": "string"
      },
      "items": [
        {
          "id": "guid",
          "cantidad": "integer",
          "precioUnitario": "decimal",
          "subtotal": "decimal",
          "partId": "guid",
          "part": {
            "id": "guid",
            "nombre": "string",
            "codigo": "string"
          }
        }
      ]
    }
  ],
  "totalItems": "integer",
  "pageNumber": "integer",
  "pageSize": "integer",
  "totalPages": "integer"
}
```

#### Obtener Venta por ID

**Endpoint**: `GET /api/sales/{id}`

**Descripción**: Obtiene los detalles de una venta específica por su ID.

**Parámetros de Ruta**:
- `id`: ID de la venta a obtener

**Respuesta Exitosa (200 OK)**:
```json
{
  "id": "guid",
  "fecha": "datetime",
  "total": "decimal",
  "estado": "string",
  "clienteId": "guid",
  "cliente": {
    "id": "guid",
    "nombre": "string",
    "apellido": "string",
    "email": "string",
    "telefono": "string"
  },
  "items": [
    {
      "id": "guid",
      "cantidad": "integer",
      "precioUnitario": "decimal",
      "subtotal": "decimal",
      "partId": "guid",
      "part": {
        "id": "guid",
        "nombre": "string",
        "codigo": "string",
        "descripcion": "string",
        "precio": "decimal"
      }
    }
  ],
  "subtotal": "decimal",
  "impuestos": "decimal",
  "total": "decimal",
  "metodoPago": "string",
  "notas": "string"
}
```

**Respuestas de Error**:
- 404 Not Found: Venta no encontrada

#### Crear Venta

**Endpoint**: `POST /api/sales`

**Descripción**: Crea una nueva venta en el sistema.

**Cuerpo de la Solicitud**:
```json
{
  "clienteId": "guid",
  "items": [
    {
      "partId": "guid",
      "cantidad": "integer",
      "precioUnitario": "decimal"
    }
  ],
  "metodoPago": "string",
  "notas": "string"
}
```

**Respuesta Exitosa (201 Created)**:
```json
{
  "id": "guid",
  "fecha": "datetime",
  "estado": "string",
  "clienteId": "guid",
  "items": [
    {
      "id": "guid",
      "cantidad": "integer",
      "precioUnitario": "decimal",
      "subtotal": "decimal",
      "partId": "guid"
    }
  ],
  "subtotal": "decimal",
  "impuestos": "decimal",
  "total": "decimal",
  "metodoPago": "string",
  "notas": "string"
}
```

**Respuestas de Error**:
- 400 Bad Request: Datos de venta inválidos
- 404 Not Found: Cliente o repuesto no encontrado
- 409 Conflict: Inventario insuficiente

#### Actualizar Estado de Venta

**Endpoint**: `PUT /api/sales/{id}/status`

**Descripción**: Actualiza el estado de una venta existente.

**Parámetros de Ruta**:
- `id`: ID de la venta a actualizar

**Cuerpo de la Solicitud**:
```json
{
  "estado": "string" // "Pendiente", "Pagada", "Cancelada"
}
```

**Respuesta Exitosa (200 OK)**:
```json
{
  "id": "guid",
  "estado": "string",
  "fechaActualizacion": "datetime"
}
```

**Respuestas de Error**:
- 400 Bad Request: Estado inválido
- 404 Not Found: Venta no encontrada

#### Anular Venta

**Endpoint**: `DELETE /api/sales/{id}`

**Descripción**: Anula una venta del sistema (cambia su estado a "Cancelada").

**Parámetros de Ruta**:
- `id`: ID de la venta a anular

**Respuesta Exitosa (204 No Content)**

**Respuestas de Error**:
- 404 Not Found: Venta no encontrada
- 409 Conflict: No se puede anular la venta en su estado actual

### Reportes de Ventas

#### Obtener Reporte de Ventas por Período

**Endpoint**: `GET /api/sales/reports/period`

**Descripción**: Obtiene un reporte de ventas para un período específico.

**Parámetros de Consulta**:
- `startDate` (requerido): Fecha de inicio del período
- `endDate` (requerido): Fecha de fin del período
- `groupBy` (opcional): Agrupación del reporte ("day", "week", "month")

**Respuesta Exitosa (200 OK)**:
```json
{
  "startDate": "datetime",
  "endDate": "datetime",
  "totalVentas": "integer",
  "totalIngresos": "decimal",
  "promedioVentaDiaria": "decimal",
  "detalles": [
    {
      "periodo": "string",
      "cantidadVentas": "integer",
      "ingresos": "decimal"
    }
  ]
}
```

#### Obtener Reporte de Ventas por Cliente

**Endpoint**: `GET /api/sales/reports/clients`

**Descripción**: Obtiene un reporte de ventas agrupado por clientes.

**Parámetros de Consulta**:
- `startDate` (opcional): Fecha de inicio para filtrar
- `endDate` (opcional): Fecha de fin para filtrar
- `top` (opcional): Número de clientes a incluir en el reporte

**Respuesta Exitosa (200 OK)**:
```json
{
  "startDate": "datetime",
  "endDate": "datetime",
  "clientes": [
    {
      "clienteId": "guid",
      "nombre": "string",
      "apellido": "string",
      "cantidadVentas": "integer",
      "totalGastado": "decimal"
    }
  ]
}
```

## Modelos de Datos

### Sale

Representa una venta o factura en el sistema.

```csharp
public class Sale
{
    public Guid Id { get; set; }
    public DateTime Fecha { get; set; }
    public string Estado { get; set; } // "Pendiente", "Pagada", "Cancelada"
    public decimal Subtotal { get; set; }
    public decimal Impuestos { get; set; }
    public decimal Total { get; set; }
    public string MetodoPago { get; set; }
    public string Notas { get; set; }
    
    // Relaciones
    public Guid ClienteId { get; set; }
    public Cliente Cliente { get; set; }
    public ICollection<SalePart> Items { get; set; }
}
```

### SalePart

Representa un ítem o línea en una venta, asociando un repuesto con su cantidad y precio.

```csharp
public class SalePart
{
    public Guid Id { get; set; }
    public int Cantidad { get; set; }
    public decimal PrecioUnitario { get; set; }
    public decimal Subtotal { get; set; }
    
    // Relaciones
    public Guid SaleId { get; set; }
    public Sale Sale { get; set; }
    public Guid PartId { get; set; }
    public Part Part { get; set; }
}
```

### Part

Representa un repuesto o producto que puede ser vendido.

```csharp
public class Part
{
    public Guid Id { get; set; }
    public string Nombre { get; set; }
    public string Codigo { get; set; }
    public string Descripcion { get; set; }
    public decimal Precio { get; set; }
    public int Stock { get; set; }
    public string Categoria { get; set; }
    public string Fabricante { get; set; }
    
    // Relaciones
    public ICollection<SalePart> SaleParts { get; set; }
}
```

### DTOs

#### SaleDto

```csharp
public class SaleDto
{
    public Guid Id { get; set; }
    public DateTime Fecha { get; set; }
    public string Estado { get; set; }
    public decimal Subtotal { get; set; }
    public decimal Impuestos { get; set; }
    public decimal Total { get; set; }
    public string MetodoPago { get; set; }
    public string Notas { get; set; }
    public Guid ClienteId { get; set; }
    public ClienteDto Cliente { get; set; }
    public ICollection<SalePartDto> Items { get; set; }
}
```

#### CreateSaleDto

```csharp
public class CreateSaleDto
{
    public Guid ClienteId { get; set; }
    public ICollection<CreateSalePartDto> Items { get; set; }
    public string MetodoPago { get; set; }
    public string Notas { get; set; }
}
```

#### SalePartDto

```csharp
public class SalePartDto
{
    public Guid Id { get; set; }
    public int Cantidad { get; set; }
    public decimal PrecioUnitario { get; set; }
    public decimal Subtotal { get; set; }
    public Guid PartId { get; set; }
    public PartDto Part { get; set; }
}
```

#### CreateSalePartDto

```csharp
public class CreateSalePartDto
{
    public Guid PartId { get; set; }
    public int Cantidad { get; set; }
    public decimal PrecioUnitario { get; set; }
}
```

#### UpdateSaleStatusDto

```csharp
public class UpdateSaleStatusDto
{
    public string Estado { get; set; }
}
```

## Controladores

### SalesController

El `SalesController` maneja todas las operaciones relacionadas con ventas.

```csharp
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class SalesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    
    public SalesController(ApplicationDbContext context)
    {
        _context = context;
    }
    
    [HttpGet]
    public async Task<ActionResult<PagedResult<SaleDto>>> GetSales(
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 10, 
        [FromQuery] DateTime? startDate = null, 
        [FromQuery] DateTime? endDate = null,
        [FromQuery] Guid? clienteId = null)
    {
        // Implementación para obtener todas las ventas con filtros
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<SaleDto>> GetSale(Guid id)
    {
        // Implementación para obtener una venta por ID
    }
    
    [HttpPost]
    public async Task<ActionResult<SaleDto>> CreateSale([FromBody] CreateSaleDto saleDto)
    {
        // Implementación para crear una venta
    }
    
    [HttpPut("{id}/status")]
    public async Task<ActionResult<SaleStatusDto>> UpdateSaleStatus(Guid id, [FromBody] UpdateSaleStatusDto statusDto)
    {
        // Implementación para actualizar el estado de una venta
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> CancelSale(Guid id)
    {
        // Implementación para anular una venta
    }
    
    [HttpGet("reports/period")]
    public async Task<ActionResult<SalesPeriodReportDto>> GetPeriodReport(
        [FromQuery] DateTime startDate, 
        [FromQuery] DateTime endDate,
        [FromQuery] string groupBy = "day")
    {
        // Implementación para generar reporte por período
    }
    
    [HttpGet("reports/clients")]
    public async Task<ActionResult<SalesClientReportDto>> GetClientReport(
        [FromQuery] DateTime? startDate = null, 
        [FromQuery] DateTime? endDate = null,
        [FromQuery] int top = 10)
    {
        // Implementación para generar reporte por cliente
    }
}
```

### PartsController

El `PartsController` maneja operaciones relacionadas con repuestos y productos.

```csharp
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class PartsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    
    public PartsController(ApplicationDbContext context)
    {
        _context = context;
    }
    
    [HttpGet]
    public async Task<ActionResult<PagedResult<PartDto>>> GetParts(
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 10, 
        [FromQuery] string search = null,
        [FromQuery] string categoria = null)
    {
        // Implementación para obtener todos los repuestos con filtros
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<PartDto>> GetPart(Guid id)
    {
        // Implementación para obtener un repuesto por ID
    }
    
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<PartDto>> CreatePart([FromBody] CreatePartDto partDto)
    {
        // Implementación para crear un repuesto
    }
    
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<PartDto>> UpdatePart(Guid id, [FromBody] UpdatePartDto partDto)
    {
        // Implementación para actualizar un repuesto
    }
    
    [HttpPut("{id}/stock")]
    [Authorize(Roles = "Admin,Receptionist")]
    public async Task<ActionResult<PartStockDto>> UpdatePartStock(Guid id, [FromBody] UpdatePartStockDto stockDto)
    {
        // Implementación para actualizar el stock de un repuesto
    }
    
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeletePart(Guid id)
    {
        // Implementación para eliminar un repuesto
    }
}
```

## Servicios

La lógica de negocio para el módulo de ventas se implementa directamente en los controladores, utilizando Entity Framework Core para el acceso a datos a través del `ApplicationDbContext`.

```csharp
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }
    
    public DbSet<Sale> Sales { get; set; }
    public DbSet<SalePart> SaleParts { get; set; }
    public DbSet<Part> Parts { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Configuración de relaciones y restricciones
        modelBuilder.Entity<Sale>()
            .HasOne(s => s.Cliente)
            .WithMany()
            .HasForeignKey(s => s.ClienteId)
            .OnDelete(DeleteBehavior.Restrict);
            
        modelBuilder.Entity<Sale>()
            .HasMany(s => s.Items)
            .WithOne(sp => sp.Sale)
            .HasForeignKey(sp => sp.SaleId)
            .OnDelete(DeleteBehavior.Cascade);
            
        modelBuilder.Entity<SalePart>()
            .HasOne(sp => sp.Part)
            .WithMany(p => p.SaleParts)
            .HasForeignKey(sp => sp.PartId)
            .OnDelete(DeleteBehavior.Restrict);
            
        modelBuilder.Entity<Part>()
            .HasIndex(p => p.Codigo)
            .IsUnique();
    }
}
```

## Cálculos y Reglas de Negocio

El módulo de ventas implementa varias reglas de negocio importantes:

1. **Cálculo automático de totales**: Al crear una venta, el sistema calcula automáticamente:
   - Subtotal de cada ítem (cantidad × precio unitario)
   - Subtotal de la venta (suma de subtotales de ítems)
   - Impuestos (porcentaje configurable sobre el subtotal)
   - Total (subtotal + impuestos)

2. **Validación de inventario**: Al crear una venta, el sistema verifica que haya suficiente stock de cada repuesto.

3. **Actualización de inventario**: Al completar una venta, el sistema reduce automáticamente el stock de los repuestos vendidos.

4. **Estados de venta**: Una venta puede estar en uno de los siguientes estados:
   - **Pendiente**: Venta registrada pero no pagada
   - **Pagada**: Venta completada y pagada
   - **Cancelada**: Venta anulada

5. **Restricciones de anulación**: Solo se pueden anular ventas en estado "Pendiente". Al anular una venta, el sistema restaura el stock de los repuestos.