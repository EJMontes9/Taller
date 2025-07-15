# 2.3.6. Módulo de Inventario

Esta sección documenta el módulo de Inventario del sistema de Gestión de Taller, que proporciona funcionalidades para la gestión de elementos de inventario, incluyendo herramientas, equipos y otros activos del taller.

## Endpoints

### Obtener Todos los Elementos de Inventario

**Endpoint**: `GET /api/inventoryitems`

**Descripción**: Obtiene una lista de todos los elementos de inventario registrados en el sistema.

**Parámetros de Consulta**:
- `page` (opcional): Número de página para paginación
- `pageSize` (opcional): Tamaño de página para paginación
- `search` (opcional): Término de búsqueda para filtrar por nombre o código
- `tipo` (opcional): Tipo de elemento para filtrar
- `estado` (opcional): Estado del elemento para filtrar

**Respuesta Exitosa (200 OK)**:
```json
{
  "items": [
    {
      "id": "guid",
      "nombre": "string",
      "codigo": "string",
      "descripcion": "string",
      "tipo": "string",
      "estado": "string",
      "ubicacion": "string",
      "fechaAdquisicion": "datetime",
      "valorAdquisicion": "decimal"
    }
  ],
  "totalItems": "integer",
  "pageNumber": "integer",
  "pageSize": "integer",
  "totalPages": "integer"
}
```

### Obtener Elemento de Inventario por ID

**Endpoint**: `GET /api/inventoryitems/{id}`

**Descripción**: Obtiene los detalles de un elemento de inventario específico por su ID.

**Parámetros de Ruta**:
- `id`: ID del elemento de inventario a obtener

**Respuesta Exitosa (200 OK)**:
```json
{
  "id": "guid",
  "nombre": "string",
  "codigo": "string",
  "descripcion": "string",
  "tipo": "string",
  "estado": "string",
  "ubicacion": "string",
  "fechaAdquisicion": "datetime",
  "valorAdquisicion": "decimal",
  "fechaUltimoMantenimiento": "datetime",
  "responsable": "string",
  "notas": "string",
  "fechaCreacion": "datetime",
  "fechaActualizacion": "datetime"
}
```

**Respuestas de Error**:
- 404 Not Found: Elemento de inventario no encontrado

### Crear Elemento de Inventario

**Endpoint**: `POST /api/inventoryitems`

**Descripción**: Crea un nuevo elemento de inventario en el sistema.

**Cuerpo de la Solicitud**:
```json
{
  "nombre": "string",
  "codigo": "string",
  "descripcion": "string",
  "tipo": "string",
  "estado": "string",
  "ubicacion": "string",
  "fechaAdquisicion": "datetime",
  "valorAdquisicion": "decimal",
  "responsable": "string",
  "notas": "string"
}
```

**Respuesta Exitosa (201 Created)**:
```json
{
  "id": "guid",
  "nombre": "string",
  "codigo": "string",
  "descripcion": "string",
  "tipo": "string",
  "estado": "string",
  "ubicacion": "string",
  "fechaAdquisicion": "datetime",
  "valorAdquisicion": "decimal",
  "responsable": "string",
  "notas": "string",
  "fechaCreacion": "datetime",
  "fechaActualizacion": "datetime"
}
```

**Respuestas de Error**:
- 400 Bad Request: Datos de elemento de inventario inválidos
- 409 Conflict: El código ya está registrado

### Actualizar Elemento de Inventario

**Endpoint**: `PUT /api/inventoryitems/{id}`

**Descripción**: Actualiza los datos de un elemento de inventario existente.

**Parámetros de Ruta**:
- `id`: ID del elemento de inventario a actualizar

**Cuerpo de la Solicitud**:
```json
{
  "nombre": "string",
  "codigo": "string",
  "descripcion": "string",
  "tipo": "string",
  "estado": "string",
  "ubicacion": "string",
  "fechaAdquisicion": "datetime",
  "valorAdquisicion": "decimal",
  "responsable": "string",
  "notas": "string"
}
```

