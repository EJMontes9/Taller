# 5.3.5. Módulo de Servicio

El Módulo de Servicio permite gestionar todas las operaciones relacionadas con los servicios de taller, incluyendo la programación de citas, gestión de órdenes de reparación, seguimiento del estado de los servicios y registro de trabajos realizados.

## Capturas de Pantalla

### Calendario de Citas

![Calendario de citas](../images/service-calendar-screen.png)

La pantalla de calendario de citas incluye:
1. Vista de calendario con citas programadas
2. Opciones de visualización (día, semana, mes)
3. Código de colores para diferentes tipos de servicios
4. Botón para crear nueva cita
5. Panel lateral con detalles de la cita seleccionada
6. Filtros para técnicos y tipos de servicio

### Formulario de Cita

![Formulario de cita](../images/service-appointment-form.png)

El formulario de cita incluye:
1. Selector de cliente (con opción para crear nuevo cliente)
2. Selector de vehículo (con opción para agregar nuevo vehículo)
3. Selector de fecha y hora
4. Selector de duración estimada
5. Selector de tipo de servicio
6. Campo para descripción o notas
7. Selector de técnico asignado
8. Botones para guardar o cancelar

### Lista de Órdenes de Servicio

![Lista de órdenes de servicio](../images/service-orders-list.png)

La pantalla de lista de órdenes de servicio incluye:
1. Barra de búsqueda y filtros para localizar órdenes
2. Botón para crear nueva orden de servicio
3. Tabla con información de las órdenes (número, fecha, cliente, vehículo, estado)
4. Indicadores visuales de estado (pendiente, en progreso, completada, entregada)
5. Opciones para ver detalles, editar o cancelar cada orden
6. Controles de paginación

### Detalles de Orden de Servicio

![Detalles de orden de servicio](../images/service-order-details.png)

La pantalla de detalles de orden de servicio incluye:
1. Información general (número, fecha, cliente, vehículo)
2. Información del vehículo (marca, modelo, año, placa)
3. Descripción del servicio y diagnóstico
4. Lista de tareas a realizar
5. Lista de repuestos utilizados
6. Historial de actualizaciones
7. Sección de fotos o archivos adjuntos
8. Opciones para actualizar estado, agregar tareas o repuestos, generar factura

## Flujos de Trabajo

### Programar una Cita

1. En la pantalla de calendario de citas, haga clic en el botón "Nueva Cita" o directamente en la fecha y hora deseada en el calendario.
2. Seleccione un cliente existente o cree uno nuevo:
   - Para seleccionar un cliente existente, comience a escribir su nombre y selecciónelo de la lista desplegable.
   - Para crear un nuevo cliente, haga clic en "Nuevo Cliente" y complete el formulario.
3. Seleccione un vehículo existente o agregue uno nuevo:
   - Para seleccionar un vehículo existente, elíjalo de la lista de vehículos del cliente.
   - Para agregar un nuevo vehículo, haga clic en "Nuevo Vehículo" y complete el formulario.
4. Seleccione la fecha y hora de la cita.
5. Establezca la duración estimada del servicio.
6. Seleccione el tipo de servicio (mantenimiento regular, reparación, diagnóstico, etc.).
7. Ingrese una descripción detallada o notas sobre el servicio requerido.
8. Asigne un técnico (opcional, puede asignarse posteriormente).
9. Haga clic en "Guardar" para programar la cita.
10. El sistema registrará la cita y la mostrará en el calendario.
11. Opcionalmente, puede enviar una confirmación por correo electrónico o SMS al cliente.

### Crear una Orden de Servicio

1. Puede crear una orden de servicio de dos maneras:
   - A partir de una cita: En la vista de calendario, seleccione la cita y haga clic en "Crear Orden de Servicio".
   - Directamente: En la lista de órdenes de servicio, haga clic en "Nueva Orden".
2. Si parte de una cita, la información del cliente, vehículo y servicio se completará automáticamente.
3. Si crea la orden directamente, deberá seleccionar el cliente y el vehículo.
4. Complete la información adicional requerida:
   - Kilometraje actual del vehículo
   - Nivel de combustible
   - Estado general del vehículo
   - Pertenencias dejadas en el vehículo
5. Realice un diagnóstico inicial y regístrelo en el campo correspondiente.
6. Agregue las tareas a realizar:
   - Haga clic en "Agregar Tarea"
   - Describa la tarea
   - Asigne un técnico
   - Estime el tiempo requerido
