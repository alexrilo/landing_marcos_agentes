/**
 * Utilidades de GitHub
 * Usa Octokit SDK para leer/escribir content.json y assets/images/
 * 
 * Variables de entorno requeridas:
 * - GITHUB_TOKEN: Personal access token con permisos en el repo
 * - GITHUB_OWNER: Usuario/org dueño del repo (ej: "usuario")
 * - GITHUB_REPO: Nombre del repo (ej: "landing-marcos")
 * - GITHUB_BRANCH: Rama donde guardar (ej: "main", "main")
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { Octokit } from 'octokit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno desde el directorio padre (.env en admin-backend/)
dotenv.config({ path: join(__dirname, '..', '.env') });

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const OWNER = process.env.GITHUB_OWNER;
const REPO = process.env.GITHUB_REPO;
const BRANCH = process.env.GITHUB_BRANCH || 'main';
const CONTENT_FILE = 'content.json';

if (!OWNER || !REPO || !process.env.GITHUB_TOKEN) {
  console.error('⚠️  Faltan variables de entorno GitHub:', {
    OWNER: !!OWNER,
    REPO: !!REPO,
    GITHUB_TOKEN: !!process.env.GITHUB_TOKEN,
    BRANCH
  });
} else {
  console.log('✅ GitHub configurado:', {
    OWNER,
    REPO,
    BRANCH,
    TOKEN: process.env.GITHUB_TOKEN.slice(0, 10) + '...'
  });
}

/**
 * Obtiene el contenido actual de content.json desde GitHub
 * En desarrollo, usa fallback a archivo local si GitHub falla
 */
export async function getContent() {
  try {
    console.log(`📡 Intentando obtener content.json de GitHub...`);
    const response = await octokit.rest.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: CONTENT_FILE,
      ref: BRANCH
    });

    const content = Buffer.from(response.data.content, 'base64').toString();
    console.log('✅ Content.json obtenido de GitHub exitosamente');
    return JSON.parse(content);
  } catch (error) {
    console.warn(`⚠️  Error conectando a GitHub (${error.status}):`, error.message);
    
    // Fallback: leer archivo local en desarrollo
    if (process.env.NODE_ENV === 'development') {
      try {
        const localPath = join(__dirname, '..', '..', 'content.json');
        const localContent = readFileSync(localPath, 'utf-8');
        console.log('📁 Usando content.json local como fallback');
        return JSON.parse(localContent);
      } catch (localError) {
        console.error('❌ Error leyendo content.json local:', localError.message);
      }
    }
    
    return null;
  }
}

/**
 * Actualiza content.json en GitHub
 * En desarrollo con error de GitHub, guarda localmente
 */
