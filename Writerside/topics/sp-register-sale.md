# 4.3.3. sp_RegisterSale

## Descripción

Este procedimiento almacenado registra una nueva venta en el sistema, incluyendo todos sus detalles como cliente, productos vendidos, precios, descuentos y método de pago. El procedimiento maneja automáticamente la actualización del inventario, la generación del número de factura y el cálculo de totales.

## Parámetros

| Parámetro | Tipo de Dato | Descripción | Valor por Defecto |
|-----------|-------------|-------------|-------------------|
| @ClienteId | int | ID del cliente que realiza la compra | Requerido |
| @VehicleId | int | ID del vehículo vendido (si aplica) | NULL |
| @Items | xml | XML con los detalles de los productos vendidos | Requerido |
| @Discount | decimal(5,2) | Porcentaje de descuento aplicado a toda la venta | 0 |
| @PaymentMethod | nvarchar(50) | Método de pago utilizado | 'Efectivo' |
| @Notes | nvarchar(500) | Notas adicionales sobre la venta | NULL |
| @UserId | int | ID del usuario que registra la venta | Requerido |

## Lógica de Negocio

El procedimiento realiza las siguientes operaciones:

1. Valida que el cliente exista en la base de datos.
2. Si se proporciona un ID de vehículo, valida que exista y esté disponible.
3. Parsea el XML de ítems para obtener los productos vendidos.
4. Verifica que haya suficiente stock de cada producto.
5. Calcula subtotales, impuestos y total de la venta.
6. Genera un número de factura único.
7. Registra la venta en la tabla Sales.
8. Registra los detalles de la venta en la tabla SaleParts.
9. Actualiza el inventario de productos.
10. Si se vendió un vehículo, actualiza su estado a 'vendido'.
11. Devuelve la información de la venta registrada.

El procedimiento utiliza una transacción para garantizar la integridad de los datos, asegurando que todas las operaciones se completen correctamente o se reviertan en caso de error.

### Código SQL

