# 6.5. Guía de Mantenimiento

Esta sección proporciona instrucciones detalladas para el mantenimiento rutinario, monitoreo, copias de seguridad y actualización del sistema de Gestión de Taller.

## Mantenimiento Rutinario

### Verificación de Estado del Sistema

Se recomienda realizar las siguientes verificaciones diariamente:

1. **Verificar el estado de los contenedores**:
   ```bash
   docker ps
   ```
   Todos los contenedores (frontend, backend, db) deben estar en estado "Up".

2. **Verificar el uso de recursos**:
   ```bash
   docker stats
   ```
   Monitoree el uso de CPU, memoria y red para detectar posibles problemas de rendimiento.

3. **Verificar los logs del sistema**:
   ```bash
   docker-compose logs --tail=100
   ```
   Revise los logs en busca de errores o advertencias que puedan indicar problemas.

### Limpieza de Recursos

Periódicamente (mensualmente), realice las siguientes tareas de limpieza:

1. **Eliminar imágenes no utilizadas**:
   ```bash
   docker image prune -a --filter "until=720h"
   ```
   Esto eliminará imágenes no utilizadas que tengan más de 30 días.

2. **Eliminar volúmenes no utilizados**:
   ```bash
   docker volume prune
   ```
   Asegúrese de que no haya volúmenes importantes sin usar antes de ejecutar este comando.

3. **Limpieza de logs**:
   ```bash
   docker-compose exec backend sh -c "find /app/logs -type f -name '*.log' -mtime +30 -delete"
   ```
   Esto eliminará archivos de log con más de 30 días de antigüedad.

## Copias de Seguridad

### Respaldo de la Base de Datos

Se recomienda realizar copias de seguridad de la base de datos diariamente:

1. **Respaldo manual**:
   ```bash
   docker exec -it gestion-taller_db_1 /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourStrong!Passw0rd -Q "BACKUP DATABASE GestionTallerDB TO DISK = '/var/opt/mssql/backup/GestionTallerDB_$(date +%Y%m%d).bak' WITH FORMAT"
   ```

2. **Respaldo automatizado**:
   
   Cree un script de shell para automatizar el proceso:

   ```bash
   #!/bin/bash
   # backup_db.sh
   
   BACKUP_DIR="/path/to/backups"
   DATE=$(date +%Y%m%d_%H%M%S)
   CONTAINER="gestion-taller_db_1"
   
   # Crear respaldo dentro del contenedor
   docker exec $CONTAINER /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourStrong!Passw0rd -Q "BACKUP DATABASE GestionTallerDB TO DISK = '/var/opt/mssql/backup/GestionTallerDB_$DATE.bak' WITH FORMAT"
   
   # Copiar el archivo de respaldo desde el contenedor
   docker cp $CONTAINER:/var/opt/mssql/backup/GestionTallerDB_$DATE.bak $BACKUP_DIR/
   
   # Eliminar respaldos antiguos (más de 7 días)
   find $BACKUP_DIR -name "GestionTallerDB_*.bak" -type f -mtime +7 -delete
   ```

   Configure este script para que se ejecute diariamente mediante cron:

   ```bash
   # Añadir al crontab (ejecutar a las 2 AM todos los días)
   0 2 * * * /path/to/backup_db.sh >> /path/to/backup.log 2>&1
   ```

### Respaldo de Volúmenes

Realice copias de seguridad de los volúmenes de Docker semanalmente:

```bash
#!/bin/bash
# backup_volumes.sh

BACKUP_DIR="/path/to/volume_backups"
DATE=$(date +%Y%m%d)

# Crear directorio de respaldo si no existe
mkdir -p $BACKUP_DIR

# Respaldar volumen de la base de datos
docker run --rm -v gestion-taller_sqlserver-data:/source -v $BACKUP_DIR:/backup alpine tar -czf /backup/sqlserver-data-$DATE.tar.gz -C /source .

# Eliminar respaldos antiguos (más de 30 días)
find $BACKUP_DIR -name "sqlserver-data-*.tar.gz" -type f -mtime +30 -delete
```

## Monitoreo del Sistema

### Configuración de Alertas

Configure alertas para ser notificado sobre problemas potenciales:

1. **Monitoreo de disponibilidad**:
   
   Utilice herramientas como Uptime Robot, Pingdom o un script personalizado para verificar periódicamente que la aplicación esté respondiendo.

2. **Monitoreo de recursos**:
   
   Configure alertas para uso excesivo de CPU, memoria o disco. Puede utilizar herramientas como Prometheus con Grafana, o soluciones más simples como cAdvisor.

3. **Monitoreo de logs**:
   
   Configure un sistema de agregación de logs como ELK Stack (Elasticsearch, Logstash, Kibana) o Graylog para centralizar y analizar los logs del sistema.

