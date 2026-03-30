/**
 * Rutas de Contenido
 * Lee/escribe content.json en GitHub
 * Usa Octokit SDK para interactuar con GitHub API
 */

import express from 'express';
import { verifyToken } from './auth.js';
import { getContent, updateContent, getHistory } from '../utils/github.js';

const router = express.Router();

/**
 * GET /api/content
 * Obtiene el JSON de contenido actual
 * No requiere autenticación (público)
 * 
 * Response: content.json completo
 */
router.get('/', async (req, res) => {
  try {
    const content = await getContent();
    if (!content) {
      return res.status(404).json({
        error: { message: 'No se pudo obtener el contenido' }
      });
    }
    res.json(content);
  } catch (error) {
    console.error('Error obteniendo contenido:', error);
    res.status(500).json({
      error: {
        message: 'Error al obtener contenido',
        detail: error.message
      }
    });
  }
});

/**
 * GET /api/content/preview
 * Obtiene contenido en rama de staging (pre-producción)
 * Solo si existe diferencia de staging
 */
router.get('/preview', async (req, res) => {
  try {
    // TODO: Implementar si se quiere preview de staging
    res.json({ message: 'Preview no implementado aún' });
  } catch (error) {
    res.status(500).json({
      error: { message: 'Error en preview' }
    });
  }
});

/**
 * POST /api/content
 * Actualiza el content.json completo
 * 
 * Requiere: Bearer token en header Authorization
 * Body: { content: object, message?: string }
 * Response: { success: true, commit: string, timestamp: string }
 */
router.post('/', verifyToken, async (req, res) => {
  try {
    const { content, message } = req.body;

    if (!content || typeof content !== 'object') {
      return res.status(400).json({
        error: { message: 'Content debe ser un objeto JSON válido' }
      });
    }

    const result = await updateContent(
      content,
      message || 'Actualización de contenido desde admin panel'
    );

    if (!result) {
      return res.status(500).json({
        error: { message: 'Error al guardar contenido' }
      });
    }

    console.log(`✅ Contenido actualizado: ${result.commit}`);
    res.json({
      success: true,
      commit: result.commit,
      timestamp: new Date().toISOString(),
      message: 'Contenido guardado y pusheado a GitHub'
    });
  } catch (error) {
    console.error('Error actualizando contenido:', error);
    res.status(500).json({
      error: {
        message: 'Error al actualizar contenido',
        detail: error.message
      }
    });
  }
});

/**
 * PATCH /api/content
 * Actualiza una sección específica del contenido (merge parcial)
 * 
 * Requiere: Bearer token
 * Body: { section: string, data: object }
 * Response: { success: true, commit: string }
 */
router.patch('/', verifyToken, async (req, res) => {
  try {
    const { section, data } = req.body;

    if (!section || !data) {
      return res.status(400).json({
        error: { message: 'section y data son requeridos' }
      });
    }

    const currentContent = await getContent();
    if (!currentContent) {
      return res.status(500).json({
        error: { message: 'No se pudo obtener contenido actual' }
      });
    }

    // Merge de sección
    const updatedContent = {
      ...currentContent,
      [section]: {
        ...currentContent[section],
        ...data
      }
    };

    const result = await updateContent(
      updatedContent,
      `Actualización de sección: ${section}`
    );

    res.json({
      success: true,
      commit: result.commit,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: { message: 'Error en actualización parcial' }
    });
  }
});

/**
 * GET /api/content/history
 * Obtiene historial de cambios en GitHub
 * 
 * Query params:
 * - limit: número de commits a obtener (default: 10)
 * 
 * Response: [ { commit, author, date, message }, ... ]
 */
router.get('/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const history = await getHistory(limit);

    res.json({
      history,
      count: history.length
    });
  } catch (error) {
    res.status(500).json({
      error: { message: 'Error obteniendo historial' }
    });
  }
});

export default router;
