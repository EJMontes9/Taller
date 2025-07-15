# 5.3.1. Módulo de Autenticación

El Módulo de Autenticación es el punto de entrada al sistema de Gestión de Taller y proporciona todas las funcionalidades relacionadas con el acceso y la seguridad del sistema.

## Capturas de Pantalla

### Pantalla de Inicio de Sesión

![Pantalla de inicio de sesión](../images/auth-login-screen.png)

La pantalla de inicio de sesión incluye:
1. Campo para nombre de usuario o correo electrónico
2. Campo para contraseña
3. Casilla "Recordarme" para mantener la sesión activa
4. Botón de inicio de sesión
5. Enlace para recuperación de contraseña

### Pantalla de Recuperación de Contraseña

![Pantalla de recuperación de contraseña](../images/auth-recovery-screen.png)

La pantalla de recuperación de contraseña incluye:
1. Campo para ingresar el correo electrónico asociado a la cuenta
2. Botón para enviar correo de recuperación
3. Enlace para volver a la pantalla de inicio de sesión

### Pantalla de Perfil de Usuario

![Pantalla de perfil de usuario](../images/auth-profile-screen.png)

La pantalla de perfil de usuario incluye:
1. Información personal del usuario
2. Opciones para editar el perfil
3. Sección para cambiar la contraseña
4. Preferencias de notificaciones
5. Historial de actividad reciente

## Flujos de Trabajo

### Iniciar Sesión en el Sistema

1. Abra su navegador web e ingrese la URL del sistema.
2. En la pantalla de inicio de sesión, ingrese su nombre de usuario o correo electrónico.
3. Ingrese su contraseña.
4. (Opcional) Marque la casilla "Recordarme" si desea mantener la sesión activa.
5. Haga clic en el botón "Iniciar Sesión".
6. Si las credenciales son correctas, será redirigido al dashboard del sistema.
7. Si las credenciales son incorrectas, se mostrará un mensaje de error.

### Recuperar Contraseña Olvidada

1. En la pantalla de inicio de sesión, haga clic en "¿Olvidó su contraseña?".
2. Ingrese el correo electrónico asociado a su cuenta.
3. Haga clic en "Enviar correo de recuperación".
4. Recibirá un mensaje de confirmación indicando que se ha enviado un correo electrónico.
5. Abra su correo electrónico y busque el mensaje de recuperación de contraseña.
6. Haga clic en el enlace proporcionado en el correo electrónico.
7. En la nueva página, ingrese y confirme su nueva contraseña.
8. Haga clic en "Guardar nueva contraseña".
9. Será redirigido a la pantalla de inicio de sesión con un mensaje de éxito.

### Actualizar Perfil de Usuario

1. Inicie sesión en el sistema.
2. Haga clic en su nombre de usuario en la esquina superior derecha.
3. Seleccione "Mi Perfil" en el menú desplegable.
4. En la pantalla de perfil, haga clic en "Editar Perfil".
5. Actualice la información que desee cambiar.
6. Haga clic en "Guardar Cambios".
7. Se mostrará un mensaje de confirmación indicando que los cambios se han guardado correctamente.

### Cambiar Contraseña

1. Inicie sesión en el sistema.
2. Haga clic en su nombre de usuario en la esquina superior derecha.
3. Seleccione "Mi Perfil" en el menú desplegable.
4. En la pantalla de perfil, vaya a la sección "Seguridad" o haga clic en "Cambiar Contraseña".
5. Ingrese su contraseña actual.
6. Ingrese y confirme su nueva contraseña.
7. Haga clic en "Actualizar Contraseña".
8. Se mostrará un mensaje de confirmación indicando que la contraseña se ha actualizado correctamente.

### Cerrar Sesión

1. Haga clic en su nombre de usuario en la esquina superior derecha.
2. Seleccione "Cerrar Sesión" en el menú desplegable.
3. Será redirigido a la pantalla de inicio de sesión.

## Casos de Uso

### Caso 1: Primer Inicio de Sesión

**Escenario**: Un nuevo empleado ha recibido sus credenciales de acceso y necesita iniciar sesión por primera vez.

**Pasos**:
1. El empleado recibe un correo electrónico con su nombre de usuario y una contraseña temporal.
2. Accede a la URL del sistema e ingresa las credenciales proporcionadas.
3. El sistema detecta que es el primer inicio de sesión y solicita al empleado que cambie su contraseña.
4. El empleado ingresa y confirma una nueva contraseña que cumple con los requisitos de seguridad.
5. El sistema solicita al empleado que complete su perfil con información adicional.
6. El empleado completa la información requerida y guarda los cambios.
7. El sistema redirige al empleado al dashboard con un mensaje de bienvenida.

### Caso 2: Recuperación de Cuenta Bloqueada

**Escenario**: Un usuario ha ingresado incorrectamente su contraseña varias veces y su cuenta ha sido bloqueada temporalmente.

**Pasos**:
1. El usuario intenta iniciar sesión pero recibe un mensaje indicando que su cuenta está bloqueada.
2. El usuario hace clic en "¿Olvidó su contraseña?" para iniciar el proceso de recuperación.
3. Ingresa su correo electrónico y solicita el correo de recuperación.
4. Sigue el enlace en el correo electrónico para restablecer su contraseña.
5. Establece una nueva contraseña y vuelve a iniciar sesión.
6. El sistema desbloquea automáticamente la cuenta y permite el acceso.

### Caso 3: Actualización de Información de Contacto

**Escenario**: Un usuario necesita actualizar su número de teléfono y dirección de correo electrónico.

**Pasos**:
1. El usuario inicia sesión y accede a su perfil.
2. En la sección de información personal, hace clic en "Editar".
3. Actualiza su número de teléfono y dirección de correo electrónico.
4. El sistema solicita verificación de la nueva dirección de correo electrónico.
5. El usuario recibe un correo de verificación en la nueva dirección y hace clic en el enlace de confirmación.
6. El sistema actualiza la información y muestra un mensaje de confirmación.

### Caso 4: Configuración de Preferencias de Notificación

**Escenario**: Un usuario desea personalizar qué notificaciones recibe y cómo las recibe.

**Pasos**:
1. El usuario inicia sesión y accede a su perfil.
2. Navega a la sección "Preferencias de Notificación".
3. Configura qué eventos generan notificaciones (nuevas órdenes, actualizaciones de inventario, etc.).
4. Selecciona los métodos de notificación preferidos (correo electrónico, notificaciones en el sistema, etc.).
5. Establece la frecuencia de las notificaciones (inmediatas, resumen diario, etc.).
6. Guarda los cambios.
7. El sistema confirma que las preferencias han sido actualizadas.