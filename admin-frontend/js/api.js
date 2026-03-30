/**
 * API Client
 * Wrapper para llamadas HTTP al backend
 */

class AdminAPI {
  constructor() {
    // En desarrollo, usa localhost; en producción, usa dominio
    const isDev = window.location.hostname === 'localhost' || 
                  window.location.hostname === '127.0.0.1' ||
                  window.location.port === '5500' ||
                  window.location.port === '3000';
    this.baseURL = isDev ? 'http://localhost:3001' : 'https://landing-marcos-agentes.vercel.app';
    this.token = localStorage.getItem('admin_token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('admin_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('admin_token');
  }

  getHeaders(includeAuth = true) {
    const headers = { 'Content-Type': 'application/json' };
    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  /**
   * POST /api/auth/login
   */
  async login(password) {
    const res = await fetch(`${this.baseURL}/api/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify({ password })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Login fallido');

    this.setToken(data.token);
    return data;
  }

  /**
   * GET /api/content
   */
  async getContent() {
    const res = await fetch(`${this.baseURL}/api/content`, {
      method: 'GET',
      headers: this.getHeaders(false)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Error obteniendo contenido');

    return data;
  }

  /**
   * POST /api/content
   */
  async updateContent(content, message = 'Actualización desde admin panel') {
    const res = await fetch(`${this.baseURL}/api/content`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ content, message })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Error guardando contenido');

    return data;
  }

  /**
   * PATCH /api/content
   * Actualiza solo una sección
   */
  async updateSection(section, data, message = `Actualización: ${section}`) {
    const res = await fetch(`${this.baseURL}/api/content`, {
      method: 'PATCH',
      headers: this.getHeaders(true),
      body: JSON.stringify({ section, data })
    });

    const responseData = await res.json();
    if (!res.ok) throw new Error(responseData.error?.message || 'Error actualizando sección');

    return responseData;
  }

  /**
   * POST /api/images
   */
  async uploadImage(file, folder = '') {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) formData.append('folder', folder);

    const res = await fetch(`${this.baseURL}/api/images`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.token}` },
      body: formData
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Error subiendo imagen');

    return data;
  }

  /**
   * GET /api/content/history
   */
  async getHistory(limit = 10) {
    const res = await fetch(`${this.baseURL}/api/content/history?limit=${limit}`, {
      method: 'GET',
      headers: this.getHeaders(false)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Error obteniendo historial');

    return data;
  }

  /**
   * Verifica si el token es válido
   */
  isAuthenticated() {
    return !!this.token;
  }
}

// Instancia global
const api = new AdminAPI();
