# 4.3.4. sp_GenerateMonthlyReport

## Descripción

Este procedimiento almacenado genera un informe mensual detallado de ventas y servicios realizados en el taller. El informe incluye estadísticas de ventas, servicios más solicitados, repuestos más vendidos, ingresos por categoría y comparativas con períodos anteriores.

## Parámetros

| Parámetro | Tipo de Dato | Descripción | Valor por Defecto |
|-----------|-------------|-------------|-------------------|
| @Year | int | Año para el cual se generará el informe | Año actual |
| @Month | int | Mes para el cual se generará el informe (1-12) | Mes actual |
| @IncludeComparison | bit | Indica si se debe incluir comparación con el mes anterior | 1 (true) |
| @DetailLevel | nvarchar(10) | Nivel de detalle del informe ('Summary', 'Detailed') | 'Detailed' |
| @OutputFormat | nvarchar(10) | Formato de salida del informe ('Table', 'JSON', 'XML') | 'Table' |

## Lógica de Negocio

El procedimiento realiza las siguientes operaciones:

1. Valida los parámetros de entrada (año, mes, nivel de detalle, formato de salida).
2. Determina el rango de fechas para el informe (primer y último día del mes especificado).
3. Si se solicita comparación, determina el rango de fechas para el mes anterior.
4. Recopila estadísticas generales de ventas para el período:
   - Total de ventas
   - Ingresos totales
   - Ticket promedio
   - Distribución por método de pago
5. Recopila estadísticas de servicios para el período:
   - Total de servicios realizados
   - Ingresos por servicios
   - Servicios más solicitados
   - Tiempo promedio de servicio
6. Analiza el rendimiento de inventario:
   - Repuestos más vendidos
   - Productos con bajo stock
   - Rotación de inventario
7. Si se solicita comparación, calcula las variaciones porcentuales respecto al mes anterior.
8. Genera el informe en el formato solicitado (tabla, JSON o XML).

El procedimiento utiliza tablas temporales para almacenar los resultados intermedios y mejorar el rendimiento.

### Código SQL

