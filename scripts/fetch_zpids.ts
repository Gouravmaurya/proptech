import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const props = await prisma.property.findMany({
    take: 5,
    select: { sourceId: true, address: true }
  });
  console.log(JSON.stringify(props, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
