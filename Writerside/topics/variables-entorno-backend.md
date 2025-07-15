# 2.2.3. Variables de Entorno

Las variables de entorno son fundamentales para la configuración del backend del sistema de Gestión de Taller, ya que permiten modificar el comportamiento de la aplicación sin cambiar el código fuente. Esta sección detalla las variables de entorno utilizadas por el backend y cómo configurarlas.

## Variables de Entorno Principales

### Variables de Entorno en Docker Compose

El archivo `docker-compose.yml` define las siguientes variables de entorno para el servicio backend:

```yaml
environment:
  - ASPNETCORE_ENVIRONMENT=Development
  - ConnectionStrings__DefaultConnection=Server=db;Database=GestionTallerDB;User=sa;Password=YourStrong!Passw0rd;TrustServerCertificate=True;
```

### Descripción de Variables

| Variable | Descripción | Valor por Defecto | Obligatoria |
|----------|-------------|-------------------|-------------|
| `ASPNETCORE_ENVIRONMENT` | Define el entorno de ejecución | `Development` | Sí |
| `ConnectionStrings__DefaultConnection` | Cadena de conexión a la base de datos | Ver ejemplo | Sí |

## Variables de Configuración Adicionales

Además de las variables definidas en Docker Compose, la aplicación puede utilizar otras variables de entorno para configurar diferentes aspectos:

### Configuración de Logging

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `Logging__LogLevel__Default` | Nivel de log por defecto | `Information` |
| `Logging__LogLevel__Microsoft.AspNetCore` | Nivel de log para Microsoft.AspNetCore | `Warning` |

### Configuración de JWT

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `Jwt__Key` | Clave secreta para firmar tokens JWT | `YourSuperSecretKey12345678901234567890` |
| `Jwt__Issuer` | Emisor de los tokens | `GestionTallerAPI` |
| `Jwt__Audience` | Audiencia de los tokens | `GestionTallerClient` |
| `Jwt__ExpiryInMinutes` | Tiempo de expiración en minutos | `60` |

### Configuración de CORS

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `AllowedOrigins` | Orígenes permitidos para CORS | `*` |

## Cómo Configurar Variables de Entorno

### En Desarrollo Local

Para desarrollo local sin Docker, puede configurar las variables de entorno de varias maneras:

1. **Archivo appsettings.Development.json**:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=localhost;Database=GestionTallerDB;User=sa;Password=YourStrong!Passw0rd;TrustServerCertificate=True;"
     }
   }
   ```

2. **Variables de entorno del sistema operativo**:
   - Windows (PowerShell):
     ```powershell
     $env:ConnectionStrings__DefaultConnection="Server=localhost;Database=GestionTallerDB;User=sa;Password=YourStrong!Passw0rd;TrustServerCertificate=True;"
     ```
   - Linux/macOS:
     ```bash
     export ConnectionStrings__DefaultConnection="Server=localhost;Database=GestionTallerDB;User=sa;Password=YourStrong!Passw0rd;TrustServerCertificate=True;"
     ```

3. **Archivo .env** (requiere paquete NuGet adicional):
   ```
   ConnectionStrings__DefaultConnection=Server=localhost;Database=GestionTallerDB;User=sa;Password=YourStrong!Passw0rd;TrustServerCertificate=True;
   ```

### En Docker

Para modificar las variables de entorno en Docker:

1. **Modificar docker-compose.yml**:
   ```yaml
   environment:
     - ASPNETCORE_ENVIRONMENT=Production
     - ConnectionStrings__DefaultConnection=Server=db;Database=GestionTallerDB;User=sa;Password=NewSecurePassword;TrustServerCertificate=True;
   ```

2. **Archivo .env junto a docker-compose.yml**:
   ```
   ASPNETCORE_ENVIRONMENT=Production
   DB_PASSWORD=NewSecurePassword
   ```
   
   Y en docker-compose.yml:
   ```yaml
   environment:
     - ASPNETCORE_ENVIRONMENT=${ASPNETCORE_ENVIRONMENT}
     - ConnectionStrings__DefaultConnection=Server=db;Database=GestionTallerDB;User=sa;Password=${DB_PASSWORD};TrustServerCertificate=True;
   ```

## Consideraciones de Seguridad

- **No almacene secretos en el código fuente**: Utilice variables de entorno o servicios de gestión de secretos
- **Utilice diferentes valores para desarrollo y producción**: Especialmente para claves secretas y contraseñas
- **Limite el acceso a las variables de entorno**: Solo los administradores deben poder modificarlas
- **Considere el uso de servicios de gestión de secretos**: Como Azure Key Vault o AWS Secrets Manager para entornos de producción

## Solución de Problemas

Si la aplicación no se comporta como se espera, verifique:

1. Que las variables de entorno estén correctamente definidas
2. Que los nombres de las variables coincidan exactamente (incluyendo mayúsculas y minúsculas)
3. Que los valores sean válidos (especialmente las cadenas de conexión)
4. Que no haya conflictos entre diferentes métodos de configuración