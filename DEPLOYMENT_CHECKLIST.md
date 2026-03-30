# ✅ Deployment Checklist

Sigue este checklist para desplegar el sistema completo a producción.

## 🔧 Pre-Deployment (Preparación)

### GitHub Setup
- [ ] Crear GitHub Token en https://github.com/settings/tokens/new
- [ ] Guardar token en lugar seguro
- [ ] Crear rama `staging` en repo
- [ ] Crear rama `main` (o usar existente)
- [ ] Configurar branch protection en `main` (optional)

### Backend - Local
- [ ] Navegar a `admin-backend/`
- [ ] Copiar `.env.example` a `.env`
- [ ] Llenar variables en `.env`:
  ```
  ADMIN_PASSWORD=tu-contraseña-fuerte
  GITHUB_TOKEN=ghp_xxxx...
  GITHUB_OWNER=tu-usuario
  GITHUB_REPO=landing-marcos-agentes
  GITHUB_BRANCH=staging
  GITHUB_EMAIL=dev@landing.local
  JWT_SECRET=algo-largo-aleatorio-min-32-chars
  ```
- [ ] Ejecutar `npm install`
- [ ] Test: `npm run dev` → debe escuchar en 3001
- [ ] Probar POST /api/auth/login con contraseña
- [ ] Probar GET /api/content

### Frontend - Local
- [ ] Navegar a `admin-frontend/`
- [ ] Verificar `js/api.js` tiene `baseURL = 'http://localhost:3001'`
- [ ] Servir localmente (Live Server o python)
- [ ] Test: Abrir http://localhost:3000
- [ ] Test: Login y editar contenido
- [ ] Test: Guardar cambios → verificar en GitHub

---

## 🚀 Deployment - Backend (Vercel)

### Setup Vercel
- [ ] Instalar Vercel CLI: `npm i -g vercel`
- [ ] Login en Vercel: `vercel login`
- [ ] Navegar a `admin-backend/`
- [ ] Asegurarse que `.env` tiene valores correctos

### Deploy
- [ ] Ejecutar: `vercel --prod`
- [ ] Vercel hace preguntas (aceptar defaults)
- [ ] **Copiar URL del deploy** (ej: admin-api-xyz.vercel.app)
- [ ] Esperar a que termine el build
- [ ] Verificar: GET https://admin-api-xyz.vercel.app/api/health
- [ ] Debe devolver: `{"status":"ok"}`

### Post-Deploy Backend
- [ ] Agregar secrets a Vercel:
  - [ ] Ir a Vercel project settings
  - [ ] Agregar todas las variables del `.env`
  - [ ] Redeploy proyecto: `vercel --prod`

---

## 🎨 Deployment - Frontend (Vercel)

### Pre-Deploy
- [ ] Navegar a `admin-frontend/`
- [ ] **Actualizar baseURL en `js/api.js`:**
  ```javascript
  // Cambiar de para producción:
  this.baseURL = 'https://admin-api-xyz.vercel.app'  // URL del backend
  ```
- [ ] Verificar login page: `index.html` se carga sin errores
- [ ] Verificar dashboard: `dashboard.html` tiene estructura

### Deploy
- [ ] Ejecutar: `vercel --prod`
- [ ] Aceptar defaults
- [ ] **Copiar URL del deploy** (ej: admin-marcos.vercel.app)
- [ ] Esperar a que termine
- [ ] Verificar: https://admin-marcos.vercel.app
- [ ] Debe verse página de login

### Test Frontend
- [ ] Abrir https://admin-marcos.vercel.app
- [ ] Ingresar contraseña
- [ ] Debe redirigir a dashboard
- [ ] Editar un campo
- [ ] Guardar cambios
- [ ] Verificar commit en GitHub

---

## 🌐 Deployment - Netlify

### Site 1 - Producción (main branch)

#### Existing Site (Si ya deployment en Netlify)
- [ ] Ir a Netlify settings
- [ ] Verificar rama: `main`
- [ ] Verificar build command: `echo 'Landing is ready'` o vacío
- [ ] Verificar publish directory: `.` o `/`
- [ ] Configurar domain personalizado (opcional)

#### New Site (Si es primera vez)
- [ ] Ir a Netlify.com
- [ ] Click "Add new site" → Import existing project
- [ ] Seleccionar repo
- [ ] Build command: (dejar vacío o `echo 'ready'`)
- [ ] Publish directory: `.` 
- [ ] Deploy

### Site 2 - Pre-Producción (staging branch)

- [ ] En Netlify, ir a Site settings
- [ ] Click "Build & deploy" → "Branches and deploy contexts"
- [ ] Agregar branch `staging` como contexto separado (o nuevo site)
- [ ] **ó Crear nuevo site separado:**
  - [ ] "Add new site" → mismo repo
  - [ ] Branch: `staging`
  - [ ] Nombre: `pre-landing-marcos`

### Netlify Setup - Ambos Sites
- [ ] Ir a settings de cada sitio
- [ ] Agregar netlify.toml si no lo ve
- [ ] Verificar redirecciones en netlify.toml
- [ ] Agregar headers de seguridad
- [ ] Enable Prerendering (optional)

