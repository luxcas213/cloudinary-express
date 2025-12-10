# Guía de Cloudinary

Hemos integrado Cloudinary para subir imágenes de forma segura.

## 1. Configuración Previa

Asegúrate de tener en tu archivo `.env` las credenciales correctas:
```
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```
*(Puedes obtenerlas en tu Dashboard de Cloudinary)*.

## 2. Cómo Probar (Postman)

La ruta es **protegida**, así que necesitas un Token válido (haz login primero).

*   **Método:** `POST`
*   **URL:** `http://localhost:3000/upload`
*   **Headers:**
    *   `Authorization`: `Bearer <TU_TOKEN_AQUI>`
*   **Body:**
    *   Selecciona `form-data`.
    *   **Key:** `image` (Tipo: `File`).
    *   **Value:** (Sube un archivo de imagen desde tu PC).

## 3. ¿Cómo funciona?

1.  **Recepción:** El middleware `multer` intercepta el archivo en la memoria (RAM).
2.  **Streaming:** El servicio `src/services/upload.js` abre un "tubo" (stream) directo hacia Cloudinary y envía los datos del archivo.
3.  **Respuesta Cloudinary:** Al terminar, Cloudinary devuelve la URL segura (`secure_url`) y el ID público.
4.  **Base de Datos:** Guardamos esa URL y metadatos en nuestra tabla `Upload` usando Prisma.
5.  **Respuesta Final:** El servidor responde con la información de la imagen guardada.
