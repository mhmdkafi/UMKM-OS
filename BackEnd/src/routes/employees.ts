import { Router, Request, Response } from 'express';
import { prisma } from '../index';

const router = Router();

// ==================== GET ALL EMPLOYEES ====================
router.get('/', async (req: Request, res: Response) => {
  try {
    const { business_id } = req.query;
    const whereClause = business_id ? { business_id: String(business_id) } : {};

    const users = await prisma.user.findMany({ 
      where: whereClause,
      orderBy: { created_at: 'desc' } 
    });
    const formatted = users.map(u => ({
      id: u.id,
      business_id: u.business_id,
      name: u.name,
      role: u.role.charAt(0).toUpperCase() + u.role.slice(1),
      accessType: u.email ? 'Email' : 'PIN',
      accessValue: u.email ? u.email : (u.pin ? `••••${u.pin.slice(-2)}` : '-'),
      status: 'Aktif',
    }));
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== CREATE ====================
router.post('/', async (req: Request, res: Response) => {
  const { business_id, name, role, email, pin } = req.body;
  try {
    if (!business_id) {
      return res.status(400).json({ error: 'business_id is required' });
    }
    const user = await prisma.user.create({
      data: {
        business_id,
        name,
        role: role.toLowerCase(),
        email: email || null,
        pin: pin || null,
      }
    });
    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

// ==================== UPDATE ====================
router.put('/:id', async (req: Request, res: Response) => {
  const { name, role, email, pin } = req.body;
  try {
    const dataToUpdate: any = { name, role: role.toLowerCase() };
    if (email !== undefined) dataToUpdate.email = email || null;
    if (pin !== undefined) dataToUpdate.pin = pin || null;

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: dataToUpdate
    });
    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

// ==================== DELETE ====================
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

export default router;
