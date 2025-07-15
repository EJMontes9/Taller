# 2.2.1. Requisitos del Sistema

Para ejecutar el backend del sistema de Gestión de Taller, ya sea en un entorno de desarrollo local o en producción, se requieren los siguientes componentes y herramientas.

## Requisitos de Software

### Para Desarrollo Local

- **Sistema Operativo**: Windows 10/11, macOS 12+, o Linux (Ubuntu 20.04+)
- **.NET SDK**: Versión 9.0 o superior
- **IDE**: Visual Studio 2022, Visual Studio Code con extensiones C#, o JetBrains Rider
- **SQL Server**: SQL Server 2019+ o SQL Server Express
- **Docker** (opcional): Docker Desktop para desarrollo con contenedores
- **Git**: Para control de versiones

### Para Producción

- **Docker**: Docker Engine 20.10+
- **Docker Compose**: Versión 2.0+
- **Sistema Operativo**: Cualquier SO compatible con Docker (Linux recomendado para producción)

## Requisitos de Hardware

### Mínimos (Desarrollo)

- **CPU**: 2 núcleos, 2.0 GHz o superior
- **RAM**: 4 GB (8 GB recomendado)
- **Almacenamiento**: 10 GB de espacio libre en disco
- **Red**: Conexión a Internet para restaurar paquetes NuGet

### Recomendados (Producción)

- **CPU**: 4 núcleos, 2.5 GHz o superior
- **RAM**: 8 GB o más
- **Almacenamiento**: 20 GB de espacio libre en SSD
- **Red**: Conexión estable con ancho de banda adecuado según el número de usuarios

## Puertos Requeridos

Los siguientes puertos deben estar disponibles:

- **5000**: Para el servicio API HTTP (configurable)
- **1433**: Para SQL Server
- **8080**: Puerto interno del contenedor para la API

## Dependencias Externas

- **SQL Server**: Base de datos relacional para almacenamiento de datos
- **NuGet**: Para gestión de paquetes y dependencias
- **Docker Hub**: Para obtener imágenes base de Docker

## Consideraciones Adicionales

### Seguridad

- Se recomienda utilizar un firewall para restringir el acceso a los puertos de la aplicación
- En producción, se debe configurar HTTPS con certificados válidos
- Las credenciales de base de datos deben ser seguras y no utilizar las predeterminadas

### Escalabilidad

- Para entornos con alta carga, considere:
  - Aumentar los recursos de hardware
  - Implementar balanceo de carga
  - Configurar réplicas de la base de datos

### Respaldo y Recuperación

- Implemente una estrategia de respaldo regular para la base de datos
- Configure volúmenes persistentes en Docker para datos importantes