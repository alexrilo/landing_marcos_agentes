/**
 * Rutas de Autenticación
 */

import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';

/**
 * POST /api/auth/login
 * Valida credenciales y devuelve JWT token
 * 
 * Body: { password: string }
 * Response: { token: string, expiresIn: string }
 */
router.post('/login', async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ 
        error: { message: 'Se requiere contraseña' } 
      });
    }

    // En producción, esto debe ser comparado contra hash en DB o variable de entorno
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    if (!ADMIN_PASSWORD) {
      return res.status(500).json({
        error: { message: 'ADMIN_PASSWORD no configurada' }
      });
    }

    const isValid = password === ADMIN_PASSWORD;

    if (!isValid) {
      // Registrar intento fallido (opcional: implementar rate limiting)
      console.warn('❌ Intento de login fallido');
      return res.status(401).json({
        error: { message: 'Contraseña incorrecta' }
      });
    }

    const token = jwt.sign(
      { role: 'admin', timestamp: Date.now() },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ Login exitoso');
    res.json({
      token,
      expiresIn: '24h',
      user: { role: 'admin' }
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Error en autenticación',
        detail: error.message
      }
    });
  }
});

/**
 * Middleware de verificación de token
 */
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      error: { message: 'Token no proporcionado o formato inválido' }
    });
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.warn('❌ Token inválido o expirado');
    return res.status(401).json({
      error: { 
        message: 'Token inválido o expirado',
        detail: error.message
      }
    });
  }
};

export default router;
