# 5.3.3. Módulo de Inventario

El Módulo de Inventario permite gestionar todos los repuestos, herramientas y otros elementos del inventario del taller, facilitando el control de stock, la gestión de proveedores y el seguimiento de movimientos de inventario.

## Capturas de Pantalla

### Lista de Inventario

![Lista de inventario](../images/inventory-list-screen.png)

La pantalla de lista de inventario incluye:
1. Barra de búsqueda y filtros para localizar elementos
2. Botón para agregar nuevo elemento al inventario
3. Tabla con información de los elementos (nombre, categoría, cantidad, ubicación)
4. Indicadores visuales de nivel de stock (normal, bajo, agotado)
5. Opciones para ver detalles, editar o eliminar cada elemento
6. Controles de paginación

### Detalles del Elemento

![Detalles del elemento](../images/inventory-item-details.png)

La pantalla de detalles del elemento incluye:
1. Información general del elemento (nombre, descripción, categoría)
2. Información de stock (cantidad actual, mínimo requerido)
3. Información de compra (precio, proveedor, fecha de última compra)
4. Historial de movimientos
5. Gráfico de tendencia de uso
6. Opciones para editar, ajustar stock o generar pedido

### Formulario de Elemento

![Formulario de elemento](../images/inventory-item-form.png)

El formulario de elemento incluye:
1. Campos para información general (nombre, descripción, categoría, SKU)
2. Campos para información de stock (cantidad, stock mínimo, ubicación)
3. Campos para información de compra (precio, proveedor)
4. Opción para cargar imagen del elemento
5. Botones para guardar o cancelar

## Flujos de Trabajo

### Registrar un Nuevo Elemento de Inventario

1. En la pantalla de lista de inventario, haga clic en el botón "Nuevo Elemento".
2. Complete los campos obligatorios del formulario (marcados con asterisco *):
   - Nombre
   - Categoría
   - Cantidad
   - Stock mínimo
3. Complete los campos opcionales según sea necesario:
   - Descripción
   - SKU (código de identificación)
   - Ubicación
   - Precio de compra
   - Proveedor
4. Haga clic en "Guardar".
5. El sistema registrará el nuevo elemento y mostrará un mensaje de confirmación.
6. Será redirigido a la pantalla de detalles del elemento recién creado.

### Buscar Elementos en el Inventario

1. En la pantalla de lista de inventario, utilice la barra de búsqueda en la parte superior.
2. Puede buscar por:
   - Nombre
   - Categoría
   - SKU
   - Proveedor
3. También puede utilizar los filtros avanzados para:
   - Mostrar solo elementos con stock bajo
   - Filtrar por categoría
   - Filtrar por ubicación
   - Filtrar por rango de precios
4. Ingrese el término de búsqueda y/o aplique los filtros deseados.
5. La tabla se actualizará mostrando los elementos que coinciden con su búsqueda.
6. Para ver los detalles de un elemento, haga clic en el botón "Ver" o en el nombre del elemento.

### Ajustar el Stock de un Elemento

1. Busque y seleccione el elemento cuyo stock desea ajustar.
2. En la pantalla de detalles del elemento, haga clic en el botón "Ajustar Stock".
3. En el formulario de ajuste, ingrese:
   - Cantidad a agregar (número positivo) o restar (número negativo)
   - Motivo del ajuste (compra, venta, uso en servicio, inventario físico, etc.)
   - Notas o referencia (opcional)
4. Haga clic en "Guardar Ajuste".
5. El sistema actualizará el stock y registrará el movimiento en el historial.
6. Si el nuevo nivel de stock está por debajo del mínimo, el sistema mostrará una alerta.

### Generar un Pedido de Reposición

1. Vaya a la sección "Alertas de Stock" o filtre la lista de inventario para mostrar elementos con stock bajo.
2. Seleccione los elementos que desea incluir en el pedido marcando las casillas correspondientes.
3. Haga clic en el botón "Generar Pedido".
4. En el formulario de pedido:
   - Seleccione el proveedor (si todos los elementos son del mismo proveedor)
   - Revise y ajuste las cantidades a pedir para cada elemento
   - Agregue notas o instrucciones especiales
5. Haga clic en "Confirmar Pedido".
6. El sistema generará un pedido y lo mostrará para su revisión.
7. Puede imprimir el pedido o enviarlo por correo electrónico al proveedor directamente desde el sistema.

### Ver el Historial de Movimientos

