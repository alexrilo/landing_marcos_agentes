/**
 * Rutas de Imágenes
 * Upload, compress y push a GitHub
 */

import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { verifyToken } from './auth.js';
import { uploadImage, deleteImage } from '../utils/github.js';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Formato de imagen no permitido'));
    }
  }
});

/**
 * POST /api/images
 * Sube una imagen, la comprime y la pushea a GitHub en assets/images/
 * 
 * Requiere: Bearer token
 * Form data: file (image), folder? (subfolder en assets/images)
 * Response: { success: true, url: string, size: number }
 */
router.post('/', verifyToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: { message: 'No se envió archivo' }
      });
    }

    const originalName = req.file.originalname;
    const folder = req.body.folder || '';
    const filename = originalName.replace(/\s+/g, '-').toLowerCase();

    // Optimizar imagen
    let compressedBuffer;
    try {
      compressedBuffer = await sharp(req.file.buffer)
        .resize(2000, 2000, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ quality: 80 })
        .toBuffer();

      // Cambiar extensión a .webp
      const webpFilename = filename.replace(/\.[^.]+$/, '.webp');
      const filepath = folder ? `${folder}/${webpFilename}` : webpFilename;

      const result = await uploadImage(compressedBuffer, filepath);

      res.json({
        success: true,
        url: result.url,
        size: compressedBuffer.length,
        filename: webpFilename
      });
    } catch (sharpError) {
      console.error('Error comprimiendo imagen:', sharpError);
      throw sharpError;
    }
  } catch (error) {
    console.error('Error en upload:', error);
    res.status(500).json({
      error: {
        message: 'Error al subir imagen',
        detail: error.message
      }
    });
  }
});

/**
 * DELETE /api/images
 * Elimina una imagen de GitHub
 * 
 * Requiere: Bearer token
 * Body: { filepath: string }
 * Response: { success: true }
 */
router.delete('/', verifyToken, async (req, res) => {
  try {
    const { filepath } = req.body;

    if (!filepath) {
      return res.status(400).json({
        error: { message: 'filepath es requerido' }
      });
    }

    const result = await deleteImage(filepath);

    res.json({
      success: true,
      message: 'Imagen eliminada'
    });
  } catch (error) {
    res.status(500).json({
      error: { message: 'Error al eliminar imagen' }
    });
  }
});

export default router;
