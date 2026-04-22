"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { runScout, analyzeLeadFast, enrichPropertyById } from "@/lib/scout-agent";
import { parseSchools, parseTaxHistory } from '@/lib/property-parser';

// Helper to map DB Lead to UI Card format matching PropertyCard props
function mapLeadToCard(lead: any) {
    const p = lead.property;
    const analysis = lead.analyses?.[0];

    // Fallback to property snapshot if property relation is missing
    const imageData = p?.images ? JSON.parse(p.images) : [];
    const mainImage = p?.imageUrl || (imageData.length > 0 ? imageData[0] : null) || "/placeholder-house.jpg";

    // Parse analysis financials once
    const financials = analysis?.financials ? (() => { try { return JSON.parse(analysis.financials); } catch { return {}; } })() : {};

    return {
        id: p?.id, // ID for saving (Property ID)
        zpid: lead.id || p?.sourceId, // ID for routing
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
        // Analysis data for badges
        capRate: financials.capRate || 0,
        roi: financials.roi5 || 0,
        status: lead.status || 'analyzed', // defaults to 'analyzed' — never 'new'
        
        // Community & Tax info
        bestSchoolRating: (() => {
            const schools = parseSchools(p?.rawData);
            if (schools.length === 0) return null;
            
            // Try to find the highest numeric rating
            const numericRatings = schools
                .map(s => typeof s.rating === 'number' ? s.rating : parseInt(s.rating as string))
                .filter(r => !isNaN(r));
            
            if (numericRatings.length > 0) return Math.max(...numericRatings);
            
            // If no numeric ratings, return the rating of the first school as a string (e.g., "A+")
            return schools[0].rating;
        })(),
        lastTaxAssessment: (() => {
            const taxes = parseTaxHistory(p?.rawData);
            if (taxes.length > 0) {
                const latest = taxes.sort((a, b) => b.year - a.year)[0].taxAssessment;
                if (latest) return latest;
            }
            // Fallback to the top-level taxAssessedValue if history is missing or empty
            return p?.taxAssessedValue || null;
        })()
    };
}

export async function getRecentLeads(limit = 20) {
    try {
        const leads = await prisma.lead.findMany({
            orderBy: { createdAt: "desc" },
            take: limit,
            include: {
                property: true,
                analyses: {
                    take: 1,
                    orderBy: { createdAt: "desc" }
                }
            }
        });

        return leads.map(mapLeadToCard);
    } catch (error) {
        console.error("Failed to fetch leads:", error);
        return [];
    }
}

