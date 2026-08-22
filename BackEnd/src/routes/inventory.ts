import { Router, Request, Response } from 'express';
import { prisma } from '../index';

const router = Router();

// ==================== GET ALL ====================
router.get('/', async (req: Request, res: Response) => {
  try {
    const { business_id } = req.query;
    const whereClause = business_id ? { business_id: String(business_id) } : {};

    const ingredients = await prisma.ingredient.findMany({
      where: whereClause,
      include: {
        inventory_movements: {
          orderBy: { created_at: 'desc' },
          take: 1,
        }
      }
    });
    const formatted = ingredients.map(ing => ({
      id: ing.id,
      business_id: ing.business_id,
      name: ing.name,
      category: 'Bahan Baku',
      stock: ing.stock,
      unit: ing.unit,
      minStock: ing.min_stock_alert,
      purchasePrice: ing.purchase_price,
      lastUpdate: ing.inventory_movements[0]?.created_at?.toISOString().split('T')[0] || '-',
      status: ing.stock <= ing.min_stock_alert ? 'Kritis' : (ing.stock <= ing.min_stock_alert * 2 ? 'Menipis' : 'Aman'),
    }));
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== CREATE (Add new ingredient) ====================
router.post('/', async (req: Request, res: Response) => {
  const { business_id, name, unit, stock, min_stock_alert, purchase_price } = req.body;
  try {
    const ingredient = await prisma.ingredient.create({
      data: {
        business_id,
        name,
        unit,
        stock: parseFloat(stock) || 0,
        min_stock_alert: parseFloat(min_stock_alert) || 0,
        purchase_price: parseFloat(purchase_price) || 0,
      }
    });

    // Log initial stock
    if (parseFloat(stock) > 0) {
      await prisma.inventoryMovement.create({
        data: {
          ingredient_id: ingredient.id,
          type: 'IN',
          quantity: parseFloat(stock),
          notes: 'Stok awal',
        }
      });
    }

    res.json({ success: true, ingredient });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create ingredient' });
  }
});

// ==================== UPDATE ====================
router.put('/:id', async (req: Request, res: Response) => {
  const { name, unit, min_stock_alert, purchase_price } = req.body;
  try {
    const ingredient = await prisma.ingredient.update({
      where: { id: req.params.id },
      data: {
        name,
        unit,
        min_stock_alert: parseFloat(min_stock_alert) || 0,
        purchase_price: parseFloat(purchase_price) || 0,
      },
    });
    res.json({ success: true, ingredient });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update ingredient' });
  }
});

// ==================== DELETE ====================
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.inventoryMovement.deleteMany({ where: { ingredient_id: req.params.id } });
    await prisma.productRecipe.deleteMany({ where: { ingredient_id: req.params.id } });
    await prisma.ingredient.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete ingredient' });
  }
});

// ==================== STOCK ADJUSTMENT ====================
router.post('/adjust', async (req: Request, res: Response) => {
  const { id, type, amount, notes, purchase_price } = req.body;
  try {
    const current = await prisma.ingredient.findUnique({ where: { id } });
    if (!current) return res.status(404).json({ error: 'Ingredient not found' });
    
    let newStock = current.stock;
    if (type === 'in') {
      newStock += parseFloat(amount);
    } else {
      newStock = Math.max(0, newStock - parseFloat(amount));
    }

    const ingredient = await prisma.ingredient.update({
      where: { id },
      data: {
        stock: newStock,
        ...(purchase_price !== undefined && purchase_price !== ''
          ? { purchase_price: parseFloat(purchase_price) || 0 }
          : {}),
      },
    });

    await prisma.inventoryMovement.create({
      data: {
        ingredient_id: id,
        type: type.toUpperCase(),
        quantity: parseFloat(amount),
        notes: notes || 'Manual adjustment',
      },
    });

    res.json({ success: true, ingredient });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== MOVEMENT HISTORY ====================
router.get('/:id/movements', async (req: Request, res: Response) => {
  try {
    const movements = await prisma.inventoryMovement.findMany({
      where: { ingredient_id: req.params.id },
      orderBy: { created_at: 'desc' },
      take: 50,
    });
    res.json(movements);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
