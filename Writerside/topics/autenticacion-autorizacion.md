# 2.3.1. Autenticación y Autorización

Esta sección documenta el módulo de Autenticación y Autorización del sistema de Gestión de Taller, que proporciona funcionalidades para el registro de usuarios, inicio de sesión, gestión de tokens XML y control de acceso basado en roles.

## Endpoints

### Registro de Usuario

**Endpoint**: `POST /api/auth/register`

**Descripción**: Registra un nuevo usuario en el sistema.

**Cuerpo de la Solicitud**:
```xml
<RegisterRequest>
  <username>string</username>
  <email>string</email>
  <password>string</password>
  <fullName>string</fullName>
  <role>string</role> <!-- "Admin", "Technician", "Receptionist", "Salesperson" -->
</RegisterRequest>
```

**Respuesta Exitosa (200 OK)**:
```xml
<RegisterResponse>
  <id>guid</id>
  <username>string</username>
  <email>string</email>
  <fullName>string</fullName>
  <role>string</role>
  <createdAt>datetime</createdAt>
</RegisterResponse>
```

**Respuestas de Error**:
- 400 Bad Request: Datos de registro inválidos
- 409 Conflict: El nombre de usuario o email ya existe

### Inicio de Sesión

**Endpoint**: `POST /api/auth/login`

**Descripción**: Autentica un usuario y devuelve un token XML.

**Cuerpo de la Solicitud**:
```xml
<LoginRequest>
  <username>string</username>
  <password>string</password>
</LoginRequest>
```

**Respuesta Exitosa (200 OK)**:
```xml
<LoginResponse>
  <token>string</token>
  <expiration>datetime</expiration>
  <user>
    <id>guid</id>
    <username>string</username>
    <email>string</email>
    <fullName>string</fullName>
    <role>string</role>
  </user>
</LoginResponse>
```

**Respuestas de Error**:
- 400 Bad Request: Datos de inicio de sesión inválidos
- 401 Unauthorized: Credenciales incorrectas

### Renovar Token

**Endpoint**: `POST /api/auth/refresh-token`

**Descripción**: Renueva un token XML existente.

**Cuerpo de la Solicitud**:
```xml
<RefreshTokenRequest>
  <token>string</token>
</RefreshTokenRequest>
```

**Respuesta Exitosa (200 OK)**:
```xml
<RefreshTokenResponse>
  <token>string</token>
  <expiration>datetime</expiration>
</RefreshTokenResponse>
```

**Respuestas de Error**:
- 400 Bad Request: Token inválido
- 401 Unauthorized: Token expirado o inválido

## Modelos de Datos

### User

Representa un usuario del sistema.

```csharp
public class User
{
    public Guid Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public string FullName { get; set; }
    public string Role { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastLogin { get; set; }
}
```

### DTOs

#### RegisterUserDto

```csharp
public class RegisterUserDto
{
    public string Username { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string FullName { get; set; }
    public string Role { get; set; }
}
```

#### LoginDto

```csharp
public class LoginDto
{
    public string Username { get; set; }
    public string Password { get; set; }
}
```

#### UserDto

```csharp
public class UserDto
{
    public Guid Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string FullName { get; set; }
    public string Role { get; set; }
}
```

## Controladores

### AuthController

El `AuthController` maneja todas las operaciones relacionadas con la autenticación y autorización de usuarios.

```csharp
[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    // Constructor y dependencias

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterUserDto registerDto)
    {
        // Implementación del registro de usuario
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        // Implementación del inicio de sesión
    }

    [HttpPost("refresh-token")]
    public IActionResult RefreshToken([FromBody] RefreshTokenDto refreshTokenDto)
    {
        // Implementación de la renovación de token
    }
}
```

## Servicios

La lógica de autenticación y autorización se implementa directamente en el controlador, utilizando los siguientes servicios y componentes:

### JWT Helper

El sistema utiliza un helper para la generación y validación de tokens JWT:

```csharp
public class JwtHelper
{
    private readonly IConfiguration _configuration;

    public JwtHelper(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateToken(User user)
    {
        // Implementación de la generación de token
    }

    public bool ValidateToken(string token, out ClaimsPrincipal principal)
    {
        // Implementación de la validación de token
    }
}
```

## Configuración

La configuración del JWT se define en el archivo `appsettings.json`:

```json
"Jwt": {
  "Key": "YourSuperSecretKey12345678901234567890",
  "Issuer": "GestionTallerAPI",
  "Audience": "GestionTallerClient",
  "ExpiryInMinutes": 60
}
```

## Uso en Otros Módulos

Para proteger los endpoints en otros módulos, se utiliza el atributo `[Authorize]`:

```csharp
[Authorize]
[Route("api/[controller]")]
[ApiController]
public class ClientesController : ControllerBase
{
    // Implementación del controlador
}
```

Para restringir el acceso a roles específicos:

```csharp
[Authorize(Roles = "Admin,Receptionist")]
[HttpPost]
public async Task<IActionResult> Create([FromBody] ClienteDto clienteDto)
{
    // Implementación del método
}
```
