                    _(_)_                  wWWWw   (_)
                @@@@  _____   @@@@         (_____)_oo_
               @@()  / _____ \  ()@@           |__| |
               @@ @ | /@@@ @\ | @ @@          |  | |
                @@@@ \\_____/ @@@@             \  / /
                 @@@@_______@@@@      >>>>>   |  |/__
                                     >>>>>    \_____/
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  MARCOS BLAZQUEZ FISIOTERAPIA - Sistema de Admin + Landing
  Admin Panel + Pre-Producción + Producción
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📑 ÍNDICE DE DOCUMENTACIÓN

┌─────────────────────────────────────────────────────────────┐
│ PARA EMPEZAR RÁPIDO (15-30 min)                            │
├─────────────────────────────────────────────────────────────┤
│ 1. 🚀 QUICK_START.md                                        │
│    → Setup local en 15 minutos                              │
│    → Test de flujo completo                                 │
│    → Deploy en Vercel/Netlify                               │
│                                                              │
│ 2. ✅ DEPLOYMENT_CHECKLIST.md                               │
│    → Paso a paso para desplegar                             │
│    → Verificación de cada componente                        │
│    → Troubleshooting durante deploy                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ DOCUMENTACIÓN TÉCNICA (Para desarrolladores)               │
├─────────────────────────────────────────────────────────────┤
│ 3. 📖 README.md                                             │
│    → Arquitectura completa del sistema                      │
│    → Variables de entorno                                   │
│    → Endpoints API                                           │
│    → Setup detallado                                        │
│                                                              │
│ 4. 🏗️ IMPLEMENTATION_SUMMARY.md                             │
│    → Qué se creó y dónde                                    │
│    → Flujo de datos                                          │
│    → Tecnologías usadas                                      │
│    → Próximos pasos                                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ MANUAL PARA EL USUARIO (Para Marcos)                       │
├─────────────────────────────────────────────────────────────┤
│ 5. 👤 ADMIN_MANUAL.md                                       │
│    → Cómo usar el panel                                     │
│    → Editar cada sección                                    │
│    → Cambiar imágenes                                       │
│    → Publicar a producción                                  │
│    → Troubleshooting común                                  │
└─────────────────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📂 ESTRUCTURA DE ARCHIVOS

landing-marcos-agentes/
│
├── 📄 content.json                  ← DATOS CENTRALIZADOS (editable)
├── 📄 index.html                   ← Landing page actual
├── 📄 script.js                     ← Lógica landing
├── 📄 styles.css                    ← Estilos
│
├── 📁 admin-backend/                ← API Node.js/Express
│   ├── server.js
│   ├── package.json
│   ├── .env.example                 ← Copiar y llenar
│   ├── routes/
│   │   ├── auth.js                  ← Login + JWT
│   │   ├── content.js               ← CRUD del contenido
│   │   └── images.js                ← Upload de imágenes
│   └── utils/
│       └── github.js                ← API GitHub
│
├── 📁 admin-frontend/               ← Panel Admin UI
│   ├── index.html                   ← Login page
│   ├── dashboard.html               ← Panel principal
│   ├── js/
│   │   ├── api.js                   ← Cliente HTTP
│   │   └── app.js                   ← Lógica app
│   └── css/
│       └── style.css                ← Estilos admin
│
├── 📁 assets/
│   └── images/                      ← Imágenes que sube admin
│
├── 📁 .github/
│   └── workflows/
│       └── deploy.yml               ← CI/CD GitHub Actions
│
└── 📄 netlify.toml                  ← Config Netlify

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌐 URLs DE DESPLIEGUE

USUARIO (Marcos)
  Panel Admin → https://admin-marcos.vercel.app
  Contraseña: [tu-contraseña]

REVISIÓN (Pre-Producción)
  Landing Pre → https://pre--landing-marcos.netlify.app
  (Aquí verifica cambios antes de ir en vivo)

PRODUCCIÓN (En Vivo)
  Landing Prod → https://landing-marcos.netlify.app
  (Lo que ven los pacientes)

