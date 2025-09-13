import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import des routes
import expenseRoutes from './routes/expenseRoutes.js';
import incomeRoutes from './routes/incomeRoutes.js';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

dotenv.config();

const app = express();
const PORT = 3000;

// ✅ CORS config VITE-compatible
const allowedOrigins = [
  'http://localhost:5173'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares globaux
app.use(express.json());

// ✅ Route de test
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
    port: PORT,
    frontend: allowedOrigins[0],
  });
});

// ✅ Routes principales
app.use('/api/auth', authRoutes);
app.use('/expenses', expenseRoutes);
app.use('/incomes', incomeRoutes);
app.use('/categories', categoryRoutes);
app.use('/dashboard', dashboardRoutes);

// 404 - Route inconnue
app.use((req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.status = 404;
  next(error);
});

// Gestion globale des erreurs
app.use((err, req, res) => {
  console.error('Erreur globale :', err);

  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message,
  });
});

// ✅ Démarrage du serveur
app.listen(PORT, () => {
  console.log('🚀 Backend lancé !');
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`🔗 Frontend autorisé : ${allowedOrigins[0]}`);
});
