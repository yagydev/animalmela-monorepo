import { PrismaClient } from '@prisma/client';

/**
 * Clears transactional marketplace data; keeps Category rows (re-seeded if missing).
 */
export async function resetMarketplaceTables(
  prisma: PrismaClient,
): Promise<void> {
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "CommissionLedger",
      "OrderItem",
      "Order",
      "CartItem",
      "Cart",
      "ChatMessage",
      "ChatThread",
      "ProductReview",
      "SellerReview",
      "ProductImage",
      "Product",
      "Store",
      "SellerProfile",
      "Address",
      "OtpChallenge",
      "AgriEvent",
      "User"
    RESTART IDENTITY CASCADE;
  `);
}

/** Idempotent category tree (matches prisma/seed.ts structure). */
export async function ensureCategorySeed(prisma: PrismaClient): Promise<void> {
  const roots = [
    { name: 'Animals & Livestock', slug: 'animals', sortOrder: 1 },
    { name: 'Seeds & Inputs', slug: 'seeds', sortOrder: 2 },
    { name: 'Tools & Machinery', slug: 'tools', sortOrder: 3 },
    { name: 'Land & Services', slug: 'land', sortOrder: 4 },
  ];

  for (const r of roots) {
    await prisma.category.upsert({
      where: { slug: r.slug },
      create: { name: r.name, slug: r.slug, sortOrder: r.sortOrder },
      update: { name: r.name, sortOrder: r.sortOrder },
    });
  }

  const animals = await prisma.category.findUniqueOrThrow({
    where: { slug: 'animals' },
  });
  const seeds = await prisma.category.findUniqueOrThrow({
    where: { slug: 'seeds' },
  });

  const children = [
    { parentId: animals.id, name: 'Cattle', slug: 'cattle', sortOrder: 1 },
    { parentId: animals.id, name: 'Poultry', slug: 'poultry', sortOrder: 2 },
    {
      parentId: animals.id,
      name: 'Goats & Sheep',
      slug: 'goats-sheep',
      sortOrder: 3,
    },
    {
      parentId: seeds.id,
      name: 'Food Grains',
      slug: 'food-grains',
      sortOrder: 1,
    },
    {
      parentId: seeds.id,
      name: 'Vegetable Seeds',
      slug: 'vegetable-seeds',
      sortOrder: 2,
    },
    {
      parentId: seeds.id,
      name: 'Fertilizers',
      slug: 'fertilizers',
      sortOrder: 3,
    },
  ];

  for (const c of children) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      create: c,
      update: { name: c.name, sortOrder: c.sortOrder, parentId: c.parentId },
    });
  }
}
