import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const systemCategories = [
    'Alimentação',
    'Transporte',
    'Lazer',
    'Investimentos',
  ];

  await prisma.category.createMany({
    data: systemCategories.map((name) => ({
      name,
      isSystem: true,
      userId: null,
    })),
    skipDuplicates: true,
  });

  console.log('System categories seeded');
}

main()
  .catch((e) => {
    console.error('Seed error', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
