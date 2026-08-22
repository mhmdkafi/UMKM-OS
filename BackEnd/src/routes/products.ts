import { Router, Request, Response } from 'express';
import { prisma } from '../index';

const router = Router();

// ==================== GET ALL ====================
router.get('/', async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        recipes: {
          include: { ingredient: true }
        }
      },
    });

    const formattedProducts = products.map(p => ({
      id: p.id,
      business_id: p.business_id,
      name: p.name,
      price: p.price,
      category: p.category.name,
      category_id: p.category_id,
      image: p.image_url,
      stock: 100,
      cogs: p.recipes.reduce((sum, r) => sum + (r.quantity_used * 500), 0), // estimate
      margin: p.price > 0 ? Math.round((1 - p.recipes.reduce((sum, r) => sum + (r.quantity_used * 500), 0) / p.price) * 100) : 0,
      recipe: p.recipes.map(r => ({
        id: r.id,
        item: r.ingredient.name,
        qty: String(r.quantity_used),
        unit: r.ingredient.unit,
        ingredient_id: r.ingredient_id,
      })),
    }));

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
  const { business_id, name, price, category_id, image_url, recipes } = req.body;
  try {
    const product = await prisma.product.create({
      data: {
        business_id,
        name,
        price: parseFloat(price),
        category_id,
        image_url: image_url || null,
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
  const { name, price, category_id, image_url, recipes } = req.body;
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
