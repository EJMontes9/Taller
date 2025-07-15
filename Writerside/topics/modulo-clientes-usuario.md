# 5.3.2. Módulo de Clientes

El Módulo de Clientes permite gestionar toda la información relacionada con los clientes del taller, incluyendo sus datos personales, vehículos asociados e historial de servicios.

## Capturas de Pantalla

### Lista de Clientes

![Lista de clientes](../images/clients-list-screen.png)

La pantalla de lista de clientes incluye:
1. Barra de búsqueda para filtrar clientes
2. Botón para agregar nuevo cliente
3. Tabla con información básica de los clientes
4. Opciones para ver detalles, editar o eliminar cada cliente
5. Controles de paginación

### Formulario de Cliente

![Formulario de cliente](../images/client-form-screen.png)

El formulario de cliente incluye:
1. Campos para información personal (nombre, apellido, correo electrónico, teléfono)
2. Campos para dirección
3. Campos para información adicional (fecha de nacimiento, documento de identidad)
4. Sección para notas o comentarios
5. Botones para guardar o cancelar

### Detalles del Cliente

![Detalles del cliente](../images/client-details-screen.png)

La pantalla de detalles del cliente incluye:
1. Información personal del cliente
2. Lista de vehículos asociados
3. Historial de servicios
4. Historial de compras
5. Opciones para editar información, agregar vehículo o registrar servicio

## Flujos de Trabajo

### Registrar un Nuevo Cliente

1. En la pantalla de lista de clientes, haga clic en el botón "Nuevo Cliente".
2. Complete los campos obligatorios del formulario (marcados con asterisco *):
   - Nombre
   - Apellido
   - Correo electrónico o teléfono
3. Complete los campos opcionales según sea necesario:
   - Dirección
   - Fecha de nacimiento
   - Documento de identidad
   - Notas
4. Haga clic en "Guardar".
5. El sistema registrará el nuevo cliente y mostrará un mensaje de confirmación.
6. Será redirigido a la pantalla de detalles del cliente recién creado.

### Buscar un Cliente

1. En la pantalla de lista de clientes, utilice la barra de búsqueda en la parte superior.
2. Puede buscar por:
   - Nombre o apellido
   - Correo electrónico
   - Teléfono
   - Número de documento
3. Ingrese el término de búsqueda y presione Enter o haga clic en el icono de búsqueda.
4. La tabla se actualizará mostrando los clientes que coinciden con su búsqueda.
5. Para ver los detalles de un cliente, haga clic en el botón "Ver" o en el nombre del cliente.

### Editar Información de un Cliente

1. Busque y seleccione el cliente que desea editar.
2. En la pantalla de detalles del cliente, haga clic en el botón "Editar".
3. Actualice la información necesaria en el formulario.
4. Haga clic en "Guardar" para confirmar los cambios.
5. El sistema actualizará la información y mostrará un mensaje de confirmación.

### Asociar un Vehículo a un Cliente

1. Busque y seleccione el cliente al que desea asociar un vehículo.
2. En la pantalla de detalles del cliente, vaya a la sección "Vehículos".
3. Haga clic en el botón "Agregar Vehículo".
4. Complete el formulario de vehículo con la información requerida:
   - Marca
   - Modelo
   - Año
   - Color
   - Número de placa o VIN
5. Haga clic en "Guardar".
6. El vehículo aparecerá en la lista de vehículos asociados al cliente.

### Ver Historial de Servicios de un Cliente

1. Busque y seleccione el cliente cuyo historial desea consultar.
2. En la pantalla de detalles del cliente, vaya a la sección "Historial de Servicios".
3. Verá una lista de todos los servicios realizados para este cliente.
4. Puede filtrar el historial por fecha o tipo de servicio utilizando los controles de filtro.
5. Para ver los detalles de un servicio específico, haga clic en el botón "Ver" o en la descripción del servicio.

## Casos de Uso

### Caso 1: Registro de Nuevo Cliente con Vehículo

**Escenario**: Un nuevo cliente llega al taller para realizar un servicio a su vehículo y necesita ser registrado en el sistema.

**Pasos**:
1. El recepcionista hace clic en "Nuevo Cliente" en la pantalla de lista de clientes.
2. Completa la información personal del cliente:
   - Nombre: Juan
   - Apellido: Pérez
   - Teléfono: 555-1234
   - Correo electrónico: juan.perez@ejemplo.com
3. Guarda la información del cliente.
4. En la pantalla de detalles del cliente, hace clic en "Agregar Vehículo".
5. Completa la información del vehículo:
   - Marca: Toyota
   - Modelo: Corolla
   - Año: 2020
   - Color: Azul
   - Placa: ABC-123
6. Guarda la información del vehículo.
7. El sistema muestra el cliente con su vehículo asociado, listo para registrar un servicio.

### Caso 2: Búsqueda de Cliente Recurrente

**Escenario**: Un cliente recurrente llega al taller y el recepcionista necesita encontrar su registro para verificar su historial.

**Pasos**:
1. El recepcionista pregunta el nombre o teléfono del cliente.
2. En la pantalla de lista de clientes, ingresa el nombre "González" en la barra de búsqueda.
3. El sistema muestra varios resultados con ese apellido.
4. El recepcionista refina la búsqueda agregando el nombre "María".
5. El sistema muestra el registro de María González.
6. El recepcionista hace clic en el nombre para ver los detalles.
7. Revisa el historial de servicios para verificar cuándo fue la última visita y qué servicios se realizaron.
8. Confirma con el cliente que la información es correcta y procede a registrar el nuevo servicio.

### Caso 3: Actualización de Información de Contacto

**Escenario**: Un cliente informa que ha cambiado su número de teléfono y dirección.

**Pasos**:
1. El recepcionista busca al cliente por su nombre o correo electrónico.
2. En la pantalla de detalles del cliente, hace clic en "Editar".
3. Actualiza el número de teléfono y la dirección con la nueva información.
4. Guarda los cambios.
5. El sistema actualiza la información y muestra un mensaje de confirmación.
6. El recepcionista confirma con el cliente que la información ha sido actualizada correctamente.

### Caso 4: Consulta de Historial de Servicios para Mantenimiento Programado

**Escenario**: Un cliente llama para consultar cuándo fue el último cambio de aceite de su vehículo y programar el siguiente.

**Pasos**:
1. El recepcionista busca al cliente por su nombre o teléfono.
2. En la pantalla de detalles del cliente, va a la sección "Historial de Servicios".
3. Filtra los servicios por tipo "Cambio de aceite".
4. Identifica la fecha del último servicio y verifica el kilometraje registrado.
5. Basándose en esta información, recomienda al cliente cuándo debería realizar el próximo cambio de aceite.
6. Si el cliente desea programar el servicio, el recepcionista procede a crear una nueva cita utilizando el módulo de Servicios.