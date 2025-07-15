# 2.3.2. Módulo de Clientes

Esta sección documenta el módulo de Clientes del sistema de Gestión de Taller, que proporciona funcionalidades para la gestión de clientes y sus vehículos asociados.

## Endpoints

### Clientes

#### Obtener Todos los Clientes

**Endpoint**: `GET /api/clientes`

**Descripción**: Obtiene una lista de todos los clientes registrados en el sistema.

**Parámetros de Consulta**:
- `page` (opcional): Número de página para paginación
- `pageSize` (opcional): Tamaño de página para paginación
- `search` (opcional): Término de búsqueda para filtrar clientes por nombre o email

**Respuesta Exitosa (200 OK)**:
```json
{
  "items": [
    {
      "id": "guid",
      "nombre": "string",
      "apellido": "string",
      "email": "string",
      "telefono": "string",
      "direccion": "string",
      "fechaRegistro": "datetime",
      "vehiculos": [
        {
          "id": "guid",
          "marca": "string",
          "modelo": "string",
          "año": "integer",
          "placa": "string"
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

#### Obtener Cliente por ID

**Endpoint**: `GET /api/clientes/{id}`

**Descripción**: Obtiene los detalles de un cliente específico por su ID.

**Parámetros de Ruta**:
- `id`: ID del cliente a obtener

**Respuesta Exitosa (200 OK)**:
```json
{
  "id": "guid",
  "nombre": "string",
  "apellido": "string",
  "email": "string",
  "telefono": "string",
  "direccion": "string",
  "fechaRegistro": "datetime",
  "vehiculos": [
    {
      "id": "guid",
      "marca": "string",
      "modelo": "string",
      "año": "integer",
      "placa": "string"
    }
  ]
}
```

**Respuestas de Error**:
- 404 Not Found: Cliente no encontrado

#### Crear Cliente

**Endpoint**: `POST /api/clientes`

**Descripción**: Crea un nuevo cliente en el sistema.

**Cuerpo de la Solicitud**:
```json
{
  "nombre": "string",
  "apellido": "string",
  "email": "string",
  "telefono": "string",
  "direccion": "string"
}
```

**Respuesta Exitosa (201 Created)**:
```json
{
  "id": "guid",
  "nombre": "string",
  "apellido": "string",
  "email": "string",
  "telefono": "string",
  "direccion": "string",
  "fechaRegistro": "datetime",
  "vehiculos": []
}
```

**Respuestas de Error**:
- 400 Bad Request: Datos de cliente inválidos
- 409 Conflict: El email ya está registrado

#### Actualizar Cliente

**Endpoint**: `PUT /api/clientes/{id}`

**Descripción**: Actualiza los datos de un cliente existente.

**Parámetros de Ruta**:
- `id`: ID del cliente a actualizar

**Cuerpo de la Solicitud**:
```json
{
  "nombre": "string",
  "apellido": "string",
  "email": "string",
  "telefono": "string",
  "direccion": "string"
}
```

**Respuesta Exitosa (200 OK)**:
```json
{
  "id": "guid",
  "nombre": "string",
  "apellido": "string",
  "email": "string",
  "telefono": "string",
  "direccion": "string",
  "fechaRegistro": "datetime",
  "vehiculos": [
    {
      "id": "guid",
      "marca": "string",
      "modelo": "string",
      "año": "integer",
      "placa": "string"
    }
  ]
}
```

**Respuestas de Error**:
- 400 Bad Request: Datos de cliente inválidos
- 404 Not Found: Cliente no encontrado
- 409 Conflict: El email ya está registrado por otro cliente

#### Eliminar Cliente

**Endpoint**: `DELETE /api/clientes/{id}`

**Descripción**: Elimina un cliente del sistema.

**Parámetros de Ruta**:
- `id`: ID del cliente a eliminar

**Respuesta Exitosa (204 No Content)**

**Respuestas de Error**:
- 404 Not Found: Cliente no encontrado
- 409 Conflict: No se puede eliminar el cliente porque tiene registros asociados

### Vehículos

#### Obtener Vehículos de un Cliente

**Endpoint**: `GET /api/clientes/{clienteId}/vehiculos`

**Descripción**: Obtiene todos los vehículos asociados a un cliente.

**Parámetros de Ruta**:
- `clienteId`: ID del cliente

**Respuesta Exitosa (200 OK)**:
```json
[
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
]
```

**Respuestas de Error**:
- 404 Not Found: Cliente no encontrado

#### Agregar Vehículo a Cliente

**Endpoint**: `POST /api/clientes/{clienteId}/vehiculos`

**Descripción**: Agrega un nuevo vehículo a un cliente.

**Parámetros de Ruta**:
- `clienteId`: ID del cliente

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

## Modelos de Datos

### Cliente

Representa un cliente del taller.

```csharp
public class Cliente
{
    public Guid Id { get; set; }
    public string Nombre { get; set; }
    public string Apellido { get; set; }
    public string Email { get; set; }
    public string Telefono { get; set; }
    public string Direccion { get; set; }
    public DateTime FechaRegistro { get; set; }
    
