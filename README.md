# Cloudinary Express API

Este proyecto es una API Backend robusta construida con Node.js y Express, diseñada para gestionar autenticación de usuarios y la subida segura de imágenes a la nube.

## Descripción General

El sistema permite a los usuarios registrarse e iniciar sesión de forma segura. Una vez autenticados, obtienen acceso a funcionalidades protegidas, como la subida de archivos de imagen. Las imágenes se almacenan en el servicio Cloudinary, mientras que sus metadatos se guardan en una base de datos PostgreSQL local.

La arquitectura sigue las mejores prácticas de separación de responsabilidades (Controladores, Servicios, Rutas) y seguridad (Hashing, JWT).

## Tecnologías Utilizadas

*   **Node.js & Express**: El núcleo del servidor y manejo de rutas HTTP.
*   **Prisma ORM**: Para la interacción eficiente y tipada con la base de datos.
*   **PostgreSQL**: Base de datos relacional para guardar usuarios y registros de archivos.
*   **Cloudinary**: Servicio en la nube para el almacenamiento y gestión de imágenes.
*   **Multer**: Middleware para gestionar la recepción de archivos en las peticiones.
*   **JSON Web Token (JWT)**: Estándar para la autenticación segura y sin estado (stateless).
*   **Bcrypt**: Librería para el cifrado (hashing) seguro de contraseñas.
*   **Jest & Supertest**: Frameworks para realizar pruebas automatizadas del sistema.

## Funcionalidades Principales

1.  **Autenticación Segura**: Registro de nuevos usuarios con validación de duplicados y encriptación de contraseñas. Inicio de sesión que emite credenciales temporales (Tokens).
2.  **Protección de Rutas**: Sistema de "guardianes" (Middleware) que impide el acceso a recursos sensibles a usuarios no identificados.
3.  **Gestión de Archivos**:
    *   Subida de imágenes desde el cliente al servidor.
    *   Transferencia automática a la nube (Cloudinary).
    *   Listado público de archivos disponibles (solo información básica).
    *   Recuperación privada de detalles completos y enlaces de descarga.

## Rutas Disponibles

### Autenticación
*   **Registro**: Permite crear una nueva cuenta de usuario proporcionando nombre, correo y contraseña.
*   **Iniciar Sesión**: Valida las credenciales del usuario y devuelve un Token de acceso necesario para las rutas privadas.

### Imágenes (Upload)
*   **Listar Archivos**: Ruta pública que muestra una lista de todos los archivos subidos, restringiendo la información visible solo al ID y nombre original.
*   **Subir Imagen** (Privada): Permite a un usuario autenticado enviar un archivo de imagen para ser almacenado en la nube.
*   **Obtener Detalles** (Privada): Permite obtener la información completa de una imagen específica, incluyendo su URL de descarga, proporcionando su ID. Requiere autenticación.

### Utilidades
*   **Ruta Segura de Prueba**: Un endpoint simple para verificar que el sistema de seguridad/tokens funciona correctamente.
