import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const p = await prisma.property.findFirst({
        where: { id: { startsWith: 'cmm4buwnz004a42eb6sl' } },
        select: { id: true, sourceId: true }
    });

    if (p) {
        console.log(`FULL ID: ${p.id}`);
    } else {
        console.log("Not found!");
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
