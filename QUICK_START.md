# 🚀 Quick Start - Admin Panel

Guía rápida para poner en marcha el sistema en 15 minutos.

## Prerequisitos

- Node.js v16+ instalado
- Cuenta GitHub
- Vercel account (opcional para deploy)
- Netlify account (opcional para deploy)

## Paso 1: GitHub Token (2 min)

1. Ve a https://github.com/settings/tokens?type=beta
2. Click "Generate new token"
3. Nombre: "Landing Admin Panel"
4. Permisos: ✅ `repo` (read + write)
5. **Copiar y guardar el token** (no volverá a aparecer)

## Paso 2: Backend (3 min)

```bash
# Navega a backend
cd admin-backend

# Instala dependencias
npm install

# Crea archivo .env
cp .env.example .env

# Abre .env en editor y reemplaza:
# ADMIN_PASSWORD=marcosfisio123     (contraseña que quieras)
# GITHUB_TOKEN=ghp_xxxxxxxxxxxx      (tu token de arriba)
# GITHUB_OWNER=tu-usuario            (tu usuario GitHub)
# GITHUB_REPO=landing-marcos-agentes (nombre del repo)
# GITHUB_BRANCH=staging              (mantener así)
```

**Test local:**
```bash
npm run dev
# Debe decir: ✅ Admin API escuchando en puerto 3001
```

## Paso 3: Frontend Admin (2 min)

```bash
# Navega a frontend
cd ../admin-frontend

# Archivo js/api.js ya está configurado
# En desarrollo reconoce localhost automáticamente
```

**Test local:**
```bash
# Opción A: Usa Live Server en VS Code
# Click derecho en index.html → "Open with Live Server"

# Opción B: Usa Python
python -m http.server 3000

# En navegador: http://localhost:3000
```

## Paso 4: Probar Flujo Completo (3 min)

1. **Backend ejecutándose:**
   ```bash
   cd admin-backend
   npm run dev  # Terminal 1
   ```

2. **Frontend ejecutándose:**
   ```bash
   cd admin-frontend
   # Live Server o python server  # Terminal 2
   ```

3. **Abrir en navegador:**
   - http://localhost:3000
   - Contraseña: `marcosfisio123` (la que pusiste)
   - Click "Acceder"

4. **Editar contenido:**
   - Selecciona "Hero" en sidebar
   - Modifica un texto
   - Click "Guardar cambios"
   - Debe aparecer ✅ mensaje de éxito
   - Verifica en GitHub que se creó nuevo commit

## Paso 5: Deploy (5 min)

### Backend en Vercel

```bash
# Asume que ya tienes Vercel CLI
npm i -g vercel

cd admin-backend
vercel --prod

# Responde preguntas y copia URL (ej: admin-api.vercel.app)
```

### Frontend en Vercel

```bash
cd admin-frontend

# Edita js/api.js y reemplaza baseURL:
# this.baseURL = 'https://admin-api.vercel.app'

vercel --prod
# Copia URL (ej: admin-marcos.vercel.app)
```

### Landing en Netlify

Ya debe estar deployada. Solo asegúrate que:
- Rama `main` → producción
- Rama `staging` → pre-producción (crea sitio separado)

## ✅ Verificación

```bash
# 1. Backend responde
curl http://localhost:3001/api/health
# Debe devolver: { "status": "ok" }

# 2. Frontend carga
# Abre http://localhost:3000 - debe verse login

# 3. Login funciona
# Contraseña correcta → redirige a dashboard

# 4. Guardar cambios
# Edita → Guardar → Verifica en GitHub que aparece commit
```

## 🔑 Credenciales Recordar

- **Admin password**: marcosfisio123 (o la que pusiste)
- **GitHub token**: guardado en `.env` (nunca compartir)
- **JWT secret**: generado automáticamente (cambiar en prod)

## 📱 Para Marcos (El dueño)

Envíale esto:

> **Tu panel de admin está en:** https://admin-marcos.vercel.app
>
> **Contraseña:** [contrasena] (cambiar después)
>
> **¿Cómo usarlo?**
> 1. Entra con contraseña
> 2. Selecciona qué editar (Hero, Servicios, Tarifas, etc)
> 3. Modifica textos e imágenes
> 4. Click "Guardar cambios"
> 5. Espera 2 min y verifica en https://pre--landing-marcos.netlify.app
> 6. Si se ve bien, click "Publicar a Prod"
> 7. ¡Cambios en vivo!

## 🆘 Errores Comunes

| Error | Solución |
|-------|----------|
| "Cannot connect to API" | Backend no está corriendo. Ejecuta `npm run dev` en otra terminal |
| "Token inválido" | Verifica token de GitHub en `.env` |
| "Login falla" | Contraseña incorrecta. Verifica `ADMIN_PASSWORD` en `.env` |
| "Cambios no aparecen" | Espera 2-3 min. Netlify webhook es lento. Refresh hard: Ctrl+Shift+R |
| "CORS error" | Agrega dominio a `ALLOWED_ORIGINS` en `.env` backend |

## 🎓 Próximos Pasos

1. **Contraseña más fuerte:** Cambiar `ADMIN_PASSWORD` a algo seguro
2. **Dominio personalizado:** Conectar dominios en Vercel y Netlify
3. **HTTPS obligatorio:** Vercel/Netlify lo hacen automáticamente
4. **Backups:** GitHub es tu backup. Hacer `git clone` periódicamente
5. **Monitoreo:** Configurar alertas en caso de errores de deploy

## 📞 Soporte

- Errores de build: Ver logs en Vercel/Netlify dashboard
- Problemas GitHub: Verificar token en https://github.com/settings/tokens
- Issues locales: `npm install` nuevamente, limpiar node_modules

---

**¡Listo! Tu admin panel está corriendo.** 🎉