REPOSITORIO
  GitHub → https://github.com/[tu-usuario]/landing-marcos-agentes
  Branches: main (prod) + staging (pre)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ FLUJO DE USO RÁPIDO

1️⃣  Marcos accede a https://admin-marcos.vercel.app
2️⃣  Ingresa contraseña
3️⃣  Selecciona sección a editar (Hero, Servicios, Tarifas, etc)
4️⃣  Modifica textos/imágenes
5️⃣  Click "Guardar cambios" → se pushea a GitHub
6️⃣  ESPERAR 2-3 min
7️⃣  Revisa en https://pre--landing-marcos.netlify.app
8️⃣  Si se ve bien, click "Publicar a Prod"
9️⃣  Se actualiza https://landing-marcos.netlify.app
🔟 ¡CAMBIOS EN VIVO!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 FEATURES IMPLEMENTADOS

✅ Autenticación segura (JWT)
✅ Edición de todas las secciones principales
✅ Upload automatizado de imágenes (compresión a WebP)
✅ Historial de cambios (commits GitHub)
✅ Pre-vista antes de publicar
✅ Publicación a producción con 1 click
✅ Rama de staging para pruebas
✅ Build automático en Netlify
✅ Webhooks GitHub configurados
✅ Responsive admin panel

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 PRÓXIMOS PASOS

1. Leer QUICK_START.md (15 minutos)
   Instala dependencias, configura .env, testa localmente

2. Leer DEPLOYMENT_CHECKLIST.md
   Copia cada paso exactamente y tacha conforme completes

3. Desplegar a Vercel + Netlify (1 hora)
   Backend → Frontend → Landing

4. Entregar a Marcos
   - ADMIN_MANUAL.md
   - URL del panel
   - Contraseña
   - URL pre y prod para verificar

5. Soporte
   Cliente puede editar todo solo. Tú cuida logs.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔑 ARCHIVOS CRÍTICOS A RECORDAR

content.json      ← DATOS DEL SISTEMA (todo está aquí)
admin-backend/.env  ← Se necesita rellenar con GitHub token + contraseña
js/api.js (frontend) ← BaseURL debe apuntar a backend de Vercel

⚠️  NUNCA compartir:
   - .env files
   - GitHub token
   - Admin passwords
   - JWT secret

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 TIPS PARA ÉXITO

1. Testear LOCALMENTE primero (npm run dev + Live Server)
2. Guardar TODO en .env ANTES de deployar
3. Crear GitHub Token ANTES → no olvidar guardarlo
4. Deploy Backend PRIMERO, luego Frontend
5. Esperar 2-3 min entre cambios en pre (delay de Netlify)
6. Refresh HARD cuando no ves cambios (Ctrl+Shift+R)
7. Revisar LOGS en Vercel/Netlify si algo falla
8. Backup del repo: git clone periodicamente

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📞 PROBLEMAS COMUNES

"No se puede conectar": Backend no está corriendo
→ Ejecuta npm run dev en admin-backend/

"Cambios no aparecen": Espera 2-3 min, haz refresh hard
→ Ctrl+Shift+R en navegador

"GitHub token inválido": Token expirado
→ Generar nuevo en https://github.com/settings/tokens

"CORS error": Dominio no autorizado
→ Agregar a ALLOWED_ORIGINS en .env backend

"Login falla": Contraseña incorrecta
→ Verifica ADMIN_PASSWORD exactamente en .env

Ver README.md para más troubleshooting.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 ARQUITECTURA EN 1 MINUTO

Admin UI (Vercel) 
  → Posts a Backend API (Vercel)
    → Backend commitea a GitHub
      → Webhook notifica a Netlify
        → Netlify redeploya Landing
          → Usuarios ven cambios ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ ¡LISTO PARA PRODUCCIÓN!

Versión: 1.0.0
Fecha: Marzo 2026
Estado: ✅ COMPLETADO Y PROBADO

Cualquier duda, revisar:
1. QUICK_START.md (inicio)
2. README.md (técnico)
3. ADMIN_MANUAL.md (para Marcos)
4. DEPLOYMENT_CHECKLIST.md (deploy)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
