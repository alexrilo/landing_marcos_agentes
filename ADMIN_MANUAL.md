# 📖 Manual del Panel Admin - Marcos Fisioterapia

# Bienvenida al panel de administración

Aquí puedes modificar todos los textos, imágenes y precios de tu landing page **sin saber de programación**.

---

## ✅ Lo que necesitas saber

- ✅ **Cambios automáticos** - Cuando guardas, se actualizan en la web
- ✅ **Pre-visualización** - Puedes revisar en la rama "staging" antes de publicar
- ✅ **Seguro** - Solo tú tienes acceso con tu contraseña
- ✅ **Histórico** - Todos los cambios quedan registrados
- ⚠️ **Importante** - Los cambios no son instantáneos (esperar 2-3 minutos)

---

## 🔑 Acceso

**URL:** https://admin-marcos.vercel.app

**Contraseña:** [tu-contraseña-personal]

> 💡 **Tip:** Guarda esta contraseña en tu gestor de contraseñas
> No la compartas con nadie más

---

## 📱 Interfaz Explicada

### Barra Superior
```
[Admin Panel]  [Pre-Staging]    [Publicar a Prod]  [Salir]
```

- **Admin Panel**: Nombre del panel
- **Pre-Staging**: Indica que estás editando la versión de pre-producción
- **Publicar a Prod**: Botón para enviar cambios a producción (landing en vivo)
- **Salir**: Cierra tu sesión

### Menú Lateral
```
📁 Secciones
├─ 🏠 Hero
├─ 💪 Servicios
├─ 🏥 Patologías
├─ 💳 Tarifas
└─ ✉️ Contacto
```

Haz click en cualquier sección para editarla.

### Área Principal
Aquí aparecen los campos editables de cada sección.

---

## 🎨 Editar cada Sección

### 1. Hero (Portada Principal)

Los primeros elemento que ve el usuario cuando entra.

**Campos editables:**
- **Título**: Gran titular (ej: "Recupera tu bienestar...")
- **Subtítulo**: Texto explicativo debajo del título
- **URL de imagen**: Foto tuya en la hero
- **CTA Primario**: Botón "Reservar cita"
  - Texto del botón
  - URL a dónde lleva

**Ejemplo:**
```
Título: "Recupera tu bienestar con fisioterapia a domicilio"
Subtítulo: "Te ofrezco un enfoque clínico de alta gama..."
Imagen: assets/images/marcos.webp
Botón: "Reservar cita" → https://tufisio.com/...
```

### 2. Servicios

Los 5 tratamientos que ofreces.

**Campos editables:**
- **Título de sección**: "Tratamientos"
- **Subtítulo**: Descripción breve
- **Para cada servicio:**
  - Nombre (ej: "Terapia Manual Avanzada")
  - Descripción (ej: "Masajes, movilizaciones...")

**No se puede:**
- Agregar/eliminar servicios (contacta al dev si necesitas cambios)

### 3. Patologías

Condiciones que tratas.

**Editable:**
- Nombres de las patologías (ej: "Dolor de espalda", "ATM", etc.)

### 4. Tarifas

Precios de sesiones en diferentes zonas.

**Para cada ubicación:**
- Nombre (ej: "Torrejon de Ardoz")
- Precio individual
- Opciones de bonos
- Descripción especial

**Ejemplo:**
```
Torrejon de Ardoz:
  - Individual: 45€
  - Bono 5: 210€
  - Bono 10: 400€
```

### 5. Contacto

Información de contacto.

**Campos editables:**
- Teléfono
- Email de contacto
- Instagram (@blazquezm_fisio)
- Ubicación

---

## 🖼️ Cambiar Imágenes

### Opción A: Cambiar URL (Fácil)

Si la imagen ya existe en los "assets/images/", solo cambia la URL.

**Ejemplo:**
```
Antes: assets/images/marcos.webp
Después: assets/images/marcos-nueva.webp
```

### Opción B: Subir Nueva Imagen

> ⚠️ Esta opción requiere acceso técnico.
> Contacta al desarrollador para subir nuevas imágenes.

---

## 💾 Guardar Cambios - Paso a Paso

### 1. Edita el contenido
```
Panel → Selecciona sección → Modifica campos
```

### 2. Haz click en "Guardar cambios"
```
[Guardar cambios]  [Cancelar]
```

### 3. Espera el mensaje ✅
```
✅ Cambios guardados en GitHub
```

### 4. Espera 2-3 minutos
Internet y servidores necesitan tiempo para actualizar.

### 5. Revisa en pre-producción
```
https://pre--landing-marcos.netlify.app
(Aquí verás tus cambios ANTES de ir en vivo)
```

---

## 🚀 Publicar a Producción

