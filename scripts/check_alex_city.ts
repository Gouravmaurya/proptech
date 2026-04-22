import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const props = await prisma.property.findMany({
    where: { city: { contains: 'Kingman', mode: 'insensitive' } },
    take: 5,
    orderBy: { createdAt: 'desc' },
  });

  console.log(`Found ${props.length} Kingman properties\n`);

  for (const p of props) {
    const raw = p.rawData ? JSON.parse(p.rawData) : {};
    console.log('---');
    console.log('ID:', p.id);
    console.log('sourceId:', p.sourceId);
    console.log('Address:', p.address);
    console.log('taxAssessedValue (column):', p.taxAssessedValue);
    console.log('Has schools in rawData:', !!(raw.schools?.length > 0), '—', raw.schools?.length ?? 0, 'schools');
    console.log('Has taxHistory in rawData:', !!(raw.taxHistory?.length > 0), '—', raw.taxHistory?.length ?? 0, 'records');
    console.log('Has priceHistory in rawData:', !!(raw.priceHistory?.length > 0));
    console.log('Has resoFacts in rawData:', !!raw.resoFacts);
    console.log('zpid in rawData:', raw.zpid);
    console.log('Raw keys count:', Object.keys(raw).length);
    // Show first school if available
    if (raw.schools?.length > 0) {
      console.log('First school:', JSON.stringify(raw.schools[0]));
    }
    if (raw.taxHistory?.length > 0) {
      console.log('First tax record:', JSON.stringify(raw.taxHistory[0]));
    }
  }

  await prisma.$disconnect();
}

main().catch(console.error);
