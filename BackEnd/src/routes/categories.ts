import { Router, Request, Response } from 'express';
import { prisma } from '../index';

const router = Router();

// ==================== GET ALL CATEGORIES ====================
router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } }
    });
    const formatted = categories.map(c => ({
      id: c.id,
      name: c.name,
      business_id: c.business_id,
      productCount: c._count.products,
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== CREATE ====================
router.post('/', async (req: Request, res: Response) => {
  const { business_id, name } = req.body;
  try {
    let bId = business_id;
    if (!bId) {
      const biz = await prisma.business.findFirst();
      bId = biz?.id;
    }
    const category = await prisma.category.create({
      data: { business_id: bId, name }
    });
    res.json({ success: true, category });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// ==================== DELETE ====================
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.category.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;
