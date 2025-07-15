# 6.4. Variables de Entorno

Esta sección documenta las variables de entorno utilizadas por el sistema de Gestión de Taller. Las variables de entorno son una parte fundamental de la configuración del sistema, ya que permiten personalizar el comportamiento de la aplicación sin modificar el código fuente.

## Importancia de las Variables de Entorno

El uso de variables de entorno ofrece varias ventajas:

- **Seguridad**: Permite mantener información sensible (como contraseñas y claves) fuera del código fuente.
- **Flexibilidad**: Facilita la configuración de la aplicación para diferentes entornos (desarrollo, pruebas, producción).
- **Portabilidad**: Simplifica el despliegue en diferentes plataformas y servicios en la nube.
- **Mantenibilidad**: Centraliza la configuración y facilita su gestión.

## Variables de Entorno del Backend

### Variables de Configuración General

| Variable | Descripción | Valor por Defecto | Obligatoria |
|----------|-------------|-------------------|-------------|
| `ASPNETCORE_ENVIRONMENT` | Define el entorno de ejecución | `Development` | Sí |
| `ASPNETCORE_URLS` | URLs en las que escucha la aplicación | `http://*:8080` | No |

### Variables de Conexión a Base de Datos

| Variable | Descripción | Valor por Defecto | Obligatoria |
|----------|-------------|-------------------|-------------|
| `ConnectionStrings__DefaultConnection` | Cadena de conexión a la base de datos | `Server=db;Database=GestionTallerDB;User=sa;Password=YourStrong!Passw0rd;TrustServerCertificate=True;` | Sí |

### Variables de Autenticación JWT

| Variable | Descripción | Valor por Defecto | Obligatoria |
|----------|-------------|-------------------|-------------|
| `Jwt__Key` | Clave secreta para firmar tokens JWT | `YourSuperSecretKey12345678901234567890` | Sí |
| `Jwt__Issuer` | Emisor de los tokens JWT | `GestionTallerAPI` | Sí |
| `Jwt__Audience` | Audiencia de los tokens JWT | `GestionTallerClient` | Sí |
| `Jwt__ExpiryInMinutes` | Tiempo de expiración de los tokens en minutos | `60` | No |

### Variables de Logging

| Variable | Descripción | Valor por Defecto | Obligatoria |
|----------|-------------|-------------------|-------------|
| `Logging__LogLevel__Default` | Nivel de log por defecto | `Information` | No |
| `Logging__LogLevel__Microsoft.AspNetCore` | Nivel de log para Microsoft.AspNetCore | `Warning` | No |

## Variables de Entorno de la Base de Datos

| Variable | Descripción | Valor por Defecto | Obligatoria |
|----------|-------------|-------------------|-------------|
| `ACCEPT_EULA` | Aceptación del acuerdo de licencia de SQL Server | `Y` | Sí |
| `SA_PASSWORD` | Contraseña del usuario SA de SQL Server | `YourStrong!Passw0rd` | Sí |
| `MSSQL_PID` | Edición de SQL Server | `Express` | No |

## Variables de Entorno para Docker Compose

Estas variables se utilizan en el archivo `docker-compose.yml` para configurar los servicios:

| Variable | Descripción | Valor por Defecto | Obligatoria |
|----------|-------------|-------------------|-------------|
| `FRONTEND_PORT` | Puerto para acceder al frontend | `4200` | No |
| `BACKEND_PORT` | Puerto para acceder al backend | `5000` | No |
| `DB_PORT` | Puerto para acceder a la base de datos | `1433` | No |
| `DB_PASSWORD` | Contraseña de la base de datos | `YourStrong!Passw0rd` | Sí |
| `DB_USER` | Usuario de la base de datos | `sa` | Sí |
| `DB_NAME` | Nombre de la base de datos | `GestionTallerDB` | Sí |

## Configuración de Variables de Entorno

### En Entorno de Desarrollo