export async function searchProperties(rawQuery: string, filters?: { minPrice?: number, maxPrice?: number, type?: string }) {
    try {
        const query = rawQuery.trim();
        const session = await auth();
        const userId = session?.user?.id;

        // 1. Search DB first using the full database

        // Map full state names to abbreviations
        const stateMap: Record<string, string> = {
            "alaska": "AK", "alabama": "AL", "arkansas": "AR", "arizona": "AZ",
            "california": "CA", "colorado": "CO", "connecticut": "CT",
            "district of columbia": "DC", "delaware": "DE",
            "florida": "FL",
            "georgia": "GA",
            "hawaii": "HI",
            "iowa": "IA", "idaho": "ID", "illinois": "IL", "indiana": "IN",
            "kansas": "KS", "kentucky": "KY",
            "louisiana": "LA",
            "massachusetts": "MA", "maryland": "MD", "maine": "ME", "michigan": "MI", "minnesota": "MN", "missouri": "MO", "mississippi": "MS", "montana": "MT",
            "north carolina": "NC", "north dakota": "ND", "nebraska": "NE", "new hampshire": "NH", "new jersey": "NJ", "new mexico": "NM", "nevada": "NV", "new york": "NY",
            "ohio": "OH", "oklahoma": "OK", "oregon": "OR",
            "pennsylvania": "PA",
            "rhode island": "RI",
            "south carolina": "SC", "south dakota": "SD",
            "tennessee": "TN", "texas": "TX",
            "utah": "UT",
            "virginia": "VA", "vermont": "VT",
            "washington": "WA", "wisconsin": "WI", "west virginia": "WV", "wyoming": "WY"
        };

        const abbr = stateMap[query.toLowerCase()];

        const baseWhere: any[] = [];
        if (query) {
            baseWhere.push({
                OR: [
                    { location: { contains: query, mode: 'insensitive' } },
                    { title: { contains: query, mode: 'insensitive' } },
                    { property: { city: { contains: query, mode: 'insensitive' } } },
                    { property: { state: { contains: query, mode: 'insensitive' } } },
                    ...(abbr ? [{ property: { state: { equals: abbr, mode: 'insensitive' as any } } }] : [])
                ]
            });
        }

        if (filters?.minPrice !== undefined) {
            baseWhere.push({ price: { gte: filters.minPrice } });
        }
        if (filters?.maxPrice !== undefined) {
            baseWhere.push({ price: { lte: filters.maxPrice } });
        }

        const fetchLeadsWithFilters = async (includeType: boolean) => {
            const conditions = [...baseWhere];
            if (includeType && filters?.type) {
                conditions.push({ property: { type: { equals: filters.type, mode: 'insensitive' as any } } });
            }

            return await prisma.lead.findMany({
                where: conditions.length > 0 ? { AND: conditions } : {},
                orderBy: { createdAt: "desc" },
                take: 50,
                include: {
                    property: true,
                    analyses: {
                        take: 1,
                        orderBy: { createdAt: "desc" }
                    }
                }
            });
        };

        // 1. Search DB with full filters
        let leads = await fetchLeadsWithFilters(true);


        // 3. Trigger Scout based on result count:
        //    - 0 results: AWAIT the scout so we can return fresh data on first search.
        //    - 1-9 results: Background scout (we have something to show, refresh silently).
        if (leads.length === 0 && query) {
            console.log(`[Dashboard] No results for "${query}" in DB. Running Scout synchronously...`);
            await runScout(query, 50, userId, filters?.type);

            // Re-query DB now that scout has saved data
            leads = await fetchLeadsWithFilters(true);
            console.log(`[Dashboard] Post-scout re-query returned ${leads.length} results.`);


        } else if (leads.length < 10 && query) {
            console.log(`[Dashboard] Only ${leads.length} results for "${query}" in DB. Triggering Scout in background...`);
            // Already have something to show — refresh in background without blocking
            runScout(query, 50, userId, filters?.type).catch(err => {
                console.error("[Dashboard] Background Scout failed:", err);
            });
        }

        // 4. Final Fallback: If STILL 0 results after Scout, expand search to other types in location
        if (leads.length === 0 && filters?.type) {
            console.log(`[Dashboard] No properties match type filter for "${query}". Showing other available properties...`);
            leads = await fetchLeadsWithFilters(false);
        }

        return leads.map(mapLeadToCard);

    } catch (error) {
        console.error("Search failed:", error);
        return [];
    }
}

import { PrismaClient } from "@prisma/client";

