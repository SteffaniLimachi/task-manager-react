# Task Manager React

Aplicación de gestión de tareas (crear, completar y eliminar tareas) con frontend en React + TypeScript (Vite) y backend en Express + Prisma + PostgreSQL.

<!-- BADGE_CI -->

## 🔧 Instalación local

```bash
git clone https://github.com/SteffaniLimachi/task-manager-react.git
cd task-manager-react

# Frontend
npm install

# Backend
cd backend
npm install
```

### Variables de entorno

Crea un archivo `.env` en la raíz del proyecto (frontend) con las siguientes claves (sin valores reales en este documento):

```
VITE_API_URL=
```

Crea un archivo `.env` en `backend/` con las siguientes claves:

```
DATABASE_URL=
PORT=
FRONTEND_URL=
```

## 📄 Comandos disponibles

**Frontend** (raíz del proyecto):

| Comando         | Descripción                              |
|-----------------|-------------------------------------------|
| `npm run dev`   | Levanta el entorno de desarrollo          |
| `npm run build` | Genera el build de producción             |
| `npm run lint`  | Corre el linter (ESLint)                  |
| `npm run preview` | Sirve el build de producción localmente |

**Backend** (`backend/`):

| Comando         | Descripción                                    |
|-----------------|--------------------------------------------------|
| `npm run dev`   | Levanta el servidor de desarrollo (ts-node-dev)  |
| `npm run build` | Compila TypeScript a `dist/`                     |
| `npm start`     | Corre el servidor compilado                      |

## 🗄️ Base de datos

PostgreSQL con esquema y cliente gestionados con Prisma (`backend/prisma/schema.prisma`). El modelo principal es `tasks` (`id`, `text`, `completed`). `prisma generate` se ejecuta automáticamente en el `postinstall` del backend.

## 🐳 Levantar todo con Docker Compose

Requiere Docker Engine + plugin de Compose (`docker compose version`). No necesitas instalar Node, PostgreSQL ni ejecutar `npm install` manualmente.

```bash
cp .env.example .env
docker compose up --build
```

La primera vez, en otra terminal, aplica las migraciones de Prisma:

```bash
docker compose exec backend npx prisma migrate deploy
```

Luego abre `http://localhost:5173`. El backend queda expuesto en `http://localhost:4000` y PostgreSQL en el puerto `5432`.

Para detener los contenedores conservando los datos: `docker compose down`. Para borrar también el volumen de PostgreSQL: `docker compose down -v`.