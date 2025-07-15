# 6.3. Configuración de Docker

Esta sección proporciona información detallada sobre la configuración de Docker utilizada en el sistema de Gestión de Taller, incluyendo la estructura de los contenedores, la configuración de Docker Compose y las mejores prácticas para la gestión de contenedores.

## Arquitectura de Contenedores

El sistema de Gestión de Taller utiliza una arquitectura basada en microservicios implementada con Docker, que consta de tres contenedores principales:

1. **Frontend (Angular/Nginx)**: Sirve la interfaz de usuario de la aplicación.
2. **Backend (ASP.NET Core)**: Proporciona la API RESTful que maneja la lógica de negocio.
3. **Base de Datos (SQL Server)**: Almacena todos los datos de la aplicación.

![Arquitectura de Contenedores](../images/docker-architecture.png)

## Archivo docker-compose.yml

El archivo `docker-compose.yml` define la configuración de los servicios, redes y volúmenes utilizados por la aplicación:

```yaml
version: '3.8'

services:
  # Backend API service
  backend:
    build:
      context: ./WebApplication1
      dockerfile: GestionTaller-Back/Dockerfile
    ports:
      - "5000:8080"
    depends_on:
      - db
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - ConnectionStrings__DefaultConnection=Server=db;Database=GestionTallerDB;User=sa;Password=YourStrong!Passw0rd;TrustServerCertificate=True;
    networks:
      - gestion-taller-network

  # Frontend Angular service
  frontend:
    build:
      context: ./GestionTaller-Front
      dockerfile: Dockerfile
    ports:
      - "4200:80"
    depends_on:
      - backend
    networks:
      - gestion-taller-network

  # Database service
  db:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=YourStrong!Passw0rd
      - MSSQL_PID=Express
    ports:
      - "1433:1433"
    volumes:
      - sqlserver-data:/var/opt/mssql
    networks:
      - gestion-taller-network

networks:
  gestion-taller-network:
    driver: bridge

volumes:
  sqlserver-data:
```

### Explicación de los Componentes

#### Servicio Backend

- **Imagen**: Construida a partir del Dockerfile en `./WebApplication1/GestionTaller-Back/Dockerfile`
- **Puertos**: Mapea el puerto 8080 del contenedor al puerto 5000 del host
- **Dependencias**: Requiere que el servicio `db` esté en ejecución
- **Variables de Entorno**: 
  - `ASPNETCORE_ENVIRONMENT`: Define el entorno de ejecución
  - `ConnectionStrings__DefaultConnection`: Cadena de conexión a la base de datos

#### Servicio Frontend

- **Imagen**: Construida a partir del Dockerfile en `./GestionTaller-Front/Dockerfile`
- **Puertos**: Mapea el puerto 80 del contenedor al puerto 4200 del host
- **Dependencias**: Requiere que el servicio `backend` esté en ejecución

#### Servicio de Base de Datos

- **Imagen**: Utiliza la imagen oficial de SQL Server 2022
- **Variables de Entorno**:
  - `ACCEPT_EULA`: Acepta el acuerdo de licencia
  - `SA_PASSWORD`: Contraseña para el usuario SA
  - `MSSQL_PID`: Edición de SQL Server (Express)
- **Puertos**: Mapea el puerto 1433 del contenedor al puerto 1433 del host
- **Volúmenes**: Utiliza un volumen para persistir los datos de SQL Server

#### Redes

- **gestion-taller-network**: Red bridge que permite la comunicación entre los contenedores

#### Volúmenes

- **sqlserver-data**: Volumen para persistir los datos de SQL Server

## Dockerfiles

### Dockerfile del Backend