**Respuesta Exitosa (200 OK)**:
```json
{
  "id": "guid",
  "nombre": "string",
  "codigo": "string",
  "descripcion": "string",
  "tipo": "string",
  "estado": "string",
  "ubicacion": "string",
  "fechaAdquisicion": "datetime",
  "valorAdquisicion": "decimal",
  "responsable": "string",
  "notas": "string",
  "fechaActualizacion": "datetime"
}
```

**Respuestas de Error**:
- 400 Bad Request: Datos de elemento de inventario inválidos
- 404 Not Found: Elemento de inventario no encontrado
- 409 Conflict: El código ya está registrado por otro elemento

### Actualizar Estado de Elemento de Inventario

**Endpoint**: `PUT /api/inventoryitems/{id}/status`

**Descripción**: Actualiza el estado de un elemento de inventario existente.

**Parámetros de Ruta**:
- `id`: ID del elemento de inventario a actualizar

**Cuerpo de la Solicitud**:
```json
{
  "estado": "string" // "Disponible", "En uso", "En mantenimiento", "Fuera de servicio", "Dado de baja"
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
- 404 Not Found: Elemento de inventario no encontrado

### Registrar Mantenimiento

**Endpoint**: `POST /api/inventoryitems/{id}/maintenance`

**Descripción**: Registra un mantenimiento para un elemento de inventario.

**Parámetros de Ruta**:
- `id`: ID del elemento de inventario

**Cuerpo de la Solicitud**:
```json
{
  "fecha": "datetime",
  "descripcion": "string",
  "costo": "decimal",
  "responsable": "string",
  "resultado": "string"
}
```

**Respuesta Exitosa (201 Created)**:
```json
{
  "id": "guid",
  "inventoryItemId": "guid",
  "fecha": "datetime",
  "descripcion": "string",
  "costo": "decimal",
  "responsable": "string",
  "resultado": "string"
}
```

**Respuestas de Error**:
- 400 Bad Request: Datos de mantenimiento inválidos
- 404 Not Found: Elemento de inventario no encontrado

### Eliminar Elemento de Inventario

**Endpoint**: `DELETE /api/inventoryitems/{id}`

**Descripción**: Elimina un elemento de inventario del sistema.

**Parámetros de Ruta**:
- `id`: ID del elemento de inventario a eliminar

**Respuesta Exitosa (204 No Content)**

**Respuestas de Error**:
- 404 Not Found: Elemento de inventario no encontrado
- 409 Conflict: No se puede eliminar el elemento porque tiene registros asociados

### Obtener Historial de Mantenimientos

**Endpoint**: `GET /api/inventoryitems/{id}/maintenance`

**Descripción**: Obtiene el historial de mantenimientos de un elemento de inventario.

**Parámetros de Ruta**:
- `id`: ID del elemento de inventario

**Respuesta Exitosa (200 OK)**:
```json
[
  {
    "id": "guid",
    "fecha": "datetime",
    "descripcion": "string",
    "costo": "decimal",
    "responsable": "string",
    "resultado": "string"
  }
]
```

**Respuestas de Error**:
- 404 Not Found: Elemento de inventario no encontrado

## Modelos de Datos

### InventoryItem

Representa un elemento de inventario en el sistema.

```csharp
public class InventoryItem
{
    public Guid Id { get; set; }
    public string Nombre { get; set; }
    public string Codigo { get; set; }
    public string Descripcion { get; set; }
    public string Tipo { get; set; }
    public string Estado { get; set; }
    public string Ubicacion { get; set; }
    public DateTime FechaAdquisicion { get; set; }
    public decimal ValorAdquisicion { get; set; }
    public DateTime? FechaUltimoMantenimiento { get; set; }
    public string Responsable { get; set; }
    public string Notas { get; set; }
    public DateTime FechaCreacion { get; set; }
    public DateTime FechaActualizacion { get; set; }
    