export async function getLead(id: string) {
    const prismaLocal = new PrismaClient();
    try {
        console.log(`[getLead] Fetching lead with Local: ${id}`);
        
        let lead: any = await prismaLocal.lead.findFirst({
            where: { id },
            include: {
                property: true,
                analyses: {
                    take: 1,
                    orderBy: { createdAt: "desc" }
                }
            }
        });

        // Fallback: If no Lead found, check if 'id' is a Property ID or Source ID
        if (!lead) {
            console.log(`Lead not found for id: ${id}. Checking if it's a Property ID/SourceID...`);
            const property = await prisma.property.findFirst({
                where: {
                    OR: [
                        { id: id },
                        { sourceId: id }
                    ]
                },
                include: {
                    leads: {
                        take: 1,
                        orderBy: { createdAt: "desc" },
                        include: {
                            analyses: {
                                take: 1,
                                orderBy: { createdAt: "desc" }
                            }
                        }
                    }
                }
            });

            if (property && property.leads.length > 0) {
                // Use the most recent lead attached to this property
                lead = property.leads[0];
                // We need to ensure the property object is attached to the lead for downstream logic
                (lead as any).property = property;
            } else if (property) {
                // Edge case: Property exists but has no Lead. unmatched.
                // We might need to construct a dummy lead or handle this.
                // For now, let's return null to avoid breaking UI that expects a Lead structure.
                console.log("Property found but no associated Lead.");
                return null;
            }
        }

        if (!lead) return null;

        // ── ON-DEMAND ENRICHMENT ────────────────────────────────────────────────
        // If the property has no schools or no taxHistory, trigger one more enrichment call now.
        // This handles leads that were skipped during the tiered background process.
        const initialRaw = lead.property?.rawData ? JSON.parse(lead.property.rawData) : {};
        const hasSchools = initialRaw.schools && initialRaw.schools.length > 0;
        const hasTaxHistory = initialRaw.taxHistory && initialRaw.taxHistory.length > 0;

        if (!hasSchools || !hasTaxHistory) {
            console.log(`[getLead] Triggering on-demand enrichment for ${lead.property.id} (Schools: ${!!hasSchools}, TaxHistory: ${!!hasTaxHistory})...`);
            await enrichPropertyById(lead.property.id);
            // Re-fetch to get enriched rawData
            const refreshedProp = await prisma.property.findUnique({ where: { id: lead.property.id } });
            if (refreshedProp) lead.property = refreshedProp;
        }

        // ── ON-DEMAND FAST ANALYSIS ────────────────────────────────────────────
        // If this lead has no analysis yet (background batch hasn't reached it),
        // run the instant math analysis NOW so the property page always shows
        // cap rate, ROI, DSCR, etc. from the first load.
        const existingAnalysis = (lead as any).analyses?.[0];
        if (!existingAnalysis) {
            console.log(`[getLead] No analysis found for lead ${lead.id} — running fast analysis on-demand...`);
            await analyzeLeadFast(lead.id);

            // Re-fetch the lead with the freshly created analysis
            const refreshed = await prisma.lead.findUnique({
                where: { id: lead.id },
                include: {
                    property: true,
                    analyses: {
                        take: 1,
                        orderBy: { createdAt: 'desc' }
                    }
                }
            });
            if (refreshed) {
                (lead as any).analyses = refreshed.analyses;
                if (!(lead as any).property) (lead as any).property = refreshed.property;
            }
        }
        // ──────────────────────────────────────────────────────────────────────

        const p = lead.property;
        // Need to fetch property if it wasn't included in the fallback path (it was) or original path
        // The original findUnique include property: true.
        // The fallback property.leads[0] might not have property included inverted.
        // Prisma object from property.leads[0] won't have .property unless we included it or manually attach it.
        // In fallback above: (lead as any).property = property; handles it.

        const analysis = lead.analyses?.[0];

        let financials = null;

        if (analysis?.financials) {
            try {
                financials = JSON.parse(analysis.financials);
            } catch (e) { }
        }

        const imageData = p?.images ? JSON.parse(p.images) : [];
        const mainImage = p?.imageUrl || (imageData.length > 0 ? imageData[0] : null) || "/placeholder-house.jpg";

        const rawData = p?.rawData ? JSON.parse(p.rawData) : {};
        const brokerName = rawData?.brokerName || null;

        // Fallback for sqft if missing in column
        const sqft = p?.sqft || rawData?.livingArea || rawData?.area || 0;

        return {
            ...lead,
            property: {
                ...p,
                images: imageData,
                mainImage,
                brokerName, // Pass this through
                sqft // Overlay fallback value
            },
            analysis: analysis ? {
                ...analysis,
                financials
            } : null
        };

    } catch (error: any) {
        console.error(`[getLead] Error: ${error.message || error}`);
        if (error.stack) console.error(`[getLead] Error Stack: ${error.stack}`);
        if (error.code) console.error(`[getLead] Error Code: ${error.code}`);
        await prismaLocal.$disconnect();
        return null;
    } finally {
        await prismaLocal.$disconnect();
    }
}