```sql
CREATE PROCEDURE sp_RegisterSale
    @ClienteId INT,
    @VehicleId INT = NULL,
    @Items XML,
    @Discount DECIMAL(5,2) = 0,
    @PaymentMethod NVARCHAR(50) = 'Efectivo',
    @Notes NVARCHAR(500) = NULL,
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Validar parámetros
    IF @Discount < 0 OR @Discount > 100
    BEGIN
        RAISERROR('El descuento debe estar entre 0 y 100 por ciento.', 16, 1);
        RETURN;
    END
    
    -- Iniciar transacción
    BEGIN TRANSACTION;
    
    BEGIN TRY
        -- Verificar que el cliente existe
        IF NOT EXISTS (SELECT 1 FROM Clientes WHERE Id = @ClienteId)
        BEGIN
            RAISERROR('El cliente especificado no existe.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        -- Verificar vehículo si se proporciona
        IF @VehicleId IS NOT NULL
        BEGIN
            DECLARE @VehicleStatus NVARCHAR(20);
            SELECT @VehicleStatus = Status FROM Vehicles WHERE Id = @VehicleId;
            
            IF @VehicleStatus IS NULL
            BEGIN
                RAISERROR('El vehículo especificado no existe.', 16, 1);
                ROLLBACK TRANSACTION;
                RETURN;
            END
            
            IF @VehicleStatus <> 'disponible'
            BEGIN
                RAISERROR('El vehículo no está disponible para la venta. Estado actual: %s', 16, 1, @VehicleStatus);
                ROLLBACK TRANSACTION;
                RETURN;
            END
        END
        
        -- Crear tabla temporal para los ítems
        DECLARE @TempItems TABLE (
            PartId INT,
            Quantity INT,
            UnitPrice DECIMAL(18,2)
        );
        
        -- Parsear XML de ítems
        INSERT INTO @TempItems (PartId, Quantity, UnitPrice)
        SELECT
            Item.value('(PartId)[1]', 'INT'),
            Item.value('(Quantity)[1]', 'INT'),
            Item.value('(UnitPrice)[1]', 'DECIMAL(18,2)')
        FROM @Items.nodes('/Items/Item') AS Items(Item);
        
        -- Verificar stock de todos los productos
        DECLARE @InsufficientStock TABLE (
            PartId INT,
            PartName NVARCHAR(100),
            CurrentStock INT,
            RequestedQuantity INT
        );
        
        INSERT INTO @InsufficientStock (PartId, PartName, CurrentStock, RequestedQuantity)
        SELECT p.Id, p.Name, p.Stock, t.Quantity
        FROM @TempItems t
        JOIN Parts p ON t.PartId = p.Id
        WHERE p.Stock < t.Quantity;
        
        IF EXISTS (SELECT 1 FROM @InsufficientStock)
        BEGIN
            DECLARE @ErrorMsg NVARCHAR(4000) = 'Stock insuficiente para los siguientes productos:';
            
            SELECT @ErrorMsg = @ErrorMsg + CHAR(13) + '- ' + PartName + ': Stock actual=' + 
                              CAST(CurrentStock AS NVARCHAR) + ', Solicitado=' + CAST(RequestedQuantity AS NVARCHAR)
            FROM @InsufficientStock;
            
            RAISERROR(@ErrorMsg, 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        -- Calcular subtotal
        DECLARE @Subtotal DECIMAL(18,2) = 0;
        SELECT @Subtotal = SUM(Quantity * UnitPrice) FROM @TempItems;
        
        -- Añadir precio del vehículo si aplica
        DECLARE @VehiclePrice DECIMAL(18,2) = 0;
        IF @VehicleId IS NOT NULL
        BEGIN
            SELECT @VehiclePrice = Price FROM Vehicles WHERE Id = @VehicleId;
            SET @Subtotal = @Subtotal + @VehiclePrice;
        END
        
        -- Calcular descuento
        DECLARE @DiscountAmount DECIMAL(18,2) = @Subtotal * (@Discount / 100);
        
        -- Calcular impuestos (asumiendo 16% de IVA)
        DECLARE @TaxRate DECIMAL(5,2) = 16;
        DECLARE @TaxAmount DECIMAL(18,2) = (@Subtotal - @DiscountAmount) * (@TaxRate / 100);
        
        -- Calcular total
        DECLARE @Total DECIMAL(18,2) = @Subtotal - @DiscountAmount + @TaxAmount;
        
        -- Generar número de factura (formato: INV-YYYYMMDD-XXXX)
        DECLARE @InvoiceNumber NVARCHAR(20);
        DECLARE @CurrentDate NVARCHAR(8) = FORMAT(GETDATE(), 'yyyyMMdd');
        DECLARE @SequenceNumber INT;
        
        SELECT @SequenceNumber = ISNULL(MAX(CAST(SUBSTRING(InvoiceNumber, 13, 4) AS INT)), 0) + 1
        FROM Sales
        WHERE InvoiceNumber LIKE 'INV-' + @CurrentDate + '-%';
        
        SET @InvoiceNumber = 'INV-' + @CurrentDate + '-' + RIGHT('0000' + CAST(@SequenceNumber AS NVARCHAR(4)), 4);
        
        -- Insertar venta
        DECLARE @SaleId INT;
        
        INSERT INTO Sales (
            Date, 
            InvoiceNumber, 
            ClienteId, 
            VehicleId, 
            Subtotal, 
            Discount, 
            Tax, 
            Total, 
            PaymentMethod, 
            Status, 
            Notes, 
            UserId
        )
        VALUES (
            GETDATE(), 
            @InvoiceNumber, 
            @ClienteId, 
            @VehicleId, 
            @Subtotal, 
            @DiscountAmount, 
            @TaxAmount, 
            @Total, 
            @PaymentMethod, 
            'Completada', 
            @Notes, 
            @UserId
        );
        
        SET @SaleId = SCOPE_IDENTITY();
        
        -- Insertar detalles de venta y actualizar inventario
        INSERT INTO SaleParts (SaleId, PartId, Quantity, UnitPrice, Subtotal)
        SELECT @SaleId, PartId, Quantity, UnitPrice, Quantity * UnitPrice
        FROM @TempItems;
        
        -- Actualizar inventario
        UPDATE p
        SET p.Stock = p.Stock - t.Quantity
        FROM Parts p
        JOIN @TempItems t ON p.Id = t.PartId;
        
        -- Registrar movimientos de inventario
        INSERT INTO InventoryMovements (PartId, Quantity, TransactionType, ReferenceId, Notes, UserId, Date)
        SELECT PartId, Quantity, 'Venta', @SaleId, 'Venta #' + @InvoiceNumber, @UserId, GETDATE()
        FROM @TempItems;
        
        -- Actualizar estado del vehículo si aplica
        IF @VehicleId IS NOT NULL
        BEGIN
            UPDATE Vehicles
            SET Status = 'vendido'
            WHERE Id = @VehicleId;
        END
        
        -- Confirmar transacción
        COMMIT TRANSACTION;
        
        -- Devolver información de la venta
        SELECT 
            s.Id,
            s.InvoiceNumber,
            s.Date,
            c.Nombre + ' ' + c.Apellido AS ClientName,
            s.Subtotal,
            s.Discount,
            s.Tax,
            s.Total,
            s.PaymentMethod,
            s.Status
        FROM Sales s
        JOIN Clientes c ON s.ClienteId = c.Id
        WHERE s.Id = @SaleId;
        
        -- Devolver detalles de la venta
        SELECT 
            sp.PartId,
            p.Name AS PartName,
            sp.Quantity,
            sp.UnitPrice,
            sp.Subtotal
        FROM SaleParts sp
        JOIN Parts p ON sp.PartId = p.Id
        WHERE sp.SaleId = @SaleId;
        
        -- Devolver información del vehículo si aplica
        IF @VehicleId IS NOT NULL
        BEGIN
            SELECT 
                Id,
                Brand,
                Model,
                Year,
                VIN,
                Price
            FROM Vehicles
            WHERE Id = @VehicleId;
        END
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

### Ejemplo 1: Registrar una venta de repuestos

```sql
DECLARE @ItemsXML XML = 
'<Items>
    <Item>
        <PartId>1</PartId>
        <Quantity>2</Quantity>
        <UnitPrice>15.99</UnitPrice>
    </Item>
    <Item>
        <PartId>2</PartId>
        <Quantity>1</Quantity>
        <UnitPrice>45.50</UnitPrice>
    </Item>