```sql
CREATE PROCEDURE sp_GenerateMonthlyReport
    @Year INT = NULL,
    @Month INT = NULL,
    @IncludeComparison BIT = 1,
    @DetailLevel NVARCHAR(10) = 'Detailed',
    @OutputFormat NVARCHAR(10) = 'Table'
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Validar parámetros
    IF @Year IS NULL
        SET @Year = YEAR(GETDATE());
        
    IF @Month IS NULL
        SET @Month = MONTH(GETDATE());
        
    IF @Month < 1 OR @Month > 12
    BEGIN
        RAISERROR('El mes debe estar entre 1 y 12.', 16, 1);
        RETURN;
    END
    
    IF @DetailLevel NOT IN ('Summary', 'Detailed')
    BEGIN
        RAISERROR('Nivel de detalle no válido. Valores permitidos: Summary, Detailed', 16, 1);
        RETURN;
    END
    
    IF @OutputFormat NOT IN ('Table', 'JSON', 'XML')
    BEGIN
        RAISERROR('Formato de salida no válido. Valores permitidos: Table, JSON, XML', 16, 1);
        RETURN;
    END
    
    -- Determinar rango de fechas para el informe
    DECLARE @StartDate DATE = DATEFROMPARTS(@Year, @Month, 1);
    DECLARE @EndDate DATE = EOMONTH(@StartDate);
    
    -- Determinar rango de fechas para comparación (mes anterior)
    DECLARE @PrevStartDate DATE = DATEADD(MONTH, -1, @StartDate);
    DECLARE @PrevEndDate DATE = EOMONTH(@PrevStartDate);
    
    -- Crear tablas temporales para almacenar resultados
    CREATE TABLE #SalesSummary (
        Category NVARCHAR(50),
        Metric NVARCHAR(100),
        Value DECIMAL(18,2),
        PrevValue DECIMAL(18,2),
        PercentChange DECIMAL(8,2)
    );
    
    CREATE TABLE #ServiceSummary (
        Category NVARCHAR(50),
        Metric NVARCHAR(100),
        Value DECIMAL(18,2),
        PrevValue DECIMAL(18,2),
        PercentChange DECIMAL(8,2)
    );
    
    CREATE TABLE #TopProducts (
        Rank INT,
        PartId INT,
        PartName NVARCHAR(100),
        QuantitySold INT,
        Revenue DECIMAL(18,2),
        PercentOfTotal DECIMAL(8,2)
    );
    
    CREATE TABLE #TopServices (
        Rank INT,
        ServiceType NVARCHAR(100),
        Count INT,
        Revenue DECIMAL(18,2),
        PercentOfTotal DECIMAL(8,2)
    );
    
    -- Recopilar estadísticas de ventas
    -- 1. Total de ventas
    DECLARE @TotalSales INT;
    DECLARE @PrevTotalSales INT = 0;
    
    SELECT @TotalSales = COUNT(*)
    FROM Sales
    WHERE Date >= @StartDate AND Date <= @EndDate;
    
    IF @IncludeComparison = 1
    BEGIN
        SELECT @PrevTotalSales = COUNT(*)
        FROM Sales
        WHERE Date >= @PrevStartDate AND Date <= @PrevEndDate;
    END
    
    INSERT INTO #SalesSummary (Category, Metric, Value, PrevValue, PercentChange)
    VALUES (
        'Ventas', 
        'Total de Ventas', 
        @TotalSales, 
        @PrevTotalSales,
        CASE 
            WHEN @PrevTotalSales = 0 THEN NULL
            ELSE ((@TotalSales - @PrevTotalSales) * 100.0 / @PrevTotalSales)
        END
    );
    
    -- 2. Ingresos totales
    DECLARE @TotalRevenue DECIMAL(18,2);
    DECLARE @PrevTotalRevenue DECIMAL(18,2) = 0;
    
    SELECT @TotalRevenue = SUM(Total)
    FROM Sales
    WHERE Date >= @StartDate AND Date <= @EndDate;
    
    IF @IncludeComparison = 1
    BEGIN
        SELECT @PrevTotalRevenue = SUM(Total)
        FROM Sales
        WHERE Date >= @PrevStartDate AND Date <= @PrevEndDate;
    END
    
    INSERT INTO #SalesSummary (Category, Metric, Value, PrevValue, PercentChange)
    VALUES (
        'Ventas', 
        'Ingresos Totales', 
        ISNULL(@TotalRevenue, 0), 
        ISNULL(@PrevTotalRevenue, 0),
        CASE 
            WHEN @PrevTotalRevenue = 0 OR @PrevTotalRevenue IS NULL THEN NULL
            ELSE ((ISNULL(@TotalRevenue, 0) - @PrevTotalRevenue) * 100.0 / @PrevTotalRevenue)
        END
    );
    
    -- 3. Ticket promedio
    INSERT INTO #SalesSummary (Category, Metric, Value, PrevValue, PercentChange)
    VALUES (
        'Ventas', 
        'Ticket Promedio', 
        CASE WHEN @TotalSales = 0 THEN 0 ELSE ISNULL(@TotalRevenue, 0) / @TotalSales END, 
        CASE WHEN @PrevTotalSales = 0 THEN 0 ELSE ISNULL(@PrevTotalRevenue, 0) / @PrevTotalSales END,
        CASE 
            WHEN @PrevTotalSales = 0 OR @PrevTotalRevenue IS NULL THEN NULL
            ELSE (((ISNULL(@TotalRevenue, 0) / @TotalSales) - (ISNULL(@PrevTotalRevenue, 0) / @PrevTotalSales)) * 100.0 / (ISNULL(@PrevTotalRevenue, 0) / @PrevTotalSales))
        END
    );
    
    -- 4. Ventas por método de pago
    INSERT INTO #SalesSummary (Category, Metric, Value, PrevValue, PercentChange)
    SELECT 
        'Método de Pago',
        PaymentMethod,
        COUNT(*),
        0,
        NULL
    FROM Sales
    WHERE Date >= @StartDate AND Date <= @EndDate
    GROUP BY PaymentMethod;
    
    -- 5. Top productos vendidos
    INSERT INTO #TopProducts (Rank, PartId, PartName, QuantitySold, Revenue, PercentOfTotal)
    SELECT 
        ROW_NUMBER() OVER (ORDER BY SUM(sp.Quantity) DESC) AS Rank,
        p.Id,
        p.Name,
        SUM(sp.Quantity) AS QuantitySold,
        SUM(sp.Subtotal) AS Revenue,
        CASE 
            WHEN @TotalRevenue = 0 OR @TotalRevenue IS NULL THEN 0
            ELSE (SUM(sp.Subtotal) * 100.0 / @TotalRevenue)
        END AS PercentOfTotal
    FROM SaleParts sp
    JOIN Parts p ON sp.PartId = p.Id
    JOIN Sales s ON sp.SaleId = s.Id
    WHERE s.Date >= @StartDate AND s.Date <= @EndDate
    GROUP BY p.Id, p.Name
    ORDER BY QuantitySold DESC;
    
    -- Recopilar estadísticas de servicios
    -- 1. Total de servicios
    DECLARE @TotalServices INT;
    DECLARE @PrevTotalServices INT = 0;
    DECLARE @ServiceRevenue DECIMAL(18,2);
    DECLARE @PrevServiceRevenue DECIMAL(18,2) = 0;
    
    SELECT 
        @TotalServices = COUNT(*),
        @ServiceRevenue = SUM(ISNULL(LaborCost, 0) + ISNULL(PartsCost, 0))
    FROM RepairOrders
    WHERE Date >= @StartDate AND Date <= @EndDate;
    
    IF @IncludeComparison = 1
    BEGIN
        SELECT 
            @PrevTotalServices = COUNT(*),
            @PrevServiceRevenue = SUM(ISNULL(LaborCost, 0) + ISNULL(PartsCost, 0))
        FROM RepairOrders
        WHERE Date >= @PrevStartDate AND Date <= @PrevEndDate;
    END
    
    INSERT INTO #ServiceSummary (Category, Metric, Value, PrevValue, PercentChange)
    VALUES (
        'Servicios', 
        'Total de Servicios', 
        ISNULL(@TotalServices, 0), 
        ISNULL(@PrevTotalServices, 0),
        CASE 
            WHEN @PrevTotalServices = 0 OR @PrevTotalServices IS NULL THEN NULL
            ELSE ((ISNULL(@TotalServices, 0) - @PrevTotalServices) * 100.0 / @PrevTotalServices)
        END
    );
    
    INSERT INTO #ServiceSummary (Category, Metric, Value, PrevValue, PercentChange)
    VALUES (
        'Servicios', 
        'Ingresos por Servicios', 
        ISNULL(@ServiceRevenue, 0), 
        ISNULL(@PrevServiceRevenue, 0),
        CASE 
            WHEN @PrevServiceRevenue = 0 OR @PrevServiceRevenue IS NULL THEN NULL
            ELSE ((ISNULL(@ServiceRevenue, 0) - @PrevServiceRevenue) * 100.0 / @PrevServiceRevenue)
        END
    );
    
    -- 2. Top servicios
    INSERT INTO #TopServices (Rank, ServiceType, Count, Revenue, PercentOfTotal)
    SELECT 
        ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) AS Rank,
        ServiceType,
        COUNT(*) AS Count,
        SUM(ISNULL(LaborCost, 0) + ISNULL(PartsCost, 0)) AS Revenue,
        CASE 
            WHEN @ServiceRevenue = 0 OR @ServiceRevenue IS NULL THEN 0
            ELSE (SUM(ISNULL(LaborCost, 0) + ISNULL(PartsCost, 0)) * 100.0 / @ServiceRevenue)
        END AS PercentOfTotal
    FROM RepairOrders
    WHERE Date >= @StartDate AND Date <= @EndDate
    GROUP BY ServiceType
    ORDER BY Count DESC;
    
    -- Generar informe según formato solicitado
    IF @OutputFormat = 'Table'
    BEGIN
        -- Resumen general
        SELECT 
            'Resumen del Período' AS ReportSection,
            'Período: ' + FORMAT(@StartDate, 'MMMM yyyy', 'es-ES') AS ReportPeriod;
            
        -- Estadísticas de ventas
        SELECT 
            Category,
            Metric,
            Value,
            CASE WHEN @IncludeComparison = 1 THEN PrevValue ELSE NULL END AS PrevValue,
            CASE WHEN @IncludeComparison = 1 THEN PercentChange ELSE NULL END AS PercentChange
        FROM #SalesSummary
        ORDER BY Category, Metric;
        
        -- Estadísticas de servicios
        SELECT 
            Category,
            Metric,
            Value,
            CASE WHEN @IncludeComparison = 1 THEN PrevValue ELSE NULL END AS PrevValue,
            CASE WHEN @IncludeComparison = 1 THEN PercentChange ELSE NULL END AS PercentChange
        FROM #ServiceSummary
        ORDER BY Category, Metric;
        
        -- Top productos
        SELECT TOP 10
            Rank,
            PartName,
            QuantitySold,
            Revenue,
            PercentOfTotal
        FROM #TopProducts
        ORDER BY Rank;
        
        -- Top servicios
        SELECT TOP 5
            Rank,
            ServiceType,
            Count,
            Revenue,
            PercentOfTotal
        FROM #TopServices
        ORDER BY Rank;
        
        -- Información detallada si se solicita
        IF @DetailLevel = 'Detailed'
        BEGIN
            -- Ventas diarias
            SELECT 
                CAST(Date AS DATE) AS SaleDate,
                COUNT(*) AS SalesCount,
                SUM(Total) AS DailyRevenue
            FROM Sales
            WHERE Date >= @StartDate AND Date <= @EndDate
            GROUP BY CAST(Date AS DATE)
            ORDER BY SaleDate;
            
            -- Productos con bajo stock
            SELECT 
                p.Id,
                p.Name,
                p.Stock,
                p.MinStock,
                p.Stock - p.MinStock AS StockDifference
            FROM Parts p
            WHERE p.Stock <= p.MinStock
            ORDER BY StockDifference;
        END
    END
    ELSE IF @OutputFormat = 'JSON'
    BEGIN
        -- Generar salida en formato JSON
        SELECT (
            SELECT 
                FORMAT(@StartDate, 'MMMM yyyy', 'es-ES') AS ReportPeriod,
                (SELECT * FROM #SalesSummary FOR JSON PATH) AS SalesSummary,
                (SELECT * FROM #ServiceSummary FOR JSON PATH) AS ServiceSummary,
                (SELECT TOP 10 * FROM #TopProducts ORDER BY Rank FOR JSON PATH) AS TopProducts,
                (SELECT TOP 5 * FROM #TopServices ORDER BY Rank FOR JSON PATH) AS TopServices,
                CASE WHEN @DetailLevel = 'Detailed' THEN
                    (SELECT 
                        CAST(Date AS DATE) AS SaleDate,
                        COUNT(*) AS SalesCount,
                        SUM(Total) AS DailyRevenue
                    FROM Sales
                    WHERE Date >= @StartDate AND Date <= @EndDate
                    GROUP BY CAST(Date AS DATE)
                    ORDER BY SaleDate
                    FOR JSON PATH) 
                ELSE NULL END AS DailySales,
                CASE WHEN @DetailLevel = 'Detailed' THEN
                    (SELECT 
                        p.Id,
                        p.Name,
                        p.Stock,
                        p.MinStock,
                        p.Stock - p.MinStock AS StockDifference
                    FROM Parts p
                    WHERE p.Stock <= p.MinStock
                    ORDER BY StockDifference
                    FOR JSON PATH)
                ELSE NULL END AS LowStockProducts
            FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
        ) AS JSONOutput;
    END
    ELSE IF @OutputFormat = 'XML'
    BEGIN
        -- Generar salida en formato XML
        SELECT (
            SELECT 
                FORMAT(@StartDate, 'MMMM yyyy', 'es-ES') AS ReportPeriod,
                (SELECT * FROM #SalesSummary FOR XML PATH('SalesSummaryItem'), ROOT('SalesSummary')) AS SalesSummary,
                (SELECT * FROM #ServiceSummary FOR XML PATH('ServiceSummaryItem'), ROOT('ServiceSummary')) AS ServiceSummary,
                (SELECT TOP 10 * FROM #TopProducts ORDER BY Rank FOR XML PATH('Product'), ROOT('TopProducts')) AS TopProducts,
                (SELECT TOP 5 * FROM #TopServices ORDER BY Rank FOR XML PATH('Service'), ROOT('TopServices')) AS TopServices,
                CASE WHEN @DetailLevel = 'Detailed' THEN
                    (SELECT 
                        CAST(Date AS DATE) AS SaleDate,
                        COUNT(*) AS SalesCount,
                        SUM(Total) AS DailyRevenue
                    FROM Sales
                    WHERE Date >= @StartDate AND Date <= @EndDate
                    GROUP BY CAST(Date AS DATE)
                    ORDER BY SaleDate
                    FOR XML PATH('DailySale'), ROOT('DailySales'))
                ELSE NULL END AS DailySales,
                CASE WHEN @DetailLevel = 'Detailed' THEN
                    (SELECT 
                        p.Id,
                        p.Name,
                        p.Stock,
                        p.MinStock,
                        p.Stock - p.MinStock AS StockDifference
                    FROM Parts p
                    WHERE p.Stock <= p.MinStock
                    ORDER BY StockDifference
                    FOR XML PATH('Product'), ROOT('LowStockProducts'))
                ELSE NULL END AS LowStockProducts
            FOR XML PATH('MonthlyReport')
        ) AS XMLOutput;
    END
    
    -- Limpiar tablas temporales
    DROP TABLE #SalesSummary;
    DROP TABLE #ServiceSummary;
    DROP TABLE #TopProducts;
    DROP TABLE #TopServices;
END
```

