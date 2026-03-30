# 🚀 GUÍA: DESPLEGAR EN VERCEL

## PASO 1: Preparar tu repositorio en GitHub

```bash
# En la raíz del proyecto
git add .
git commit -m "Agregar config de Vercel"
git push origin main
```

✅ Esto pushea `vercel.json` que acabamos de crear en backend y frontend.

---

## PASO 2: Crear cuenta en Vercel (si no tienes)

1. Ve a → **https://vercel.com**
2. Click "Sign Up"
3. Elige "GitHub" para conectar
4. Autoriza a Vercel
5. ✅ **Cuenta creada**

---

## PASO 3: Desplegar el BACKEND (la API)

### 3.1 - Nuevo Proyecto en Vercel

1. En Vercel, click **"New Project"**
2. Selecciona tu repositorio (`landing-marcos-agentes`)
3. Click **"Import"**

### 3.2 - Configurar el proyecto Backend

En "Configure Project":

- **Project Name**: `admin-api` (o lo que quieras)
- **Framework Preset**: `Other`
- **Root Directory**: `admin-backend/` ← **¡IMPORTANTE!**
- Click "*Select*"

### 3.3 - Variables de Entorno

Aquí es **CRÍTICO**. Click en "Environment Variables" y agrega TODAS estas:

```
ADMIN_PASSWORD = [tu-contraseña-para-marcos]

GITHUB_TOKEN = [tu-github-token-personal]
    → Cómo crearlo: https://github.com/settings/tokens
    → Permisos necesarios: repo (read + write)
    → Guárdalo en un lugar seguro

GITHUB_OWNER = [tu-usuario-github]
    → Ej: "usuario" (de https://github.com/usuario/landing-marcos-agentes)

GITHUB_REPO = landing-marcos-agentes
    → OJO: Exactamente así

GITHUB_BRANCH_CONTENT = staging
    → De dónde lee/escribe los cambios (rama de pre-producción)

JWT_SECRET = [cualquier-string-aleatorio-24-caracteres]
    → Ej: "aB3xY9kL0mNpQwErTyUiOpAsD"

ALLOWED_ORIGINS = https://admin-marcos.vercel.app,http://localhost:3000
    → Dominio del frontend (lo cambias cuando sepas la URL)
```

**Copiar del archivo .env.example si lo tienes:**
```bash
cat admin-backend/.env.example
```

### 3.4 - Deploy

Click **"Deploy"**

Espera 2-3 minutos...

✅ **Backend en vivo** en: `https://admin-api.vercel.app`

Guarda esta URL → **La necesitas en el siguiente paso**

---

## PASO 4: Desplegar el FRONTEND (el Panel Admin)

### 4.1 - Nuevo Proyecto en Vercel

1. Click **"New Project"** (otra vez)
2. Selecciona tu repositorio
3. Click **"Import"**

### 4.2 - Configurar el proyecto Frontend

En "Configure Project":

- **Project Name**: `admin-marcos`
- **Framework Preset**: `Other`
- **Root Directory**: `admin-frontend/` ← **¡IMPORTANTE!**
- Click "*Select*"

### 4.3 - NO necesita variables de entorno

✅ **El frontend NO guarda secretos** (Lee la API URL del navegador)

### 4.4 - Deploy

Click **"Deploy"**

Espera 2-3 minutos...

✅ **Frontend en vivo** en: `https://admin-marcos.vercel.app`

---

## PASO 5: Conectar Frontend ↔ Backend

Ahora están en Vercel pero el frontend NO SABE dónde está el backend.

### 5.1 - Editar `admin-frontend/js/api.js`

Busca esta línea (aprox. línea 5):

```javascript
const API_BASE_URL = 
  window.location.hostname === 'localhost' 
    ? 'http://localhost:3001'
    : 'https://admin-api.vercel.app';  ← CAMBIAR POR TU URL
```

Reemplaza `https://admin-api.vercel.app` por la URL real de tu backend de Vercel.

### 5.2 - Push a GitHub

```bash
git add admin-frontend/js/api.js
git commit -m "Conectar frontend a backend en Vercel"
git push origin main
```

✅ **Vercel se redeploya automáticamente**

Espera 2 min...

---

## PASO 6: Testear que funciona

### 6.1 - Accede al panel admin

1. Abre → **https://admin-marcos.vercel.app**
2. Ingresa la contraseña (la que pusiste en `ADMIN_PASSWORD`)
3. ✅ Si entra → **¡FUNCIONA!**

### 6.2 - Testea una edición

1. Click en "Hero"
2. Cambiar título (ej: "Fisio - Test 123")
3. Click "Guardar cambios"
4. Espera 5 segundos...
5. Verifica que NO salga error rojo

