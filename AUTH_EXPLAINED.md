# Explicación de la Lógica de Autenticación

Este documento describe conceptualmente cómo funciona el sistema de autenticación implementado en el proyecto, cubriendo los flujos de registro, inicio de sesión (login) y acceso seguro, así como los conceptos clave de seguridad utilizados.

## Conceptos Clave

### 1. Hashing de Contraseñas (Bcrypt)
Nunca guardamos las contraseñas "en texto plano" (tal cual las escribe el usuario) en la base de datos. Si alguien accediera a la base de datos, tendría acceso a todas las cuentas.
*   **¿Qué hacemos?** Utilizamos una función llamada "Hashing" (en nuestro caso, la librería **bcrypt**).
*   **Funcionamiento:** Esta función transforma la contraseña ej: `miPassword123` en una cadena de caracteres aleatoria y larga ej: `$2b$10$EixZAYVK...`. Esta transformación es **unidireccional**, no se puede volver a la contraseña original desde el hash.
*   **Verificación:** Cuando el usuario intenta entrar, "hasheamos" la contraseña que acaba de escribir y la comparamos con el hash guardado en la base de datos. Si coinciden, la contraseña es correcta.

### 2. JWT (JSON Web Token)
Es la "credencial" digital que le damos al usuario una vez que ha probado quién es (se ha logueado exitosamente).
*   **¿Qué es?** Un string largo cifrado que contiene información (payload) como el ID del usuario y su email.
*   **Firma Digital:** El token está firmado con una "Clave Secreta" (JWT_SECRET) que solo conoce el servidor. Esto garantiza que nadie pueda modificar el token (ej: cambiar el ID de usuario) sin que el servidor se de cuenta.
*   **Sin Estado (Stateless):** El servidor no necesita guardar una "sesión" en memoria. Cuando llega una petición, solo verifica que el token sea válido y tenga una firma correcta.

---

## Flujos de la Aplicación

### A. Registro de Usuario (Sign Up)
El objetivo es crear una nueva cuenta segura.

1.  **Recepción:** El usuario envía `username`, `email` y `password`.
2.  **Validación de Existencia:** El sistema verifica en la base de datos si ya existe un usuario con ese email o username. Si existe, rechaza el registro para evitar duplicados.
3.  **Protección (Hashing):** El sistema toma la `password` y la convierte en un hash seguro usando **bcrypt**.
4.  **Almacenamiento:** Se guarda el usuario en la base de datos, pero **solo guardamos el hash**, nunca la contraseña real.
5.  **Respuesta:** Se confirma que el usuario fue creado.

### B. Inicio de Sesión (Login)
El objetivo es validar la identidad y entregar una credencial de acceso (Token).

1.  **Recepción:** El usuario envía `email` y `password`.
2.  **Búsqueda:** El sistema busca al usuario por su email. Si no existe, error.
3.  **Verificación:** El sistema compara la contraseña recibida (convirtiéndola a hash) contra el hash guardado en la base de datos.
4.  **Generación de Token:** Si la contraseña es correcta, el sistema genera un **JWT**.
    *   Le pone fecha de expiración (ej: 1 hora).
    *   Inc rusta datos básicos (ID del usuario).
    *   Lo firma con la clave secreta.
5.  **Entrega:** Se devuelve el **Token** al usuario. El usuario debe guardar este token (ej: en el almacenamiento local del navegador) para usarlo después.

### C. Acceso a Rutas Protegidas
El objetivo es acceder a recursos privados (ej: `/index/secure`) usando la credencial obtenida.

1.  **Petición:** El usuario quiere ver una página privada. Su navegador envía la solicitud incluyendo el **Token JWT** en la cabecera (Header: `Authorization: Bearer <token>`).
2.  **Middleware de Seguridad:** Antes de llegar a la lógica de la ruta, un "guardia" (Middleware) intercepta la petición.
3.  **Verificación del Token:** El guardia revisa el token:
    *   ¿Existe el token?
    *   ¿Ha sido firmado por nosotros (es auténtico)?
    *   ¿Ha caducado?
4.  **Decisión:**
    *   **Válido:** El guardia deja pasar la petición y le adjunta los datos del usuario. El controlador responde con la información privada.
    *   **Inválido/Faltante:** El guardia bloquea el paso y responde con error `401 Unauthorized` (No autorizado) o `403 Forbidden` (Prohibido).