7. Agregue los repuestos necesarios:
   - Haga clic en "Agregar Repuesto"
   - Busque y seleccione el repuesto
   - Indique la cantidad
   - El sistema verificará la disponibilidad en inventario
8. Calcule y registre el presupuesto estimado.
9. Haga clic en "Guardar" para crear la orden de servicio.
10. El sistema asignará un número único a la orden y la registrará con estado "Pendiente".

### Actualizar el Estado de una Orden de Servicio

1. Busque y seleccione la orden de servicio que desea actualizar.
2. En la pantalla de detalles de la orden, haga clic en el botón "Actualizar Estado".
3. Seleccione el nuevo estado:
   - Pendiente: Esperando aprobación o inicio
   - En Progreso: Trabajo iniciado
   - En Espera: Trabajo pausado (esperando repuestos, aprobación adicional, etc.)
   - Completada: Trabajo técnico finalizado
   - Entregada: Vehículo entregado al cliente
   - Cancelada: Servicio cancelado
4. Ingrese notas o comentarios sobre la actualización.
5. Si cambia a "En Progreso", registre la hora de inicio.
6. Si cambia a "Completada", registre la hora de finalización.
7. Haga clic en "Guardar".
8. El sistema actualizará el estado y registrará el cambio en el historial.
9. Si está configurado, el sistema puede enviar notificaciones al cliente sobre el cambio de estado.

### Registrar Trabajo Realizado

1. Busque y seleccione la orden de servicio en progreso.
2. En la pantalla de detalles de la orden, vaya a la sección "Tareas".
3. Para cada tarea completada:
   - Marque la casilla de verificación
   - Registre el tiempo real utilizado
   - Agregue notas o comentarios sobre el trabajo realizado
4. Si se utilizaron repuestos adicionales:
   - Haga clic en "Agregar Repuesto"
   - Seleccione el repuesto y la cantidad
   - El sistema actualizará automáticamente el inventario
5. Si se encontraron problemas adicionales:
   - Haga clic en "Agregar Tarea"
   - Describa el nuevo problema y la solución propuesta
   - Indique si requiere aprobación adicional del cliente
6. Opcionalmente, agregue fotos o documentos:
   - Haga clic en "Agregar Archivo"
   - Seleccione o tome fotos del trabajo realizado
   - Agregue una descripción para cada archivo
7. Haga clic en "Guardar" para actualizar la orden de servicio.

### Generar Factura de Servicio

1. Busque y seleccione la orden de servicio completada.
2. Verifique que todas las tareas estén marcadas como completadas.
3. Revise todos los repuestos utilizados y sus cantidades.
4. En la pantalla de detalles de la orden, haga clic en "Generar Factura".
5. El sistema calculará automáticamente:
   - Costo de mano de obra (basado en las tareas y tiempo)
   - Costo de repuestos (basado en los repuestos utilizados)
   - Subtotal, impuestos y total
6. Revise el resumen de la factura y realice ajustes si es necesario:
   - Aplique descuentos si corresponde
   - Ajuste precios específicos si es necesario
7. Haga clic en "Confirmar Factura".
8. El sistema creará una factura en el módulo de ventas y la vinculará a la orden de servicio.
9. Puede proceder al cobro utilizando el módulo de ventas.

## Casos de Uso

### Caso 1: Programación y Realización de Mantenimiento Regular

**Escenario**: Un cliente llama para programar el mantenimiento regular de su vehículo.

**Pasos**:
1. El recepcionista accede al calendario de citas y verifica la disponibilidad.
2. Crea una nueva cita con la siguiente información:
   - Cliente: María González (cliente existente)
   - Vehículo: Honda Civic 2020 (vehículo existente)
   - Fecha: 15/07/2023, 9:00 AM
   - Duración: 2 horas
   - Tipo de servicio: Mantenimiento 10,000 km
   - Descripción: "Cambio de aceite, filtros, revisión general"
   - Técnico: Carlos Ramírez
3. Guarda la cita y envía una confirmación al cliente.
4. El día de la cita, cuando el cliente llega:
   - El recepcionista marca la cita como "Cliente Llegó"
   - Crea una orden de servicio a partir de la cita
   - Registra el kilometraje actual (10,120 km)
   - Agrega las tareas específicas del mantenimiento
   - Selecciona los repuestos necesarios (aceite, filtros)
   - Obtiene la aprobación del cliente para el presupuesto
5. El técnico asignado:
   - Actualiza el estado a "En Progreso"
   - Realiza el trabajo
   - Marca cada tarea como completada
   - Registra observaciones adicionales
   - Actualiza el estado a "Completada"