### 6.3 - Verifica que llegó a GitHub

```bash
# En tu terminal
git log --oneline -n 5
# Deberías ver: "Update content: Hero section"
```

✅ **Si llegó un commit → TODO FUNCIONA CORRECTAMENTE**

---

## PASO 7: Desplegar LANDING en Netlify

### 7.1 - Crear site en Netlify (Producción - main)

1. Ve a → **https://app.netlify.com**
2. Click "New site from Git"
3. Selecciona GitHub
4. Busca `landing-marcos-agentes`
5. Click "Deploy"

En "Build settings":
- **Base directory**: `.` (root)
- **Build command**: (dejar vacío, es HTML estático)
- **Publish directory**: `.`

Click "Deploy site"

✅ **Landing en PRODUCCIÓN** → `https://[algo-random]-landing.netlify.app`

**Personaliza la URL:**
- En Netlify → Site Settings → Site name
- Cambia a: `landing-marcos`
- URL final: **https://landing-marcos.netlify.app**

### 7.2 - Crear site en Netlify (Pre-Producción - staging)

Repite el paso 7.1 pero:
- En GitHub selecciona la rama: `staging`
- Site name: `pre-landing-marcos`
- URL: **https://pre-landing-marcos.netlify.app**

---

## PASO 8: Configurar GitHub Webhooks (Opcional pero Recomendado)

Para que Netlify se redepliegue automáticamente cuando cambies el contenido:

### 8.1 - En Netlify (PRODUCCIÓN)

1. Site → Build & deploy → Webhooks
2. Click "Add a hook"
3. Event: "Push to main"
4. Copiar URL del webhook

### 8.2 - En GitHub

1. Repo → Settings → Webhooks
2. Click "Add webhook"
3. Payload URL: Pega la URL de Netlify
4. Content type: `application/json`
5. Let me select events → Select only "push events"
6. Click "Add webhook"

✅ Ahora cuando hagas un commit → Netlify se redeploya automáticamente

---

## 🎯 RESULTADO FINAL

```
Tu Aplicación Completa:
│
├─ ADMIN (Vercel)
│  └─ Frontend: https://admin-marcos.vercel.app
│  └─ Backend API: https://admin-api.vercel.app
│
├─ PRE-PRODUCCIÓN (Netlify)
│  └─ https://pre-landing-marcos.netlify.app
│  └─ (Lee cambios de rama: staging)
│
└─ PRODUCCIÓN (Netlify)
   └─ https://landing-marcos.netlify.app
   └─ (Lee cambios de rama: main)
```

---

## ⚠️  PROBLEMAS COMUNES

### "Error: 403 Forbidden" en admin

**Causa**: GitHub token inválido o expirado

**Solución**:
1. Crea un nuevo token en https://github.com/settings/tokens
2. Actualiza en Vercel → Settings → Environment Variables
3. Redeploya

### "CORS error en consola"

**Causa**: Frontend no sabe dónde está el backend

**Solución**:
1. Edita `admin-frontend/js/api.js`
2. Asegúrate de que `API_BASE_URL` es correcto
3. Push a GitHub
4. Espera a que Vercel redepliegue

### "Cambios no aparecen en pre"

**Causa**: Delay de Netlify (puede tardar 2-3 min)

**Solución**:
1. Espera 3 minutos
2. Haz refresh HARD: `Ctrl+Shift+R`
3. Si aún no, revisa Netlify logs

### "Contraseña no funciona"

**Causa**: Typo en `ADMIN_PASSWORD` en Vercel

**Solución**:
1. Ve a Vercel → Settings → Environment Variables
2. Verifica `ADMIN_PASSWORD`
3. Borra y vuelve a agregar (cuidado con espacios)
4. Redeploya todo

---

## 📝 CHECKLIST FINAL

- [ ] Backend en Vercel con todas las env vars
- [ ] Frontend en Vercel conectado al backend
- [ ] Landing en Netlify (rama main)
- [ ] Pre-landing en Netlify (rama staging)
- [ ] Login funciona en admin panel
- [ ] Edición y save funcionan
- [ ] Cambio visible en pre después de 3 min
- [ ] GitHub webhooks configurados (opcional)

Si todo pasó ✅ → **¡ESTÁS LISTO PARA ENTREGARLE A MARCOS!**

---

## 🆘 ¿NECESITAS AYUDA?

1. **Error de deploy**: Revisa Vercel/Netlify logs (botón amarillo en deploy)
2. **Código no anda**: Revisa el archivo que mencionó el error
3. **GitHub token**: Asegúrate que tiene permisos `repo`
4. **URL del backend**: Cópiala completa, sin "/" al final

¡Dale! 🚀
