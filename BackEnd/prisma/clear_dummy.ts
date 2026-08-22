import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Memulai penghapusan data dummy...');
  
  // Hapus semua data transaksional dan operasional
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

  console.log('✅ Semua data produk, transaksi, dan inventaris dummy telah dihapus!');
  console.log('ℹ️ Akun Login (Owner/Kasir) dan Profil Bisnis tetap dipertahankan agar Anda tetap bisa masuk ke aplikasi.');
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
