# Edukiato - Plataforma Educativa Moderna (MVP)

## Visión
Edukiato es una plataforma de gestión educativa fresca, ligera y centrada en las personas, diseñada específicamente para instituciones terciarias de arte y talleres de oficios. A diferencia de los ERPs pesados, Edukiato se enfoca en las interacciones diarias entre instructores y estudiantes, ofreciendo una interfaz visual e intuitiva.

## Stack Tecnológico (Monorepo)
*   **Frontend**: React, TypeScript, Vite, Tailwind CSS, Recharts, Lucide Icons.
*   **Backend**: Node.js, NestJS.
*   **Base de Datos**: PostgreSQL.
*   **Infraestructura**: Docker Compose, compatible con Coolify.

## Estructura del Proyecto
```
/
├── backend/       # Código fuente de la API (NestJS)
├── frontend/      # Aplicación Web (React + Vite)
├── db/            # Scripts SQL (Schema + Seed para inicio rápido)
├── docker-compose.yml # Orquestación de servicios
├── DEPLOY.md      # Guía de despliegue en producción
└── README.md      # Este archivo
```

## Cómo correr localmente (Desarrollo)

### Frontend solo
1.  Entrar a la carpeta: `cd frontend`
2.  Instalar dependencias: `npm install`
3.  Correr servidor: `npm run dev`
4.  Abrir: `http://localhost:5173`

### Stack completo con Docker (Recomendado)
Para levantar Frontend + Backend + Base de Datos con datos de prueba:

```bash
docker-compose up --build
```
*   **Frontend**: `http://localhost:8000`
*   **Backend API**: `http://localhost:3000`
*   **Credenciales Demo**:
    *   Admin: `admin@edukiato.edu` / `password`
    *   Profesor: `elena@edukiato.edu` / `password`
    *   Estudiante: `sofia@student.com` / `password`

## Licencia
MIT