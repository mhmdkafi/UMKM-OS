import { Router, Request, Response } from 'express';
import { prisma } from '../index';

const router = Router();

// ==================== GET ALL ====================
router.get('/', async (req: Request, res: Response) => {
  try {
    const { business_id } = req.query;
    const whereClause = business_id ? { business_id: String(business_id) } : {};

    const expenses = await prisma.operationalExpense.findMany({
      where: whereClause,
      orderBy: { expense_date: 'desc' }
    });
    const formatted = expenses.map(exp => ({
      id: exp.id,
      business_id: exp.business_id,
      name: exp.name,
      amount: exp.amount,
      category: exp.category,
      date: exp.expense_date.toISOString().split('T')[0],
      notes: exp.notes
    }));
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== CREATE ====================
router.post('/', async (req: Request, res: Response) => {
  const { business_id, name, amount, category, date, notes } = req.body;
  try {
    // Get first business if no business_id
    let bId = business_id;
    if (!bId) {
      const biz = await prisma.business.findFirst();
      bId = biz?.id;
    }
    const expense = await prisma.operationalExpense.create({
      data: {
        business_id: bId,
        name,
        amount: parseFloat(amount),
        category,
        expense_date: new Date(date),
        notes: notes || null,
      }
    });
    res.json({ success: true, expense });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

// ==================== UPDATE ====================
router.put('/:id', async (req: Request, res: Response) => {
  const { name, amount, category, date, notes } = req.body;
  try {
    const expense = await prisma.operationalExpense.update({
      where: { id: req.params.id },
      data: {
        name,
        amount: parseFloat(amount),
        category,
        expense_date: new Date(date),
        notes: notes || null,
      }
    });
    res.json({ success: true, expense });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

// ==================== DELETE ====================
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.operationalExpense.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

export default router;
