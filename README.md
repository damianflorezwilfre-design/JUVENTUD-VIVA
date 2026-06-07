# JUVENTUD VIVA - Plataforma Web Institucional

Plataforma full-stack moderna desarrollada para la fundación **JUVENTUD VIVA**, enfocada en el desarrollo juvenil, empoderamiento y liderazgo.

## Tecnologías Utilizadas

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS v4, Framer Motion, TypeScript
- **Backend**: API Routes (Next.js Node.js environment)
- **Autenticación**: JWT (con `jose`) y `bcryptjs`
- **Base de Datos**: PostgreSQL y Prisma ORM
- **Iconos**: Lucide React

## Requisitos Previos

- Node.js (v18 o superior)
- PostgreSQL (funcionando localmente o en un servicio cloud)

## Configuración del Proyecto

1. **Instalar Dependencias**
   Abre una terminal en la raíz del proyecto y ejecuta:
   ```bash
   npm install
   ```

2. **Configurar Variables de Entorno**
   Crea o edita el archivo `.env` en la raíz del proyecto e ingresa tu URL de PostgreSQL.
   ```env
   DATABASE_URL="postgresql://USUARIO:CONTRASEÑA@localhost:5432/juventud_viva?schema=public"
   JWT_SECRET="supersecret_juventud_viva_2026_change_me_in_production"
   ```

3. **Configurar Base de Datos (Prisma)**
   Sincroniza el esquema con tu base de datos:
   ```bash
   npx prisma db push
   ```
   *Nota: También puedes usar `npx prisma migrate dev` si prefieres mantener un historial de migraciones.*

4. **Sembrar (Seed) Usuario Administrador**
   Genera el usuario administrador por defecto (`admin` / `Admin123*`):
   ```bash
   npm run prisma db seed
   ```

## Ejecución Local

Para iniciar el servidor de desarrollo:
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la plataforma pública.

## Acceso al Panel Administrativo

- **URL:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Usuario:** `admin`
- **Contraseña:** `Admin123*`

## Estructura Principal de Carpetas

- `/src/app`: Vistas y rutas de Next.js (Públicas y `/admin`).
- `/src/app/api`: Endpoints del backend.
- `/src/components`: Componentes reutilizables (Navbar, Footer, etc.).
- `/src/lib`: Utilidades (Conexión a Prisma, Autenticación JWT).
- `/prisma`: Esquema de la base de datos y script de seed.
- `/public`: Archivos estáticos e imágenes.

---
*Desarrollado con ♥ para JUVENTUD VIVA*
