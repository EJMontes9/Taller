# 2.3.5. Módulo de Repuestos

Esta sección documenta el módulo de Repuestos del sistema de Gestión de Taller, que proporciona funcionalidades para la gestión de repuestos y piezas utilizadas en reparaciones y disponibles para venta.

## Endpoints

### Obtener Todos los Repuestos

**Endpoint**: `GET /api/parts`

**Descripción**: Obtiene una lista de todos los repuestos registrados en el sistema.

**Parámetros de Consulta**:
- `page` (opcional): Número de página para paginación
- `pageSize` (opcional): Tamaño de página para paginación
- `search` (opcional): Término de búsqueda para filtrar por nombre o código
- `categoria` (opcional): Categoría de repuestos para filtrar
- `fabricante` (opcional): Fabricante para filtrar

**Respuesta Exitosa (200 OK)**:
```json
{
  "items": [
    {
      "id": "guid",
      "nombre": "string",
      "codigo": "string",
      "descripcion": "string",
      "precio": "decimal",
      "stock": "integer",
      "categoria": "string",
      "fabricante": "string"
    }
  ],
  "totalItems": "integer",
  "pageNumber": "integer",
  "pageSize": "integer",
  "totalPages": "integer"
}
```

### Obtener Repuesto por ID

**Endpoint**: `GET /api/parts/{id}`

**Descripción**: Obtiene los detalles de un repuesto específico por su ID.

**Parámetros de Ruta**:
- `id`: ID del repuesto a obtener

**Respuesta Exitosa (200 OK)**:
```json
{
  "id": "guid",
  "nombre": "string",
  "codigo": "string",
  "descripcion": "string",
  "precio": "decimal",
  "stock": "integer",
  "categoria": "string",
  "fabricante": "string",
  "ubicacion": "string",
  "fechaCreacion": "datetime",
  "fechaActualizacion": "datetime"
}
```

**Respuestas de Error**:
- 404 Not Found: Repuesto no encontrado

### Crear Repuesto

**Endpoint**: `POST /api/parts`

**Descripción**: Crea un nuevo repuesto en el sistema.

**Cuerpo de la Solicitud**:
```json
{
  "nombre": "string",
  "codigo": "string",
  "descripcion": "string",
  "precio": "decimal",
  "stock": "integer",
  "categoria": "string",
  "fabricante": "string",
  "ubicacion": "string"
}
```

**Respuesta Exitosa (201 Created)**:
```json
{
  "id": "guid",
  "nombre": "string",
  "codigo": "string",
  "descripcion": "string",
  "precio": "decimal",
  "stock": "integer",
  "categoria": "string",
  "fabricante": "string",
  "ubicacion": "string",
  "fechaCreacion": "datetime",
  "fechaActualizacion": "datetime"
}
```

**Respuestas de Error**:
- 400 Bad Request: Datos de repuesto inválidos
- 409 Conflict: El código ya está registrado

### Actualizar Repuesto

**Endpoint**: `PUT /api/parts/{id}`

**Descripción**: Actualiza los datos de un repuesto existente.

**Parámetros de Ruta**:
- `id`: ID del repuesto a actualizar

**Cuerpo de la Solicitud**:
```json
{
  "nombre": "string",
  "codigo": "string",
  "descripcion": "string",
  "precio": "decimal",
  "categoria": "string",
  "fabricante": "string",
  "ubicacion": "string"
}
```

**Respuesta Exitosa (200 OK)**:
```json
{
  "id": "guid",
  "nombre": "string",
  "codigo": "string",
  "descripcion": "string",
  "precio": "decimal",
  "stock": "integer",
  "categoria": "string",
  "fabricante": "string",
  "ubicacion": "string",
  "fechaActualizacion": "datetime"
}
```

**Respuestas de Error**:
- 400 Bad Request: Datos de repuesto inválidos
- 404 Not Found: Repuesto no encontrado
- 409 Conflict: El código ya está registrado por otro repuesto

### Actualizar Stock de Repuesto

**Endpoint**: `PUT /api/parts/{id}/stock`

**Descripción**: Actualiza el stock de un repuesto existente.

**Parámetros de Ruta**:
- `id`: ID del repuesto a actualizar

**Cuerpo de la Solicitud**:
```json
{
  "cantidad": "integer",
  "tipo": "string" // "Incremento", "Decremento", "Establecer"
}
```

**Respuesta Exitosa (200 OK)**:
```json
{
  "id": "guid",
  "stock": "integer",
  "fechaActualizacion": "datetime"
}
```

**Respuestas de Error**:
- 400 Bad Request: Datos de stock inválidos
- 404 Not Found: Repuesto no encontrado
- 409 Conflict: Stock insuficiente para decrementar

### Eliminar Repuesto

**Endpoint**: `DELETE /api/parts/{id}`