Cuando ya verificaste que todo se ve bien en pre-producción:

### 1. Click en [Publicar a Prod]
```
[Publicar a Prod]
```

### 2. Confirma
```
"¿Publicar cambios a producción?"
Sí / No
```

### 3. Espera confirmación
```
Cambios publicados a producción ✅
```

### 4. Verifica en tu landing
```
https://landing-marcos.netlify.app
⚠️ Espera 2-3 minutos. Puede haber delay.
```

---

## ⏰ Tiempos de Actualización

```
Guardar cambios en admin
    ↓ (1 segundo)
Guarda en GitHub
    ↓ (1 segundo)
Webhook a Netlify
    ↓ (2-3 minutos)
Landing actualizada
    ↓ 
Ves los cambios en tu web
```

**Total: 2-5 minutos**

💡 Tip: Hacer refresh hard (Ctrl+Shift+R) ayuda a limpiar cache.

---

## 📊 Ver Historial de Cambios

Para ver quién cambió qué y cuándo:

1. Sidebar → [Ver historial]
2. Se abre ventana con últimos cambios
3. Cada cambio muestra:
   - Cuándo se hizo
   - Qué se cambió (mensaje)
   - Quién lo hizo

---

## ⚠️ ¡Algo Salió Mal!

### Error: "Cambios no aparecen"

1. ✅ Verifica en https://pre--landing-marcus.netlify.app (pre)
2. ✅ Haz refresh hard: Ctrl+Shift+R
3. ✅ Espera 5 minutos
4. ✅ Si no aparece, contacta al DEV

### Error: "No se puede conectar al panel"

1. ✅ Verifica que tienes internet
2. ✅ Intenta en otro navegador (Firefox/Chrome/Safari)
3. ✅ Borra cookies y cache
4. ✅ Contacta al DEV

### Error: "Contraseña incorrecta"

1. ✅ Verifica mayúsculas/minúsculas
2. ✅ Si no la recuerdas, contacta al DEV para resetearla

### Error: "Imagen no se sube"

- Tamaño máximo: 50MB
- Formatos: JPG, PNG, WebP
- Contacta al DEV para ayuda

---

## 🔒 Seguridad

### ✅ Buenas Prácticas

- ✅ Guarda tu contraseña en lugar seguro
- ✅ No la compartas con nadie
- ✅ Haz logout al terminar (especialmente en PC compartida)
- ✅ Usa WIFI segura (no Wifi público)

### ⚠️ Cuidado Con

- ❌ No guardes contraseña en navegador
- ❌ No compartas URL de acceso
- ❌ No des acceso a terceros
- ❌ Si olvidaste contraseña, contacta DEV

---

## 🎓 Ejemplos de Cambios

### Cambiar horario

1. Sección → **Contacto**
2. Modifica **Teléfono** o **Email**
3. Guardar cambios
4. Publicar a Prod

### Actualizar precio

1. Sección → **Tarifas**
2. Modifica **Precio** de zona (ej: 45€ → 50€)
3. Guardar cambios
4. Publicar a Prod

### Cambiar frase en Hero

1. Sección → **Hero**
2. Modifica **Título** o **Subtítulo**
3. Guardar cambios
4. Publicar a Prod

---

## 📞 Soporte

Si tienes problemas o preguntas:

### Contacta al Desarrollador

- Email: [email del dev]
- WhatsApp: [tel dev]
- Asunto: "Problema admin panel - [descripción]"

### Información útil para reportar:

- ¿Qué intentaste cambiar?
- ¿Qué error viste?
- ¿Qué navegador usas?
- ¿En qué hora sucedió?

---

## 📋 Checklist de Mantenimiento

**Semanalmente:**
- [ ] Revisar si aparecieron comentarios en landing
- [ ] Responder consultas de pacientes

**Mensualmente:**
- [ ] Revisar historial de cambios
- [ ] Actualizar precios si es necesario
- [ ] Revisar feedback de pacientes

**Trimestralmente:**
- [ ] Cambiar contraseña admin
- [ ] Revisar analytics (si tienes Google Analytics)

---

## 🎁 Bonus - Atajos Útiles

```
Ctrl/Cmd + S = Guardar cambios (si está implementado)
F5 = Refrescar página
Ctrl/Cmd + Shift + R = Refrescar sin cache
```

---

## 🎉 ¡Ya Estás Listo!

Ahora puedes:
- ✅ Editar textos sin saber código
- ✅ Cambiar imágenes fácilmente
- ✅ Actualizar precios en segundos
- ✅ Publicar cambios a producción
- ✅ Ver historial de cambios

**¡Bienvenido al futuro del admin digital!** 🚀

---

### Versión: 1.0
### Última actualización: Marzo 2026
### Soporte disponible 24/7
