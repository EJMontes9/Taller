# 2.3.4. Módulo de Vehículos

Esta sección documenta el módulo de Vehículos del sistema de Gestión de Taller, que proporciona funcionalidades para la gestión de vehículos de los clientes, incluyendo registro, actualización y seguimiento de servicios asociados.

## Endpoints

### Obtener Todos los Vehículos

**Endpoint**: `GET /api/vehicles`

**Descripción**: Obtiene una lista de todos los vehículos registrados en el sistema.

**Parámetros de Consulta**:
- `page` (opcional): Número de página para paginación
- `pageSize` (opcional): Tamaño de página para paginación
- `clienteId` (opcional): ID del cliente para filtrar vehículos
- `marca` (opcional): Marca del vehículo para filtrar
- `modelo` (opcional): Modelo del vehículo para filtrar

**Respuesta Exitosa (200 OK)**:
```json
{
  "items": [
    {
      "id": "guid",
      "marca": "string",
      "modelo": "string",
      "año": "integer",
      "placa": "string",
      "color": "string",
      "vin": "string",
      "clienteId": "guid",
      "cliente": {
        "id": "guid",
        "nombre": "string",
        "apellido": "string"
      }
    }
  ],
  "totalItems": "integer",
  "pageNumber": "integer",
  "pageSize": "integer",
  "totalPages": "integer"
}
```

### Obtener Vehículo por ID

**Endpoint**: `GET /api/vehicles/{id}`

**Descripción**: Obtiene los detalles de un vehículo específico por su ID.

**Parámetros de Ruta**:
- `id`: ID del vehículo a obtener

**Respuesta Exitosa (200 OK)**:
```json
{
  "id": "guid",
  "marca": "string",
  "modelo": "string",
  "año": "integer",
  "placa": "string",
  "color": "string",
  "vin": "string",
  "clienteId": "guid",
  "cliente": {
    "id": "guid",
    "nombre": "string",
    "apellido": "string",
    "email": "string",
    "telefono": "string"
  },
  "historialServicios": [
    {
      "id": "guid",
      "fecha": "datetime",
      "descripcion": "string",
      "estado": "string"
    }
  ]
}
```

**Respuestas de Error**:
- 404 Not Found: Vehículo no encontrado

### Crear Vehículo

**Endpoint**: `POST /api/vehicles`

**Descripción**: Crea un nuevo vehículo en el sistema.

**Cuerpo de la Solicitud**:
```json
{
  "marca": "string",
  "modelo": "string",
  "año": "integer",
  "placa": "string",
  "color": "string",
  "vin": "string",
  "clienteId": "guid"
}
```

**Respuesta Exitosa (201 Created)**:
```json
{
  "id": "guid",
  "marca": "string",
  "modelo": "string",
  "año": "integer",
  "placa": "string",
  "color": "string",
  "vin": "string",
  "clienteId": "guid"
}
```

**Respuestas de Error**:
- 400 Bad Request: Datos de vehículo inválidos
- 404 Not Found: Cliente no encontrado
- 409 Conflict: La placa o VIN ya está registrado

### Actualizar Vehículo

**Endpoint**: `PUT /api/vehicles/{id}`

**Descripción**: Actualiza los datos de un vehículo existente.

**Parámetros de Ruta**:
- `id`: ID del vehículo a actualizar

**Cuerpo de la Solicitud**:
```json
{
  "marca": "string",
  "modelo": "string",
  "año": "integer",
  "placa": "string",
  "color": "string",
  "vin": "string"
}
```

**Respuesta Exitosa (200 OK)**:
```json
{
  "id": "guid",
  "marca": "string",
  "modelo": "string",
  "año": "integer",
  "placa": "string",
  "color": "string",
  "vin": "string",
  "clienteId": "guid"
}
```

**Respuestas de Error**:
- 400 Bad Request: Datos de vehículo inválidos
- 404 Not Found: Vehículo no encontrado
- 409 Conflict: La placa o VIN ya está registrado por otro vehículo

### Eliminar Vehículo

**Endpoint**: `DELETE /api/vehicles/{id}`

**Descripción**: Elimina un vehículo del sistema.

**Parámetros de Ruta**:
- `id`: ID del vehículo a eliminar

**Respuesta Exitosa (204 No Content)**

**Respuestas de Error**:
- 404 Not Found: Vehículo no encontrado
- 409 Conflict: No se puede eliminar el vehículo porque tiene registros asociados

### Obtener Historial de Servicios de un Vehículo

**Endpoint**: `GET /api/vehicles/{id}/services`

**Descripción**: Obtiene el historial de servicios realizados a un vehículo específico.

**Parámetros de Ruta**:
- `id`: ID del vehículo

**Respuesta Exitosa (200 OK)**:
```json
[
  {
    "id": "guid",
    "fecha": "datetime",
    "descripcion": "string",
    "estado": "string",
    "costo": "decimal",
    "tecnico": "string",
    "observaciones": "string"
  }
]
```