### Panel de Control de Monitoreo

Para un monitoreo más completo, considere implementar un panel de control utilizando las siguientes herramientas:

1. **Prometheus + Grafana**:
   - Prometheus para recopilar métricas
   - Grafana para visualizar las métricas en dashboards personalizables

2. **cAdvisor + Prometheus + Grafana**:
   - cAdvisor para recopilar métricas de contenedores
   - Prometheus para almacenar las métricas
   - Grafana para visualización

## Actualizaciones del Sistema

### Actualización de Componentes

Para actualizar los componentes del sistema:

1. **Respalde el sistema antes de actualizar**:
   ```bash
   # Respaldar la base de datos
   ./backup_db.sh
   
   # Respaldar los volúmenes
   ./backup_volumes.sh
   ```

2. **Actualizar el código fuente**:
   ```bash
   # Obtener los últimos cambios del repositorio
   git pull origin main
   ```

3. **Reconstruir y reiniciar los contenedores**:
   ```bash
   # Reconstruir las imágenes con los cambios
   docker-compose build
   
   # Reiniciar los servicios
   docker-compose down
   docker-compose up -d
   ```

### Actualización de Imágenes Base

Periódicamente, actualice las imágenes base utilizadas en los Dockerfiles:

1. **Actualizar las versiones en los Dockerfiles**:
   - Actualice las versiones de las imágenes base en los Dockerfiles (por ejemplo, de `node:18` a `node:20`)
   - Asegúrese de probar exhaustivamente después de actualizar versiones mayores

2. **Reconstruir las imágenes**:
   ```bash
   docker-compose build --no-cache
   docker-compose up -d
   ```

## Solución de Problemas Comunes

### Contenedor Detenido

Si un contenedor se detiene inesperadamente:

1. **Verificar el estado**:
   ```bash
   docker ps -a
   ```

2. **Revisar los logs**:
   ```bash
   docker logs gestion-taller_backend_1
   ```

3. **Reiniciar el contenedor**:
   ```bash
   docker-compose restart backend
   ```

4. **Si persiste el problema**:
   ```bash
   # Reconstruir el contenedor
   docker-compose up -d --build backend
   ```

### Problemas de Rendimiento

Si el sistema muestra problemas de rendimiento:

1. **Verificar el uso de recursos**:
   ```bash
   docker stats
   ```

2. **Verificar la carga de la base de datos**:
   ```bash
   docker exec -it gestion-taller_db_1 /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourStrong!Passw0rd -Q "SELECT * FROM sys.dm_exec_requests"
   ```

3. **Verificar conexiones activas**:
   ```bash
   docker exec -it gestion-taller_db_1 /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourStrong!Passw0rd -Q "SELECT COUNT(*) FROM sys.dm_exec_connections"
   ```

4. **Reiniciar los servicios si es necesario**:
   ```bash
   docker-compose restart
   ```

### Recuperación de Desastres

En caso de fallo grave del sistema:

1. **Restaurar desde la última copia de seguridad**:
   ```bash
   # Detener los servicios
   docker-compose down
   
   # Eliminar el volumen de la base de datos
   docker volume rm gestion-taller_sqlserver-data
   
   # Recrear los servicios
   docker-compose up -d
   
   # Esperar a que la base de datos esté lista
   sleep 30
   
   # Restaurar la base de datos
   docker exec -it gestion-taller_db_1 /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourStrong!Passw0rd -Q "RESTORE DATABASE GestionTallerDB FROM DISK = '/path/to/backup/GestionTallerDB_latest.bak' WITH REPLACE"
   ```

2. **Verificar la integridad del sistema después de la restauración**:
   - Acceder a la aplicación web
   - Verificar que los datos estén correctos
   - Realizar algunas operaciones de prueba

## Calendario de Mantenimiento Recomendado

| Tarea | Frecuencia | Descripción |
|-------|-----------|-------------|
| Verificación de estado | Diaria | Comprobar que todos los servicios estén funcionando correctamente |
| Respaldo de base de datos | Diaria | Crear copia de seguridad de la base de datos |
| Revisión de logs | Diaria | Revisar logs en busca de errores o advertencias |
| Respaldo de volúmenes | Semanal | Crear copia de seguridad de los volúmenes de Docker |
| Limpieza de recursos | Mensual | Eliminar imágenes, contenedores y volúmenes no utilizados |
| Actualización de componentes | Según sea necesario | Actualizar el código fuente y reconstruir contenedores |
| Actualización de imágenes base | Trimestral | Actualizar las imágenes base de Docker a versiones más recientes |
| Pruebas de restauración | Trimestral | Verificar que las copias de seguridad se puedan restaurar correctamente |