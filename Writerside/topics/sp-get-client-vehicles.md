# 4.3.1. sp_GetClientVehicles

## Descripción

Este procedimiento almacenado recupera todos los vehículos asociados a un cliente específico. Permite filtrar los vehículos por estado y ordenarlos según diferentes criterios.

## Parámetros

| Parámetro | Tipo de Dato | Descripción | Valor por Defecto |
|-----------|-------------|-------------|-------------------|
| @ClienteId | int | ID del cliente cuyos vehículos se desean obtener | Requerido |
| @Status | nvarchar(20) | Estado de los vehículos a filtrar (disponible, vendido, en reparación) | NULL (todos) |
| @OrderBy | nvarchar(50) | Campo por el cual ordenar los resultados | 'Brand' |
| @OrderDirection | nvarchar(4) | Dirección de ordenamiento (ASC o DESC) | 'ASC' |

## Lógica de Negocio

El procedimiento realiza las siguientes operaciones:

1. Valida que el cliente exista en la base de datos.
2. Construye dinámicamente una consulta SQL que selecciona los vehículos del cliente especificado.
3. Si se proporciona un valor para @Status, filtra los vehículos por ese estado.
4. Ordena los resultados según los parámetros @OrderBy y @OrderDirection.
5. Devuelve un conjunto de resultados con la información de los vehículos.

El procedimiento incluye manejo de errores para capturar y reportar cualquier problema durante la ejecución.

### Código SQL

```sql
CREATE PROCEDURE sp_GetClientVehicles
    @ClienteId INT,
    @Status NVARCHAR(20) = NULL,
    @OrderBy NVARCHAR(50) = 'Brand',
    @OrderDirection NVARCHAR(4) = 'ASC'
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Verificar que el cliente existe
    IF NOT EXISTS (SELECT 1 FROM Clientes WHERE Id = @ClienteId)
    BEGIN
        RAISERROR('El cliente especificado no existe.', 16, 1);
        RETURN;
    END
    
    -- Validar parámetros de ordenamiento
    IF @OrderBy NOT IN ('Brand', 'Model', 'Year', 'Price')
    BEGIN
        SET @OrderBy = 'Brand';
    END
    
    IF @OrderDirection NOT IN ('ASC', 'DESC')
    BEGIN
        SET @OrderDirection = 'ASC';
    END
    
    -- Construir y ejecutar la consulta
    DECLARE @SQL NVARCHAR(1000);
    
    SET @SQL = 'SELECT Id, Brand, Model, Year, Color, VIN, Price, Status 
                FROM Vehicles 
                WHERE ClienteId = @ClienteId';
    
    IF @Status IS NOT NULL
    BEGIN
        SET @SQL = @SQL + ' AND Status = @Status';
    END
    
    SET @SQL = @SQL + ' ORDER BY ' + @OrderBy + ' ' + @OrderDirection;
    
    EXEC sp_executesql @SQL, 
                      N'@ClienteId INT, @Status NVARCHAR(20)', 
                      @ClienteId, @Status;
END
```

## Ejemplos de Uso

### Ejemplo 1: Obtener todos los vehículos de un cliente

```sql
EXEC sp_GetClientVehicles @ClienteId = 1;
```

Resultado:

| Id | Brand | Model | Year | Color | VIN | Price | Status |
|----|-------|-------|------|-------|-----|-------|--------|
| 1 | Toyota | Corolla | 2023 | Blanco | ABC123456789 | 25000.00 | disponible |
| 3 | Honda | Civic | 2022 | Azul | JKL987654321 | 23000.00 | en reparación |

### Ejemplo 2: Obtener solo los vehículos disponibles de un cliente, ordenados por precio descendente

```sql
EXEC sp_GetClientVehicles 
    @ClienteId = 1, 
    @Status = 'disponible', 
    @OrderBy = 'Price', 
    @OrderDirection = 'DESC';
```

Resultado:

| Id | Brand | Model | Year | Color | VIN | Price | Status |
|----|-------|-------|------|-------|-----|-------|--------|
| 1 | Toyota | Corolla | 2023 | Blanco | ABC123456789 | 25000.00 | disponible |
| 5 | Nissan | Sentra | 2021 | Gris | MNO123789456 | 21500.00 | disponible |

### Ejemplo 3: Manejo de errores - Cliente inexistente

```sql
EXEC sp_GetClientVehicles @ClienteId = 999;
```

Resultado:

```
Msg 50000, Level 16, State 1, Procedure sp_GetClientVehicles, Line 11
El cliente especificado no existe.
```