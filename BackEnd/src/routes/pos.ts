import { Router, Request, Response } from 'express';
import { prisma } from '../index';

const router = Router();

// ==================== POS: CHECKOUT ====================
router.post('/checkout', async (req: Request, res: Response) => {
  const { business_id, cashier_id, customer_name, total_amount, payment_method, items } = req.body;

  try {
    // Get first business if not provided
    let bId = business_id;
    if (!bId) {
      const biz = await prisma.business.findFirst();
      bId = biz?.id;
    }
    // Get first user as cashier if not provided
    let cId = cashier_id;
    if (!cId) {
      const user = await prisma.user.findFirst({ where: { role: 'kasir' } });
      cId = user?.id || 'system';
    }

    const transaction = await prisma.$transaction(async (tx) => {
      const newTx = await tx.transaction.create({
        data: {
          business_id: bId,
          cashier_id: cId,
          customer_name: customer_name || 'Guest',
          total_amount: parseFloat(total_amount),
          payment_method: payment_method || 'TUNAI',
          status: 'COMPLETED',
          items: {
            create: items.map((item: any) => ({
              product_id: item.id,
              quantity: item.qty,
              price_at_time: item.price,
            })),
          },
        },
      });

      const alerts: string[] = [];

      // Deduct ingredient stock based on BOM or direct stock
      for (const item of items) {
        const recipes = await tx.productRecipe.findMany({
          where: { product_id: item.id },
        });

        if (recipes.length > 0) {
          // F&B Mode: Deduct Ingredients
          for (const recipe of recipes) {
            const totalUsed = recipe.quantity_used * item.qty;

            const ing = await tx.ingredient.findUnique({ where: { id: recipe.ingredient_id } });
            if (ing) {
              const newStock = Math.max(0, ing.stock - totalUsed);
              await tx.ingredient.update({
                where: { id: recipe.ingredient_id },
                data: { stock: newStock },
              });

              if (newStock <= ing.min_stock_alert) {
                 if (!alerts.includes(`Stok bahan ${ing.name} menipis/habis (sisa ${newStock} ${ing.unit})`)) {
                    alerts.push(`Stok bahan ${ing.name} menipis/habis (sisa ${newStock} ${ing.unit})`);
                 }
              }

              await tx.inventoryMovement.create({
                data: {
                  ingredient_id: recipe.ingredient_id,
                  type: 'OUT',
                  quantity: ing.stock - newStock,
                  notes: `POS Transaksi: ${newTx.id}`,
                },
              });
            }
          }
        } else {
          // Retail/Service Mode: Deduct Direct Stock if not a service
          const prod = await tx.product.findUnique({ where: { id: item.id } });
          if (prod && !(prod as any).is_service) {
            const currentStock = (prod as any).stock || 0;
            const newStock = Math.max(0, currentStock - item.qty);
            
            await tx.product.update({
              where: { id: item.id },
              data: { stock: newStock } as any,
            });

            if (newStock <= 5) {
               if (!alerts.includes(`Stok produk ${prod.name} menipis/habis (sisa ${newStock})`)) {
                  alerts.push(`Stok produk ${prod.name} menipis/habis (sisa ${newStock})`);
               }
            }
          }
        }
      }

      return { newTx, alerts };
    });

    res.json({ success: true, transaction: transaction.newTx, alerts: transaction.alerts });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Checkout failed' });
  }
});

// ==================== GET ALL TRANSACTIONS ====================
router.get('/transactions', async (req: Request, res: Response) => {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        items: {
          include: { product: true }
        }
      },
      take: 100,
    });

    const formatted = transactions.map(tx => ({
      id: tx.id,
      customer_name: tx.customer_name,
      total_amount: tx.total_amount,
      payment_method: tx.payment_method,
      status: tx.status,
      created_at: tx.created_at.toISOString(),
      items: tx.items.map(i => ({
        product_name: i.product.name,
        quantity: i.quantity,
        price: i.price_at_time,
      })),
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
