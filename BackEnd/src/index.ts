import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
export const prisma = new PrismaClient();

app.use(cors());
// Gambar produk dikirim sebagai Base64 dari formulir etalase.
// Batas default Express (100 KB) membuat request produk dengan foto ditolak.
app.use(express.json({ limit: '10mb' }));

// Routes
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import posRoutes from './routes/pos';
import inventoryRoutes from './routes/inventory';
import expensesRoutes from './routes/expenses';
import employeesRoutes from './routes/employees';
import categoriesRoutes from './routes/categories';
import dashboardRoutes from './routes/dashboard';

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/pos', posRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'UMKM OS API is running!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 UMKM OS API Server running on http://localhost:${PORT}`);
});