6. El recepcionista:
   - Revisa la orden completada
   - Genera la factura
   - Procesa el pago
   - Actualiza el estado a "Entregada"
   - Programa la próxima cita de mantenimiento

### Caso 2: Diagnóstico y Reparación de Problema Imprevisto

**Escenario**: Un cliente llega sin cita porque su vehículo hace un ruido extraño.

**Pasos**:
1. El recepcionista verifica la disponibilidad de un técnico para diagnóstico.
2. Crea una nueva orden de servicio directamente:
   - Registra la información del cliente y vehículo
   - Tipo de servicio: Diagnóstico
   - Descripción: "Ruido extraño al acelerar"
   - Prioridad: Media
3. El técnico realiza un diagnóstico inicial y encuentra que el problema es una polea tensora desgastada.
4. Actualiza la orden con:
   - Diagnóstico: "Polea tensora desgastada que requiere reemplazo"
   - Tarea: "Reemplazo de polea tensora y correa"
   - Repuestos necesarios: Polea tensora, correa
   - Tiempo estimado: 1.5 horas
   - Costo estimado: $180
5. El recepcionista contacta al cliente para obtener aprobación.
6. Con la aprobación del cliente, el técnico:
   - Actualiza el estado a "En Progreso"
   - Verifica la disponibilidad de los repuestos
   - Realiza la reparación
   - Documenta el trabajo con fotos antes/después
   - Marca la tarea como completada
   - Actualiza el estado a "Completada"
7. El recepcionista:
   - Contacta al cliente para informarle que el vehículo está listo
   - Genera la factura
   - Procesa el pago cuando el cliente recoge el vehículo
   - Actualiza el estado a "Entregada"

### Caso 3: Gestión de Servicio Complejo con Aprobaciones Adicionales

**Escenario**: Durante un servicio de mantenimiento programado, se descubren problemas adicionales que requieren aprobación del cliente.

**Pasos**:
1. El cliente deja su vehículo para un mantenimiento regular.
2. Durante la inspección, el técnico descubre problemas con los frenos y la suspensión.
3. El técnico actualiza la orden de servicio:
   - Mantiene las tareas originales del mantenimiento
   - Agrega nuevas tareas: "Reemplazo de pastillas de freno" y "Reemplazo de amortiguadores delanteros"
   - Marca estas tareas como "Requiere aprobación"
   - Agrega fotos de las piezas desgastadas
   - Actualiza el presupuesto con los costos adicionales
4. El sistema notifica al recepcionista sobre la actualización.
5. El recepcionista contacta al cliente:
   - Explica los problemas encontrados
   - Comparte las fotos a través del portal del cliente
   - Proporciona el nuevo presupuesto
   - Solicita aprobación
6. El cliente aprueba el reemplazo de pastillas de freno pero pospone los amortiguadores.
7. El recepcionista actualiza la orden:
   - Marca "Reemplazo de pastillas de freno" como aprobado
   - Elimina "Reemplazo de amortiguadores" o lo marca como "Pospuesto"
8. El técnico completa el mantenimiento original y el reemplazo de pastillas.
9. La orden se procesa normalmente hasta la entrega.
10. El sistema registra los trabajos pospuestos para seguimiento futuro.

### Caso 4: Seguimiento de Garantía y Historial de Servicio

**Escenario**: Un cliente regresa porque un trabajo previo presenta problemas dentro del período de garantía.

**Pasos**:
1. El cliente informa que los frenos reemplazados hace un mes están haciendo ruido.
2. El recepcionista:
   - Busca al cliente en el sistema
   - Revisa el historial de servicio
   - Identifica la orden anterior donde se reemplazaron los frenos
   - Verifica que está dentro del período de garantía (90 días)
3. Crea una nueva orden de servicio:
   - La marca como "Garantía" y la vincula a la orden original
   - Registra la descripción del problema
   - Asigna prioridad alta
4. El técnico que realizó el trabajo original (si está disponible):
   - Inspecciona el vehículo
   - Identifica que una de las pastillas está defectuosa
   - Reemplaza las pastillas defectuosas
   - Documenta el problema y la solución
5. Como es un trabajo en garantía:
   - No se generan cargos para el cliente
   - Se registra el costo interno para seguimiento de calidad
   - Se actualiza el registro del proveedor de las pastillas defectuosas
6. El sistema actualiza el historial completo del vehículo.
7. El recepcionista explica al cliente el problema encontrado y la solución implementada.
8. Se extiende la garantía por 90 días adicionales para este trabajo específico.