## Ejemplos de Uso

### Ejemplo 1: Generar informe mensual básico para el mes actual

```sql
EXEC sp_GenerateMonthlyReport;
```

Resultado (parcial):

```
ReportSection           ReportPeriod
----------------------- --------------------------
Resumen del Período     Período: junio 2023

Category    Metric              Value      PrevValue   PercentChange
----------- ------------------- ---------- ----------- -------------
Ventas      Total de Ventas     42         38          10.53
Ventas      Ingresos Totales    78542.75   65890.20    19.20
Ventas      Ticket Promedio     1870.07    1733.95     7.85
Método de Pago Efectivo         15         NULL        NULL
Método de Pago Tarjeta          18         NULL        NULL
Método de Pago Transferencia    9          NULL        NULL

...

Rank  PartName                 QuantitySold  Revenue    PercentOfTotal
----- ------------------------ ------------- ---------- --------------
1     Filtro de aceite         87            1391.13    1.77
2     Pastillas de freno       45            2047.50    2.61
3     Batería 12V              32            2879.68    3.67
...
```

### Ejemplo 2: Generar informe detallado para un mes específico en formato JSON

```sql
EXEC sp_GenerateMonthlyReport 
    @Year = 2023, 
    @Month = 5, 
    @DetailLevel = 'Detailed', 
    @OutputFormat = 'JSON';
```

