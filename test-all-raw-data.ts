import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Scanning properties for taxHistory (limit 100)...");
    const properties = await prisma.property.findMany({
        take: 100,
        select: { id: true, rawData: true }
    });

    let countWithTax = 0;
    let total = properties.length;

    console.log(`Analyzing ${total} properties...`);

    for (const p of properties) {
        if (!p.rawData) continue;
        try {
            const raw = JSON.parse(p.rawData);
            if (raw.taxHistory && Array.isArray(raw.taxHistory) && raw.taxHistory.length > 0) {
                countWithTax++;
                console.log(`[FOUND] Property ${p.id} has taxHistory (${raw.taxHistory.length} records)`);
            }
        } catch (e) {}
    }

    console.log(`\nScan Complete.`);
    console.log(`Total properties with taxHistory: ${countWithTax} / ${total}`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