export async function getUserPreferences() {
    try {
        const session = await auth();
        if (!session?.user?.email) return null;

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { preferences: true }
        });

        if (!user?.preferences) return null;

        return JSON.parse(user.preferences);
    } catch (error) {
        console.error("Failed to fetch preferences:", error);
        return null;
    }
}

/**
 * Checks if a background Scout refresh is needed for a location.
 * Returns true if the newest lead for this location is older than 6 hours.
 */
export async function shouldRefreshScout(location: string): Promise<boolean> {
    try {
        const city = location.split(',')[0].trim();
        const stateMap: Record<string, string> = {
            "alaska": "AK", "alabama": "AL", "arkansas": "AR", "arizona": "AZ",
            "california": "CA", "colorado": "CO", "connecticut": "CT",
            "district of columbia": "DC", "delaware": "DE",
            "florida": "FL",
            "georgia": "GA",
            "hawaii": "HI",
            "iowa": "IA", "idaho": "ID", "illinois": "IL", "indiana": "IN",
            "kansas": "KS", "kentucky": "KY",
            "louisiana": "LA",
            "massachusetts": "MA", "maryland": "MD", "maine": "ME", "michigan": "MI", "minnesota": "MN", "missouri": "MO", "mississippi": "MS", "montana": "MT",
            "north carolina": "NC", "north dakota": "ND", "nebraska": "NE", "new hampshire": "NH", "new jersey": "NJ", "new mexico": "NM", "nevada": "NV", "new york": "NY",
            "ohio": "OH", "oklahoma": "OK", "oregon": "OR",
            "pennsylvania": "PA",
            "rhode island": "RI",
            "south carolina": "SC", "south dakota": "SD",
            "tennessee": "TN", "texas": "TX",
            "utah": "UT",
            "virginia": "VA", "vermont": "VT",
            "washington": "WA", "wisconsin": "WI", "west virginia": "WV", "wyoming": "WY"
        };
        const abbr = stateMap[city.toLowerCase()];

        const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);

        const recentLead = await prisma.lead.findFirst({
            where: {
                OR: [
                    { location: { contains: city, mode: 'insensitive' } },
                    { property: { city: { contains: city, mode: 'insensitive' } } },
                    { property: { state: { contains: city, mode: 'insensitive' } } },
                    ...(abbr ? [{ property: { state: { contains: abbr, mode: 'insensitive' as any } } }] : [])
                ],
                createdAt: { gte: sixHoursAgo }
            },
            select: { id: true }
        });

        // If no lead found within 6 hours → refresh needed
        return recentLead === null;
    } catch (error) {
        console.error("[shouldRefreshScout] Error:", error);
        return false;
    }
}

/**
 * Triggers a background Scout run for a location (fire-and-forget).
 * Safe to call after showing DB data to the user — won't block the UI.
 * Scout's own 6-hour dedup gate ensures it won't actually re-fetch unless needed.
 */
export async function triggerBackgroundScout(location: string): Promise<void> {
    try {
        const session = await auth();
        const userId = session?.user?.id;

        const needsRefresh = await shouldRefreshScout(location);
        if (!needsRefresh) {
            console.log(`[Dashboard] Scout refresh not needed for "${location}" (data is fresh).`);
            return;
        }

        console.log(`[Dashboard] Triggering background Scout refresh for "${location}"...`);
        // Fire-and-forget: don't await, let it run in the background
        runScout(location, 50, userId).then((result) => {
            console.log(`[Dashboard] Background Scout for "${location}" complete:`, result);
        }).catch((err) => {
            console.error(`[Dashboard] Background Scout for "${location}" failed:`, err);
        });
    } catch (error) {
        console.error("[triggerBackgroundScout] Error:", error);
    }
}
