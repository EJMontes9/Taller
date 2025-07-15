# 2.2.2. Configuración de Docker

El backend del sistema de Gestión de Taller está configurado para ejecutarse en contenedores Docker, lo que facilita su despliegue y garantiza la consistencia entre diferentes entornos. Esta sección detalla la configuración de Docker para el backend.

## Dockerfile

El backend utiliza un Dockerfile multi-etapa para optimizar el tamaño de la imagen final y mejorar el rendimiento. A continuación, se explica cada sección del Dockerfile:

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

### Etapas del Dockerfile

1. **Etapa base**:
   - Utiliza la imagen oficial de ASP.NET Core 9.0 runtime
   - Establece el directorio de trabajo en `/app`
   - Expone el puerto 8080 para comunicaciones HTTP

2. **Etapa de compilación**:
   - Utiliza la imagen completa del SDK de .NET 9.0
   - Copia y restaura el archivo de proyecto para optimizar la caché de capas
   - Copia todo el código fuente y compila la aplicación en modo Release

3. **Etapa de publicación**:
   - Publica la aplicación en modo Release
   - Configura la aplicación para no usar un host nativo

4. **Etapa final**:
   - Vuelve a la imagen base (runtime)
   - Copia solo los archivos publicados desde la etapa de publicación
   - Configura el punto de entrada para ejecutar la aplicación

## Docker Compose

El archivo `docker-compose.yml` en la raíz del proyecto configura todos los servicios necesarios para la aplicación, incluyendo el backend:

```yaml
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
```

### Configuración del Servicio Backend

- **build**: Especifica el contexto de construcción (directorio WebApplication1) y la ubicación del Dockerfile
- **ports**: Mapea el puerto 5000 del host al puerto 8080 del contenedor
- **depends_on**: Indica que el servicio depende de la base de datos (db)
- **environment**: Define variables de entorno para la aplicación
- **networks**: Conecta el servicio a la red `gestion-taller-network`

## Redes y Volúmenes

El archivo `docker-compose.yml` también define redes y volúmenes:

```yaml
networks:
  gestion-taller-network:
    driver: bridge

volumes:
  sqlserver-data:
```

- **gestion-taller-network**: Red que permite la comunicación entre los servicios
- **sqlserver-data**: Volumen para persistir los datos de SQL Server

## Comandos Docker Útiles

### Construir y Ejecutar los Servicios

```bash
docker-compose up -d
```

### Reconstruir el Servicio Backend

```bash
docker-compose build backend
docker-compose up -d backend
```

### Ver Logs del Backend

```bash
docker-compose logs -f backend
```

### Detener los Servicios

```bash
docker-compose down
```

### Eliminar Volúmenes (Cuidado: Elimina Datos)

```bash
docker-compose down -v
```

## Consideraciones para Producción

Para entornos de producción, se recomienda:

1. **Modificar las credenciales**: Cambiar las contraseñas predeterminadas
2. **Configurar HTTPS**: Utilizar certificados SSL/TLS
3. **Limitar puertos expuestos**: Exponer solo los puertos necesarios
4. **Implementar monitoreo**: Configurar herramientas como Prometheus y Grafana
5. **Configurar respaldos**: Implementar estrategias de respaldo para los volúmenes