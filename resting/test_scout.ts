
import fs from 'fs';
import path from 'path';

// --- Copied Logic from src/app/api/agents/scout/route.ts ---

// Helper to normalized Zillow/Mock data to our schema
function mapToLead(raw: any, provider: string) {
    // Simple mapping, adjust based on actual API response
    const address = raw.address || raw.streetAddress || "";
    // const location = raw.location || [raw.city, raw.state].filter(Boolean).join(', ') || ""; // Not used in this simplified test

    return {
        sourceId: raw.sourceId || raw.zpid || `mock_${Date.now()}_${Math.random()}`,
        title: raw.title || address || "Unknown Property",
        // Ensure we don't pass nulls where strings are expected if using strict types, but Prisma handles optionals
        type: raw.type || raw.homeType || "Single Family",
        status: raw.status || "For Sale",
        price: Number(raw.price) || 0,
        address: address,
        city: raw.city,
        state: raw.state,
        zip: raw.zipcode || raw.zip,
        country: raw.country || "USA",
        geoLocation: raw.geoLocation ? JSON.stringify(raw.geoLocation) : null,
        sqft: Number(raw.sqft || raw.livingArea) || undefined,
        bedrooms: Number(raw.bedrooms) || undefined,
        bathrooms: Number(raw.bathrooms) || undefined,
        imageUrl: raw.image || raw.imgSrc || null,
        images: raw.photos ? JSON.stringify(raw.photos) : null,
        rentEstimate: Number(raw.rentEstimate || raw.rentZestimate) || undefined,
        _provider: provider
    };
}

async function fetchZillow(location: string, limit: number) {
    const apiKey = process.env.ZILLOW_RAPIDAPI_KEY;
    const host = process.env.ZILLOW_RAPIDAPI_HOST || 'real-time-real-estate-data.p.rapidapi.com';

    if (!apiKey) {
        console.log("⚠️ No Zillow API key found, generating mock data...");
        return generateMockProperties(location, limit);
    }

    try {
        const qp = new URLSearchParams({
            location: location || 'Los Angeles, CA',
            home_status: 'FOR_SALE',
            sort: 'DEFAULT',
            listing_type: 'BY_AGENT',
            limit: String(limit) // Some endpoints ignore this, but good to try
        });

        const url = `https://${host}/search?${qp.toString()}`;
        console.log(`📡 Fetching from Zillow: ${url}`);

        const res = await fetch(url, {
            headers: {
                'x-rapidapi-host': host,
                'x-rapidapi-key': apiKey,
            },
        });

        if (!res.ok) throw new Error(`Zillow API Error: ${res.status}`);

        const json = await res.json();
        const listings = json.data?.slice(0, limit) || [];

        // Save raw response for inspection
        fs.writeFileSync(path.join(process.cwd(), 'resting', 'zillow_raw.json'), JSON.stringify(json, null, 2));


        return listings.map((item: any) => ({
            sourceId: `z_${item.zpid}`,
            title: item.streetAddress || "Zillow Listing",
            type: item.homeType,
            price: item.price,
            address: item.streetAddress,
            city: item.city,
            state: item.state,
            zip: item.zipcode,
            country: item.country,
            geoLocation: { lat: item.latitude, lng: item.longitude },
            sqft: item.livingArea,
            bedrooms: item.bedrooms,
            bathrooms: item.bathrooms,
            image: item.imgSrc,
            rentEstimate: item.rentZestimate,
            _provider: 'scout:zillow'
        }));

    } catch (e) {
        console.error("Zillow Fetch Failed:", e);
        return generateMockProperties(location, limit); // Fallback
    }
}

function generateMockProperties(location: string, limit: number) {
    const mocks = [];
    const cities = location.split(',');
    const city = cities[0] || "Austin";
    const state = cities[1] || "TX";

    for (let i = 0; i < limit; i++) {
        const price = 250000 + Math.random() * 500000;
        mocks.push({
            sourceId: `mock_${city.replace(/\s/g, '')}_${i}_${Date.now()}`,
            title: `${Math.floor(Math.random() * 9999)} Mock St`,
            type: "Single Family",
            status: "For Sale",
            price: Math.floor(price),
            address: `${Math.floor(Math.random() * 9999)} Mock St`,
            city: city.trim(),
            state: state.trim(),
            geoLocation: { lat: 30.26 + Math.random() * 0.1, lng: -97.74 + Math.random() * 0.1 },
            sqft: 1200 + Math.floor(Math.random() * 1000),
            bedrooms: 3 + Math.floor(Math.random() * 2),
            bathrooms: 2 + Math.floor(Math.random() * 2),
            image: `https://photos.zillowstatic.com/fp/${Math.random().toString(36).substring(7)}-p_e.jpg`, // Placeholder
            rentEstimate: price * 0.008,
            _provider: 'scout:mock'
        });
    }
    return mocks;
}

// --- Main Execution ---

async function main() {
    console.log("🚀 Starting Scout Agent Test...");

    const location = process.env.TEST_LOCATION || "San Francisco, CA";
    const limit = 5;

    console.log(`📍 Location: ${location}`);
    console.log(`🔢 Limit: ${limit}`);

    const rawProperties = await fetchZillow(location, limit);
    console.log(`✅ Fetched ${rawProperties.length} properties.`);

    const processedLeads = rawProperties.map((p: any) => mapToLead(p, p._provider));
    console.log(`✅ Processed ${processedLeads.length} leads.`);

    const output = {
        timestamp: new Date().toISOString(),
        location,
        limit,
        count: processedLeads.length,
        results: processedLeads,
        raw: rawProperties // Optional: keep raw data for debugging
    };

    const outputPath = path.join(process.cwd(), 'resting', 'scout_data.json');
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

    console.log(`💾 Saved results to: ${outputPath}`);
}

main().catch(console.error);
