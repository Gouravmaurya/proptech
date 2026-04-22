import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const properties = await prisma.property.findMany({
        take: 5,
        select: { id: true, sourceId: true, rawData: true }
    });

    console.log(`Found ${properties.length} properties.`);

    for (const p of properties) {
        console.log(`\n--- Property ${p.id} (${p.sourceId}) ---`);
        if (!p.rawData) {
            console.log("rawData is NULL");
            continue;
        }

        try {
            const raw = JSON.parse(p.rawData);
            console.log("Has schools:", !!raw.schools && raw.schools.length > 0);
            console.log("Has taxHistory:", !!raw.taxHistory && raw.taxHistory.length > 0);
            console.log("Has priceHistory:", !!raw.priceHistory && raw.priceHistory.length > 0);
            
            if (raw.taxHistory) {
                console.log("Tax History Preview:", JSON.stringify(raw.taxHistory).slice(0, 100));
            }
        } catch (e: any) {
            console.error("Failed to parse rawData:", e.message);
        }
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
