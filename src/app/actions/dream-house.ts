"use server";

import prisma from "@/lib/prisma";
import { analyzeDreamHouseImage } from "@/lib/ai-engine";

export async function matchDreamHouse(formData: FormData): Promise<{ ok: boolean; results?: any[]; keywords?: string[]; error?: string }> {
    try {
        const file = formData.get("image") as File;
        if (!file || file.size === 0) {
            return { ok: false, error: "No image provided" };
        }

        // Convert the File to a base64 string
        const arrayBuffer = await file.arrayBuffer();
        const base64Image = Buffer.from(arrayBuffer).toString("base64");
        const mimeType = file.type;

        // 1. Analyze the image with Gemini
        console.log("[Dream House] Analyzing image...");
        const aiResult = await analyzeDreamHouseImage(base64Image, mimeType);

        if (!aiResult || !aiResult.keywords || !Array.isArray(aiResult.keywords)) {
            return { ok: false, error: "Failed to analyze image or extract keywords." };
        }

        const keywords: string[] = aiResult.keywords.map((k: string) => k.toLowerCase());
        console.log("[Dream House] Extracted keywords:", keywords);

        // 2. Fetch properties from the database to match against
        // We'll fetch a decent chunk of recent properties (e.g., 100) and score them in memory for speed
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

        // 3. Score properties based on keywords
        const scoredProperties = properties.map((lead: any) => {
            const p = lead.property;
            if (!p) return { lead, score: 0 };

            let score = 0;
            const searchString = `${p.title || ""} ${p.description || ""} ${p.type || ""} ${p.amenities || ""} ${lead.location || ""}`.toLowerCase();

            keywords.forEach(keyword => {
                if (searchString.includes(keyword)) {
                    score += 1;
                }
            });

            return { lead, score };
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

        // If no matches found with score > 0, return the most recent properties as a fallback
        if (topMatches.length === 0) {
            console.log("[Dream House] No exact matches found, returning fallbacks.");
            topMatches = uniqueMatches.slice(0, 5);
        }

        console.log(`[Dream House] Unique matches count: ${topMatches.length}`);
        // console.log("[Dream House] IDs:", topMatches.map(m => m.lead.property?.id || m.lead.id));

        // 5. Map to PropertyCard format
        const formattedResults = topMatches.map((item: any) => {
            const lead = item.lead;
            const p = lead.property;
            const analysis = lead.analyses?.[0];

            const imageData = p?.images ? JSON.parse(p.images) : [];
            const mainImage = p?.imageUrl || (imageData.length > 0 ? imageData[0] : null) || "/placeholder-house.jpg";

            const financials = analysis?.financials ? (() => { try { return JSON.parse(analysis.financials); } catch { return {}; } })() : {};

            return {
                matchScore: item.score,
                id: p?.id || lead.id,
                zpid: lead.id || p?.sourceId,
                streetAddress: lead.title || p?.address || lead.location,
                city: p?.city || '',
                state: p?.state || '',
                zipcode: p?.zip || '',
                price: lead.price,
                bedrooms: p?.bedrooms || 3,
                bathrooms: p?.bathrooms || 2,
                livingArea: p?.sqft || 1500,
                homeType: p?.type || "Single Family",
                homeStatus: lead.status || 'For Sale',
                imgSrc: mainImage,
                rentZestimate: p?.rentEstimate || null,
                zestimate: p?.zestimate || null,
                capRate: financials.capRate || 0,
                roi: financials.roi5 || 0,
                status: lead.status || 'analyzed',
            };
        });

        return {
            ok: true,
            keywords,
            results: formattedResults
        };

    } catch (error: any) {
        console.error("Dream House Match Error:", error);
        return { ok: false, error: error.message };
    }
}
