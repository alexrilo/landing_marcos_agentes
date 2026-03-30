/**
 * Admin Backend Server
 * API Node.js/Express para gestión de contenido landing page
 * 
 * Endpoints:
 * - POST /api/auth/login - Autenticación
 * - GET /api/content - Obtener contenido actual
 * - POST /api/content - Guardar cambios (requiere auth)
 * - POST /api/images - Subir imagen (requiere auth)
 * - GET /api/history - Historial de cambios
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRouter from './routes/auth.js';
import contentRouter from './routes/content.js';
import imageRouter from './routes/images.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : [
    'http://localhost:3000',
    'https://landing-marcos-agentes-ceiq.vercel.app'
  ];
// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rutas de autenticación
app.use('/api/auth', authRouter);

// Rutas de contenido
app.use('/api/content', contentRouter);

// Rutas de imágenes
app.use('/api/images', imageRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      status: err.status || 500
    }
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: { message: 'Ruta no encontrada' } });
});

app.get('/api/debug-cors', (req, res) => {
  res.json({
    allowedOrigins,
    envValue: process.env.ALLOWED_ORIGINS || null
  });
});

app.listen(PORT, () => {
  console.log(`✅ Admin API escuchando en puerto ${PORT}`);
  console.log(`📊 Endpoints disponibles:`);
  console.log(`   POST /api/auth/login`);
  console.log(`   GET  /api/content`);
  console.log(`   POST /api/content`);
  console.log(`   POST /api/images`);
  console.log(`   GET  /api/history`);
});
