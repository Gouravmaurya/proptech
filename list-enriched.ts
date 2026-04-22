import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Looking for fully enriched properties...");
    const properties = await prisma.property.findMany({
        take: 200,
        select: { id: true, sourceId: true, rawData: true }
    });

    let found = [];

    for (const p of properties) {
        if (!p.rawData) continue;
        try {
            const raw = JSON.parse(p.rawData);
            if (raw.taxHistory && Array.isArray(raw.taxHistory) && raw.taxHistory.length > 0) {
                found.push({ id: p.id, zpid: raw.zpid || p.sourceId });
            }
        } catch (e) {}
    }

    console.log(`\nFound ${found.length} properties with taxHistory.`);
    if (found.length > 0) {
        console.log("--- Valid IDs ---");
        for (const item of found.slice(0, 3)) {
            console.log(`ID: ${item.id}`);
        }
    }

}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
