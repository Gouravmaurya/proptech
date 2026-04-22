import prisma from '@/lib/prisma';
import {
    capRate,
    monthlyCashFlow,
    project10Years,
    dscr,
    roi5Years,
    loanPayment,
    buildSystemPrompt,
    buildAnalysisPrompt,
    generateAIAnalysis,
} from '@/lib/ai-engine';

// Map full state names to abbreviations (shared with dashboard.ts)
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

// Concurrency helper: run tasks in parallel batches of `batchSize`
async function runInBatches<T>(
    items: T[],
    batchSize: number,
    task: (item: T) => Promise<void>
): Promise<void> {
    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        await Promise.allSettled(batch.map(task));
    }
}

// Helper to safely parse numbers from strings with commas/symbols
function safeNumber(val: any): number | undefined {
    if (val === null || val === undefined || val === '') return undefined;
    if (typeof val === 'number') return val;
    const str = String(val).replace(/[^0-9.-]/g, '');
    const num = Number(str);
    return isNaN(num) ? undefined : num;
}

// Helper to normalize Zillow/Mock data to our schema - Now captures ALL raw fields
function mapToLead(raw: any, provider: string) {
    const address = raw.address || raw.streetAddress || "";
    const location = raw.location || [raw.city, raw.state].filter(Boolean).join(', ') || "";

    // Extract multiple images from carouselPhotosComposable
    let imagesArray: string[] = [];
    if (raw.carouselPhotosComposable?.photoData && raw.carouselPhotosComposable.baseUrl) {
        const baseUrl = raw.carouselPhotosComposable.baseUrl;
        imagesArray = raw.carouselPhotosComposable.photoData
            .slice(0, 20) // Limit to first 20 images to avoid oversized data
            .map((photo: any) => baseUrl.replace('{photoKey}', photo.photoKey));
    } else if (raw.photos && Array.isArray(raw.photos)) {
        imagesArray = raw.photos.slice(0, 20);
    }

    return {
        // Core identifiers
        sourceId: raw.sourceId || (raw.zpid ? `z_${raw.zpid}` : `mock_${Date.now()}_${Math.random()}`),
        title: raw.title || raw.streetAddress || address || "Unknown Property",

        // Type & Status
        type: raw.type || raw.homeType || "Single Family",
        status: raw.status || raw.homeStatus || "For Sale",

        // Price
        price: safeNumber(raw.price) || 0,

        // Location
        address: address,
        city: raw.city,
        state: raw.state,
        zip: raw.zipcode || raw.zip,
        country: raw.country || "USA",
        geoLocation: raw.latitude && raw.longitude
            ? JSON.stringify({ lat: raw.latitude, lng: raw.longitude })
            : null,

        // Core Specs
        sqft: safeNumber(raw.sqft) || safeNumber(raw.livingArea) || safeNumber(raw.area),
        bedrooms: safeNumber(raw.bedrooms) || safeNumber(raw.beds),
        bathrooms: safeNumber(raw.bathrooms) || safeNumber(raw.baths),
        yearBuilt: safeNumber(raw.yearBuilt),
        lotArea: safeNumber(raw.lotAreaValue),
        lotAreaUnit: raw.lotAreaUnit || undefined,

        // Market Data
        daysOnMarket: safeNumber(raw.daysOnZillow),
        taxAssessedValue: safeNumber(raw.taxAssessedValue),
        zestimate: safeNumber(raw.zestimate),
        detailUrl: raw.detailUrl || undefined,
        openHouseInfo: raw.openHouse ? JSON.stringify({ schedule: raw.openHouse }) : undefined,

        // Financials
        rentEstimate: safeNumber(raw.rentEstimate) || safeNumber(raw.rentZestimate),

        // Media - Now properly extracts multiple images
        imageUrl: raw.image || raw.imgSrc || (imagesArray.length > 0 ? imagesArray[0] : null),
        images: imagesArray.length > 0 ? JSON.stringify(imagesArray) : null,

        // Store complete raw data for future use
        rawData: JSON.stringify(raw),

        _provider: provider
    };
}

