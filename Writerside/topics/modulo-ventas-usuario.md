# 5.3.4. Módulo de Ventas

El Módulo de Ventas permite gestionar todas las operaciones relacionadas con la venta de repuestos y servicios, incluyendo la generación de facturas, gestión de pagos y consulta del historial de ventas.

## Capturas de Pantalla

### Lista de Ventas

![Lista de ventas](../images/sales-list-screen.png)

La pantalla de lista de ventas incluye:
1. Barra de búsqueda y filtros para localizar ventas
2. Botón para registrar nueva venta
3. Tabla con información de las ventas (número, fecha, cliente, total)
4. Indicadores visuales de estado de pago (pagado, pendiente, anulado)
5. Opciones para ver detalles, editar o anular cada venta
6. Controles de paginación

### Formulario de Venta

![Formulario de venta](../images/sales-form-screen.png)

El formulario de venta incluye:
1. Selector de cliente (con opción para crear nuevo cliente)
2. Sección para agregar productos o servicios
3. Tabla de productos/servicios seleccionados con cantidades y precios
4. Cálculo automático de subtotal, impuestos y total
5. Campo para aplicar descuentos
6. Selector de método de pago
7. Campo para notas o comentarios
8. Botones para guardar, imprimir o cancelar

### Detalles de Venta

![Detalles de venta](../images/sales-details-screen.png)

La pantalla de detalles de venta incluye:
1. Información general de la venta (número, fecha, cliente)
2. Lista de productos/servicios vendidos
3. Resumen de importes (subtotal, descuentos, impuestos, total)
4. Información de pago
5. Historial de cambios
6. Opciones para imprimir factura, enviar por correo, registrar pago o anular venta

## Flujos de Trabajo

### Registrar una Nueva Venta

1. En la pantalla de lista de ventas, haga clic en el botón "Nueva Venta".
2. Seleccione un cliente existente o cree uno nuevo:
   - Para seleccionar un cliente existente, comience a escribir su nombre y selecciónelo de la lista desplegable.
   - Para crear un nuevo cliente, haga clic en "Nuevo Cliente" y complete el formulario.
3. Agregue productos o servicios a la venta:
   - Haga clic en "Agregar Producto" o "Agregar Servicio".
   - Busque el producto/servicio por nombre o código.
   - Ingrese la cantidad.
   - El sistema calculará automáticamente el subtotal.
4. Repita el paso 3 para cada producto o servicio que desee incluir.
5. Si es necesario, aplique un descuento:
   - Ingrese el porcentaje de descuento o el monto fijo.
   - El sistema recalculará el total.
6. Seleccione el método de pago (efectivo, tarjeta, transferencia, etc.).
7. Agregue notas o comentarios si es necesario.
8. Haga clic en "Guardar" para registrar la venta.
9. El sistema generará un número de factura y mostrará un mensaje de confirmación.
10. Puede imprimir la factura o enviarla por correo electrónico al cliente.

### Buscar y Filtrar Ventas

1. En la pantalla de lista de ventas, utilice la barra de búsqueda en la parte superior.
2. Puede buscar por:
   - Número de factura
   - Nombre del cliente
   - Fecha
3. También puede utilizar los filtros avanzados para:
   - Mostrar ventas en un rango de fechas específico
   - Filtrar por estado de pago (pagado, pendiente, anulado)
   - Filtrar por método de pago
   - Filtrar por vendedor
4. Ingrese el término de búsqueda y/o aplique los filtros deseados.
5. La tabla se actualizará mostrando las ventas que coinciden con su búsqueda.
6. Para ver los detalles de una venta, haga clic en el botón "Ver" o en el número de factura.

### Registrar un Pago para una Venta Pendiente

1. Busque y seleccione la venta pendiente de pago.
2. En la pantalla de detalles de la venta, haga clic en el botón "Registrar Pago".
3. En el formulario de pago, ingrese:
   - Fecha del pago
   - Monto (por defecto, el sistema sugiere el saldo pendiente)
   - Método de pago
   - Referencia (número de transacción, cheque, etc.)
   - Notas (opcional)
4. Haga clic en "Guardar Pago".
5. El sistema registrará el pago y actualizará el estado de la venta.
6. Si el pago cubre el total pendiente, la venta se marcará como "Pagada".
7. Si es un pago parcial, la venta seguirá como "Pendiente" y mostrará el saldo restante.

### Anular una Venta

1. Busque y seleccione la venta que desea anular.
2. En la pantalla de detalles de la venta, haga clic en el botón "Anular Venta".
3. En el diálogo de confirmación, ingrese:
   - Motivo de la anulación
   - Notas adicionales (opcional)
4. Haga clic en "Confirmar Anulación".
5. El sistema anulará la venta y:
   - Cambiará su estado a "Anulada"
   - Revertirá los cambios en el inventario (si corresponde)
   - Registrará la anulación en el historial
