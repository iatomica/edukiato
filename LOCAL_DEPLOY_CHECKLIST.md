# Edukiato - Local + Coolify checklist

## 1) Prueba local (backend + frontend)

### Backend

```bash
cd backend
npm install
npm run build
npm run start:prod
```

El backend queda en `http://localhost:3001`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend queda en `http://localhost:3002` (Vite) y proxyea `/api` al backend.

---

## 2) Verificación rápida de auth

Credenciales probadas:

- `seilarg@hotmail.com`
- `vinculos`

Prueba en PowerShell:

```powershell
$loginBody = @{ email = 'seilarg@hotmail.com'; password = 'vinculos' } | ConvertTo-Json
$login = Invoke-RestMethod -Method Post -Uri 'http://localhost:3001/api/auth/login' -ContentType 'application/json' -Body $loginBody
$token = $login.token
Invoke-RestMethod -Method Get -Uri 'http://localhost:3001/api/auth/me' -Headers @{ Authorization = "Bearer $token" }
```

Esperado: respuesta con `id/userId`, `email`, `role`, `institutionId`.

---

## 3) Variables de entorno backend

El backend soporta dos modos de conexión:

### Opción A (recomendada para Coolify)

- `DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DBNAME`

### Opción B (actual local)

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

Además:

- `JWT_SECRET`
- `PORT` (por ejemplo `3001`)
- `DB_SSL=true` (si tu proveedor exige SSL)

---

## 4) Coolify - mínimo necesario

En el servicio del backend configurar:

- `PORT=3001`
- `JWT_SECRET=<valor fuerte>`
- `DATABASE_URL=<connection string de Postgres>`
- `DB_SSL=true` (si aplica)

Comando de build:

- `npm run build`

Comando de start:

- `npm run start:prod`

Health check recomendado:

- `GET /api/auth/me` (con token) o endpoint público si luego agregan uno de health.

---

## 5) Estado actual relevante

- Auth JWT funcional y verificado localmente.
- `users`, `institutions`, `reports` migrados a PostgreSQL.
- Frontend ya no usa token `dummy` en Layout/Dashboard y dejó de hidratar estado inicial desde mocks.
- Backend carga `.env` de forma consistente para evitar drift entre firmado y verificación JWT.
