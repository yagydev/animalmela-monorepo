import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
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

  const animals = await prisma.category.findUniqueOrThrow({ where: { slug: 'animals' } });
  const seeds = await prisma.category.findUniqueOrThrow({ where: { slug: 'seeds' } });

  const children = [
    { parentId: animals.id, name: 'Cattle', slug: 'cattle', sortOrder: 1 },
    { parentId: animals.id, name: 'Poultry', slug: 'poultry', sortOrder: 2 },
    { parentId: animals.id, name: 'Goats & Sheep', slug: 'goats-sheep', sortOrder: 3 },
    { parentId: seeds.id, name: 'Food Grains', slug: 'food-grains', sortOrder: 1 },
    { parentId: seeds.id, name: 'Vegetable Seeds', slug: 'vegetable-seeds', sortOrder: 2 },
    { parentId: seeds.id, name: 'Fertilizers', slug: 'fertilizers', sortOrder: 3 },
  ];

  for (const c of children) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      create: c,
      update: { name: c.name, sortOrder: c.sortOrder, parentId: c.parentId },
    });
  }

  const adminPhone = process.env.SEED_ADMIN_PHONE || '+919999000001';
  await prisma.user.upsert({
    where: { phone: adminPhone },
    create: {
      phone: adminPhone,
      name: 'Platform Admin',
      role: 'ADMIN',
    },
    update: { role: 'ADMIN', name: 'Platform Admin' },
  });

  console.log('Seed: categories + admin OK');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
