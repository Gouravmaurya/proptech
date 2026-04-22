import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Fetching leads...");
    const properties = await prisma.lead.findMany({
        take: 100,
        orderBy: { createdAt: "desc" },
        include: {
            property: true,
            analyses: {
                take: 1,
                orderBy: { createdAt: "desc" }
            }
        }
    });

    console.log(`Fetched ${properties.length} leads.`);

    // 3. Score properties based on keywords (Mock)
    const scoredProperties = properties.map((lead: any) => {
        const p = lead.property;
        if (!p) return { lead, score: 0 };
        return { lead, score: Math.random() > 0.5 ? 1 : 0 }; // random score for test
    });

    // 4. Sort by score (descending)
    let sortedProperties = scoredProperties.sort((a: any, b: any) => b.score - a.score);

    // Deduplicate by property.id (or lead.id if property is missing)
    const seen = new Set<string>();
    const uniqueMatches: any[] = [];

    for (const item of sortedProperties) {
        const pId = item.lead.property?.id || item.lead.id;
        if (pId && !seen.has(pId)) {
            seen.add(pId);
            uniqueMatches.push(item);
        }
    }

    let topMatches = uniqueMatches
        .filter((item: any) => item.score > 0)
        .slice(0, 10);

    if (topMatches.length === 0) {
        console.log("[Dream House] No exact matches found, returning fallbacks.");
        topMatches = uniqueMatches.slice(0, 5);
    }

    // 5. Map to PropertyCard format
    const formattedResults = topMatches.map((item: any) => {
        const lead = item.lead;
        const p = lead.property;
        return {
            matchScore: item.score,
            id: p?.id || lead.id,
            streetAddress: lead.title || p?.address || lead.location,
        };
    });

    console.log("\n--- Results ---");
    const ids = formattedResults.map(r => r.id);
    console.log("IDs:", ids);

    const duplicates = ids.filter((item, index) => ids.indexOf(item) !== index);
    if (duplicates.length > 0) {
        console.error("Duplicate IDs found:", duplicates);
    } else {
        console.log("Success: No duplicates found!");
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
