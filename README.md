# Gestión Taller - Aplicación Dockerizada

Este proyecto consiste en una aplicación de gestión de taller con un frontend en Angular y un backend en .NET, todo configurado para ejecutarse en contenedores Docker.

## Estructura del Proyecto

- **GestionTaller-Front**: Aplicación frontend en Angular
- **WebApplication1/GestionTaller-Back**: API backend en .NET 9.0
- **Docker**: Configuración para contenedores Docker

## Requisitos Previos

- [Docker](https://www.docker.com/products/docker-desktop/) instalado en tu sistema
- [Docker Compose](https://docs.docker.com/compose/install/) instalado en tu sistema

## Cómo Ejecutar la Aplicación

1. Clona este repositorio en tu máquina local
2. Abre una terminal en la carpeta raíz del proyecto
3. Ejecuta el siguiente comando para construir y levantar todos los servicios:

```bash
docker-compose up -d
```

Este comando construirá y ejecutará:
- El frontend Angular (accesible en http://localhost:4200)
- El backend .NET (accesible en http://localhost:5000)
- Una base de datos SQL Server (accesible en localhost:1433)

## Servicios y Puertos

| Servicio | Descripción | Puerto |
|----------|-------------|--------|
| frontend | Aplicación Angular | 4200 |
| backend | API .NET | 5000 (HTTP), 5001 (HTTPS) |
| db | SQL Server | 1433 |

## Detener la Aplicación

Para detener todos los servicios, ejecuta:

```bash
docker-compose down
```

Para detener y eliminar los volúmenes (esto eliminará los datos de la base de datos), ejecuta:

```bash
docker-compose down -v
```

## Desarrollo

### Frontend

El código fuente del frontend se encuentra en la carpeta `GestionTaller-Front`. Si realizas cambios en el código, necesitarás reconstruir la imagen Docker:

```bash
docker-compose build frontend
docker-compose up -d frontend
```

### Backend

El código fuente del backend se encuentra en la carpeta `WebApplication1/GestionTaller-Back`. Si realizas cambios en el código, necesitarás reconstruir la imagen Docker:

```bash
docker-compose build backend
docker-compose up -d backend
```

## Base de Datos

La aplicación utiliza SQL Server como base de datos. Los datos se persisten en un volumen Docker, por lo que no se perderán al detener los contenedores.

Credenciales por defecto:
- **Usuario**: sa
- **Contraseña**: YourStrong!Passw0rd
- **Base de datos**: GestionTallerDB

## API Endpoints

La API backend proporciona los siguientes endpoints:

- `GET /api/clientes`: Obtener todos los clientes
- `GET /api/clientes/{id}`: Obtener un cliente por ID
- `POST /api/clientes`: Crear un nuevo cliente
- `PUT /api/clientes/{id}`: Actualizar un cliente existente
- `DELETE /api/clientes/{id}`: Eliminar un cliente

## Solución de Problemas

### Error en Nginx: "unknown directive "﻿server""

Si encuentras un error como este:
```
unknown directive "﻿server" in /etc/nginx/conf.d/default.conf:1
```

Este error se debe a caracteres invisibles (BOM - Byte Order Mark) al principio del archivo de configuración de Nginx. Hay dos formas de solucionar este problema:

#### Solución 1: Editar el archivo nginx.conf

1. Abre el archivo nginx.conf en un editor que soporte cambiar la codificación (como Notepad++, VS Code, etc.)
2. Guárdalo como UTF-8 sin BOM
3. Reconstruye el contenedor frontend:
```bash
docker-compose build frontend
docker-compose up -d frontend
```

#### Solución 2: Modificar el Dockerfile (Recomendada)

Una solución más robusta es modificar el Dockerfile para generar el archivo de configuración directamente en el contenedor, evitando así cualquier problema de codificación:

1. Modifica el Dockerfile del frontend para usar printf en lugar de copiar el archivo:
```dockerfile
# Production stage
FROM nginx:alpine
COPY --from=build /app/dist/dome28062025/browser /usr/share/nginx/html
# Create a clean nginx.conf file without BOM
RUN printf 'server {\n\
    listen 80;\n\
    server_name localhost;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
\n\
    # Cache static assets\n\
    location ~* \\.(jpg|jpeg|png|gif|ico|css|js)$ {\n\
        expires 1y;\n\
        add_header Cache-Control "public, max-age=31536000";\n\
    }\n\
\n\
    # Don'\''t cache HTML files\n\
    location ~* \\.html$ {\n\
        expires -1;\n\
        add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate";\n\
    }\n\
}' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. Reconstruye el contenedor frontend:
```bash
docker-compose build frontend
docker-compose up -d frontend
```

Esta solución es más confiable ya que evita completamente los problemas de codificación al generar el archivo de configuración directamente en el contenedor.
