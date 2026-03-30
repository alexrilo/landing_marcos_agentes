# Landing Page + Admin Panel - Marcos Fisioterapia

Sistema completo de landing page con panel de administración para gestionar contenido sin código.

## 🏗️ Arquitectura

```
landing-marcos-agentes/
├── index2.html              # Landing page (versión desplegada)
├── styles.css               # Estilos landing
├── content.json             # DATOS CENTRALIZADOS (editable por admin)
├── script.js                # Lógica landing
│
├── admin-backend/           # API Node.js/Express (Vercel)
│   ├── server.js            # Servidor principal
│   ├── package.json
│   ├── .env.example
│   ├── routes/
│   │   ├── auth.js          # Autenticación (login)
│   │   ├── content.js       # CRUD del contenido
│   │   └── images.js        # Upload de imágenes
│   └── utils/
│       └── github.js        # Integración GitHub API
│
└── admin-frontend/          # UI Admin (Vercel)
    ├── index.html           # Página login
    ├── dashboard.html       # Panel principal
    ├── css/style.css
    └── js/
        ├── app.js           # Lógica principal
        └── api.js           # Cliente HTTP
```

## 🔄 Flujo de Datos

1. **Frontend (Landing)** lee `content.json` e inyecta contenido en el DOM
2. **Admin Frontend** (UI) permite editar contenido
3. **Admin Backend** (API) valida cambios y commitea a GitHub
4. **GitHub** almacena historial de cambios (versionado)
5. **Netlify** detecta cambios y redeploya automáticamente

```
Admin UI → API Backend → GitHub → Netlify Deploy → Landing Live
```

## 📋 Setup - Paso a Paso

### Fase 1: Preparar GitHub Token

1. Ir a https://github.com/settings/tokens/new
2. Nombre: "Landing Admin Panel"
3. Seleccionar permisos:
   - ✅ `repo` (acceso completo al repositorio)
   - ✅ `workflow` (para CI/CD, opcional)
4. Copiar token (aparece una sola vez)

### Fase 2: Backend Admin (Node.js API)

```bash
cd admin-backend
npm install

# Crear .env basado en .env.example
cp .env.example .env

# Editar .env con valores reales:
# - ADMIN_PASSWORD: contraseña del panel
# - GITHUB_TOKEN: token generado arriba
# - GITHUB_OWNER: tu usuario GitHub
# - GITHUB_REPO: nombre del repo
# - GITHUB_BRANCH: "staging" para pre-prod
```

**Desarrollo local:**
```bash
npm run dev  # Corre en http://localhost:3001
```

**Desplegar en Vercel:**
```bash
vercel --prod
# (Vercel detectará Node.js automáticamente)
```

### Fase 3: Frontend Admin (UI)

```bash
cd admin-frontend

# Para desarrollo local:
# - Sirve los archivos con cualquier servidor HTTP
# - O instala Live Server en VS Code

# Cambia la URL de API en js/api.js si es necesario
# En localhost: http://localhost:3001
# En prod: tu-api.vercel.app
```

**Desplegar en Vercel:**
```bash
vercel --prod
```

### Fase 4: Ramas y Deploy en Netlify

1. **Crear rama `staging`** en tu repo:
   ```bash
   git checkout -b staging
   git push origin staging
   ```

2. **Configurar Netlify para `staging`:**
   - Conectar repo
   - Build command: (dejar en blanco, es estático)
   - Publish directory: `/` o `.`
   - Branch: `staging`
   - Deploy a: `https://pre--landing-marcos.netlify.app`

3. **Mantener `main` para producción:**
   - Deploy automático en cada push a `main`
   - URL: `https://landing-marcos.netlify.app`

## 🔑 Variables de Entorno

### Backend (.env)

```env
# Puerto del servidor
PORT=3001
NODE_ENV=production

# Contraseña admin
ADMIN_PASSWORD=tu-contraseña

# JWT Secret
JWT_SECRET=tu-jwt-secret

# GitHub
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
GITHUB_OWNER=tu-usuario
GITHUB_REPO=landing-marcos-agentes
GITHUB_BRANCH=staging
GITHUB_EMAIL=admin@landing.local

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://admin.tu-dominio.com

# Tamaño máximo de upload
MAX_UPLOAD_SIZE_MB=50
```

## 📝 Estructura de content.json

El archivo `content.json` es el "corazón" del sistema:

