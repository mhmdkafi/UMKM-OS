import { Router, Request, Response } from 'express';
import { prisma } from '../index';

const router = Router();

// ==================== DASHBOARD SUMMARY ====================
router.get('/summary', async (req: Request, res: Response) => {
  try {
    const { business_id } = req.query;
    const bId = business_id ? String(business_id) : undefined;

    const whereClause = bId ? { business_id: bId } : {};

    // Business info
    const business = bId ? await prisma.business.findUnique({ where: { id: bId } }) : await prisma.business.findFirst();

    // Total transactions
    const transactions = await prisma.transaction.findMany({
      where: { ...whereClause, status: 'COMPLETED' },
      include: { items: { include: { product: { include: { recipes: { include: { ingredient: true } } } } } } },
      orderBy: { created_at: 'desc' },
    });

    const totalOmzet = transactions.reduce((sum, tx) => sum + tx.total_amount, 0);
    const totalTransactions = transactions.length;

    // Calculate actual COGS from recipes
    const totalCogs = transactions.reduce((tsum, tx) => {
      return tsum + tx.items.reduce((isum, item) => {
        const itemCogs = item.product.recipes.reduce((rsum, r) => {
          const costPerUnit = (r.ingredient as any).cost_per_unit || 0;
          return rsum + (r.quantity_used * costPerUnit * item.quantity);
        }, 0);
        return isum + itemCogs;
      }, 0);
    }, 0);

    const totalGrossProfit = totalOmzet - totalCogs;

    // Total expenses
    const expenses = await prisma.operationalExpense.findMany({ where: whereClause });
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Laba bersih = Gross Profit - Operational Expenses
    const labaBersih = totalGrossProfit - totalExpenses;
    const margin = totalOmzet > 0 ? Math.round((totalGrossProfit / totalOmzet) * 1000) / 10 : 0;

    // Low stock alerts
    const allIngredients = await prisma.ingredient.findMany({ where: whereClause });
    const lowStockItems = allIngredients.filter(ing => ing.stock <= ing.min_stock_alert);

    // Top products from transaction items
    const txItems = await prisma.transactionItem.findMany({
      where: { transaction: { ...whereClause, status: 'COMPLETED' } },
      include: { product: { include: { recipes: { include: { ingredient: true } } } } }
    });
    const productSalesMap: Record<string, { name: string; sales: number; revenue: number; cogs: number }> = {};
    txItems.forEach(item => {
      if (!productSalesMap[item.product_id]) {
        productSalesMap[item.product_id] = { name: item.product.name, sales: 0, revenue: 0, cogs: 0 };
      }
      productSalesMap[item.product_id].sales += item.quantity;
      productSalesMap[item.product_id].revenue += item.price_at_time * item.quantity;
      const itemCogs = item.product.recipes.reduce((rsum, r) => {
        const cpu = (r.ingredient as any).cost_per_unit || 0;
        return rsum + (r.quantity_used * cpu * item.quantity);
      }, 0);
      productSalesMap[item.product_id].cogs += itemCogs;
    });
    const topProducts = Object.values(productSalesMap)
      .sort((a, b) => (b.revenue - b.cogs) - (a.revenue - a.cogs))
      .slice(0, 5)
      .map(p => ({ name: p.name, sales: p.sales, revenue: p.revenue, grossProfit: p.revenue - p.cogs }));

    // Last 7 days chart data (daily aggregation)
    const now = new Date();
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(now.getDate() - i);
      const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const dayTxs = transactions.filter(tx => {
        const d = new Date(tx.created_at);
        return d >= dayStart && d < dayEnd;
      });
      const dayRevenue = dayTxs.reduce((s, tx) => s + tx.total_amount, 0);
    const dayProfit = dayTxs.reduce((tsum, tx) => {
      return tsum + tx.items.reduce((isum, item) => {
        const ic = item.product?.recipes?.reduce((rsum, r) => {
          return rsum + (r.quantity_used * ((r.ingredient as any).cost_per_unit || 0) * item.quantity);
        }, 0) ?? 0;
        return isum + ic;
      }, 0);
    }, 0);

      chartData.push({
        name: day.toLocaleDateString('id-ID', { weekday: 'short', day: '2-digit' }),
        revenue: dayRevenue,
        profit: dayRevenue - dayProfit,
      });
    }

    res.json({
      kpiCards: {
        totalOmzet,
        totalCogs,
        grossProfit: totalGrossProfit,
        labaBersih,
        margin,
        totalTransactions,
        totalExpenses,
        aov: totalTransactions > 0 ? Math.round(totalOmzet / totalTransactions) : 0,
      },
      lowStockAlerts: lowStockItems.map(ing => ({
        name: ing.name,
        stock: ing.stock,
        unit: ing.unit,
        minStock: ing.min_stock_alert,
      })),
      topProducts,
      chartData,
      businessName: business?.name || 'UMKM OS',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== REPORTS DATA ====================
router.get('/reports', async (req: Request, res: Response) => {
  try {
    const { business_id } = req.query;
    const bId = business_id ? String(business_id) : undefined;
    const whereClause = bId ? { business_id: bId } : {};

    const business = bId ? await prisma.business.findUnique({ where: { id: bId } }) : await prisma.business.findFirst();

    const transactions = await prisma.transaction.findMany({
      where: { ...whereClause, status: 'COMPLETED' },
      include: { items: { include: { product: { include: { recipes: { include: { ingredient: true } } } } } } }
    });
    const expenses = await prisma.operationalExpense.findMany({ where: whereClause });

    const totalPendapatan = transactions.reduce((sum, tx) => sum + tx.total_amount, 0);
    const totalCogs = transactions.reduce((tsum, tx) => {
      return tsum + tx.items.reduce((isum, item) => {
        return isum + item.product.recipes.reduce((rsum, r) => {
          return rsum + (r.quantity_used * ((r.ingredient as any).cost_per_unit || 0) * item.quantity);
        }, 0);
      }, 0);
    }, 0);
    const grossProfit = totalPendapatan - totalCogs;
    const totalPengeluaran = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    const expenseByCategory: Record<string, number> = {};
    expenses.forEach(exp => {
      expenseByCategory[exp.category] = (expenseByCategory[exp.category] || 0) + exp.amount;
    });

    res.json({
      businessName: business?.name || 'UMKM OS',
      pendapatan: {
        total: totalPendapatan,
        jumlahTransaksi: transactions.length,
      },
      cogs: {
        total: totalCogs,
      },
      grossProfit,
      pengeluaran: {
        total: totalPengeluaran,
        byCategory: expenseByCategory,
        items: expenses.map(exp => ({
          name: exp.name,
          amount: exp.amount,
          category: exp.category,
        })),
      },
      labaRugi: grossProfit - totalPengeluaran,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