export async function updateContent(contentObject, commitMessage) {
  try {
    const contentString = JSON.stringify(contentObject, null, 2);
    const encodedContent = Buffer.from(contentString).toString('base64');

    // Obtener SHA del archivo actual (necesario para actualizar)
    let currentSha;
    try {
      const current = await octokit.rest.repos.getContent({
        owner: OWNER,
        repo: REPO,
        path: CONTENT_FILE,
        ref: BRANCH
      });
      currentSha = current.data.sha;
    } catch {
      // Si no existe, crearemos archivo nuevo
      currentSha = null;
    }

    const updatePayload = {
      owner: OWNER,
      repo: REPO,
      path: CONTENT_FILE,
      message: commitMessage || 'Actualizar contenido',
      content: encodedContent,
      branch: BRANCH,
      committer: {
        name: 'Admin Panel',
        email: process.env.GITHUB_EMAIL || 'admin@landing.local'
      }
    };

    if (currentSha) {
      updatePayload.sha = currentSha;
    }

    const response = await octokit.rest.repos.createOrUpdateFileContents(updatePayload);

    console.log(`✅ Contenido actualizado en GitHub: ${response.data.commit.sha.slice(0, 7)}`);

    return {
      commit: response.data.commit.sha,
      html_url: response.data.commit.html_url,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('⚠️  Error actualizando en GitHub:', error.message);
    
    // Fallback: guardar localmente en desarrollo
    if (process.env.NODE_ENV === 'development') {
      try {
        const localPath = join(__dirname, '..', '..', 'content.json');
        const contentString = JSON.stringify(contentObject, null, 2);
        writeFileSync(localPath, contentString, 'utf-8');
        console.log('📁 Contenido guardado localmente (GitHub no disponible)');
        
        return {
          commit: 'local-' + Date.now(),
          timestamp: new Date().toISOString(),
          mode: 'local'
        };
      } catch (localError) {
        console.error('❌ Error guardando localmente:', localError.message);
        throw new Error('No se pudo guardar en GitHub ni localmente: ' + localError.message);
      }
    }
    
    throw error;
  }
}

/**
 * Sube una imagen a assets/images/ en GitHub
 */
export async function uploadImage(buffer, filepath) {
  try {
    const fullPath = `assets/images/${filepath}`;
    const encodedContent = buffer.toString('base64');

    // Obtener SHA si ya existe
    let currentSha;
    try {
      const current = await octokit.rest.repos.getContent({
        owner: OWNER,
        repo: REPO,
        path: fullPath,
        ref: BRANCH
      });
      currentSha = current.data.sha;
    } catch {
      // Archivo nuevo
      currentSha = null;
    }

    const uploadPayload = {
      owner: OWNER,
      repo: REPO,
      path: fullPath,
      message: `Agregar imagen: ${filepath}`,
      content: encodedContent,
      branch: BRANCH,
      committer: {
        name: 'Admin Panel',
        email: process.env.GITHUB_EMAIL || 'admin@landing.local'
      }
    };

    if (currentSha) {
      uploadPayload.sha = currentSha;
    }

    const response = await octokit.rest.repos.createOrUpdateFileContents(uploadPayload);

    // Construir URL pública
    const rawUrl = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${fullPath}`;

    console.log(`✅ Imagen subida: ${fullPath}`);

    return {
      url: rawUrl,
      commit: response.data.commit.sha,
      size: buffer.length
    };
  } catch (error) {
    console.error('Error subiendo imagen:', error.message);
    throw error;
  }
}

/**
 * Elimina una imagen de GitHub
 */
export async function deleteImage(filepath) {
  try {
    const fullPath = `assets/images/${filepath}`;

    const current = await octokit.rest.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: fullPath,
      ref: BRANCH
    });

    const response = await octokit.rest.repos.deleteFile({
      owner: OWNER,
      repo: REPO,
      path: fullPath,
      message: `Eliminar imagen: ${filepath}`,
      sha: current.data.sha,
      branch: BRANCH,
      committer: {
        name: 'Admin Panel',
        email: process.env.GITHUB_EMAIL || 'admin@landing.local'
      }
    });

    console.log(`✅ Imagen eliminada: ${filepath}`);
    return { success: true };
  } catch (error) {
    console.error('Error eliminando imagen:', error.message);
    throw error;
  }
}

/**
 * Obtiene historial de commits en content.json
 */
export async function getHistory(limit = 10) {
  try {
    const response = await octokit.rest.repos.listCommits({
      owner: OWNER,
      repo: REPO,
      path: CONTENT_FILE,
      per_page: limit
    });

    return response.data.map(commit => ({
      commit: commit.sha.slice(0, 7),
      author: commit.commit.author.name,
      date: commit.commit.author.date,
      message: commit.commit.message,
      html_url: commit.html_url
    }));
  } catch (error) {
    console.error('Error obteniendo historial:', error.message);
    return [];
  }
}

/**
 * Crea un pull request de main -> main
 * Útil para workflow pre -> prod
 */
export async function createPublishPR(title = 'Publicar cambios a producción') {
  try {
    const response = await octokit.rest.pulls.create({
      owner: OWNER,
      repo: REPO,
      title,
      head: BRANCH,
      base: 'main',
      body: '🚀 Cambios listos para producción.\nRevisar main y mergear cuando esté listo.'
    });

    console.log(`✅ PR creado: ${response.data.html_url}`);
    return {
      pr_number: response.data.number,
      url: response.data.html_url
    };
  } catch (error) {
    console.error('Error creando PR:', error.message);
    throw error;
  }
}

export default {
  getContent,
  updateContent,
  uploadImage,
  deleteImage,
  getHistory,
  createPublishPR
};
