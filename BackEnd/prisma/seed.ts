import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Clearing old data...');
  
  // Clear in correct order (respecting FK constraints)
  await prisma.aiMessage.deleteMany();
  await prisma.aiConversation.deleteMany();
  await prisma.inventoryMovement.deleteMany();
  await prisma.transactionItem.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.operationalExpense.deleteMany();
  await prisma.productRecipe.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.user.deleteMany();
  await prisma.business.deleteMany();

  console.log('🏪 Creating business...');
  const business = await prisma.business.create({
    data: {
      name: 'Kopi Senja',
      address: 'Jl. Sudirman No. 45, Jakarta Selatan',
      phone: '08123456789',
    },
  });

  console.log('👥 Creating users...');
  const owner = await prisma.user.create({
    data: { business_id: business.id, name: 'Budi Santoso', email: 'owner@umkmos.com', pin: '123456', role: 'owner' },
  });
  const manager = await prisma.user.create({
    data: { business_id: business.id, name: 'Siti Aminah', email: 'siti@umkmos.com', pin: '111111', role: 'manager' },
  });
  const kasir = await prisma.user.create({
    data: { business_id: business.id, name: 'Rian Hidayat', pin: '654321', role: 'kasir' },
  });
  const kasir2 = await prisma.user.create({
    data: { business_id: business.id, name: 'Dewi Lestari', pin: '112233', role: 'kasir' },
  });

  console.log('📁 Creating categories...');
  const catKopi = await prisma.category.create({ data: { business_id: business.id, name: 'Kopi' } });
  const catNonKopi = await prisma.category.create({ data: { business_id: business.id, name: 'Non-Kopi' } });
  const catMakanan = await prisma.category.create({ data: { business_id: business.id, name: 'Makanan' } });

  console.log('🧪 Creating ingredients...');
  const bijiKopi = await prisma.ingredient.create({
    data: { business_id: business.id, name: 'Biji Kopi Arabica', unit: 'Gram', stock: 5000, min_stock_alert: 1000 },
  });
  const bijiRobusta = await prisma.ingredient.create({
    data: { business_id: business.id, name: 'Biji Kopi Robusta', unit: 'Gram', stock: 3000, min_stock_alert: 800 },
  });
  const susu = await prisma.ingredient.create({
    data: { business_id: business.id, name: 'Susu UHT Full Cream', unit: 'ml', stock: 10000, min_stock_alert: 2000 },
  });
  const gulaAren = await prisma.ingredient.create({
    data: { business_id: business.id, name: 'Sirup Gula Aren', unit: 'ml', stock: 3000, min_stock_alert: 500 },
  });
  const matchaPowder = await prisma.ingredient.create({
    data: { business_id: business.id, name: 'Matcha Powder', unit: 'Gram', stock: 2000, min_stock_alert: 300 },
  });
  const coklat = await prisma.ingredient.create({
    data: { business_id: business.id, name: 'Coklat Bubuk', unit: 'Gram', stock: 1500, min_stock_alert: 300 },
  });
  const cupPlastik = await prisma.ingredient.create({
    data: { business_id: business.id, name: 'Cup Plastik 16oz', unit: 'Pcs', stock: 450, min_stock_alert: 200 },
  });
  const sedotan = await prisma.ingredient.create({
    data: { business_id: business.id, name: 'Sedotan Ramah Lingkungan', unit: 'Pcs', stock: 800, min_stock_alert: 300 },
  });

  console.log('☕ Creating products with recipes...');
  // Product 1: Kopi Susu Aren
  const p1 = await prisma.product.create({
    data: {
      business_id: business.id, category_id: catKopi.id, name: 'Kopi Susu Aren', price: 20000,
      image_url: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&q=80',
      recipes: { create: [
        { ingredient_id: bijiKopi.id, quantity_used: 18 },
        { ingredient_id: susu.id, quantity_used: 120 },
        { ingredient_id: gulaAren.id, quantity_used: 20 },
        { ingredient_id: cupPlastik.id, quantity_used: 1 },
      ]},
    },
  });
  // Product 2: Americano
  const p2 = await prisma.product.create({
    data: {
      business_id: business.id, category_id: catKopi.id, name: 'Americano', price: 15000,
      image_url: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=500&q=80',
      recipes: { create: [
        { ingredient_id: bijiKopi.id, quantity_used: 18 },
        { ingredient_id: cupPlastik.id, quantity_used: 1 },
      ]},
    },
  });
  // Product 3: Matcha Latte
  const p3 = await prisma.product.create({
    data: {
      business_id: business.id, category_id: catNonKopi.id, name: 'Matcha Latte', price: 25000,
      image_url: 'https://images.unsplash.com/photo-1536514072410-5019a3c69182?w=500&q=80',
      recipes: { create: [
        { ingredient_id: matchaPowder.id, quantity_used: 15 },
        { ingredient_id: susu.id, quantity_used: 150 },
        { ingredient_id: cupPlastik.id, quantity_used: 1 },
      ]},
    },
  });
  // Product 4: Caffe Latte
  const p4 = await prisma.product.create({
    data: {
      business_id: business.id, category_id: catKopi.id, name: 'Caffe Latte', price: 22000,
      image_url: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=500&q=80',
      recipes: { create: [
        { ingredient_id: bijiKopi.id, quantity_used: 18 },
        { ingredient_id: susu.id, quantity_used: 150 },
        { ingredient_id: cupPlastik.id, quantity_used: 1 },
      ]},
    },
  });
  // Product 5: Croissant
  const p5 = await prisma.product.create({
    data: {
      business_id: business.id, category_id: catMakanan.id, name: 'Croissant Butter', price: 18000,
      image_url: 'https://images.unsplash.com/photo-1517433627367-17b5e43bc047?w=500&q=80',
    },
  });
  // Product 6: Chocolate Muffin
  const p6 = await prisma.product.create({
    data: {
      business_id: business.id, category_id: catMakanan.id, name: 'Chocolate Muffin', price: 15000,
      image_url: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=500&q=80',
      recipes: { create: [
        { ingredient_id: coklat.id, quantity_used: 30 },
      ]},
    },
  });
  // Product 7: Red Velvet Cake
  const p7 = await prisma.product.create({
    data: {
      business_id: business.id, category_id: catMakanan.id, name: 'Red Velvet Cake', price: 28000,
      image_url: 'https://images.unsplash.com/photo-1586788224331-947f68671caf?w=500&q=80',
    },
  });
  // Product 8: Teh Tarik
  const p8 = await prisma.product.create({
    data: {
      business_id: business.id, category_id: catNonKopi.id, name: 'Teh Tarik', price: 12000,
      image_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&q=80',
      recipes: { create: [
        { ingredient_id: susu.id, quantity_used: 100 },
        { ingredient_id: cupPlastik.id, quantity_used: 1 },
      ]},
    },
  });

  console.log('🛒 Creating sample transactions...');
  const products = [p1, p2, p3, p4, p5, p6, p7, p8];
  const customerNames = ['Ahmad', 'Rini', 'Joko', 'Putri', 'Doni', 'Maya', 'Eko', 'Lisa', 'Tono', 'Indah', null, null];
  const paymentMethods = ['TUNAI', 'QRIS'];

  for (let i = 0; i < 25; i++) {
    const numItems = Math.floor(Math.random() * 3) + 1;
    const selectedProducts = [];
    for (let j = 0; j < numItems; j++) {
      const randProduct = products[Math.floor(Math.random() * products.length)];
      const qty = Math.floor(Math.random() * 3) + 1;
      selectedProducts.push({ product: randProduct, qty });
    }
    const totalAmount = selectedProducts.reduce((sum, sp) => sum + sp.product.price * sp.qty, 0);
    const daysAgo = Math.floor(Math.random() * 30);
    const txDate = new Date();
    txDate.setDate(txDate.getDate() - daysAgo);
    txDate.setHours(Math.floor(Math.random() * 12) + 8, Math.floor(Math.random() * 60));

    await prisma.transaction.create({
      data: {
        business_id: business.id,
        cashier_id: Math.random() > 0.5 ? kasir.id : kasir2.id,
        customer_name: customerNames[Math.floor(Math.random() * customerNames.length)] || 'Guest',
        total_amount: totalAmount,
        payment_method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        status: 'COMPLETED',
        created_at: txDate,
        items: {
          create: selectedProducts.map(sp => ({
            product_id: sp.product.id,
            quantity: sp.qty,
            price_at_time: sp.product.price,
          })),
        },
      },
    });
  }

  console.log('💸 Creating sample expenses...');
  const expenseData = [
    { name: 'Gaji Karyawan (Agustus)', amount: 12000000, category: 'Tetap (Fixed)', daysAgo: 21, notes: 'Gaji 1 Manajer, 2 Kasir' },
    { name: 'Sewa Tempat Bulanan', amount: 5000000, category: 'Tetap (Fixed)', daysAgo: 17, notes: 'Ruko lantai 1' },
    { name: 'Listrik & Air', amount: 2500000, category: 'Variabel (Variable)', daysAgo: 12, notes: 'Token listrik & tagihan PAM' },
    { name: 'Iklan Instagram (Ads)', amount: 1000000, category: 'Pemasaran (Marketing)', daysAgo: 7, notes: 'Promo kemerdekaan' },
    { name: 'Internet & WiFi', amount: 500000, category: 'Tetap (Fixed)', daysAgo: 15, notes: 'Paket 100 Mbps' },
    { name: 'Perawatan Mesin Kopi', amount: 350000, category: 'Variabel (Variable)', daysAgo: 5, notes: 'Servis bulanan grinder' },
    { name: 'Beli Tissue & Tisu Basah', amount: 150000, category: 'Variabel (Variable)', daysAgo: 3, notes: 'Restock' },
  ];

  for (const exp of expenseData) {
    const expDate = new Date();
    expDate.setDate(expDate.getDate() - exp.daysAgo);
    await prisma.operationalExpense.create({
      data: {
        business_id: business.id,
        name: exp.name,
        amount: exp.amount,
        category: exp.category,
        expense_date: expDate,
        notes: exp.notes,
      }
    });
  }

  console.log('✅ Seeding complete!');
  console.log(`   📦 Business: ${business.name}`);
  console.log(`   👥 Users: 4 (1 owner, 1 manager, 2 kasir)`);
  console.log(`   ☕ Products: 8`);
  console.log(`   🧪 Ingredients: 8`);
  console.log(`   🛒 Transactions: 25`);
  console.log(`   💸 Expenses: 7`);
  console.log('');
  console.log('   Login credentials:');
  console.log('   Owner  → email: owner@umkmos.com | pin: 123456');
  console.log('   Kasir  → pin: 654321');
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