</Items>';

EXEC sp_RegisterSale 
    @ClienteId = 1, 
    @Items = @ItemsXML, 
    @Discount = 5, 
    @PaymentMethod = 'Tarjeta', 
    @Notes = 'Cliente frecuente', 
    @UserId = 1;
```

Resultado:

```
Id  InvoiceNumber     Date                ClientName    Subtotal  Discount  Tax      Total    PaymentMethod  Status
--- ---------------- ------------------- ------------- --------- --------- -------- -------- -------------- ---------
1   INV-20230615-0001 2023-06-15 14:30:22 Juan Pérez     77.48     3.87      11.78    85.39   Tarjeta        Completada

PartId  PartName           Quantity  UnitPrice  Subtotal
------- ------------------ --------- ---------- ---------
1       Filtro de aceite   2         15.99      31.98
2       Pastillas de freno 1         45.50      45.50
```

### Ejemplo 2: Registrar una venta de vehículo con repuestos adicionales

```sql
DECLARE @ItemsXML XML = 
'<Items>
    <Item>
        <PartId>3</PartId>
        <Quantity>1</Quantity>
        <UnitPrice>89.99</UnitPrice>
    </Item>
</Items>';

EXEC sp_RegisterSale 
    @ClienteId = 2, 
    @VehicleId = 1, 
    @Items = @ItemsXML, 
    @PaymentMethod = 'Transferencia', 
    @UserId = 1;
```

Resultado:

```
Id  InvoiceNumber     Date                ClientName      Subtotal   Discount  Tax       Total     PaymentMethod  Status
--- ---------------- ------------------- --------------- ---------- --------- --------- --------- -------------- ---------
2   INV-20230615-0002 2023-06-15 15:45:10 María González  25089.99   0.00      4014.40   29104.39  Transferencia  Completada

PartId  PartName     Quantity  UnitPrice  Subtotal
------- ------------ --------- ---------- ---------
3       Batería 12V  1         89.99      89.99

Id  Brand   Model    Year  VIN           Price
--- ------- -------- ----- ------------- -------
1   Toyota  Corolla  2023  ABC123456789  25000.00
```

### Ejemplo 3: Manejo de errores - Stock insuficiente

```sql
DECLARE @ItemsXML XML = 
'<Items>
    <Item>
        <PartId>2</PartId>
        <Quantity>30</Quantity>
        <UnitPrice>45.50</UnitPrice>
    </Item>
</Items>';

EXEC sp_RegisterSale 
    @ClienteId = 1, 
    @Items = @ItemsXML, 
    @UserId = 1;
```

Resultado:

```
Msg 50000, Level 16, State 1, Procedure sp_RegisterSale, Line 98
Stock insuficiente para los siguientes productos:
- Pastillas de freno: Stock actual=19, Solicitado=30
```