    // Relaciones
    public ICollection<Vehicle> Vehiculos { get; set; }
}
```

### Vehicle

Representa un vehículo asociado a un cliente.

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
}
```

### DTOs

#### ClienteDto

```csharp
public class ClienteDto
{
    public Guid Id { get; set; }
    public string Nombre { get; set; }
    public string Apellido { get; set; }
    public string Email { get; set; }
    public string Telefono { get; set; }
    public string Direccion { get; set; }
    public DateTime FechaRegistro { get; set; }
    public ICollection<VehicleDto> Vehiculos { get; set; }
}
```

#### CreateClienteDto

```csharp
public class CreateClienteDto
{
    public string Nombre { get; set; }
    public string Apellido { get; set; }
    public string Email { get; set; }
    public string Telefono { get; set; }
    public string Direccion { get; set; }
}
```

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
}
```

## Controladores

### ClientesController

El `ClientesController` maneja todas las operaciones relacionadas con los clientes.

```csharp
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class ClientesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    
    public ClientesController(ApplicationDbContext context)
    {
        _context = context;
    }
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ClienteDto>>> GetClientes([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string search = null)
    {
        // Implementación para obtener todos los clientes
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<ClienteDto>> GetCliente(Guid id)
    {
        // Implementación para obtener un cliente por ID
    }
    
    [HttpPost]
    public async Task<ActionResult<ClienteDto>> CreateCliente([FromBody] CreateClienteDto clienteDto)
    {
        // Implementación para crear un cliente
    }
    
    [HttpPut("{id}")]
    public async Task<ActionResult<ClienteDto>> UpdateCliente(Guid id, [FromBody] CreateClienteDto clienteDto)
    {
        // Implementación para actualizar un cliente
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCliente(Guid id)
    {
        // Implementación para eliminar un cliente
    }
    
    [HttpGet("{clienteId}/vehiculos")]
    public async Task<ActionResult<IEnumerable<VehicleDto>>> GetVehiculos(Guid clienteId)
    {
        // Implementación para obtener los vehículos de un cliente
    }
    
    [HttpPost("{clienteId}/vehiculos")]
    public async Task<ActionResult<VehicleDto>> AddVehiculo(Guid clienteId, [FromBody] CreateVehicleDto vehicleDto)
    {
        // Implementación para agregar un vehículo a un cliente
    }
}
```

### VehiclesController

El `VehiclesController` maneja operaciones específicas de vehículos.

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
    
    [HttpGet("{id}")]
    public async Task<ActionResult<VehicleDto>> GetVehicle(Guid id)
    {
        // Implementación para obtener un vehículo por ID
    }
    
    [HttpPut("{id}")]
    public async Task<ActionResult<VehicleDto>> UpdateVehicle(Guid id, [FromBody] CreateVehicleDto vehicleDto)
    {
        // Implementación para actualizar un vehículo
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteVehicle(Guid id)
    {
        // Implementación para eliminar un vehículo
    }
}
```

## Servicios

La lógica de negocio para el módulo de clientes se implementa directamente en los controladores, utilizando Entity Framework Core para el acceso a datos a través del `ApplicationDbContext`.

```csharp
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }
    
    public DbSet<Cliente> Clientes { get; set; }
    public DbSet<Vehicle> Vehicles { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Configuración de relaciones y restricciones
        modelBuilder.Entity<Cliente>()
            .HasMany(c => c.Vehiculos)
            .WithOne(v => v.Cliente)
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