Resultado (parcial):

```json
{
  "ReportPeriod": "mayo 2023",
  "SalesSummary": [
    {
      "Category": "Ventas",
      "Metric": "Total de Ventas",
      "Value": 38,
      "PrevValue": 42,
      "PercentChange": -9.52
    },
    {
      "Category": "Ventas",
      "Metric": "Ingresos Totales",
      "Value": 65890.20,
      "PrevValue": 70125.50,
      "PercentChange": -6.04
    },
    ...
  ],
  "ServiceSummary": [
    ...
  ],
  "TopProducts": [
    {
      "Rank": 1,
      "PartId": 1,
      "PartName": "Filtro de aceite",
      "QuantitySold": 75,
      "Revenue": 1199.25,
      "PercentOfTotal": 1.82
    },
    ...
  ],
  "TopServices": [
    ...
  ],
  "DailySales": [
    {
      "SaleDate": "2023-05-01",
      "SalesCount": 2,
      "DailyRevenue": 3450.75
    },
    ...
  ],
  "LowStockProducts": [
    {
      "Id": 3,
      "Name": "Batería 12V",
      "Stock": 2,
      "MinStock": 3,
      "StockDifference": -1
    },
    ...
  ]
}
```

### Ejemplo 3: Generar informe resumido sin comparación con el mes anterior

```sql
EXEC sp_GenerateMonthlyReport 
    @Year = 2023, 
    @Month = 4, 
    @IncludeComparison = 0, 
    @DetailLevel = 'Summary';
```

Resultado (parcial):

```
ReportSection           ReportPeriod
----------------------- --------------------------
Resumen del Período     Período: abril 2023

Category    Metric              Value      PrevValue   PercentChange
----------- ------------------- ---------- ----------- -------------
Ventas      Total de Ventas     42         NULL        NULL
Ventas      Ingresos Totales    70125.50   NULL        NULL
Ventas      Ticket Promedio     1669.65    NULL        NULL
...
```

### Ejemplo 4: Manejo de errores - Mes inválido

```sql
EXEC sp_GenerateMonthlyReport @Month = 13;
```

Resultado:

```
Msg 50000, Level 16, State 1, Procedure sp_GenerateMonthlyReport, Line 16
El mes debe estar entre 1 y 12.
```