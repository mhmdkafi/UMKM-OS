import { Router, Request, Response } from 'express';
import { prisma } from '../index';

const router = Router();

// ==================== DASHBOARD SUMMARY ====================
router.get('/summary', async (req: Request, res: Response) => {
  try {
    const businessId = typeof req.query.business_id === 'string' ? req.query.business_id : undefined;
    const businessFilter = businessId ? { business_id: businessId } : {};

    // Total transactions
    const transactions = await prisma.transaction.findMany({
      where: { ...businessFilter, status: 'COMPLETED' }
    });

    const totalOmzet = transactions.reduce((sum, tx) => sum + tx.total_amount, 0);
    const totalTransactions = transactions.length;

    // Total expenses
    const expenses = await prisma.operationalExpense.findMany({ where: businessFilter });
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Laba bersih
    const labaBersih = totalOmzet - totalExpenses;
    const margin = totalOmzet > 0 ? Math.round((labaBersih / totalOmzet) * 1000) / 10 : 0;

    // Low stock alerts
    const lowStock = await prisma.ingredient.findMany({
      where: {
        ...businessFilter,
        stock: { lte: prisma.ingredient.fields.min_stock_alert }
      }
    }).catch(() => []);
    // Workaround: just fetch all and filter
    const allIngredients = await prisma.ingredient.findMany({ where: businessFilter });
    const lowStockItems = allIngredients.filter(ing => ing.stock <= ing.min_stock_alert);

    // Top products from transaction items
    const txItems = await prisma.transactionItem.findMany({
      where: businessId ? { transaction: { business_id: businessId } } : {},
      include: { product: true }
    });
    const productSalesMap: Record<string, { name: string; sales: number; revenue: number }> = {};
    txItems.forEach(item => {
      if (!productSalesMap[item.product_id]) {
        productSalesMap[item.product_id] = { name: item.product.name, sales: 0, revenue: 0 };
      }
      const productSales = productSalesMap[item.product_id]!;
      productSales.sales += item.quantity;
      productSales.revenue += item.price_at_time * item.quantity;
    });
    const topProducts = Object.values(productSalesMap)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5)
      .map(p => ({ name: p.name, sales: p.sales, revenue: p.revenue }));

    // Recent transactions (last 7)
    const recentTx = await prisma.transaction.findMany({
      where: businessFilter,
      orderBy: { created_at: 'desc' },
      take: 7,
      include: { items: { include: { product: true } } }
    });

    res.json({
      kpiCards: {
        totalOmzet,
        labaBersih,
        margin,
        totalTransactions,
        totalExpenses,
      },
      lowStockAlerts: lowStockItems.map(ing => ({
        name: ing.name,
        stock: ing.stock,
        unit: ing.unit,
        minStock: ing.min_stock_alert,
      })),
      topProducts,
      recentTransactions: recentTx.map(tx => ({
        id: tx.id,
        customer_name: tx.customer_name,
        total_amount: tx.total_amount,
        payment_method: tx.payment_method,
        created_at: tx.created_at.toISOString(),
        items: tx.items.map(i => ({ name: i.product.name, qty: i.quantity })),
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== REPORTS DATA ====================
router.get('/reports', async (req: Request, res: Response) => {
  try {
    const businessId = typeof req.query.business_id === 'string' ? req.query.business_id : undefined;
    const businessFilter = businessId ? { business_id: businessId } : {};
    const transactions = await prisma.transaction.findMany({
      where: { ...businessFilter, status: 'COMPLETED' },
      include: { items: { include: { product: true } } }
    });
    const expenses = await prisma.operationalExpense.findMany({ where: businessFilter });

    const totalPendapatan = transactions.reduce((sum, tx) => sum + tx.total_amount, 0);
    const totalPengeluaran = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Group expenses by category
    const expenseByCategory: Record<string, number> = {};
    expenses.forEach(exp => {
      expenseByCategory[exp.category] = (expenseByCategory[exp.category] || 0) + exp.amount;
    });

    res.json({
      pendapatan: {
        total: totalPendapatan,
        jumlahTransaksi: transactions.length,
      },
      pengeluaran: {
        total: totalPengeluaran,
        byCategory: expenseByCategory,
        items: expenses.map(exp => ({
          name: exp.name,
          amount: exp.amount,
          category: exp.category,
        })),
      },
      labaRugi: totalPendapatan - totalPengeluaran,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