// ZHomes API Implementation
async function fetchZillow(location: string, limit: number = 20, type?: string): Promise<any[]> {
    const apiKey = process.env.ZILLOW_RAPIDAPI_KEY;
    const host = process.env.ZILLOW_RAPIDAPI_HOST || 'zhomes-realty-us.p.rapidapi.com';

    if (!apiKey) {
        console.error("Missing ZILLOW_RAPIDAPI_KEY");
        return [];
    }

    try {
        let url = '';
        let method = 'GET';
        let headers: Record<string, string> = {
            'x-rapidapi-host': host,
            'x-rapidapi-key': apiKey,
        };
        let body: string | undefined = undefined;
        let providerTag = 'scout:unknown';

        if (host === 'zhomes-realty-us.p.rapidapi.com') {
            // ZHomes API
            url = `https://${host}/property/search`;
            method = 'POST';
            headers['Content-Type'] = 'application/json';
            
            const bodyObj: any = {
                location: location,
                status: "forSale",
            };

            if (type) {
                const zillowTypes: Record<string, string> = {
                    "SINGLE_FAMILY": "singleFamily",
                    "CONDO": "condo",
                    "TOWNHOUSE": "townhouse",
                    "MULTI_FAMILY": "multiFamily"
                };
                if (zillowTypes[type]) {
                    bodyObj.type = zillowTypes[type];
                }
            }

            body = JSON.stringify(bodyObj);
            providerTag = 'scout:zhomes';
            console.log(`📡 Fetching from ZHomes: ${url} (POST) for ${location} (type: ${type || 'any'})`);
        } else if (host === 'real-time-real-estate-data.p.rapidapi.com') {
            // Real-Time Real Estate Data — GET /search with correct params
            const typeMap: Record<string, string> = {
                "SINGLE_FAMILY": "Houses",
                "CONDO": "Apartments", // Condo is not supported by API, Apartment is closest match
                "TOWNHOUSE": "Townhomes",
                "MULTI_FAMILY": "Multi_family"
            };
            const params = new URLSearchParams({
                location: location,
                status_type: 'ForSale',
                offset: '0',
                limit: String(limit),
            });
            if (type && typeMap[type]) {
                params.append('home_type', typeMap[type]);
            }
            url = `https://${host}/search?${params}`;
            method = 'GET';
            providerTag = 'scout:real-time-data';
            console.log(`📡 Fetching from Real-Time RE Data: ${url}`);
        } else {
            console.warn(`[Scout] Unknown ZILLOW_RAPIDAPI_HOST: ${host}. Falling back to ZHomes default.`);
            // Default to ZHomes behavior if host is unknown or not specified
            url = `https://${'zhomes-realty-us.p.rapidapi.com'}/property/search`;
            method = 'POST';
            headers['Content-Type'] = 'application/json';
            body = JSON.stringify({
                location: location,
                status: "forSale",
            });
            // Update host in headers if we defaulted
            headers['x-rapidapi-host'] = 'zhomes-realty-us.p.rapidapi.com';
            providerTag = 'scout:zhomes-fallback';
        }

        const fetchOptions: RequestInit = {
            method: method,
            headers: headers,
        };
        if (body) {
            fetchOptions.body = body;
        }

        const res = await fetch(url, fetchOptions);

        if (!res.ok) {
            // If API fails, do not fallback to mocks
            console.error(`API Error (${host}): ${res.status} ${res.statusText}`);
            return [];
        }

        const json = await res.json();

        let listings: any[] = [];

        // Handle different API response structures
        if (host === 'zhomes-realty-us.p.rapidapi.com') {
            if (Array.isArray(json)) {
                listings = json;
            } else if (Array.isArray(json.data)) {
                listings = json.data;
            } else if (Array.isArray(json.props)) {
                listings = json.props;
            } else if (json.results && Array.isArray(json.results)) {
                listings = json.results;
            }
        } else if (host === 'real-time-real-estate-data.p.rapidapi.com') {
            // Real-Time Real Estate Data API often returns results directly in 'data' or 'properties'
            if (Array.isArray(json.data)) {
                listings = json.data;
            } else if (Array.isArray(json.properties)) {
                listings = json.properties;
            } else if (Array.isArray(json)) {
                listings = json;
            }
        } else {
            // Fallback for unknown hosts, assume ZHomes-like structure
            if (Array.isArray(json)) {
                listings = json;
            } else if (Array.isArray(json.data)) {
                listings = json.data;
            } else if (Array.isArray(json.props)) {
                listings = json.props;
            } else if (json.results && Array.isArray(json.results)) {
                listings = json.results;
            }
        }


        if (listings.length === 0) {
            console.warn("[Scout] No listings returned from API.");
            return [];
        }

        // Tag provider
        return listings.slice(0, limit).map((item: any) => ({
            ...item,
            _provider: providerTag
        }));

    } catch (error) {
        console.error("Fetch Zillow failed:", error);
        return [];
    }
}
// --- NEW: Fetch Property Detail (Schools, Tax, etc.) ---
// Utility to enrich a single property by its DB ID
export async function enrichPropertyById(id: string) {
    const prop = await prisma.property.findUnique({
        where: { id },
        select: { id: true, sourceId: true, rawData: true }
    });

    if (!prop) return null;

    const apiKey = process.env.ZILLOW_RAPIDAPI_KEY || '';
    const host = process.env.ZILLOW_RAPIDAPI_HOST || 'real-time-real-estate-data.p.rapidapi.com';

    if (!apiKey) return null;

    // Get zpid from rawData or sourceId
    let raw: any = {};
    try { raw = prop.rawData ? JSON.parse(prop.rawData) : {}; } catch {}

    const zpid = raw.zpid 
        || (prop.sourceId?.startsWith('z_') ? prop.sourceId.slice(2) : (prop.sourceId?.match(/^\d+$/) ? prop.sourceId : null));

    if (!zpid) return null;

    const detail = await fetchPropertyDetail(zpid, host, apiKey);
    if (!detail) return null;

    const enrichedFields: any = {};
    if (detail.schools?.length > 0)      enrichedFields.schools = detail.schools;
    if (detail.taxHistory?.length > 0)   enrichedFields.taxHistory = detail.taxHistory;
    if (detail.priceHistory?.length > 0) enrichedFields.priceHistory = detail.priceHistory;
    if (detail.resoFacts)                enrichedFields.resoFacts = detail.resoFacts;
    if (detail.propertyTaxRate != null)  enrichedFields.propertyTaxRate = detail.propertyTaxRate;

    if (Object.keys(enrichedFields).length === 0) return null;

    const merged = { ...raw, ...enrichedFields };
    const taxAssessed = detail.resoFacts?.taxAssessedValue 
        ? safeNumber(detail.resoFacts.taxAssessedValue) 
        : undefined;

    return await prisma.property.update({
        where: { id: prop.id },
        data: { 
            rawData: JSON.stringify(merged),
            ...(taxAssessed ? { taxAssessedValue: taxAssessed } : {}),
        },
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// FETCH PROPERTIES BULK — calls ZHomes plural endpoint for multiple ZPIDs
// ─────────────────────────────────────────────────────────────────────────────
async function fetchPropertiesBulk(zpids: string[], host: string, apiKey: string) {
    if (zpids.length === 0) return [];
    
    try {
        // ZHomes v2 supports plural 'details' endpoint
        // URL Pattern: https://zhomes-realty-us.p.rapidapi.com/v2/properties/details?zpid=ZPID1,ZPID2,...
        const url = `https://zhomes-realty-us.p.rapidapi.com/v2/properties/details?zpid=${zpids.join(',')}`;

        console.log(`📡 Fetching bulk details for ${zpids.length} zpids from ZHomes`);
        const res = await fetch(url, {
            headers: {
                'x-rapidapi-host': 'zhomes-realty-us.p.rapidapi.com',
                'x-rapidapi-key': apiKey,
            }
        });

        if (!res.ok) {
            console.error(`Bulk API Error: ${res.status}`);
            return [];
        }

        const json = await res.json();
        const results = json.data || json;
        return Array.isArray(results) ? results : [results];
    } catch (err) {
        console.error(`fetchPropertiesBulk failed:`, err);
        return [];
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// FETCH PROPERTY DETAIL — calls the external RapidAPI for full fields
// ─────────────────────────────────────────────────────────────────────────────
async function fetchPropertyDetail(zpid: string, host: string, apiKey: string) {
    try {
        let url = '';
        if (host === 'real-time-real-estate-data.p.rapidapi.com') {
            url = `https://${host}/property-details?zpid=${zpid}`;
        } else {
            url = `https://zhomes-realty-us.p.rapidapi.com/property/detail?zpid=${zpid}`;
        }

        console.log(`📡 Fetching detail for zpid: ${zpid} from ${host}`);
        const res = await fetch(url, {
            headers: {
                'x-rapidapi-host': host,
                'x-rapidapi-key': apiKey,
            }
        });

        if (!res.ok) {
            console.error(`Detail API Error (${host}): ${res.status}`);
            return null;
        }

        const json = await res.json();
        return json.data || json;
    } catch (err) {
        console.error(`fetchPropertyDetail failed for ${zpid}:`, err);
        return null;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// DETAIL ENRICHMENT — fetch schools/taxHistory/resoFacts for existing DB properties
// Can be called for any city, enriches properties that are missing detail data.
// ─────────────────────────────────────────────────────────────────────────────
export async function enrichExistingProperties(location: string, limitCount?: number, sourceIds?: string[]) {
    const apiKey = process.env.ZILLOW_RAPIDAPI_KEY || '';
    const host = process.env.ZILLOW_RAPIDAPI_HOST || 'real-time-real-estate-data.p.rapidapi.com';

    if (!apiKey) {
        console.warn('[Scout] No API key — skipping enrichment');
        return { ok: false, error: 'No API key configured' };
    }

    // Find all properties in this location
    const query = location.split(',')[0].trim();
    const abbr = stateMap[query.toLowerCase()];

    const properties = await prisma.property.findMany({
        where: {
            AND: [
                {
                    OR: [
                        { city: { contains: query, mode: 'insensitive' } },
                        { state: { contains: query, mode: 'insensitive' } },
                        ...(abbr ? [{ state: { contains: abbr, mode: 'insensitive' as any } }] : [])
                    ]
                },
                ...(sourceIds && sourceIds.length > 0 ? [{ sourceId: { in: sourceIds } }] : [])
            ]
        },
        select: { id: true, sourceId: true, rawData: true },
        take: limitCount,
        orderBy: { createdAt: 'desc' }
    });

    console.log(`[Scout] Enriching ${properties.length} existing properties for ${query}...`);

    const toEnrich: { id: string, zpid: string, raw: any }[] = [];
    let skipped = 0;

    for (const prop of properties) {
        let raw: any = {};
        try { raw = prop.rawData ? JSON.parse(prop.rawData) : {}; } catch {}

        if (raw.schools?.length > 0 || raw.taxHistory?.length > 0) {
            skipped++;
            continue;
        }

        const zpid = raw.zpid 
            || (prop.sourceId?.startsWith('z_') ? prop.sourceId.slice(2) : (prop.sourceId?.match(/^\d+$/) ? prop.sourceId : null));

        if (zpid) {
            toEnrich.push({ id: prop.id, zpid, raw });
        }
    }

    if (toEnrich.length === 0) {
        console.log(`[Scout] No properties need enrichment. ${skipped} already had data.`);
        return { ok: true, enriched: 0, skipped, total: properties.length };
    }

    // Trigger consolidated enrichment
    const zpids = toEnrich.map(item => item.zpid);
    const details = await fetchPropertiesBulk(zpids, 'zhomes-realty-us.p.rapidapi.com', apiKey);
    
    let enriched = 0;
    for (const detail of details) {
        const item = toEnrich.find(e => String(e.zpid) === String(detail.zpid || detail.sourceId));
        if (!item) continue;

        const enrichedFields: any = {};
        if (detail.schools?.length > 0)      enrichedFields.schools = detail.schools;
        if (detail.taxHistory?.length > 0)   enrichedFields.taxHistory = detail.taxHistory;
        if (detail.priceHistory?.length > 0) enrichedFields.priceHistory = detail.priceHistory;
        if (detail.resoFacts)                enrichedFields.resoFacts = detail.resoFacts;
        if (detail.propertyTaxRate != null)  enrichedFields.propertyTaxRate = detail.propertyTaxRate;

        if (Object.keys(enrichedFields).length === 0) continue;

        const merged = { ...item.raw, ...enrichedFields };
        const taxAssessed = detail.resoFacts?.taxAssessedValue 
            ? safeNumber(detail.resoFacts.taxAssessedValue) 
            : undefined;

        await prisma.property.update({
            where: { id: item.id },
            data: { 
                rawData: JSON.stringify(merged),
                ...(taxAssessed ? { taxAssessedValue: taxAssessed } : {}),
            },
        });
        enriched++;
    }

    console.log(`[Scout] Enrichment done for ${query}: ${enriched} enriched via consolidated call.`);
    return { ok: true, enriched, skipped, total: properties.length };
}

// --- NEW: Fast Save Function ---
async function savePropertyBasic(mapped: any, userId?: string) {
    // Upsert Property with ALL fields
    const savedProp = await prisma.property.upsert({
        where: { sourceId: mapped.sourceId },
        update: {
            price: mapped.price,
            status: mapped.status,
            daysOnMarket: mapped.daysOnMarket,
            rentEstimate: mapped.rentEstimate,
            imageUrl: mapped.imageUrl,
            images: mapped.images,
        },
        create: {
            sourceId: mapped.sourceId,
            title: mapped.title,
            type: mapped.type,
            status: mapped.status,
            price: mapped.price,
            address: mapped.address,
            city: mapped.city,
            state: mapped.state,
            zip: mapped.zip,
            country: mapped.country,
            geoLocation: mapped.geoLocation,
            sqft: mapped.sqft,
            bedrooms: mapped.bedrooms,
            bathrooms: mapped.bathrooms,
            yearBuilt: mapped.yearBuilt,
            lotArea: mapped.lotArea,
            lotAreaUnit: mapped.lotAreaUnit,
            daysOnMarket: mapped.daysOnMarket,
            taxAssessedValue: mapped.taxAssessedValue,
            zestimate: mapped.zestimate,
            detailUrl: mapped.detailUrl,
            openHouseInfo: mapped.openHouseInfo,
            rentEstimate: mapped.rentEstimate,
            imageUrl: mapped.imageUrl,
            images: mapped.images,
            rawData: mapped.rawData,
        }
    });

    // Atomically create Lead if not exists using createMany with skipDuplicates.
    // This eliminates the race condition from findFirst + create pattern.
    // We need a unique constraint — use sourceId as the unique key.
    const existing = await prisma.lead.findFirst({
        where: { propertyId: savedProp.id },
        select: { id: true, status: true }
    });

    if (!existing) {
        // Create with status 'analyzed' directly — never 'new' — so the frontend
        // never shows an 'Analyzing...' badge. analyzeLeadFast() will update with
        // accurate math scores immediately after this via runInBatches.
        const newLead = await prisma.lead.create({
            data: {
                propertyId: savedProp.id,
                sourceId: mapped.sourceId,
                title: savedProp.title,
                price: savedProp.price,
                location: `${savedProp.city}, ${savedProp.state}`,
                status: 'analyzed', // Never expose 'new' to frontend
                score: 0,
                tier: 'cold',
                propertyData: mapped.rawData,
                userId: userId || undefined
            }
        });
        return { lead: newLead, isNew: true };
    }

    return { lead: existing, isNew: false };
}

// ─────────────────────────────────────────────────────────────────────────────
// FAST (math-only) analysis — no AI call, runs instantly for bulk scouting
// Used during initial Scout run so 40 properties are analyzed in <5 seconds.
// ─────────────────────────────────────────────────────────────────────────────
export async function analyzeLeadFast(leadId: string) {
    try {
        const lead = await prisma.lead.findUnique({
            where: { id: leadId },
            include: { property: true }
        });

        if (!lead || !lead.property) return;
        const savedProp = lead.property;

        // --- INSTANT UNDERWRITING (pure math, no external calls) ---
        const price = savedProp.price;
        const rentEstimate = savedProp.rentEstimate || (price * 0.008);
        const taxesMonthly = (savedProp.taxAssessedValue || price) * 0.012 / 12;
        const insuranceMonthly = 100;
        const maintMonthly = rentEstimate * 0.10;
        const expenses = taxesMonthly + insuranceMonthly + maintMonthly;
        
        // Calculate Debt Service early
        const loanAmt = price * 0.80;
        const debtService = loanPayment({ principal: loanAmt, annualRatePct: 6.5, termYears: 30 });

        // Calculate Monthly Cash Flow (subtracting Mortgage)
        const monthlyNoi = monthlyCashFlow({ monthlyRent: rentEstimate, monthlyExpenses: expenses });
        const mcf = monthlyNoi - debtService; // Actual Net Cash Flow

        const noiAnnual = monthlyNoi * 12;
        const cap = capRate({ netOperatingIncome: noiAnnual, propertyValue: price });
        const dscrVal = dscr({ annualNOI: noiAnnual, annualDebtService: debtService * 12 });

        const appPct = 4.0;
        const roi5 = roi5Years({ purchasePrice: price, annualNetCashFlow: mcf * 12, expectedAppreciationPct: appPct });
        const projections = project10Years({ purchasePrice: price, expectedAppreciationPct: appPct, annualNetCashFlowYear1: mcf * 12 });

        // Score using rule-based heuristics (instant, no AI)
        let score = 0;
        if (dscrVal >= 1.2) score += 3;
        if (cap >= 5.0) score += 3;
        if (roi5 >= 20) score += 4;
        const verdict = score >= 8 ? 'Excellent' : score >= 5 ? 'Good' : score >= 3 ? 'Neutral' : 'Risky';

        const financials = {
            monthlyRent: rentEstimate,
            monthlyExpenses: expenses,
            monthlyCashFlow: mcf, // Actual Net Cash Flow
            noiAnnual,
            capRate: cap,
            dscr: dscrVal,
            roi5,
            projections,
            aiRecommendation: null, // AI analysis happens on-demand when user views the property
            taxAssessedValue: savedProp.taxAssessedValue,
            zestimate: savedProp.zestimate,
            daysOnMarket: savedProp.daysOnMarket,
        };

        await Promise.all([
            prisma.lead.update({
                where: { id: lead.id },
                data: {
                    status: 'analyzed',
                    score,
                    tier: verdict === 'Excellent' || verdict === 'Good' ? 'hot' : 'cold',
                }
            }),
            prisma.analysis.create({
                data: {
                    leadId: lead.id,
                    verdict,
                    score,
                    financials: JSON.stringify(financials)
                }
            })
        ]);

    } catch (error) {
        console.error(`[Scout] Fast analysis failed for lead ${leadId}:`, error);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// FULL (AI-enhanced) analysis — used on-demand when user opens a property page.
// Makes a Gemini API call, so it takes a few seconds but gives rich insights.
// ─────────────────────────────────────────────────────────────────────────────
export async function analyzeLead(leadId: string, skipAI = false) {
    try {
        const lead = await prisma.lead.findUnique({
            where: { id: leadId },
            include: { property: true }
        });

        if (!lead || !lead.property) return;

        const savedProp = lead.property;
        console.log(`[Scout] Analyzing lead: ${savedProp.address} (${lead.id})`);

        // --- PERFORM UNDERWRITING ---
        const price = savedProp.price;
        const rentEstimate = savedProp.rentEstimate || (price * 0.008);
        const taxesMonthly = (savedProp.taxAssessedValue || price) * 0.012 / 12;
        const insuranceMonthly = 100;
        const maintMonthly = rentEstimate * 0.10;
        const expenses = taxesMonthly + insuranceMonthly + maintMonthly;
        
        // Calculate Debt Service early
        const loanAmt = price * 0.80;
        const debtService = loanPayment({ principal: loanAmt, annualRatePct: 6.5, termYears: 30 });

        // Calculate Monthly Cash Flow (subtracting Mortgage)
        const monthlyNoi = monthlyCashFlow({ monthlyRent: rentEstimate, monthlyExpenses: expenses });
        const mcf = monthlyNoi - debtService; // Actual Net Cash Flow

        const noiAnnual = monthlyNoi * 12;
        const cap = capRate({ netOperatingIncome: noiAnnual, propertyValue: price });
        const dscrVal = dscr({ annualNOI: noiAnnual, annualDebtService: debtService * 12 });

        const appPct = 4.0;
        const roi5 = roi5Years({ purchasePrice: price, annualNetCashFlow: mcf * 12, expectedAppreciationPct: appPct });
        const projections = project10Years({
            purchasePrice: price,
            expectedAppreciationPct: appPct,
            annualNetCashFlowYear1: mcf * 12
        });

        // --- MATH-BASED SCORE (instant baseline) ---
        let score = 0;
        if (dscrVal >= 1.2) score += 3;
        if (cap >= 5.0) score += 3;
        if (roi5 >= 20) score += 4;
        let verdict = score >= 8 ? 'Excellent' : score >= 5 ? 'Good' : score >= 3 ? 'Neutral' : 'Risky';

        // --- AI ENHANCEMENT (optional, skipped during bulk scouting) ---
        let aiData: any = null;
        if (!skipAI) {
            try {
                const systemPrompt = buildSystemPrompt('auto');
                const analysisPrompt = buildAnalysisPrompt({
                    title: savedProp.title,
                    price: savedProp.price,
                    location: `${savedProp.city}, ${savedProp.state}`,
                    rentalYield: `${cap.toFixed(2)}%`,
                    expectedAppreciation: "4% per year",
                    type: savedProp.type,
                    sqft: savedProp.sqft,
                    bedrooms: savedProp.bedrooms,
                    bathrooms: savedProp.bathrooms
                });
                aiData = await generateAIAnalysis(`${systemPrompt}\n\n${analysisPrompt}`);
                if (aiData) {
                    if (typeof aiData.score === 'number') score = aiData.score;
                    if (aiData.verdict) verdict = aiData.verdict;
                }
            } catch (aiErr) {
                console.error("[Scout] AI Gen Failed (will use math score):", aiErr);
            }
        }

        const financials = {
            monthlyRent: rentEstimate,
            monthlyExpenses: expenses,
            monthlyCashFlow: mcf,
            noiAnnual,
            capRate: cap,
            dscr: dscrVal,
            roi5,
            projections,
            aiRecommendation: aiData ? JSON.stringify(aiData) : null,
            taxAssessedValue: savedProp.taxAssessedValue,
            zestimate: savedProp.zestimate,
            daysOnMarket: savedProp.daysOnMarket
        };

        await Promise.all([
            prisma.lead.update({
                where: { id: lead.id },
                data: {
                    status: 'analyzed',
                    score,
                    tier: verdict === 'Excellent' || verdict === 'Good' ? 'hot' : 'cold',
                }
            }),
            prisma.analysis.create({
                data: {
                    leadId: lead.id,
                    verdict,
                    score,
                    financials: JSON.stringify(financials)
                }
            })
        ]);

        console.log(`[Scout] Analysis complete for ${savedProp.address}`);

    } catch (error) {
        console.error(`[Scout] Analysis failed for lead ${leadId}:`, error);
    }
}

export async function runScout(location: string = 'Austin, TX', limit: number = 50, userId?: string, type?: string) {
    try {
        // --- SERVER-SIDE DEDUPLICATION (6-hour refresh gate) ---
        // If we already have leads for this location fetched within the last 6 hours,
        // skip the external API call. This acts as the background refresh mechanism:
        // each load after 6h will silently re-run Scout and upsert new listings.
        // each load after 6h will silently re-run Scout and upsert new listings.
        const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
        const query = location.split(',')[0].trim();
        const abbr = stateMap[query.toLowerCase()];

        const recentLeads = await prisma.lead.findFirst({
            where: {
                OR: [
                    { location: { contains: query, mode: 'insensitive' } },
                    { property: { city: { contains: query, mode: 'insensitive' } } },
                    { property: { state: { contains: query, mode: 'insensitive' } } },
                    ...(abbr ? [{ property: { state: { contains: abbr, mode: 'insensitive' as any } } }] : [])
                ],
                createdAt: { gte: sixHoursAgo },
                ...(type ? { property: { type: { equals: type, mode: 'insensitive' } } } : {})
            }
        });

        if (recentLeads) {
            console.log(`[Scout] Found recent leads for ${location}, using cached data.`);
            // STILL enrich existing properties — the gate only blocks re-fetching listings,
            // not detail enrichment. This handles the case where properties were saved
            // before the detail enrichment feature existed.
            (async () => {
                await enrichExistingProperties(location);
            })();

            // Also find and return IDs of leads for this location so the caller can display them
            const queryLeads = await prisma.lead.findMany({
                where: {
                    OR: [
                        { location: { contains: query, mode: 'insensitive' } },
                        { property: { city: { contains: query, mode: 'insensitive' } } },
                        { property: { state: { contains: query, mode: 'insensitive' } } },
                        ...(abbr ? [{ property: { state: { contains: abbr, mode: 'insensitive' as any } } }] : [])
                    ],
                    createdAt: { gte: sixHoursAgo }
                },
                select: { id: true }
            });

            return { 
                ok: true, 
                saved: 0, 
                leadIds: queryLeads.map(l => l.id),
                message: "Using cached data (enrichment running in background)" 
            };
        }

        const properties = await fetchZillow(location, limit, type);
        console.log(`[Scout] Fetched ${properties.length} properties for ${location}`);

        let savedCount = 0;
        const newLeadIds: string[] = [];
        const allLeadIds: string[] = [];

        // 1. FAST SAVE
        for (const p of properties) {
            try {
                const mapped = mapToLead(p, p._provider);
                const { lead, isNew } = await savePropertyBasic(mapped, userId);
                allLeadIds.push(lead.id);

                if (isNew) {
                    newLeadIds.push(lead.id);
                    savedCount++;
                }
            } catch (err) {
                console.error("[Scout] Error saving property:", err);
            }
        }

        // 2. BACKGROUND ENRICHMENT + ANALYSIS (fire-and-forget)
        // Fetches property detail (schools, taxHistory, resoFacts) and runs math analysis
        // in parallel batches so it doesn't block the initial response.
        (async () => {
            // Step 2a: Tiered Enrichment — Now more efficient with 1+1 flow.
            // Enrich top 20 properties in one consolidated background call.
            console.log(`[Scout] Running background enrichment for top 20 leads in ${location}...`);
            await enrichExistingProperties(location, 20, allLeadIds);

            // Step 2b: Run fast math analysis for new leads
            console.log(`[Scout] Starting parallel analysis for ${newLeadIds.length} leads (batches of 5)...`);
            await runInBatches(newLeadIds, 5, (leadId) => analyzeLeadFast(leadId));
            console.log(`[Scout] Background analysis complete for ${newLeadIds.length} leads.`);
        })();

        console.log(`[Scout] Validated ${savedCount} new leads. Analysis running in background.`);
        return { ok: true, saved: savedCount, total: properties.length, leadIds: allLeadIds };

    } catch (e: any) {
        console.error("[Scout] Logic Error:", e);
        return { ok: false, error: e.message };
    }
}
