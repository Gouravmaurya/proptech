import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const apiKey = process.env.ZILLOW_RAPIDAPI_KEY;

async function testBulkEnrich() {
    if (!apiKey) {
        console.error("Missing ZILLOW_RAPIDAPI_KEY in .env");
        return;
    }

    const prisma = new PrismaClient();
    
    // 1. Get some real ZPIDs from the DB
    const properties = await prisma.property.findMany({
        take: 3,
        select: { sourceId: true, address: true }
    });

    if (properties.length === 0) {
        console.log("No properties found in DB to test with.");
        await prisma.$disconnect();
        return;
    }

    const zpids = properties.map(p => {
        const sid = p.sourceId;
        return sid.startsWith('z_') ? sid.slice(2) : sid;
    });

    console.log(`Testing bulk enrichment for ZPIDs: ${zpids.join(', ')}`);

    // 2. Call the Real-Time RE Data endpoint
    const url = `https://real-time-real-estate-data.p.rapidapi.com/property-details?zpid=${zpids.join(',')}`;
    
    try {
        const res = await fetch(url, {
            headers: {
                'x-rapidapi-host': 'real-time-real-estate-data.p.rapidapi.com',
                'x-rapidapi-key': apiKey,
            }
        });

        console.log(`Response Status: ${res.status}`);
        const json = await res.json();
        const data = json.data || json;

        if (Array.isArray(data)) {
            console.log(`Success! Received details for ${data.length} properties.`);
            data.forEach((prop, i) => {
                console.log(`[${i}] ZPID: ${prop.zpid || prop.sourceId} - Schools Found: ${prop.schools?.length || 0}`);
            });
        } else {
            console.log("Response was not an array. Data received:", JSON.stringify(data).slice(0, 200));
        }
    } catch (err) {
        console.error("Test failed:", err);
    }

    await prisma.$disconnect();
}

testBulkEnrich();