**Respuestas de Error**:
- 404 Not Found: Vehículo no encontrado

## Modelos de Datos

### Vehicle

Representa un vehículo en el sistema.

```csharp
public class Vehicle
{
    public Guid Id { get; set; }
    public string Marca { get; set; }
    public string Modelo { get; set; }
    public int Año { get; set; }
    public string Placa { get; set; }
    public string Color { get; set; }
    public string VIN { get; set; }
    
    // Relaciones
    public Guid ClienteId { get; set; }
    public Cliente Cliente { get; set; }
    public ICollection<Servicio> Servicios { get; set; }
}
```

### DTOs

#### VehicleDto

```csharp
public class VehicleDto
{
    public Guid Id { get; set; }
    public string Marca { get; set; }
    public string Modelo { get; set; }
    public int Año { get; set; }
    public string Placa { get; set; }
    public string Color { get; set; }
    public string VIN { get; set; }
    public Guid ClienteId { get; set; }
    public ClienteDto Cliente { get; set; }
}
```

#### CreateVehicleDto

```csharp
public class CreateVehicleDto
{
    public string Marca { get; set; }
    public string Modelo { get; set; }
    public int Año { get; set; }
    public string Placa { get; set; }
    public string Color { get; set; }
    public string VIN { get; set; }
    public Guid ClienteId { get; set; }
}
```

#### UpdateVehicleDto

```csharp
public class UpdateVehicleDto
{
    public string Marca { get; set; }
    public string Modelo { get; set; }
    public int Año { get; set; }
    public string Placa { get; set; }
    public string Color { get; set; }
    public string VIN { get; set; }
}
```

#### VehicleServiceDto

```csharp
public class VehicleServiceDto
{
    public Guid Id { get; set; }
    public DateTime Fecha { get; set; }
    public string Descripcion { get; set; }
    public string Estado { get; set; }
    public decimal Costo { get; set; }
    public string Tecnico { get; set; }
    public string Observaciones { get; set; }
}
```

## Controladores

### VehiclesController

El `VehiclesController` maneja todas las operaciones relacionadas con vehículos.

```csharp
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class VehiclesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    
    public VehiclesController(ApplicationDbContext context)
    {
        _context = context;
    }
    
    [HttpGet]
    public async Task<ActionResult<PagedResult<VehicleDto>>> GetVehicles(
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 10, 
        [FromQuery] Guid? clienteId = null,
        [FromQuery] string marca = null,
        [FromQuery] string modelo = null)
    {
        // Implementación para obtener todos los vehículos con filtros
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<VehicleDto>> GetVehicle(Guid id)
    {
        // Implementación para obtener un vehículo por ID
    }
    
    [HttpPost]
    public async Task<ActionResult<VehicleDto>> CreateVehicle([FromBody] CreateVehicleDto vehicleDto)
    {
        // Implementación para crear un vehículo
    }
    
    [HttpPut("{id}")]
    public async Task<ActionResult<VehicleDto>> UpdateVehicle(Guid id, [FromBody] UpdateVehicleDto vehicleDto)
    {
        // Implementación para actualizar un vehículo
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteVehicle(Guid id)
    {
        // Implementación para eliminar un vehículo
    }
    
    [HttpGet("{id}/services")]
    public async Task<ActionResult<IEnumerable<VehicleServiceDto>>> GetVehicleServices(Guid id)
    {
        // Implementación para obtener el historial de servicios de un vehículo
    }
}
```

## Servicios

La lógica de negocio para el módulo de vehículos se implementa directamente en el controlador, utilizando Entity Framework Core para el acceso a datos a través del `ApplicationDbContext`.

```csharp
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }
    
    public DbSet<Vehicle> Vehicles { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Configuración de relaciones y restricciones
        modelBuilder.Entity<Vehicle>()
            .HasOne(v => v.Cliente)
            .WithMany(c => c.Vehiculos)
            .HasForeignKey(v => v.ClienteId)
            .OnDelete(DeleteBehavior.Cascade);
            
        modelBuilder.Entity<Vehicle>()
            .HasIndex(v => v.Placa)
            .IsUnique();
            
        modelBuilder.Entity<Vehicle>()
            .HasIndex(v => v.VIN)
            .IsUnique();
    }
}
```

## Reglas de Negocio

El módulo de vehículos implementa las siguientes reglas de negocio:

1. **Unicidad de placa y VIN**: No se permiten vehículos con la misma placa o VIN.
2. **Asociación con cliente**: Todo vehículo debe estar asociado a un cliente existente.
3. **Historial de servicios**: Se mantiene un registro completo de todos los servicios realizados a cada vehículo.
4. **Validación de datos**: Se validan los datos del vehículo antes de su creación o actualización:
   - El año debe ser válido (no futuro y dentro de un rango razonable)
   - La placa debe seguir el formato establecido
   - El VIN debe tener la longitud y formato correctos