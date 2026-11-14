/**
 * FarmDrop Sauces - Production-Ready Backend Server
 * Node.js & Express.js
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Route Handlers
const statusRoutes = require('./routes/status');
const productsRoutes = require('./routes/products');
const chatRoutes = require('./routes/chat');
const contactRoutes = require('./routes/contact');
const ordersRoutes = require('./routes/orders');
const newsletterRoutes = require('./routes/newsletter');

// Middleware
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// 1. CORS Configuration
// Compatible with Cloudflare Pages, Vercel, and local dev
// ==========================================
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'http://localhost:5500',
  'http://localhost:8080',
  'http://127.0.0.1:5500',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:8080',
  'http://127.0.0.1:5000',
  'https://farm-drop-sauces.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow non-browser requests (curl, server-to-server, mobile apps)
    if (!origin) return callback(null, true);

    // Explicitly allowed origins
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }

    // Cloudflare Pages (*.pages.dev), Workers, Vercel, and localhost with any port
    const isCloudflare = origin.endsWith('.pages.dev') || origin.endsWith('.workers.dev') || origin.includes('cloudflare');
    const isVercel = origin.endsWith('.vercel.app');
    const isLocal = origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:');

    if (isCloudflare || isVercel || isLocal || process.env.FRONTEND_URL === '*') {
      return callback(null, true);
    }

    // Permissive fallback so cross-origin evaluation never blocks legitimate requests
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ==========================================
// 2. Request Parsing Middleware
// ==========================================
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Simple request logger for incoming calls
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// ==========================================
// 3. Welcome / Root Endpoint
// ==========================================
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'FarmDrop Sauces API',
    tagline: 'From Farm to Flavor — Freshness in Every Drop 🌿',
    status: 'running',
    version: '1.0.0',
    documentation: '/backend/README.md',
    endpoints: {
      serverStatus: 'GET /api/status',
      products: 'GET /api/products',
      singleProduct: 'GET /api/products/:id',
      chatbot: 'POST /api/chat',
      contact: 'POST /api/contact',
      orders: 'POST /api/orders',
      newsletter: 'POST /api/newsletter'
    }
  });
});

// Health check endpoint for Render and Cloudflare ping
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ==========================================
// 4. API Routes Mounting
// ==========================================
app.use('/api/status', statusRoutes);
app.use('/api/health', statusRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/chatbot', chatRoutes); // Alias
app.use('/api/contact', contactRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/newsletter', newsletterRoutes);

// ==========================================
// 5. Error Handling Middleware
// ==========================================
app.use(notFoundHandler);
app.use(errorHandler);

// ==========================================
// 6. Server Initialization
// ==========================================
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n=================================================`);
  console.log(`🌿 FarmDrop Sauces Backend API Server is Running!`);
  console.log(`=================================================`);
  console.log(`📡 Local URL:        http://localhost:${PORT}`);
  console.log(`📊 Health Check:    http://localhost:${PORT}/api/status`);
  console.log(`🍅 Products API:    http://localhost:${PORT}/api/products`);
  console.log(`💬 Chatbot API:     http://localhost:${PORT}/api/chat`);
  console.log(`📬 Contact API:     http://localhost:${PORT}/api/contact`);
  console.log(`🛒 Orders API:      http://localhost:${PORT}/api/orders`);
  console.log(`🌍 Environment:     ${process.env.NODE_ENV || 'development'}`);
  console.log(`=================================================\n`);
});

module.exports = { app, server };