**Descripción**: Elimina un repuesto del sistema.

**Parámetros de Ruta**:
- `id`: ID del repuesto a eliminar

**Respuesta Exitosa (204 No Content)**

**Respuestas de Error**:
- 404 Not Found: Repuesto no encontrado
- 409 Conflict: No se puede eliminar el repuesto porque tiene registros asociados

### Obtener Categorías de Repuestos

**Endpoint**: `GET /api/parts/categories`

**Descripción**: Obtiene una lista de todas las categorías de repuestos disponibles.

**Respuesta Exitosa (200 OK)**:
```json
[
  "string"
]
```

### Obtener Fabricantes de Repuestos

**Endpoint**: `GET /api/parts/manufacturers`

**Descripción**: Obtiene una lista de todos los fabricantes de repuestos disponibles.

**Respuesta Exitosa (200 OK)**:
```json
[
  "string"
]
```

## Modelos de Datos

### Part

Representa un repuesto o pieza en el sistema.

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
    public string Ubicacion { get; set; }
    public DateTime FechaCreacion { get; set; }
    public DateTime FechaActualizacion { get; set; }
    
    // Relaciones
    public ICollection<SalePart> SaleParts { get; set; }
    public ICollection<InventoryItem> InventoryItems { get; set; }
}
```

### DTOs

#### PartDto

```csharp
public class PartDto
{
    public Guid Id { get; set; }
    public string Nombre { get; set; }
    public string Codigo { get; set; }
    public string Descripcion { get; set; }
    public decimal Precio { get; set; }
    public int Stock { get; set; }
    public string Categoria { get; set; }
    public string Fabricante { get; set; }
    public string Ubicacion { get; set; }
    public DateTime FechaCreacion { get; set; }
    public DateTime FechaActualizacion { get; set; }
}
```

#### CreatePartDto

```csharp
public class CreatePartDto
{
    public string Nombre { get; set; }
    public string Codigo { get; set; }
    public string Descripcion { get; set; }
    public decimal Precio { get; set; }
    public int Stock { get; set; }
    public string Categoria { get; set; }
    public string Fabricante { get; set; }
    public string Ubicacion { get; set; }
}
```

#### UpdatePartDto

```csharp
public class UpdatePartDto
{
    public string Nombre { get; set; }
    public string Codigo { get; set; }
    public string Descripcion { get; set; }
    public decimal Precio { get; set; }
    public string Categoria { get; set; }
    public string Fabricante { get; set; }
    public string Ubicacion { get; set; }
}
```

#### UpdatePartStockDto

```csharp
public class UpdatePartStockDto
{
    public int Cantidad { get; set; }
    public string Tipo { get; set; } // "Incremento", "Decremento", "Establecer"
}
```

#### PartStockDto

```csharp
public class PartStockDto
{
    public Guid Id { get; set; }
    public int Stock { get; set; }
    public DateTime FechaActualizacion { get; set; }
}
```

## Controladores

### PartsController

El `PartsController` maneja todas las operaciones relacionadas con repuestos.

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
        [FromQuery] string categoria = null,
        [FromQuery] string fabricante = null)
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
    
    [HttpGet("categories")]
    public async Task<ActionResult<IEnumerable<string>>> GetCategories()
    {
        // Implementación para obtener todas las categorías
    }
    
    [HttpGet("manufacturers")]
    public async Task<ActionResult<IEnumerable<string>>> GetManufacturers()
    {
        // Implementación para obtener todos los fabricantes
    }
}
```

## Servicios

La lógica de negocio para el módulo de repuestos se implementa directamente en el controlador, utilizando Entity Framework Core para el acceso a datos a través del `ApplicationDbContext`.

```csharp
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }
    
    public DbSet<Part> Parts { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Configuración de relaciones y restricciones
        modelBuilder.Entity<Part>()
            .HasIndex(p => p.Codigo)
            .IsUnique();
            
        modelBuilder.Entity<Part>()
            .Property(p => p.Precio)
            .HasColumnType("decimal(18,2)");
    }
}
```

## Reglas de Negocio

El módulo de repuestos implementa las siguientes reglas de negocio:

1. **Unicidad de código**: No se permiten repuestos con el mismo código.
2. **Control de stock**: El sistema mantiene un registro actualizado del stock disponible de cada repuesto.
3. **Validación de datos**: Se validan los datos del repuesto antes de su creación o actualización:
   - El precio debe ser mayor que cero
   - El stock no puede ser negativo
   - El código debe seguir el formato establecido
4. **Control de acceso**: Solo los usuarios con roles específicos pueden realizar ciertas operaciones:
   - Administradores: Crear, actualizar y eliminar repuestos
   - Recepcionistas: Actualizar stock
   - Todos los usuarios autenticados: Consultar repuestos
5. **Trazabilidad**: Se registra la fecha de creación y última actualización de cada repuesto.