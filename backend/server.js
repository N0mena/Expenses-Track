import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import expenseRoutes from './routes/expenseRoutes.js';
import incomeRoutes from './routes/incomeRoutes.js';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

dotenv.config();

const app = express();
const PORT = 3000;


const allowedOrigins = [
  'http://localhost:5173'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
    port: PORT,
    frontend: allowedOrigins[0],
  });
});

app.use('/api/auth', authRoutes);
app.use('/expenses', expenseRoutes);
app.use('/incomes', incomeRoutes);
app.use('/categories', categoryRoutes);
app.use('/dashboard', dashboardRoutes);

app.use((req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.status = 404;
  next(error);
});

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

app.listen(PORT, () => {
  console.log(' Backend lancé !');
  console.log(` http://localhost:${PORT}`);
  console.log(` Frontend autorisé : ${allowedOrigins[0]}`);
});