### Test Netlify
- [ ] Esperar 2-3 min a que complete first deploy
- [ ] Abrir prod URL: https://landing-marcos.netlify.app
- [ ] Debe verse landing page normal
- [ ] Abrir pre URL: https://pre--landing-marcos.netlify.app
- [ ] Debe verse igual (es staging)

---

## 🔗 GitHub Webhooks (Automáticos)

### Verificar Webhooks
- [ ] Ir a GitHub repo → Settings → Webhooks
- [ ] Netlify debe haber creado webhooks automáticamente
- [ ] Verificar 2 webhooks (uno por branch/site)
- [ ] Deben ser dirigidos a `api.netlify.com`

### Test Webhook Flow
- [ ] Hacer un cambio pequeño en `index2.html`
- [ ] Push a `staging` rama
- [ ] Esperar 1 min
- [ ] Ir a Netlify staging site → Deploys
- [ ] Verificar que aparece nuevo deploy
- [ ] Abrir pre URL y verificar cambio

---

## 📋 Final Verification Checklist

### Acceso Admin
- [ ] Panel admin carga: https://admin-marcos.vercel.app
- [ ] Login con contraseña funciona
- [ ] Dashboard muestra secciones
- [ ] Editar Hero y guardar
- [ ] Cambios aparecen en GitHub commit

### Pre-Producción (Staging)
- [ ] URL pre accesible: https://pre--landing-marcos.netlify.app
- [ ] Cambios del admin aparecen en < 5 min
- [ ] Refresh hard muestra cambios
- [ ] Historial de cambios en admin

### Producción (Main)
- [ ] URL prod accesible: https://landing-marcos.netlify.app
- [ ] Cambios desde pre → prod funciona
- [ ] Publicar a prod hace merge correctamente
- [ ] Prod se actualiza < 5 min después

### Seguridad
- [ ] HTTPS funciona en ambas URLs ✅
- [ ] Contraseña admin es fuerte
- [ ] JWT_SECRET cambió de default
- [ ] CORS originates solo dominios autorizados

---

## 🎯 Delivery a Cliente (Marcos)

### Documentos a Entregar
- [ ] README.md (documentación técnica)
- [ ] QUICK_START.md (setup rápido)
- [ ] ADMIN_MANUAL.md (guía de usuario)
- [ ] Este checklist

### Información a Compartir
- [ ] **URL Admin:** https://admin-marcos.vercel.app
- [ ] **URL Pre:** https://pre--landing-marcos.netlify.app
- [ ] **URL Prod:** https://landing-marcos.netlify.app
- [ ] **Contraseña:** [contraseña única]
- [ ] **Soporte:** [tu email/tel]

### Training (Opcional)
- [ ] Hacer demo: login → editar → guardar → verificar
- [ ] Mostrar pre-producción vs producción
- [ ] Mostrar cómo publicar a producción
- [ ] Responder preguntas del cliente

---

## 🔄 Post-Deployment Monitoring

### Primer Día
- [ ] Monitorear logs en Vercel
- [ ] Monitorear logs en Netlify
- [ ] Verificar que admin panel funciona
- [ ] Hacer cambio de prueba → verificar flujo completo
- [ ] Disponibilidad para soporte

### Primera Semana
- [ ] Cliente hace cambios por su cuenta
- [ ] Monitorear si hay errores
- [ ] Hacer backup inicial del repo
- [ ] Documentar issues/feedback

### Mantenimiento Continuo
- [ ] Revisar logs semanalmente
- [ ] Actualizar dependencias npm (minor)
- [ ] Monitorear storage de imágenes
- [ ] Hacer backups mensuales

---

## ⚠️ Rollback (si algo falla)

### Rollback Backend
```bash
# En Vercel dashboard
# Ir a Deployments
# Click al deployment anterior
# "Promote to Production"
```

### Rollback Frontend
```bash
# Mismo procedimiento que backend
```

### Rollback Landing (Content)
```bash
# En GitHub
git log content.json          # Ver histórico
git revert [commit-hash]      # Revertir cambio
git push origin main
# Netlify redeploya automáticamente
```

---

## 📞 Troubleshooting Durante Deploy

| Problema | Solución |
|----------|----------|
| "Cannot find module" | `npm install` falta ejecutar |
| Port 3001 en uso | Cambiar PORT en `.env` |
| CORS error | Actualizar ALLOWED_ORIGINS en `.env` |
| GitHub token inválido | Regenerar en settings/tokens |
| Vercel build falla | Ver logs en Vercel dashboard |
| Netlify no actualiza | Esperar 3-5 min, hacer refresh hard |
| Admin no se carga | Verificar baseURL en `js/api.js` |

---

## ✅ Sign-Off

Completa esto cuando todo esté listo:

- [ ] Backend desplegado y funcionando
- [ ] Frontend desplegado y funcionando  
- [ ] Netlify prod configurado
- [ ] Netlify pre configurado
- [ ] GitHub webhooks verificados
- [ ] Test end-to-end exitoso
- [ ] Cliente recibió documentación
- [ ] Cliente recibió contraseña
- [ ] Cliente hizo primer cambio exitosamente
- [ ] Fecha de go-live: ________________

**Autorizado por:** ________________  
**Fecha:** ________________

---

**¡Sistema desplegado a producción exitosamente!** 🎉

a