6. Si la venta ya tenía pagos registrados, el sistema le preguntará si desea generar una nota de crédito o devolución.

### Generar Informes de Ventas

1. En la pantalla de lista de ventas, haga clic en el botón "Informes".
2. Seleccione el tipo de informe que desea generar:
   - Ventas diarias
   - Ventas por período
   - Ventas por cliente
   - Ventas por producto
   - Ventas por vendedor
3. Configure los parámetros del informe:
   - Rango de fechas
   - Clientes específicos (opcional)
   - Productos específicos (opcional)
   - Vendedores específicos (opcional)
4. Seleccione el formato de salida (PDF, Excel, CSV).
5. Haga clic en "Generar Informe".
6. El sistema procesará la solicitud y generará el informe.
7. Puede descargar, imprimir o enviar por correo electrónico el informe generado.

## Casos de Uso

### Caso 1: Venta Rápida de Repuestos

**Escenario**: Un cliente llega al taller para comprar varios filtros y aceite para su vehículo.

**Pasos**:
1. El vendedor hace clic en "Nueva Venta" en la pantalla de lista de ventas.
2. Busca al cliente por nombre. Si es un cliente nuevo, crea un registro básico con su nombre y teléfono.
3. Agrega los productos al carrito:
   - Busca "Filtro de aceite" y agrega 1 unidad
   - Busca "Filtro de aire" y agrega 1 unidad
   - Busca "Aceite de motor 10W40" y agrega 5 litros
4. El sistema calcula automáticamente el subtotal.
5. El cliente solicita un descuento por comprar varios productos. El vendedor aplica un 5% de descuento.
6. Selecciona "Efectivo" como método de pago.
7. Hace clic en "Guardar" para registrar la venta.
8. Imprime la factura y la entrega al cliente junto con los productos.
9. El sistema actualiza automáticamente el inventario, reduciendo el stock de los productos vendidos.

### Caso 2: Facturación de un Servicio Completado

**Escenario**: Un cliente recoge su vehículo después de un servicio de mantenimiento y necesita pagar y recibir su factura.

**Pasos**:
1. El cajero accede al módulo de ventas y hace clic en "Nueva Venta".
2. Selecciona al cliente que ya existe en el sistema.
3. En lugar de agregar productos individuales, hace clic en "Agregar Servicio".
4. Busca y selecciona la orden de servicio completada para el cliente.
5. El sistema importa automáticamente todos los detalles del servicio, incluyendo:
   - Mano de obra (2 horas de trabajo mecánico)
   - Repuestos utilizados (filtros, aceite, etc.)
6. Revisa el total con el cliente y confirma que todo está correcto.
7. Selecciona "Tarjeta de Crédito" como método de pago.
8. Procesa el pago con la terminal de punto de venta.
9. Registra el número de autorización en el campo de referencia.
10. Guarda la venta y genera la factura.
11. Imprime dos copias: una para el cliente y otra para los registros del taller.

### Caso 3: Gestión de Venta a Crédito

**Escenario**: Un cliente corporativo solicita repuestos y servicios con pago a 30 días según su acuerdo de crédito.

**Pasos**:
1. El vendedor crea una nueva venta y selecciona la empresa cliente.
2. Agrega los productos y servicios solicitados.
3. El sistema reconoce automáticamente que este cliente tiene términos de crédito especiales.
4. Selecciona "Crédito" como método de pago.
5. En el campo de términos, selecciona "30 días" según el acuerdo.
6. Guarda la venta, que queda registrada con estado "Pendiente".
7. Imprime la factura que incluye los términos de pago y la fecha de vencimiento.
8. Entrega los productos o realiza el servicio.
9. 30 días después, cuando el cliente realiza el pago:
   - Busca la venta en el sistema
   - Hace clic en "Registrar Pago"
   - Ingresa los detalles del pago recibido
   - El sistema actualiza el estado de la venta a "Pagada"

### Caso 4: Devolución y Nota de Crédito

**Escenario**: Un cliente devuelve un producto porque no era compatible con su vehículo y solicita un reembolso.

**Pasos**:
1. El vendedor busca la venta original utilizando el número de factura proporcionado por el cliente.
2. En la pantalla de detalles de la venta, hace clic en "Crear Devolución".
3. Selecciona el producto que está siendo devuelto y la cantidad.
4. Ingresa el motivo de la devolución: "Producto incompatible".
5. Verifica el estado del producto devuelto:
   - Si está en buen estado, marca "Devolver a inventario"
   - Si está dañado o abierto, marca "No devolver a inventario"
6. Selecciona el tipo de reembolso:
   - Reembolso en efectivo
   - Reembolso a tarjeta
   - Nota de crédito para futuras compras
7. Procesa la devolución.
8. El sistema:
   - Genera una nota de crédito
   - Actualiza el inventario (si corresponde)
   - Registra la transacción en el historial
9. Imprime la nota de crédito y la entrega al cliente junto con el reembolso o comprobante de crédito.