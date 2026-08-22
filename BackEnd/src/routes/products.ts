import { Router, Request, Response } from 'express';
import { prisma } from '../index';

const router = Router();

// ==================== GET ALL ====================
router.get('/', async (req: Request, res: Response) => {
  try {
    const { business_id } = req.query;
    const whereClause = business_id ? { business_id: String(business_id) } : {};

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
        recipes: {
          include: { ingredient: true }
        }
      },
    });

    const formattedProducts = products.map(p => {
      let calculatedStock = 0;
      
      if ((p as any).is_service) {
        calculatedStock = 999; // Layanana/Jasa tidak terbatas
      } else if (p.recipes && p.recipes.length > 0) {
        // Mode F&B: Hitung stok maksimal dari ketersediaan bahan baku
        const possibleQuantities = p.recipes.map((r: any) => {
          if (r.quantity_used <= 0) return 999;
          return Math.floor(r.ingredient.stock / r.quantity_used);
        });
        calculatedStock = Math.min(...possibleQuantities);
        if (calculatedStock < 0) calculatedStock = 0;
      } else {
        // Mode Retail: Ambil stok langsung
        calculatedStock = (p as any).stock || 0;
      }

      const totalCogs = p.recipes.reduce((sum, r) => sum + (r.quantity_used * ((r.ingredient as any).cost_per_unit || 0)), 0);
      const margin = p.price > 0 ? Math.round((1 - totalCogs / p.price) * 100) : 0;

      return {
        id: p.id,
        business_id: p.business_id,
        name: p.name,
        price: p.price,
        category: p.category.name,
        category_id: p.category_id,
        image: p.image_url,
        stock: calculatedStock,
        cogs: totalCogs,
        margin,
        recipe: p.recipes.map(r => ({
          id: r.id,
          item: r.ingredient.name,
          qty: String(r.quantity_used),
          unit: r.ingredient.unit,
          ingredient_id: r.ingredient_id,
          cost_per_unit: (r.ingredient as any).cost_per_unit || 0,
        })),
      };
    });

    res.json(formattedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== GET ONE ====================
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: {
        category: true,
        recipes: { include: { ingredient: true } }
      },
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== CREATE ====================
router.post('/', async (req: Request, res: Response) => {
  const { business_id, name, price, category_id, image_url, recipes, stock, is_service } = req.body;
  try {
    const product = await prisma.product.create({
      data: {
        business_id,
        name,
        price: parseFloat(price),
        category_id,
        image_url: image_url || null,
        stock: stock ? parseFloat(stock) : 0,
        is_service: is_service === true || is_service === 'true',
        recipes: recipes?.length ? {
          create: recipes.map((r: any) => ({
            ingredient_id: r.ingredient_id,
            quantity_used: parseFloat(r.quantity_used),
          })),
        } : undefined,
      },
      include: {
        category: true,
        recipes: { include: { ingredient: true } }
      },
    });
    res.json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// ==================== UPDATE ====================
router.put('/:id', async (req: Request, res: Response) => {
  const { name, price, category_id, image_url, recipes, stock, is_service } = req.body;
  try {
    // Delete old recipes and recreate
    await prisma.productRecipe.deleteMany({ where: { product_id: req.params.id } });

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        name,
        price: parseFloat(price),
        category_id,
        image_url: image_url || null,
        stock: stock !== undefined ? parseFloat(stock) : undefined,
        is_service: is_service !== undefined ? (is_service === true || is_service === 'true') : undefined,
        recipes: recipes?.length ? {
          create: recipes.map((r: any) => ({
            ingredient_id: r.ingredient_id,
            quantity_used: parseFloat(r.quantity_used),
          })),
        } : undefined,
      },
      include: {
        category: true,
        recipes: { include: { ingredient: true } }
      },
    });
    res.json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// ==================== DELETE ====================
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.productRecipe.deleteMany({ where: { product_id: req.params.id } });
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
