# Guía de Despliegue: Artis Platform

Esta guía cubre cómo desplegar el monorepo de Artis en un VPS (Hetzner, DigitalOcean, etc.) utilizando **Coolify**.

## 1. Prerrequisitos

*   Un **Servidor VPS** (Ubuntu 22.04 o similar).
*   **Coolify** instalado en tu servidor.
    *   Comando de instalación: `curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash`
*   Un dominio apuntando a la IP de tu servidor (ej: `app.midominio.com`).
*   Este repositorio subido a GitHub/GitLab.

## 2. Preparación del Proyecto

Asegúrate de que tu repositorio tenga la estructura correcta en la raíz:
*   `/backend` (con su Dockerfile)
*   `/frontend` (con su Dockerfile y nginx.conf)
*   `/db` (con schema.sql y seed.sql)
*   `docker-compose.yml`

## 3. Despliegue en Coolify

1.  **Crear Nuevo Recurso**:
    *   Ve a tu proyecto en Coolify.
    *   Click en **+ New Resource**.
    *   Selecciona **Docker Compose**.

2.  **Seleccionar Fuente**:
    *   Elige tu repositorio de Git.
    *   Rama: `main` (o la que uses).
    *   Coolify detectará automáticamente el archivo `docker-compose.yml`.

3.  **Configuración de Servicios**:
    *   Coolify leerá el compose y mostrará los servicios (`frontend`, `backend`, `db`).
    *   **Dominios**:
        *   Configura tu dominio (ej: `https://app.midominio.com`) en el servicio **frontend**.
        *   Asegúrate de que el puerto expuesto en la config de Coolify para frontend sea el `80` (que es lo que expone Nginx internamente).

4.  **Variables de Entorno (Secrets)**:
    *   Ve a la pestaña "Environment Variables" / "Secrets" en Coolify.
    *   Agrega las claves basándote en `.env.example`:
        *   `DB_USER`: (ej: `artis_admin`)
        *   `DB_PASSWORD`: (Genera una contraseña fuerte)
        *   `DB_NAME`: `artis_db`
        *   `JWT_SECRET`: (Genera un string aleatorio largo)

5.  **Build & Deploy**:
    *   Haz click en **Deploy**.
    *   Coolify realizará lo siguiente:
        1.  Clonar el repo.
        2.  Construir la imagen de Frontend (Node build -> Nginx).
        3.  Construir la imagen de Backend (NestJS build).
        4.  Levantar Postgres y ejecutar automáticamente los scripts de `/db` para crear las tablas y datos semilla.
        5.  Iniciar el proxy reverso para que tu dominio funcione con SSL automático.

## 4. Verificación Post-Deploy

1.  **Logs**: Revisa la pestaña "Logs" del servicio `backend` en Coolify. Deberías ver "Nest application successfully started".
2.  **Acceso Web**: Navega a tu dominio `https://app.midominio.com`.
3.  **Prueba de Login**: Ingresa con `admin@artis.edu` (password: `password` o el hash que hayas configurado en el seed).

## 5. Solución de Problemas Comunes

*   **Error de conexión a Base de Datos**:
    *   Verifica que la variable `DATABASE_URL` en el backend apunte al nombre del servicio de docker (`db`), no a `localhost`.
    *   Correcto: `postgres://user:pass@db:5432/db_name`
*   **Error 404 al recargar página**:
    *   Asegúrate de que el archivo `frontend/nginx.conf` esté presente y tenga la directiva `try_files $uri $uri/ /index.html;`.

## 6. Backups

*   En Coolify, ve al servicio `db`.
*   Activa la pestaña **Backups**.
*   Configura un backup diario (S3 compatible o local) para asegurar los datos de la institución.