1. Busque y seleccione el elemento cuyo historial desea consultar.
2. En la pantalla de detalles del elemento, vaya a la sección "Historial de Movimientos".
3. Verá una lista de todos los movimientos (entradas y salidas) del elemento.
4. Puede filtrar el historial por:
   - Tipo de movimiento (entrada, salida)
   - Fecha
   - Motivo
5. Para cada movimiento, se muestra:
   - Fecha y hora
   - Tipo de movimiento
   - Cantidad
   - Stock resultante
   - Motivo
   - Usuario que realizó el movimiento
   - Referencia (si aplica)

## Casos de Uso

### Caso 1: Recepción de Mercancía

**Escenario**: El taller recibe un pedido de repuestos que debe ser registrado en el inventario.

**Pasos**:
1. El encargado de almacén recibe la mercancía junto con la factura o albarán.
2. Accede al módulo de inventario y busca cada elemento recibido por nombre o SKU.
3. Para cada elemento encontrado:
   - Hace clic en "Ajustar Stock"
   - Ingresa la cantidad recibida como número positivo
   - Selecciona "Compra" como motivo
   - Ingresa el número de factura como referencia
4. Si algún elemento no existe en el inventario:
   - Hace clic en "Nuevo Elemento"
   - Completa toda la información del nuevo repuesto
   - Establece la cantidad inicial igual a la cantidad recibida
5. Una vez registrados todos los elementos, verifica que el inventario coincida con la mercancía física recibida.
6. Archiva la factura o albarán con una anotación de que ha sido procesado en el sistema.

### Caso 2: Gestión de Stock Bajo

**Escenario**: El sistema ha generado alertas de varios elementos con stock por debajo del mínimo que deben ser reordenados.

**Pasos**:
1. El encargado de compras accede al módulo de inventario.
2. Hace clic en la sección "Alertas de Stock" o filtra la lista para mostrar solo elementos con stock bajo.
3. Revisa la lista de elementos que necesitan reposición.
4. Agrupa los elementos por proveedor para optimizar los pedidos.
5. Para cada grupo de elementos del mismo proveedor:
   - Selecciona los elementos marcando las casillas correspondientes
   - Hace clic en "Generar Pedido"
   - Revisa y ajusta las cantidades según necesidades futuras
   - Confirma el pedido
6. Envía los pedidos generados a los proveedores correspondientes.
7. Registra la fecha estimada de entrega para cada pedido.
8. Cuando los pedidos sean recibidos, seguirá el proceso de recepción de mercancía.

### Caso 3: Uso de Repuestos en un Servicio

**Escenario**: Un técnico necesita utilizar varios repuestos para completar una reparación y debe registrar su uso en el inventario.

**Pasos**:
1. El técnico identifica los repuestos necesarios para la reparación.
2. Accede al módulo de inventario y busca cada repuesto por nombre o SKU.
3. Verifica la disponibilidad de cada repuesto antes de comenzar la reparación.
4. Una vez completada la reparación, para cada repuesto utilizado:
   - Hace clic en "Ajustar Stock"
   - Ingresa la cantidad utilizada como número negativo
   - Selecciona "Uso en Servicio" como motivo
   - Ingresa el número de orden de servicio como referencia
5. El sistema actualiza el inventario y registra los movimientos.
6. Si algún repuesto alcanza el nivel de stock mínimo, el sistema genera una alerta.
7. El técnico completa la orden de servicio en el módulo correspondiente, donde se reflejarán automáticamente los repuestos utilizados.

### Caso 4: Inventario Físico

**Escenario**: El taller realiza un inventario físico trimestral para verificar que los registros del sistema coincidan con las existencias reales.

**Pasos**:
1. El encargado de almacén genera un reporte de inventario actual desde el sistema.
2. Imprime el reporte que incluye todos los elementos con sus cantidades registradas.
3. Realiza el conteo físico de cada elemento y anota las cantidades reales en el reporte impreso.
4. Para cada discrepancia encontrada:
   - Busca el elemento en el sistema
   - Hace clic en "Ajustar Stock"
   - Ingresa la cantidad necesaria para corregir el inventario (positiva o negativa)
   - Selecciona "Inventario Físico" como motivo
   - Agrega notas explicando la posible causa de la discrepancia
5. El sistema genera un reporte de ajustes de inventario que muestra todas las correcciones realizadas.
6. El encargado de almacén revisa el reporte para identificar patrones o problemas recurrentes.
7. Implementa medidas correctivas para reducir discrepancias en el futuro.