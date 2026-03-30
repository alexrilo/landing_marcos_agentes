/**
 * App Principal
 * Lógica de autenticación y flujos principales
 */

class AdminApp {
  constructor() {
    this.content = null;
    this.isLoggedIn = api.isAuthenticated();
    this.isModified = false;
  }

  async init() {
    const path = window.location.pathname;
    const isLoginPage = path.endsWith('/index.html') || path === '/' || path.endsWith('/');
    const isDashboardPage = path.endsWith('/dashboard.html');

    if (isLoginPage) {
      if (this.isLoggedIn) {
        // Ya tiene token → ir directo al dashboard
        this.goToDashboard();
      } else {
        // Sin token → mostrar login
        this.initLoginPage();
      }
    } else if (isDashboardPage) {
      if (this.isLoggedIn) {
        // Cargar contenido E inicializar el dashboard
        await this.loadDashboard();
      } else {
        // Sin token → redirigir al login
        window.location.href = 'index.html';
      }
    }
  }

  // ========== LOGIN ==========

  initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');

    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const password = document.getElementById('password').value;

      loginError.style.display = 'none';
      loginError.textContent = '';

      try {
        await api.login(password);
        this.isLoggedIn = true;
        this.goToDashboard();
      } catch (error) {
        loginError.style.display = 'block';
        loginError.textContent = `❌ ${error.message}`;
        document.getElementById('password').value = '';
        document.getElementById('password').focus();
      }
    });
  }

  // ========== DASHBOARD ==========

  goToDashboard() {
    if (!this.isLoggedIn) {
      window.location.href = 'index.html';
      return;
    }
    // Solo navegar — el init() de dashboard.html se encarga del resto
    window.location.href = 'dashboard.html';
  }

  async loadDashboard() {
    this.showLoading('Cargando contenido...');
    try {
      // Cargar contenido desde el backend
      this.content = await api.getContent();

      // Inicializar dashboard (listeners, sección por defecto)
      this.initDashboard();
    } catch (error) {
      console.error('Error cargando contenido:', error);
      this.showError('No se pudo cargar el contenido: ' + error.message);
    } finally {
      this.hideLoading();
    }
  }

  initDashboard() {
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        api.clearToken();
        window.location.href = 'index.html';
      });
    }

    // Menu de secciones
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        const section = item.getAttribute('data-section');
        this.showSection(section);

        // Activar estado
        menuItems.forEach(m => m.classList.remove('active'));
        item.classList.add('active');
      });
    });

    // Primero, mostrar Hero
    this.showSection('hero');

    // Historial
    const viewHistoryBtn = document.getElementById('viewHistory');
    if (viewHistoryBtn) {
      viewHistoryBtn.addEventListener('click', () => this.showHistory());
    }

    // Publish
    const publishBtn = document.getElementById('publishBtn');
    if (publishBtn) {
      publishBtn.addEventListener('click', () => this.publish());
    }
    
  }

  // ========== SECCIONES ==========

  showSection(sectionName) {
    const contentArea = document.getElementById('contentArea');
    if (!contentArea) return;

    const section = this.content[sectionName];
    if (!section) {
      contentArea.innerHTML = '<p>Sección no encontrada</p>';
      return;
    }

    let html = '';

    switch (sectionName) {
      case 'hero':
        html = this.renderHeroEditor();
        break;
      case 'services':
        html = this.renderServicesEditor();
        break;
      case 'pathologies':
        html = this.renderPathologiesEditor();
        break;
      case 'pricing':
        html = this.renderPricingEditor();
        break;
      case 'contact':
        html = this.renderContactEditor();
        break;
      default:
        html = '<p>Sin editor implementado para esta sección</p>';
    }

    contentArea.innerHTML = html;
    this.attachEditorListeners(sectionName);
  }

  // ========== EDITORES ==========

  renderHeroEditor() {
    const data = this.content.hero;
    return `
      <div class="section-editor">
        <h2>Hero Section</h2>
        <div class="editor-form">
          <div class="form-group">
            <label>Título</label>
            <input type="text" class="editor-field" data-path="hero.title" value="${this.escapeHtml(data.title)}" />
          </div>
          <div class="form-group">
            <label>Subtítulo</label>
            <textarea class="editor-field" data-path="hero.subtitle" rows="3">${this.escapeHtml(data.subtitle)}</textarea>
          </div>
          <div class="form-group">
            <label>URL de imagen</label>
            <input type="text" class="editor-field" data-path="hero.image" value="${data.image}" />
          </div>
          <div class="form-group">
            <label>CTA primario - Texto</label>
            <input type="text" class="editor-field" data-path="hero.cta_primary.text" value="${data.cta_primary.text}" />
          </div>
          <div class="form-group">
            <label>CTA primario - URL</label>
            <input type="text" class="editor-field" data-path="hero.cta_primary.url" value="${data.cta_primary.url}" />
          </div>
          <div class="form-group">
            <label>Quote inspiradora</label>
            <textarea class="editor-field" data-path="hero.quote" rows="2">${this.escapeHtml(data.quote)}</textarea>
          </div>

          <div class="editor-actions">
            <button class="btn btn-primary" data-action="save">Guardar cambios</button>
            <button class="btn btn-ghost" data-action="cancel">Cancelar</button>
          </div>
        </div>
      </div>
    `;
  }

  renderServicesEditor() {
    const data = this.content.services;
    let html = `<div class="section-editor">
      <h2>Servicios</h2>
      <div class="editor-form">
        <div class="form-group">
          <label>Título de sección</label>
          <input type="text" class="editor-field" data-path="services.title" value="${this.escapeHtml(data.title)}" />
        </div>
        <div class="form-group">
          <label>Subtítulo</label>
          <textarea class="editor-field" data-path="services.subtitle" rows="2">${this.escapeHtml(data.subtitle)}</textarea>
        </div>
        <h3 style="margin-top: 2rem;">Tratamientos (${data.items.length})</h3>`;

    data.items.forEach((service, idx) => {
      html += `
        <div class="service-item">
          <div class="item-header">
            <h4>${this.escapeHtml(service.title)}</h4>
            <button class="btn btn-sm btn-ghost" data-action="toggle-modal" data-target="modal-fields-${idx}">
              <span class="material-symbols-outlined">expand_more</span>
              Popup
            </button>
          </div>

          <!-- Card fields -->
          <div class="form-group">
            <label>Nombre</label>
            <input type="text" class="editor-field" data-path="services.items.${idx}.title" value="${this.escapeHtml(service.title)}" />
          </div>
          <div class="form-group">
            <label>Descripción (card)</label>
            <textarea class="editor-field" data-path="services.items.${idx}.description" rows="2">${this.escapeHtml(service.description)}</textarea>
          </div>
          <div class="form-group">
            <label>Imagen</label>
            <input type="text" class="editor-field" data-path="services.items.${idx}.image" value="${this.escapeHtml(service.image || '')}" />
          </div>

          <!-- Modal / Popup fields -->
          <div class="modal-fields" id="modal-fields-${idx}" style="display: none;">
            <div class="modal-fields-header">
              <span class="material-symbols-outlined">open_in_new</span>
              <span>Contenido del popup</span>
            </div>
            <div class="form-group">
              <label>Título del popup</label>
              <input type="text" class="editor-field" data-path="services.items.${idx}.modal_title" value="${this.escapeHtml(service.modal_title || '')}" />
            </div>
            <div class="form-group">
              <label>Subtítulo del popup</label>
              <input type="text" class="editor-field" data-path="services.items.${idx}.modal_subtitle" value="${this.escapeHtml(service.modal_subtitle || '')}" />
            </div>
            <div class="form-group">
              <label>Descripción del popup</label>
              <textarea class="editor-field" data-path="services.items.${idx}.modal_description" rows="3">${this.escapeHtml(service.modal_description || '')}</textarea>
            </div>
            <div class="form-group">
              <label>Contenido del popup</label>
              <textarea class="editor-field" data-path="services.items.${idx}.modal_content" rows="3">${this.escapeHtml(service.modal_content || '')}</textarea>
            </div>
            <div class="form-group">
              <label>Características (una por línea)</label>
              <textarea class="editor-field editor-details" data-path="services.items.${idx}.features" rows="2" data-type="array">${(service.features || []).join('\n')}</textarea>
            </div>
          </div>
        </div>
      `;
    });

    html += `
        <div class="editor-actions">
          <button class="btn btn-primary" data-action="save">Guardar cambios</button>
        </div>
      </div>
    </div>`;
    return html;
  }

  renderPathologiesEditor() {
    const data = this.content.pathologies;
    let html = `<div class="section-editor">
      <h2>Patologías</h2>
      <div class="editor-form">
        <div class="form-group">
          <label>Título de sección</label>
          <input type="text" class="editor-field" data-path="pathologies.title" value="${this.escapeHtml(data.title)}" />
        </div>
        <div class="form-group">
          <label>Subtítulo</label>
          <textarea class="editor-field" data-path="pathologies.subtitle" rows="2">${this.escapeHtml(data.subtitle)}</textarea>
        </div>

        <h3 style="margin-top: 2rem;">Patologías (${data.items.length})</h3>`;

    data.items.forEach((item, idx) => {
      html += `
        <div class="service-item" data-array-item="pathologies.items.${idx}">
          <div class="item-header">
            <h4>${this.escapeHtml(item.name)}</h4>
            <button class="btn btn-sm btn-danger" data-action="delete" data-path="pathologies.items" data-index="${idx}">
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
          <div class="form-group">
            <label>Nombre</label>
            <input type="text" class="editor-field" data-path="pathologies.items.${idx}.name" value="${this.escapeHtml(item.name)}" />
          </div>
          <div class="form-group">
            <label>Imagen (ruta)</label>
            <input type="text" class="editor-field" data-path="pathologies.items.${idx}.image" value="${item.image || ''}" />
          </div>
        </div>
      `;
    });

    html += `
        <button class="btn btn-ghost btn-add-item" data-action="add" data-path="pathologies.items">
          <span class="material-symbols-outlined">add</span>
          Añadir patología
        </button>

        <div class="editor-actions">
          <button class="btn btn-primary" data-action="save">Guardar cambios</button>
        </div>
      </div>
    </div>`;
    return html;
  }

  renderPricingEditor() {
    const data = this.content.pricing;
    let html = `<div class="section-editor">
      <h2>Tarifas</h2>
      <div class="editor-form">
        <div class="form-group">
          <label>Título de sección</label>
          <input type="text" class="editor-field" data-path="pricing.title" value="${this.escapeHtml(data.title)}" />
        </div>
        <div class="form-group">
          <label>Subtítulo</label>
          <textarea class="editor-field" data-path="pricing.subtitle" rows="2">${this.escapeHtml(data.subtitle)}</textarea>
        </div>
        <div class="form-group">
          <label>Nota inferior</label>
          <input type="text" class="editor-field" data-path="pricing.note" value="${this.escapeHtml(data.note)}" />
        </div>

        <h3 style="margin-top: 2rem;">Tarifas (${data.items.length})</h3>`;

    data.items.forEach((item, idx) => {
      html += `
        <div class="service-item" data-array-item="pricing.items.${idx}">
          <div class="item-header">
            <h4>${this.escapeHtml(item.title)}</h4>
            <button class="btn btn-sm btn-danger" data-action="delete" data-path="pricing.items" data-index="${idx}">
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
          <div class="form-group">
            <label>Título</label>
            <input type="text" class="editor-field" data-path="pricing.items.${idx}.title" value="${this.escapeHtml(item.title)}" />
          </div>
          <div class="form-group">
            <label>Descripción</label>
            <textarea class="editor-field" data-path="pricing.items.${idx}.description" rows="2">${this.escapeHtml(item.description)}</textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Precio</label>
              <input type="text" class="editor-field" data-path="pricing.items.${idx}.price" value="${this.escapeHtml(item.price)}" />
            </div>
            <div class="form-group">
              <label>Estilo</label>
              <select class="editor-field" data-path="pricing.items.${idx}.style">
                <option value="default" ${item.style === 'default' ? 'selected' : ''}>Normal</option>
                <option value="highlight" ${item.style === 'highlight' ? 'selected' : ''}>Destacado</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>Detalles (uno por línea)</label>
            <textarea class="editor-field editor-details" data-path="pricing.items.${idx}.details" rows="3" data-type="array">${(item.details || []).join('\n')}</textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>CTA - Texto</label>
              <input type="text" class="editor-field" data-path="pricing.items.${idx}.cta" value="${this.escapeHtml(item.cta)}" />
            </div>
            <div class="form-group">
              <label>CTA - URL</label>
              <input type="text" class="editor-field" data-path="pricing.items.${idx}.url" value="${this.escapeHtml(item.url)}" />
            </div>
          </div>
        </div>
      `;
    });

    html += `
        <button class="btn btn-ghost btn-add-item" data-action="add" data-path="pricing.items">
          <span class="material-symbols-outlined">add</span>
          Añadir tarifa
        </button>

        <h3 style="margin-top: 2rem;">Condiciones</h3>`;

    (data.terms || []).forEach((term, idx) => {
      html += `
        <div class="form-group" data-array-item="pricing.terms.${idx}" style="flex-direction: row; gap: 8px; align-items: center;">
          <input type="text" class="editor-field" data-path="pricing.terms.${idx}" value="${this.escapeHtml(term)}" style="flex: 1;" />
          <button class="btn btn-sm btn-danger" data-action="delete" data-path="pricing.terms" data-index="${idx}">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      `;
    });

    html += `
        <button class="btn btn-ghost btn-add-item" data-action="add" data-path="pricing.terms">
          <span class="material-symbols-outlined">add</span>
          Añadir condición
        </button>

        <div class="editor-actions">
          <button class="btn btn-primary" data-action="save">Guardar cambios</button>
        </div>
      </div>
    </div>`;
    return html;
  }

  renderContactEditor() {
    const data = this.content.contact;
    return `<div class="section-editor">
      <h2>Contacto</h2>
      <div class="editor-form">
        <div class="form-group">
          <label>Teléfono</label>
          <input type="tel" class="editor-field" data-path="contact.phone" value="${data.phone}" />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" class="editor-field" data-path="contact.email" value="${data.email}" />
        </div>
        <div class="form-group">
          <label>Instagram</label>
          <input type="text" class="editor-field" data-path="contact.social_handle" value="${data.social_handle}" />
        </div>
        <div class="form-group">
          <label>Ubicación</label>
          <input type="text" class="editor-field" data-path="contact.location" value="${data.location}" />
        </div>

        <div class="editor-actions">
          <button class="btn btn-primary" data-action="save">Guardar cambios</button>
        </div>
      </div>
    </div>`;
  }

  // ========== LISTENERS ==========

  attachEditorListeners(section) {
    const fields = document.querySelectorAll('.editor-field');
    fields.forEach(field => {
      field.addEventListener('change', () => {
        this.isModified = true;
      });
    });

    const saveBtn = document.querySelector('[data-action="save"]');
    if (saveBtn) {
      saveBtn.addEventListener('click', async () => {
        await this.saveSection(section);
      });
    }

    const cancelBtn = document.querySelector('[data-action="cancel"]');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        this.showSection(section);
      });
    }

    // Delete item buttons
    document.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const path = btn.getAttribute('data-path');
        const index = parseInt(btn.getAttribute('data-index'));
        this.deleteArrayItem(path, index, section);
      });
    });

    // Add item buttons
    document.querySelectorAll('[data-action="add"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const path = btn.getAttribute('data-path');
        this.addArrayItem(path, section);
      });
    });

    // Toggle modal fields
    document.querySelectorAll('[data-action="toggle-modal"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.getAttribute('data-target'));
        if (!target) return;
        const isHidden = target.style.display === 'none';
        target.style.display = isHidden ? 'block' : 'none';
        btn.querySelector('.material-symbols-outlined').textContent =
          isHidden ? 'expand_less' : 'expand_more';
      });
    });
  }

  deleteArrayItem(path, index, section) {
    const keys = path.split('.');
    let current = this.content;
    for (let i = 0; i < keys.length; i++) {
      current = current[keys[i]];
    }
    // current is now the array
    current.splice(index, 1);
    this.isModified = true;
    this.showSection(section);
  }

  addArrayItem(path, section) {
    const keys = path.split('.');
    let current = this.content;
    for (let i = 0; i < keys.length; i++) {
      current = current[keys[i]];
    }
    // current is now the array
    if (path === 'pathologies.items') {
      current.push({
        id: 'new_' + Date.now(),
        name: 'Nueva patología',
        image: ''
      });
    } else if (path === 'pricing.items') {
      current.push({
        id: 'new_' + Date.now(),
        title: 'Nueva tarifa',
        description: 'Descripción de la tarifa',
        price: '0€',
        details: [],
        cta: 'Reservar ahora',
        url: '#',
        style: 'default'
      });
    } else if (path === 'pricing.terms') {
      current.push('Nueva condición');
    }
    this.isModified = true;
    this.showSection(section);
  }

  async saveSection(section) {
    const fields = document.querySelectorAll('.editor-field');
    const updated = JSON.parse(JSON.stringify(this.content));

    fields.forEach(field => {
      const path = field.getAttribute('data-path');
      const type = field.getAttribute('data-type');
      let value = field.value;

      // Convertir textarea de detalles (una línea = un item del array)
      if (type === 'array') {
        value = value.split('\n').map(s => s.trim()).filter(s => s.length > 0);
      }

      this.setNestedValue(updated, path, value);
    });

    this.showLoading('Guardando cambios en GitHub...');
    try {
      await api.updateContent(updated, `Actualización: ${section}`);
      this.content = updated;
      this.isModified = false;

      this.showSuccess('Cambios guardados en GitHub');
      this.updateSyncStatus('Sincronizado');

      // Recargar sección
      setTimeout(() => this.showSection(section), 500);
    } catch (error) {
      this.showError('Error: ' + error.message);
    } finally {
      this.hideLoading();
    }
  }

  // ========== HISTORIAL ==========

  async showHistory() {
    try {
      const historyData = await api.getHistory(10);
      const historyList = document.getElementById('historyList');

      let html = '<div class="history-items">';
      historyData.history.forEach(item => {
        html += `
          <div class="history-item">
            <div class="history-commit">${item.commit}</div>
            <div class="history-message">${item.message}</div>
            <div class="history-meta">${item.author} • ${new Date(item.date).toLocaleString('es-ES')}</div>
          </div>
        `;
      });
      html += '</div>';

      historyList.innerHTML = html;
      document.getElementById('historyModal').style.display = 'flex';

      // Close modal
      document.querySelector('.modal-close').addEventListener('click', () => {
        document.getElementById('historyModal').style.display = 'none';
      });
    } catch (error) {
      this.showError('Error cargando historial: ' + error.message);
    }
  }

  // ========== PUBLISH ==========

  async publish() {
    if (!confirm('¿Publicar cambios a producción?')) return;

    this.showLoading('Publicando cambios...');
    try {
      // TODO: Implementar merge staging -> main
      this.showSuccess('Cambios publicados a producción');
    } catch (error) {
      this.showError('Error publicando: ' + error.message);
    } finally {
      this.hideLoading();
    }
  }

  // ========== UTILIDADES ==========

  setNestedValue(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  updateSyncStatus(status) {
    const syncStatus = document.getElementById('syncStatus');
    if (syncStatus) syncStatus.textContent = status;
  }

  showError(message) {
    const div = document.createElement('div');
    div.className = 'toast toast-error';
    div.textContent = message;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 5000);
  }

  showSuccess(message) {
    const div = document.createElement('div');
    div.className = 'toast toast-success';
    div.textContent = message;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 5000);
  }

  showLoading(message = 'Cargando...') {
    // Evitar duplicados
    this.hideLoading();
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.id = 'loadingOverlay';
    overlay.innerHTML = `
      <div class="loading-spinner"></div>
      <span class="loading-text">${message}</span>
    `;
    document.body.appendChild(overlay);
  }

  hideLoading() {
    const existing = document.getElementById('loadingOverlay');
    if (existing) existing.remove();
  }
}

// Inicializar app
const app = new AdminApp();
document.addEventListener('DOMContentLoaded', () => app.init());
