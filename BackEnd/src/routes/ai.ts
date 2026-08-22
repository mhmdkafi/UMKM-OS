import { Router, Request, Response } from 'express';
import { prisma } from '../index';

const router = Router();

// ==================== AI QUERY ====================
router.post('/query', async (req: Request, res: Response) => {
  try {
    const { question, business_id } = req.body;
    if (!question) return res.status(400).json({ error: 'Question is required' });

    const bId = business_id ? String(business_id) : undefined;
    const whereClause = bId ? { business_id: bId } : {};

    // Fetch actual business data to ground the AI response
    const [transactions, expenses, ingredients, products] = await Promise.all([
      prisma.transaction.findMany({
        where: { ...whereClause, status: 'COMPLETED' },
        include: { items: { include: { product: { include: { recipes: { include: { ingredient: true } } } } } } },
        orderBy: { created_at: 'desc' },
        take: 100,
      }),
      prisma.operationalExpense.findMany({ where: whereClause }),
      prisma.ingredient.findMany({ where: whereClause }),
      prisma.product.findMany({ where: whereClause, include: { recipes: { include: { ingredient: true } } } }),
    ]);

    // Calculate key metrics
    const totalRevenue = transactions.reduce((s, tx) => s + tx.total_amount, 0);
    const totalCogs = transactions.reduce((ts, tx) =>
      ts + tx.items.reduce((is, item) =>
        is + item.product.recipes.reduce((rs, r) =>
          rs + (r.quantity_used * ((r.ingredient as any).cost_per_unit || 0) * item.quantity), 0), 0), 0);
    const grossProfit = totalRevenue - totalCogs;
    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
    const netProfit = grossProfit - totalExpenses;
    const margin = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : '0';
    const aov = transactions.length > 0 ? Math.round(totalRevenue / transactions.length) : 0;

    // Last 7 days
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);
    const recentTx = transactions.filter(tx => new Date(tx.created_at) >= weekAgo);
    const recentRevenue = recentTx.reduce((s, tx) => s + tx.total_amount, 0);
    const recentExpenses = expenses
      .filter(e => new Date(e.expense_date) >= weekAgo)
      .reduce((s, e) => s + e.amount, 0);

    // Low stock items
    const lowStockItems = ingredients.filter(i => i.stock <= i.min_stock_alert);

    // Top products by gross profit
    const productMap: Record<string, { name: string; qty: number; revenue: number; cogs: number }> = {};
    transactions.forEach(tx => {
      tx.items.forEach(item => {
        if (!productMap[item.product_id]) {
          productMap[item.product_id] = { name: item.product?.name ?? 'Unknown', qty: 0, revenue: 0, cogs: 0 };
        }
        productMap[item.product_id].qty += item.quantity;
        productMap[item.product_id].revenue += item.price_at_time * item.quantity;
        const ic = item.product?.recipes?.reduce((rs, r) =>
          rs + (r.quantity_used * ((r.ingredient as any).cost_per_unit || 0) * item.quantity), 0) ?? 0;
        productMap[item.product_id].cogs += ic;
      });
    });
    const topByProfit = Object.values(productMap)
      .sort((a, b) => (b.revenue - b.cogs) - (a.revenue - a.cogs))
      .slice(0, 3);

    // Build contextual data snapshot
    const dataContext = {
      totalTransactions: transactions.length,
      totalRevenue,
      totalCogs,
      grossProfit,
      totalExpenses,
      netProfit,
      marginPct: margin,
      aov,
      recentRevenue7d: recentRevenue,
      recentExpenses7d: recentExpenses,
      lowStockCount: lowStockItems.length,
      lowStockItems: lowStockItems.map(i => `${i.name} (${i.stock} ${i.unit})`),
      topProducts: topByProfit.map(p => `${p.name}: ${p.qty} terjual, laba Rp ${(p.revenue - p.cogs).toLocaleString('id-ID')}`),
      dataAvailable: transactions.length > 0,
    };

    const fmt = (v: number) => `Rp ${v.toLocaleString('id-ID')}`;
    const q = question.toLowerCase();

    // Structured rule-based AI response (grounded in data)
    let answer = '';
    let factData: Record<string, any> = {};
    let recommendation = '';

    if (!dataContext.dataAvailable) {
      answer = 'Data transaksi belum tersedia. Silakan catat transaksi terlebih dahulu melalui halaman Kasir (POS) sebelum melakukan analisis.';
    } else if (q.includes('laba bersih') || q.includes('net profit') || q.includes('profit bersih')) {
      answer = `[FAKTA DATA] Laba bersih bisnis Anda hingga saat ini adalah ${fmt(netProfit)}.\n\nRincian:\n• Total Omzet: ${fmt(totalRevenue)}\n• HPP/COGS: ${fmt(totalCogs)}\n• Laba Kotor: ${fmt(grossProfit)}\n• Total Pengeluaran Operasional: ${fmt(totalExpenses)}`;
      factData = { netProfit, grossProfit, totalRevenue, totalCogs, totalExpenses };
      recommendation = netProfit > 0
        ? `Laba bersih Anda positif dengan margin ${margin}%. ${totalExpenses === 0 ? 'Namun belum ada pengeluaran operasional yang dicatat — pastikan catat semua biaya (sewa, gaji, listrik) agar angka ini benar-benar akurat.' : 'Pertahankan pengeluaran operasional yang efisien.'}`
        : 'Bisnis Anda sedang rugi. Tinjau ulang harga jual atau kurangi pengeluaran operasional.';
    } else if (q.includes('omzet') || q.includes('revenue') || q.includes('pendapatan')) {
      answer = `[FAKTA DATA] Total omzet bisnis Anda adalah ${fmt(totalRevenue)} dari ${dataContext.totalTransactions} transaksi. Rata-rata nilai per transaksi (AOV): ${fmt(aov)}.`;
      factData = { totalRevenue, totalTransactions: dataContext.totalTransactions, aov };
      recommendation = `Untuk meningkatkan omzet, pertimbangkan strategi upselling atau bundling produk.`;
    } else if (q.includes('produk') && (q.includes('terlaris') || q.includes('menguntungkan') || q.includes('terbaik'))) {
      if (topByProfit.length === 0) {
        answer = 'Belum ada data transaksi untuk menentukan produk terlaris.';
      } else {
        answer = `[FAKTA DATA] Produk paling menguntungkan berdasarkan laba kotor:\n${topByProfit.map((p, i) => `${i + 1}. ${p.name} — ${p.qty} terjual, laba ${fmt(p.revenue - p.cogs)}`).join('\n')}`;
        factData = { topProducts: topByProfit };
        recommendation = `Prioritaskan ketersediaan stok bahan baku untuk produk-produk di atas dan pertimbangkan promo bundle.`;
      }
    } else if (q.includes('stok') || q.includes('bahan') || q.includes('persediaan')) {
      if (lowStockItems.length === 0) {
        answer = `[FAKTA DATA] Semua ${ingredients.length} bahan baku dalam kondisi stok aman.`;
      } else {
        answer = `[FAKTA DATA] Terdapat ${lowStockItems.length} bahan baku yang stoknya menipis atau habis:\n${dataContext.lowStockItems.join('\n')}`;
        factData = { lowStockItems: dataContext.lowStockItems };
        recommendation = 'Segera lakukan restock sebelum bahan habis untuk menghindari kehilangan penjualan.';
      }
    } else if (q.includes('pengeluaran') || q.includes('biaya') || q.includes('expense')) {
      if (expenses.length === 0) {
        answer = '[INFORMASI] Belum ada pengeluaran operasional yang dicatat. Catat biaya-biaya seperti sewa, gaji, dan listrik di menu Pengeluaran agar Laba Bersih terhitung akurat.';
      } else {
        const topExp = expenses.sort((a, b) => b.amount - a.amount).slice(0, 3);
        answer = `[FAKTA DATA] Total pengeluaran operasional: ${fmt(totalExpenses)}.\nPengeluaran terbesar:\n${topExp.map(e => `• ${e.name}: ${fmt(e.amount)} (${e.category})`).join('\n')}`;
        factData = { totalExpenses, topExpenses: topExp };
        recommendation = 'Tinjau pengeluaran Fixed Cost secara berkala dan cari peluang efisiensi.';
      }
    } else if (q.includes('margin')) {
      answer = `[FAKTA DATA] Margin laba kotor bisnis Anda saat ini adalah ${margin}%.\n• Omzet: ${fmt(totalRevenue)}\n• HPP (COGS): ${fmt(totalCogs)}\n• Laba Kotor: ${fmt(grossProfit)}`;
      factData = { margin, totalRevenue, totalCogs, grossProfit };
      recommendation = parseFloat(margin) >= 40
        ? 'Margin Anda sehat (≥40%). Fokus pada volume penjualan.'
        : parseFloat(margin) >= 20
          ? 'Margin cukup. Pertimbangkan audit harga beli bahan baku untuk mengoptimalkan COGS.'
          : 'Margin rendah (<20%). Tinjau ulang harga jual atau negosiasikan harga beli bahan baku.';
    } else {
      answer = `[FAKTA DATA] Berikut ringkasan bisnis Anda:\n• Omzet: ${fmt(totalRevenue)} (${dataContext.totalTransactions} transaksi)\n• HPP/COGS: ${fmt(totalCogs)}\n• Laba Kotor: ${fmt(grossProfit)} (margin ${margin}%)\n• Pengeluaran Operasional: ${fmt(totalExpenses)}\n• Laba Bersih: ${fmt(netProfit)}\n• AOV: ${fmt(aov)}`;
      factData = dataContext;
      recommendation = 'Anda dapat bertanya lebih spesifik, misalnya: "Produk apa yang paling menguntungkan?", "Berapa laba bersih saya?", atau "Stok bahan baku apa yang menipis?"';
    }

    res.json({
      success: true,
      data: {
        answer,
        metrics: factData,
        recommendation,
      }
    });
  } catch (err) {
    console.error('AI query error:', err);
    res.status(500).json({ error: 'Failed to process query' });
  }
});

export default router;