El Dockerfile del backend utiliza un enfoque de compilación multi-etapa para optimizar el tamaño de la imagen final:

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["GestionTaller-Back/GestionTaller-Back.csproj", "GestionTaller-Back/"]
RUN dotnet restore "GestionTaller-Back/GestionTaller-Back.csproj"
COPY . .
WORKDIR "/src/GestionTaller-Back"
RUN dotnet build "GestionTaller-Back.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "GestionTaller-Back.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "GestionTaller-Back.dll"]
```

### Dockerfile del Frontend

El Dockerfile del frontend también utiliza un enfoque multi-etapa:

```dockerfile
# Build stage
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist/gestion-taller-front /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Configuración para Entornos de Producción

Para entornos de producción, se recomienda utilizar un archivo `docker-compose.prod.yml` con las siguientes modificaciones:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./WebApplication1
      dockerfile: GestionTaller-Back/Dockerfile
    ports:
      - "${BACKEND_PORT}:8080"
    depends_on:
      - db
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ConnectionStrings__DefaultConnection=Server=db;Database=${DB_NAME};User=${DB_USER};Password=${DB_PASSWORD};TrustServerCertificate=True;
      - Jwt__Key=${JWT_KEY}
      - Jwt__Issuer=${JWT_ISSUER}
      - Jwt__Audience=${JWT_AUDIENCE}
      - Jwt__ExpiryInMinutes=${JWT_EXPIRY_MINUTES}
    networks:
      - gestion-taller-network
    restart: always

  frontend:
    build:
      context: ./GestionTaller-Front
      dockerfile: Dockerfile
    ports:
      - "${FRONTEND_PORT}:80"
    depends_on:
      - backend
    networks:
      - gestion-taller-network
    restart: always

  db:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=${DB_PASSWORD}
      - MSSQL_PID=Express
    ports:
      - "${DB_PORT}:1433"
    volumes:
      - sqlserver-data:/var/opt/mssql
    networks:
      - gestion-taller-network
    restart: always

networks:
  gestion-taller-network:
    driver: bridge

volumes:
  sqlserver-data:
```

## Gestión de Contenedores

### Comandos Útiles

#### Iniciar los Servicios

```bash
docker-compose up -d
```

#### Detener los Servicios

```bash
docker-compose down
```

#### Ver Logs de los Contenedores

```bash
# Ver logs de todos los contenedores
docker-compose logs

# Ver logs de un contenedor específico
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db
```

#### Reiniciar un Servicio

```bash
docker-compose restart backend
```

#### Reconstruir un Servicio

```bash
docker-compose build backend
docker-compose up -d backend
```

### Monitoreo de Contenedores

Para monitorear el estado y rendimiento de los contenedores, puede utilizar:

```bash
# Ver contenedores en ejecución
docker ps

# Ver estadísticas de uso de recursos
docker stats
```

## Respaldos y Recuperación

### Respaldo de la Base de Datos

Para crear un respaldo de la base de datos:

```bash
# Ejecutar SQL Server Management Studio dentro del contenedor
docker exec -it gestion-taller_db_1 /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourStrong!Passw0rd -Q "BACKUP DATABASE GestionTallerDB TO DISK = '/var/opt/mssql/backup/GestionTallerDB.bak' WITH FORMAT"
```

### Copia de Seguridad del Volumen

Para crear una copia de seguridad del volumen de datos:

```bash
# Crear un contenedor temporal para acceder al volumen
docker run --rm -v gestion-taller_sqlserver-data:/source -v $(pwd):/backup alpine tar -czvf /backup/sqlserver-data-backup.tar.gz -C /source .
```

## Mejores Prácticas

1. **Seguridad**:
   - No utilice contraseñas predeterminadas en entornos de producción
   - Limite el acceso a los puertos de los contenedores
   - Utilice secretos de Docker para gestionar información sensible

2. **Rendimiento**:
   - Monitoree el uso de recursos de los contenedores
   - Ajuste los límites de memoria y CPU según sea necesario
   - Utilice volúmenes montados para mejorar el rendimiento de I/O

3. **Mantenimiento**:
   - Actualice regularmente las imágenes base
   - Implemente un sistema de respaldo automatizado
   - Utilice etiquetas de versión específicas en lugar de `latest`