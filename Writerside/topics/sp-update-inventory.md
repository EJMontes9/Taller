# 4.3.2. sp_UpdateInventory

## Descripción

Este procedimiento almacenado actualiza el inventario de repuestos después de una venta o servicio. Permite ajustar las cantidades disponibles, registrar movimientos de inventario y generar alertas cuando los niveles de stock caen por debajo del mínimo establecido.

## Parámetros

| Parámetro | Tipo de Dato | Descripción | Valor por Defecto |
|-----------|-------------|-------------|-------------------|
| @PartId | int | ID del repuesto a actualizar | Requerido |
| @Quantity | int | Cantidad a restar del inventario (negativo para añadir) | Requerido |
| @TransactionType | nvarchar(20) | Tipo de transacción ('Venta', 'Servicio', 'Ajuste', 'Compra') | Requerido |
| @ReferenceId | int | ID de referencia (ID de venta, servicio, etc.) | NULL |
| @Notes | nvarchar(500) | Notas adicionales sobre la transacción | NULL |
| @UserId | int | ID del usuario que realiza la operación | Requerido |

## Lógica de Negocio

El procedimiento realiza las siguientes operaciones:

1. Valida que el repuesto exista en la base de datos.
2. Verifica que haya suficiente stock disponible si se está reduciendo el inventario.
3. Actualiza la cantidad de stock del repuesto.
4. Registra la transacción en la tabla de movimientos de inventario.
5. Verifica si el nivel de stock ha caído por debajo del mínimo establecido.
6. Si el stock está por debajo del mínimo, genera una alerta en la tabla de alertas de inventario.

El procedimiento utiliza una transacción para garantizar que todas las operaciones se completen correctamente o se reviertan en caso de error.

### Código SQL

```sql
CREATE PROCEDURE sp_UpdateInventory
    @PartId INT,
    @Quantity INT,
    @TransactionType NVARCHAR(20),
    @ReferenceId INT = NULL,
    @Notes NVARCHAR(500) = NULL,
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Validar parámetros
    IF @TransactionType NOT IN ('Venta', 'Servicio', 'Ajuste', 'Compra')
    BEGIN
        RAISERROR('Tipo de transacción no válido. Valores permitidos: Venta, Servicio, Ajuste, Compra', 16, 1);
        RETURN;
    END
    
    -- Iniciar transacción
    BEGIN TRANSACTION;
    
    BEGIN TRY
        -- Verificar que el repuesto existe y obtener información actual
        DECLARE @CurrentStock INT;
        DECLARE @MinStock INT;
        DECLARE @PartName NVARCHAR(100);
        
        SELECT @CurrentStock = Stock, @MinStock = MinStock, @PartName = Name
        FROM Parts
        WHERE Id = @PartId;
        
        IF @CurrentStock IS NULL
        BEGIN
            RAISERROR('El repuesto especificado no existe.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        -- Verificar stock suficiente (solo para salidas de inventario)
        IF @Quantity > 0 AND @CurrentStock < @Quantity
        BEGIN
            RAISERROR('Stock insuficiente. Stock actual: %d, Cantidad solicitada: %d', 16, 1, @CurrentStock, @Quantity);
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        -- Actualizar stock
        UPDATE Parts
        SET Stock = Stock - @Quantity
        WHERE Id = @PartId;
        
        -- Registrar movimiento de inventario
        INSERT INTO InventoryMovements (PartId, Quantity, TransactionType, ReferenceId, Notes, UserId, Date)
        VALUES (@PartId, @Quantity, @TransactionType, @ReferenceId, @Notes, @UserId, GETDATE());
        
        -- Verificar si se debe generar alerta por bajo stock
        DECLARE @NewStock INT;
        SELECT @NewStock = Stock FROM Parts WHERE Id = @PartId;
        
        IF @NewStock <= @MinStock
        BEGIN
            -- Insertar alerta en la tabla de alertas
            INSERT INTO InventoryAlerts (PartId, CurrentStock, MinStock, AlertDate, Status)
            VALUES (@PartId, @NewStock, @MinStock, GETDATE(), 'Pendiente');
            
            -- Devolver mensaje de alerta
            SELECT 'ALERTA' AS AlertType, 
                   'Nivel de stock bajo' AS AlertTitle,
                   'El repuesto "' + @PartName + '" ha alcanzado un nivel de stock bajo (' + 
                   CAST(@NewStock AS NVARCHAR) + ' unidades, mínimo: ' + CAST(@MinStock AS NVARCHAR) + ').' AS AlertMessage;
        END
        
        -- Confirmar transacción
        COMMIT TRANSACTION;
        
        -- Devolver resultado exitoso
        SELECT 'SUCCESS' AS Result, 
               @PartId AS PartId, 
               @NewStock AS NewStock, 
               @Quantity AS QuantityChanged;
    END TRY
    BEGIN CATCH
        -- Revertir transacción en caso de error
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        -- Devolver información del error
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        
        RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END
```

## Ejemplos de Uso

### Ejemplo 1: Actualizar inventario después de una venta

```sql
EXEC sp_UpdateInventory 
    @PartId = 2, 
    @Quantity = 4, 
    @TransactionType = 'Venta', 
    @ReferenceId = 101, 
    @Notes = 'Venta de pastillas de freno', 
    @UserId = 1;
```

Resultado:

```
Result    PartId    NewStock    QuantityChanged
--------- --------- ----------- ---------------
SUCCESS   2         16          4
```

### Ejemplo 2: Actualizar inventario con generación de alerta por bajo stock

```sql
EXEC sp_UpdateInventory 
    @PartId = 3, 
    @Quantity = 13, 
    @TransactionType = 'Venta', 
    @ReferenceId = 102, 
    @UserId = 1;
```

Resultado:

```
AlertType    AlertTitle           AlertMessage
----------- -------------------- ----------------------------------------------
ALERTA       Nivel de stock bajo   El repuesto "Batería 12V" ha alcanzado un nivel de stock bajo (2 unidades, mínimo: 3).

Result    PartId    NewStock    QuantityChanged
--------- --------- ----------- ---------------
SUCCESS   3         2           13
```

### Ejemplo 3: Recibir nueva mercancía (incremento de inventario)

```sql
EXEC sp_UpdateInventory 
    @PartId = 1, 
    @Quantity = -20, 
    @TransactionType = 'Compra', 
    @Notes = 'Reposición de inventario', 
    @UserId = 1;
```

Resultado:

```
Result    PartId    NewStock    QuantityChanged
--------- --------- ----------- ---------------
SUCCESS   1         65          -20
```

### Ejemplo 4: Manejo de errores - Stock insuficiente

```sql
EXEC sp_UpdateInventory 
    @PartId = 2, 
    @Quantity = 30, 
    @TransactionType = 'Venta', 
    @ReferenceId = 103, 
    @UserId = 1;
```

Resultado:

```
Msg 50000, Level 16, State 1, Procedure sp_UpdateInventory, Line 36
Stock insuficiente. Stock actual: 16, Cantidad solicitada: 30
```