En un entorno de desarrollo, las variables de entorno se pueden configurar de varias maneras:

#### Usando un Archivo .env

Cree un archivo `.env` en la raíz del proyecto:

```
# Configuración de la Base de Datos
DB_PASSWORD=YourStrongPassword
DB_USER=sa
DB_NAME=GestionTallerDB

# Configuración de JWT
JWT_KEY=YourSecureJWTKey
JWT_ISSUER=GestionTallerAPI
JWT_AUDIENCE=GestionTallerClient
JWT_EXPIRY_MINUTES=60

# Configuración de Puertos
FRONTEND_PORT=4200
BACKEND_PORT=5000
DB_PORT=1433
```

#### Usando Variables de Entorno del Sistema

En Windows:

```powershell
$env:ASPNETCORE_ENVIRONMENT = "Development"
$env:ConnectionStrings__DefaultConnection = "Server=localhost;Database=GestionTallerDB;User=sa;Password=YourStrong!Passw0rd;TrustServerCertificate=True;"
```

En Linux/macOS:

```bash
export ASPNETCORE_ENVIRONMENT="Development"
export ConnectionStrings__DefaultConnection="Server=localhost;Database=GestionTallerDB;User=sa;Password=YourStrong!Passw0rd;TrustServerCertificate=True;"
```

### En Entorno de Producción

En un entorno de producción, las variables de entorno deben configurarse de manera segura:

#### Usando un Archivo .env.prod

Cree un archivo `.env.prod` con valores seguros y específicos para producción:

```
# Configuración de la Base de Datos
DB_PASSWORD=GenerateAStrongPasswordHere
DB_USER=sa
DB_NAME=GestionTallerDB

# Configuración de JWT
JWT_KEY=GenerateASecureRandomKeyHere
JWT_ISSUER=YourDomain.com
JWT_AUDIENCE=YourDomain.com
JWT_EXPIRY_MINUTES=30

# Configuración de Puertos
FRONTEND_PORT=80
BACKEND_PORT=5000
DB_PORT=1433
```

Luego, al desplegar con Docker Compose:

```bash
docker-compose --env-file .env.prod -f docker-compose.prod.yml up -d
```

#### Usando Secretos de Docker

Para información sensible, considere usar Docker Secrets:

```bash
echo "MySecurePassword" | docker secret create db_password -
```

Y luego referencie el secreto en su archivo `docker-compose.yml`:

```yaml
services:
  db:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      - ACCEPT_EULA=Y
      - MSSQL_PID=Express
    secrets:
      - db_password
    environment:
      - SA_PASSWORD_FILE=/run/secrets/db_password
    # ...

secrets:
  db_password:
    external: true
```

## Mejores Prácticas

1. **Nunca incluya valores sensibles en el código fuente o en sistemas de control de versiones.**
2. **Utilice valores diferentes para cada entorno (desarrollo, pruebas, producción).**
3. **Genere claves seguras para JWT y contraseñas de base de datos.**
4. **Limite el acceso a los archivos de configuración que contienen variables de entorno.**
5. **Considere el uso de un servicio de gestión de secretos para entornos de producción.**
6. **Documente todas las variables de entorno utilizadas por la aplicación.**
7. **Proporcione valores por defecto razonables para variables no críticas.**
8. **Valide la presencia de variables de entorno requeridas al inicio de la aplicación.**

## Solución de Problemas

### Variable de Entorno No Reconocida

Si la aplicación no reconoce una variable de entorno:

1. Verifique que el nombre de la variable sea exactamente el mismo que espera la aplicación.
2. Asegúrese de que la variable esté correctamente definida en el entorno o archivo de configuración.
3. Reinicie la aplicación después de cambiar las variables de entorno.

### Problemas de Formato

Para variables que contienen caracteres especiales:

1. Encierre el valor entre comillas.
2. Escape los caracteres especiales según sea necesario.
3. Verifique que no haya espacios adicionales al principio o al final del valor.