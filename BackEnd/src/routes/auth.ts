import { Router } from 'express';
import { prisma } from '../index';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret_umkm_os_2026';

// ==================== LOGIN ====================
router.post('/login', async (req, res) => {
  const { identifier, password_or_pin } = req.body;

  try {
    // Find user by email or name (so Kasir can login with their name)
    const user = await prisma.user.findFirst({
      where: { 
        OR: [
          { email: identifier },
          { name: identifier }
        ]
      },
      include: { business: true } // Fetch business to get category (saved in address)
    });

    if (user && user.pin === password_or_pin) {
      const category = user.business?.address || "Lainnya";
      const token = jwt.sign(
        { id: user.id, role: user.role, name: user.name, business_id: user.business_id, business_category: category },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      return res.json({
        success: true,
        token,
        user: { id: user.id, name: user.name, role: user.role, business_id: user.business_id, business_category: category },
      });
    }

    res.status(401).json({ success: false, error: 'Email atau password salah.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ==================== REGISTER ====================
router.post('/register', async (req, res) => {
  const { name, email, password, business_name, business_category } = req.body;

  if (!name || !email || !password || !business_name) {
    return res.status(400).json({ success: false, error: 'Semua field wajib diisi.' });
  }

  try {
    // Check if email already exists
    const existingUser = await prisma.user.findFirst({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email sudah terdaftar.' });
    }

    // Create Business
    const business = await prisma.business.create({
      data: {
        name: business_name,
        address: business_category || null,
      },
    });

    // Create User as OWNER
    const user = await prisma.user.create({
      data: {
        business_id: business.id,
        name,
        email,
        pin: password, // For MVP, store as plain text PIN
        role: 'OWNER',
      },
    });

    // Generate JWT token so user is auto-logged-in after registration
    const category = business_category || "Lainnya";
    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name, business_id: user.business_id, business_category: category },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, role: user.role, business_id: user.business_id, business_category: category },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Gagal mendaftar. Coba lagi.' });
  }
});

export default router;
