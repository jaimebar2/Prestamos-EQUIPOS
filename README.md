# 🖥️ Sistema de Préstamo de Equipos

Sistema full-stack para gestionar préstamos de equipos en universidades/laboratorios.

- **Frontend:** React + Vite → Vercel
- **Backend:** Node.js + Express → Railway
- **Base de datos:** PostgreSQL → Neon

---

## 📁 Estructura

```
prestamo-equipos/
├── backend/
│   ├── src/
│   │   ├── config/db.js          ← Conexión Neon
│   │   ├── controllers/          ← Lógica de negocio
│   │   ├── middleware/auth.js    ← JWT middleware
│   │   └── routes/               ← Rutas API
│   ├── schema.sql                ← Script BD
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── App.jsx               ← App completa
    │   └── services/api.js       ← Llamadas al backend
    ├── .env.example
    └── package.json
```

---

## 🗄️ Paso 1 — Crear base de datos en Neon

1. Ve a [neon.tech](https://neon.tech) y crea una cuenta gratuita
2. Crea un nuevo proyecto llamado `prestamos`
3. En el **SQL Editor**, pega y ejecuta el contenido de `backend/schema.sql`
4. Copia la **Connection string** (formato `postgresql://user:pass@host/db?sslmode=require`)

---

## 🚂 Paso 2 — Deploy del Backend en Railway

1. Ve a [railway.app](https://railway.app) y conecta tu cuenta de GitHub
2. Crea un nuevo proyecto → **Deploy from GitHub repo**
3. Selecciona el repositorio y configura el **Root Directory** como `backend`
4. En la pestaña **Variables**, agrega:

| Variable       | Valor                                      |
|----------------|--------------------------------------------|
| `DATABASE_URL` | Tu connection string de Neon               |
| `JWT_SECRET`   | Una cadena aleatoria larga (min. 32 chars) |
| `FRONTEND_URL` | (dejar vacío por ahora, llenar después)    |

5. Railway detecta el `package.json` y ejecuta `npm start` automáticamente
6. Copia la URL pública que genera Railway (ej: `https://xxx.up.railway.app`)

---

## ▲ Paso 3 — Deploy del Frontend en Vercel

1. Ve a [vercel.com](https://vercel.com) y conecta tu cuenta de GitHub
2. Crea un nuevo proyecto → selecciona el repositorio
3. Configura:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
4. En **Environment Variables** agrega:

| Variable       | Valor                                      |
|----------------|--------------------------------------------|
| `VITE_API_URL` | `https://tu-url.up.railway.app/api`        |

5. Deploy → copia la URL de Vercel

---

## 🔗 Paso 4 — Conectar frontend ↔ backend

1. Vuelve a Railway → Variables
2. Actualiza `FRONTEND_URL` con la URL de Vercel (para CORS)
3. Redeploy del backend

---

## 🔑 Credenciales por defecto

El `schema.sql` crea un admin inicial:

- **Correo:** `admin@prestamos.com`
- **Contraseña:** `password` (cámbiala después)

> ⚠️ El hash en schema.sql corresponde a `password`. Cámbiala desde la DB o creando un nuevo hash con bcrypt.

---

## 🔐 Flujo de solicitudes

```
Usuario                    Admin
   │                          │
   ├─ Se registra             │
   ├─ Ve equipos disponibles  │
   ├─ Envía solicitud ────────►│
   │                          ├─ Ve solicitud (pendiente)
   │                          ├─ Aprueba o rechaza
   │◄──────────────── Estado actualizado
   ├─ Ve estado en "Mis solicitudes"
```

---

## 🛠️ Desarrollo local

```bash
# Backend
cd backend
cp .env.example .env   # Llena las variables
npm install
npm run dev            # http://localhost:3000

# Frontend (otra terminal)
cd frontend
cp .env.example .env   # VITE_API_URL=http://localhost:3000/api
npm install
npm run dev            # http://localhost:5173
```

---

## 📡 API Endpoints

| Método | Ruta                      | Acceso   | Descripción                    |
|--------|---------------------------|----------|--------------------------------|
| POST   | /api/auth/login           | Público  | Iniciar sesión                 |
| POST   | /api/auth/registro        | Público  | Crear cuenta                   |
| GET    | /api/equipos              | Auth     | Listar equipos                 |
| GET    | /api/solicitudes          | Auth     | Ver solicitudes (propias/todas)|
| POST   | /api/solicitudes          | Auth     | Crear solicitud                |
| PUT    | /api/solicitudes/:id      | Admin    | Aprobar/rechazar/devolver      |
