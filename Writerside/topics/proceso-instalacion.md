# 6.2. Proceso de Instalación

Esta sección proporciona instrucciones detalladas para instalar y configurar el sistema de Gestión de Taller en diferentes entornos.

## Requisitos Previos

Antes de comenzar la instalación, asegúrese de que su sistema cumple con los [requisitos de infraestructura](requisitos-infraestructura.md) y que tiene instalado:

- Docker (versión 20.10 o superior)
- Docker Compose (versión 2.0 o superior)
- Git (para clonar el repositorio)

## Instalación en Entorno de Desarrollo

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/su-organizacion/gestion-taller.git
cd gestion-taller
```

### Paso 2: Configurar Variables de Entorno

Cree un archivo `.env` en la raíz del proyecto con las siguientes variables:

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

> **Nota**: Para entornos de desarrollo, puede utilizar los valores predeterminados. Para entornos de producción, asegúrese de utilizar valores seguros y únicos.

### Paso 3: Construir y Levantar los Contenedores

```bash
docker-compose up -d
```

Este comando construirá las imágenes Docker para el frontend, backend y base de datos, y levantará los contenedores.

### Paso 4: Verificar la Instalación

Una vez que los contenedores estén en ejecución, puede acceder a:

- Frontend: http://localhost:4200
- Backend API: http://localhost:5000
- Swagger (documentación de la API): http://localhost:5000/swagger

## Instalación en Entorno de Producción

### Paso 1: Preparar el Servidor

1. Instale Docker y Docker Compose en el servidor:

```bash
# Para Ubuntu/Debian
sudo apt update
sudo apt install docker.io docker-compose

# Para CentOS/RHEL
sudo yum install docker docker-compose
```

2. Inicie y habilite el servicio Docker:

```bash
sudo systemctl start docker
sudo systemctl enable docker
```

### Paso 2: Clonar el Repositorio

```bash
git clone https://github.com/su-organizacion/gestion-taller.git
cd gestion-taller
```

### Paso 3: Configurar para Producción

1. Cree un archivo `.env.prod` con configuraciones seguras para producción:

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

2. Modifique el archivo `docker-compose.prod.yml` para utilizar las variables de entorno:

```bash
cp docker-compose.yml docker-compose.prod.yml
```

Edite `docker-compose.prod.yml` para:
- Cambiar los puertos según sea necesario
- Configurar volúmenes persistentes para datos
- Habilitar reinicio automático de contenedores

### Paso 4: Construir y Desplegar

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Paso 5: Configurar Proxy Inverso (Opcional)

Para entornos de producción, se recomienda utilizar un proxy inverso como Nginx para gestionar el tráfico HTTPS:

1. Instale Nginx:

```bash
sudo apt install nginx
```

2. Configure un sitio para el sistema:

```bash
sudo nano /etc/nginx/sites-available/gestion-taller
```

Añada la siguiente configuración:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:4200;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /api/ {
        proxy_pass http://localhost:5000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

3. Habilite el sitio y reinicie Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/gestion-taller /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

4. Configure HTTPS con Let's Encrypt:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Verificación Post-Instalación

Después de completar la instalación, realice las siguientes verificaciones:

1. **Acceso al Frontend**: Navegue a la URL del frontend y verifique que la página de inicio se carga correctamente.
2. **Acceso a la API**: Pruebe la API accediendo a la documentación Swagger.
3. **Conexión a la Base de Datos**: Verifique que la aplicación puede conectarse a la base de datos.
4. **Autenticación**: Pruebe el proceso de inicio de sesión.
5. **Funcionalidades Clave**: Verifique que las funcionalidades principales del sistema funcionan correctamente.

## Solución de Problemas Comunes

### Error de Conexión a la Base de Datos

Si la aplicación no puede conectarse a la base de datos:

1. Verifique que el contenedor de la base de datos está en ejecución:
```bash
docker ps | grep db
```

2. Verifique los logs del contenedor:
```bash
docker logs gestion-taller_db_1
```

3. Asegúrese de que las credenciales en las variables de entorno son correctas.

### Error en el Frontend

Si el frontend no carga correctamente:

1. Verifique los logs del contenedor:
```bash
docker logs gestion-taller_frontend_1
```

2. Asegúrese de que el backend está accesible desde el frontend.

### Error en el Backend

Si el backend no responde:

1. Verifique los logs del contenedor:
```bash
docker logs gestion-taller_backend_1
```

2. Asegúrese de que la conexión a la base de datos está configurada correctamente.