```json
{
  "site": {
    "title": "Marcos Blazquez Fisioterapia"
  },
  "hero": {
    "title": "Recupera tu bienestar...",
    "subtitle": "...",
    "image": "assets/images/marcos.webp",
    "cta_primary": { "text": "Reservar", "url": "..." }
  },
  "services": [
    {
      "id": "terapia-manual",
      "title": "Terapia Manual",
      "description": "...",
      "image": "assets/images/..."
    }
  ],
  // ... más secciones
}
```

**Cada cambio en admin genera un commit en GitHub** con la estructura completa.

## 🚀 Endpoints API

### Autenticación

```bash
POST /api/auth/login
{
  "password": "contraseña"
}
→ { "token": "jwt...", "expiresIn": "24h" }
```

### Contenido

```bash
# Obtener (sin autenticación)
GET /api/content
→ { "hero": {...}, "services": [...], ... }

# Actualizar (requiere token)
POST /api/content
Headers: Authorization: Bearer {token}
Body: {
  "content": {...},
  "message": "Descripción del cambio"
}
→ { "success": true, "commit": "abc123" }

# Actualizar parcial
PATCH /api/content
Body: { "section": "hero", "data": {...} }

# Ver historial
GET /api/content/history?limit=10
→ [{ "commit": "abc", "author": "Admin", "date": "...", "message": "..." }, ...]
```

### Imágenes

```bash
# Subir imagen (requiere token)
POST /api/images
Headers: Authorization: Bearer {token}
Body: FormData { file: File, folder?: "subfolder" }
→ { "success": true, "url": "...", "filename": "..." }

# Eliminar imagen
DELETE /api/images
Body: { "filepath": "nombre.webp" }
```

## 🎯 Flujo de Uso

### Para el dueño (Marcos):

1. Ir a https://admin-marcos.vercel.app
2. Ingresar contraseña
3. Seleccionar sección a editar (Hero, Servicios, Tarifas, etc.)
4. Cambiar textos/imágenes
5. Hacer click en "Guardar cambios"
6. Automáticamente va a rama `staging` (pre-producción)
7. Revisar en https://pre--landing-marcos.netlify.app
8. Si todo OK, hacer click "Publicar a Prod" → merge a `main` → actualiza producción

### Para el desarrollador (tú):

1. Cambios en `main` se despliegan automáticamente en producción (Netlify)
2. Ver historial de cambios en GitHub (cada commit del admin es un cambio)
3. Revertir cambios: hacer git revert del commit
4. Actualizar versión del admin: redeploy en Vercel

## 🔒 Seguridad

- ✅ Contraseña simple (cambiar en `.env`)
- ✅ JWT tokens con expiración 24h
- ✅ CORS restringido a dominios autorizados
- ✅ Validación de archivos en upload
- ⚠️ En producción:
  - Usar HTTPS obligatoriamente
  - Cambiar `ADMIN_PASSWORD` a algo fuerte
  - Cambiar `JWT_SECRET` a algo largo/aleatorio
  - Limitar rate limiting en login (opcional: bcrypt + DB)

## 📊 Gestión de Cambios

```bash
# Ver commits de admin
git log content.json

# Ver cambios específicos
git diff HEAD~1 content.json

# Revertir cambio
git revert <commit-hash>
git push origin staging
```

## 🐛 Troubleshooting

### "Error: No se pudo conectar con API"
- Verificar que backend está corriendo
- Verificar CORS en `.env` incluye el dominio del admin
- Verificar token JWT no está expirado

### "GitHub token inválido"
- Regenerar token en https://github.com/settings/tokens
- Verificar permisos de `repo`
- Actualizar `GITHUB_TOKEN` en `.env`

### "Imagen no se sube"
- Verificar formato: JPG, PNG, WebP, SVG
- Verificar tamaño < 50MB
- Verificar token tiene permisos

### "Cambios no aparecen en pre-prod"
- Esperar 2-3 min (Netlify webhook delay)
- Hacer refresh hard (Ctrl+Shift+R)
- Verificar branch: `staging`
- Ver logs en Netlify dashboard

## 📚 Documentación Adicional

- [Octokit SDK](https://github.com/octokit/octokit.js)
- [Netlify Webhooks](https://docs.netlify.com/configure-builds/webhooks/)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [JWT.io](https://jwt.io/)

## 📞 Contacto

- **Landing**: https://landing-marcos.netlify.app
- **Pre**: https://pre--landing-marcos.netlify.app
- **Admin**: https://admin-marcos.vercel.app
- **GitHub Repo**: https://github.com/tu-usuario/landing-marcos-agentes

---

**v1.0.0** - Marzo 2026
