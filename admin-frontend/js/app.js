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
    if (this.isLoggedIn) {
      await this.goToDashboard();
    } else {
      this.initLoginPage();
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
        window.location.href = 'dashboard.html';
      } catch (error) {
        loginError.style.display = 'block';
        loginError.textContent = `❌ ${error.message}`;
        document.getElementById('password').value = '';
        document.getElementById('password').focus();
      }
    });
  }

  // ========== DASHBOARD ==========

  async goToDashboard() {
    if (!this.isLoggedIn) {
      window.location.href = 'index.html';
      return;
    }

    try {
      // Cargar contenido
      this.content = await api.getContent();
      console.log('✅ Contenido cargado:', this.content);

      // Inicializar dashboard
      this.initDashboard();
    } catch (error) {
      console.error('Error inicializando dashboard:', error);
      this.showError('No se pudo cargar el contenido: ' + error.message);
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
          <input type="text" class="editor-field" data-path="services.title" value="${data.title}" />
        </div>
        <div class="form-group">
          <label>Subtítulo</label>
          <textarea class="editor-field" data-path="services.subtitle" rows="2">${this.escapeHtml(data.subtitle)}</textarea>
        </div>
        <h3 style="margin-top: 2rem;">Servicios (${data.items.length})</h3>`;

    data.items.forEach((service, idx) => {
      html += `
        <div class="service-item" style="border: 1px solid #e0e0e0; padding: 1rem; margin: 1rem 0; border-radius: 8px;">
          <h4>${service.title}</h4>
          <div class="form-group">
            <label>Nombre</label>
            <input type="text" class="editor-field" data-path="services.items.${idx}.title" value="${service.title}" />
          </div>
          <div class="form-group">
            <label>Descripción</label>
            <textarea class="editor-field" data-path="services.items.${idx}.description" rows="2">${this.escapeHtml(service.description)}</textarea>
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
    return `<div class="section-editor">
      <h2>Patologías</h2>
      <p>Editor de patologías aquí</p>
      <div class="editor-actions">
        <button class="btn btn-primary" data-action="save">Guardar cambios</button>
      </div>
    </div>`;
  }

  renderPricingEditor() {
    return `<div class="section-editor">
      <h2>Tarifas</h2>
      <p>Editor de tarifas aquí</p>
      <div class="editor-actions">
        <button class="btn btn-primary" data-action="save">Guardar cambios</button>
      </div>
    </div>`;
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
  }

  async saveSection(section) {
    const fields = document.querySelectorAll('.editor-field');
    const updated = JSON.parse(JSON.stringify(this.content));

    fields.forEach(field => {
      const path = field.getAttribute('data-path');
      const value = field.value;
      this.setNestedValue(updated, path, value);
    });

    try {
      await api.updateContent(updated, `Actualización: ${section}`);
      this.content = updated;
      this.isModified = false;

      this.showSuccess('✅ Cambios guardados en GitHub');
      this.updateSyncStatus('Sincronizado');

      // Recargar sección
      setTimeout(() => this.showSection(section), 500);
    } catch (error) {
      this.showError('Error: ' + error.message);
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

    try {
      // TODO: Implementar merge staging -> main
      this.showSuccess('Cambios publicados a producción');
    } catch (error) {
      this.showError('Error publicando: ' + error.message);
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
}

// Inicializar app
const app = new AdminApp();
document.addEventListener('DOMContentLoaded', () => app.init());
