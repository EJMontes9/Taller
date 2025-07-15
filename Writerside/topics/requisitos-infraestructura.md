# 6.1. Requisitos de Infraestructura

Esta sección detalla los requisitos de hardware y software necesarios para desplegar y ejecutar el sistema de Gestión de Taller en diferentes entornos.

## Requisitos de Hardware

### Entorno de Desarrollo

Para desarrollo local, se recomienda:

- **CPU**: Procesador de 4 núcleos o superior
- **RAM**: Mínimo 8 GB, recomendado 16 GB
- **Almacenamiento**: 20 GB de espacio libre en disco
- **Red**: Conexión a Internet para descargar dependencias

### Entorno de Producción

Para un entorno de producción que soporte hasta 50 usuarios concurrentes:

- **CPU**: Procesador de 8 núcleos o superior
- **RAM**: Mínimo 16 GB, recomendado 32 GB
- **Almacenamiento**: 
  - 50 GB para el sistema
  - 100 GB adicionales para la base de datos y copias de seguridad
- **Red**: Conexión a Internet con ancho de banda mínimo de 10 Mbps

Para entornos con mayor carga, se recomienda escalar horizontalmente añadiendo más instancias del backend y configurando un balanceador de carga.

## Requisitos de Software

### Software Base

- **Sistema Operativo**: 
  - Windows Server 2019/2022
  - Ubuntu Server 20.04/22.04
  - CentOS 8 o superior
- **Docker**: Versión 20.10 o superior
- **Docker Compose**: Versión 2.0 o superior

### Software Adicional

- **Navegadores soportados** (para acceder a la aplicación):
  - Google Chrome (versión 90 o superior)
  - Mozilla Firefox (versión 88 o superior)
  - Microsoft Edge (versión 90 o superior)
  - Safari (versión 14 o superior)

## Requisitos de Red

- **Puertos**: Los siguientes puertos deben estar disponibles:
  - 80/443: Para acceso web (HTTP/HTTPS)
  - 5000: Para la API backend (puede ser interno)
  - 1433: Para SQL Server (debe ser interno, no expuesto a Internet)

- **Dominio**: Se recomienda configurar un nombre de dominio para acceder a la aplicación.

- **Certificados SSL**: Para entornos de producción, se requiere un certificado SSL válido para habilitar HTTPS.

## Requisitos de Almacenamiento

- **Base de Datos**: 
  - Tipo: SQL Server 2019 o superior
  - Configuración inicial: 10 GB con crecimiento automático
  - Respaldo: Espacio adicional para copias de seguridad (mínimo 3 veces el tamaño de la base de datos)

- **Archivos de Aplicación**:
  - Frontend: ~100 MB
  - Backend: ~200 MB
  - Logs: Espacio adicional para archivos de registro (mínimo 5 GB)

## Consideraciones de Escalabilidad

El sistema está diseñado para escalar horizontalmente. Para entornos de alta disponibilidad o con gran número de usuarios, considere:

- Implementar múltiples instancias del backend detrás de un balanceador de carga
- Configurar la base de datos en modo de alta disponibilidad (Always On, Mirroring, etc.)
- Utilizar un servicio de almacenamiento en red para archivos compartidos
- Implementar una red de distribución de contenido (CDN) para el frontend

## Requisitos de Seguridad

- Firewall configurado para permitir solo el tráfico necesario
- Sistema de detección/prevención de intrusiones (IDS/IPS)
- Políticas de contraseñas seguras
- Cifrado de datos en tránsito (HTTPS) y en reposo
- Copias de seguridad regulares y cifradas