    // Relaciones
    public ICollection<MaintenanceRecord> Mantenimientos { get; set; }
}
```

### MaintenanceRecord

Representa un registro de mantenimiento para un elemento de inventario.

```csharp
public class MaintenanceRecord
{
    public Guid Id { get; set; }
    public DateTime Fecha { get; set; }
    public string Descripcion { get; set; }
    public decimal Costo { get; set; }
    public string Responsable { get; set; }
    public string Resultado { get; set; }
    
    // Relaciones
    public Guid InventoryItemId { get; set; }
    public InventoryItem InventoryItem { get; set; }
}
```

### DTOs

#### InventoryItemDto

```csharp
public class InventoryItemDto
{
    public Guid Id { get; set; }
    public string Nombre { get; set; }
    public string Codigo { get; set; }
    public string Descripcion { get; set; }
    public string Tipo { get; set; }
    public string Estado { get; set; }
    public string Ubicacion { get; set; }
    public DateTime FechaAdquisicion { get; set; }
    public decimal ValorAdquisicion { get; set; }
    public DateTime? FechaUltimoMantenimiento { get; set; }
    public string Responsable { get; set; }
    public string Notas { get; set; }
    public DateTime FechaCreacion { get; set; }
    public DateTime FechaActualizacion { get; set; }
}
```

#### CreateInventoryItemDto

```csharp
public class CreateInventoryItemDto
{
    public string Nombre { get; set; }
    public string Codigo { get; set; }
    public string Descripcion { get; set; }
    public string Tipo { get; set; }
    public string Estado { get; set; }
    public string Ubicacion { get; set; }
    public DateTime FechaAdquisicion { get; set; }
    public decimal ValorAdquisicion { get; set; }
    public string Responsable { get; set; }
    public string Notas { get; set; }
}
```

#### UpdateInventoryItemDto

```csharp
public class UpdateInventoryItemDto
{
    public string Nombre { get; set; }
    public string Codigo { get; set; }
    public string Descripcion { get; set; }
    public string Tipo { get; set; }
    public string Estado { get; set; }
    public string Ubicacion { get; set; }
    public DateTime FechaAdquisicion { get; set; }
    public decimal ValorAdquisicion { get; set; }
    public string Responsable { get; set; }
    public string Notas { get; set; }
}
```

#### UpdateInventoryItemStatusDto

```csharp
public class UpdateInventoryItemStatusDto
{
    public string Estado { get; set; }
}
```

#### InventoryItemStatusDto

```csharp
public class InventoryItemStatusDto
{
    public Guid Id { get; set; }
    public string Estado { get; set; }
    public DateTime FechaActualizacion { get; set; }
}
```

#### CreateMaintenanceRecordDto

```csharp
public class CreateMaintenanceRecordDto
{
    public DateTime Fecha { get; set; }
    public string Descripcion { get; set; }
    public decimal Costo { get; set; }
    public string Responsable { get; set; }
    public string Resultado { get; set; }
}
```

#### MaintenanceRecordDto

```csharp
public class MaintenanceRecordDto
{
    public Guid Id { get; set; }
    public Guid InventoryItemId { get; set; }
    public DateTime Fecha { get; set; }
    public string Descripcion { get; set; }
    public decimal Costo { get; set; }
    public string Responsable { get; set; }
    public string Resultado { get; set; }
}
```

## Controladores

### InventoryItemsController

El `InventoryItemsController` maneja todas las operaciones relacionadas con elementos de inventario.

```csharp
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class InventoryItemsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    
    public InventoryItemsController(ApplicationDbContext context)
    {
        _context = context;
    }
    
    [HttpGet]
    public async Task<ActionResult<PagedResult<InventoryItemDto>>> GetInventoryItems(
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 10, 
        [FromQuery] string search = null,
        [FromQuery] string tipo = null,
        [FromQuery] string estado = null)
    {
        // Implementación para obtener todos los elementos de inventario con filtros
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<InventoryItemDto>> GetInventoryItem(Guid id)
    {
        // Implementación para obtener un elemento de inventario por ID
    }
    
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<InventoryItemDto>> CreateInventoryItem([FromBody] CreateInventoryItemDto inventoryItemDto)
    {
        // Implementación para crear un elemento de inventario
    }
    
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<InventoryItemDto>> UpdateInventoryItem(Guid id, [FromBody] UpdateInventoryItemDto inventoryItemDto)
    {
        // Implementación para actualizar un elemento de inventario
    }
    
    [HttpPut("{id}/status")]
    [Authorize(Roles = "Admin,Technician")]
    public async Task<ActionResult<InventoryItemStatusDto>> UpdateInventoryItemStatus(Guid id, [FromBody] UpdateInventoryItemStatusDto statusDto)
    {
        // Implementación para actualizar el estado de un elemento de inventario
    }
    
    [HttpPost("{id}/maintenance")]
    [Authorize(Roles = "Admin,Technician")]
    public async Task<ActionResult<MaintenanceRecordDto>> AddMaintenanceRecord(Guid id, [FromBody] CreateMaintenanceRecordDto maintenanceDto)
    {
        // Implementación para registrar un mantenimiento
    }
    
    [HttpGet("{id}/maintenance")]
    public async Task<ActionResult<IEnumerable<MaintenanceRecordDto>>> GetMaintenanceRecords(Guid id)
    {
        // Implementación para obtener el historial de mantenimientos
    }
    
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteInventoryItem(Guid id)
    {
        // Implementación para eliminar un elemento de inventario
    }
}
```

## Servicios

La lógica de negocio para el módulo de inventario se implementa directamente en el controlador, utilizando Entity Framework Core para el acceso a datos a través del `ApplicationDbContext`.

```csharp
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }
    
    public DbSet<InventoryItem> InventoryItems { get; set; }
    public DbSet<MaintenanceRecord> MaintenanceRecords { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Configuración de relaciones y restricciones
        modelBuilder.Entity<InventoryItem>()
            .HasIndex(i => i.Codigo)
            .IsUnique();
            
        modelBuilder.Entity<InventoryItem>()
            .Property(i => i.ValorAdquisicion)
            .HasColumnType("decimal(18,2)");
            
        modelBuilder.Entity<MaintenanceRecord>()
            .HasOne(m => m.InventoryItem)
            .WithMany(i => i.Mantenimientos)
            .HasForeignKey(m => m.InventoryItemId)
            .OnDelete(DeleteBehavior.Cascade);
            
        modelBuilder.Entity<MaintenanceRecord>()
            .Property(m => m.Costo)
            .HasColumnType("decimal(18,2)");
    }
}
```

## Reglas de Negocio

El módulo de inventario implementa las siguientes reglas de negocio:

1. **Unicidad de código**: No se permiten elementos de inventario con el mismo código.
2. **Estados válidos**: Los estados permitidos para un elemento de inventario son:
   - Disponible
   - En uso
   - En mantenimiento
   - Fuera de servicio
   - Dado de baja
3. **Actualización de fecha de último mantenimiento**: Al registrar un nuevo mantenimiento, se actualiza automáticamente la fecha de último mantenimiento del elemento.
4. **Control de acceso**: Solo los usuarios con roles específicos pueden realizar ciertas operaciones:
   - Administradores: Crear, actualizar y eliminar elementos de inventario
   - Técnicos: Actualizar estado y registrar mantenimientos
   - Todos los usuarios autenticados: Consultar elementos de inventario
5. **Trazabilidad**: Se registra la fecha de creación y última actualización de cada elemento de inventario.
6. **Historial de mantenimientos**: Se mantiene un registro completo de todos los mantenimientos realizados a cada elemento de inventario.