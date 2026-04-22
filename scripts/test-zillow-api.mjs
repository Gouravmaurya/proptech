// ================================================================
//  Haven – Zillow API Tester (mirrors scout-agent.ts exactly)
//  Run: node scripts/test-zillow-api.mjs
//
//  ✏️  Only edit the CONFIG block below.
// ================================================================

// ┌──────────────────────────────────────────────────────────────┐
// │                     ✏️  EDIT THIS ONLY                       │
// └──────────────────────────────────────────────────────────────┘

const API_KEY = "ddc30bfc1fmsha610a3abf7f14a0p120d0fjsnae3fa5422508";
const API_HOST = "real-time-real-estate-data.p.rapidapi.com";

// other hosts to try:
//   "zhomes-realty-us.p.rapidapi.com"       (POST /property/search)
//   "zillow56.p.rapidapi.com"               (GET  /search)
//   "zillow-com1.p.rapidapi.com"            (GET  /propertyExtendedSearch)

const LOCATION = "Austin, TX";   // city, zip, "City, ST"
const STATUS = "ForSale";      // ForSale | ForRent | RecentlySold
const HOME_TYPE = "Houses";       // Houses | Apartments_Condos_Co-ops | Townhomes | null
const LIMIT = 5;              // how many properties to fetch
const FULL_PRINT = 2;              // how many to print in full detail
const SHOW_RAW = false;          // true = dump raw JSON for each property

// ┌──────────────────────────────────────────────────────────────┐
// │                    DO NOT EDIT BELOW                         │
// └──────────────────────────────────────────────────────────────┘

const C = {
    r: "\x1b[0m", b: "\x1b[1m", d: "\x1b[2m",
    g: "\x1b[32m", c: "\x1b[36m", y: "\x1b[33m",
    re: "\x1b[31m", bl: "\x1b[34m", m: "\x1b[35m",
};
const ln = (ch = "─", n = 62) => `  ${C.d}${ch.repeat(n)}${C.r}`;
const row = (k, v, col = C.r) => {
    if (v == null || v === "") return;
    console.log(`  ${C.d}${String(k).padEnd(28)}${C.r}${col}${v}${C.r}`);
};
const hdr = (t) => {
    console.log(`\n${C.b}${C.c}${"═".repeat(64)}${C.r}`);
    console.log(`${C.b}${C.c}  ${t}${C.r}`);
    console.log(`${C.b}${C.c}${"═".repeat(64)}${C.r}`);
};
const h2 = (t) => console.log(`\n  ${C.b}${C.bl}${t}${C.r}`);

// ── Same safeNumber helper as scout-agent.ts ──────────────────
function safeNumber(val) {
    if (val === null || val === undefined || val === "") return undefined;
    if (typeof val === "number") return val;
    const n = Number(String(val).replace(/[^0-9.-]/g, ""));
    return isNaN(n) ? undefined : n;
}

// ── Same mapToLead logic as scout-agent.ts ───────────────────
// (exact field mapping used when saving to DB)
function mapToLead(raw) {
    const address = raw.address || raw.streetAddress || "";
    const location = raw.location || [raw.city, raw.state].filter(Boolean).join(", ") || "";

    let imagesArray = [];
    if (raw.carouselPhotosComposable?.photoData && raw.carouselPhotosComposable.baseUrl) {
        const baseUrl = raw.carouselPhotosComposable.baseUrl;
        imagesArray = raw.carouselPhotosComposable.photoData
            .slice(0, 20)
            .map(photo => baseUrl.replace("{photoKey}", photo.photoKey));
    } else if (raw.photos && Array.isArray(raw.photos)) {
        imagesArray = raw.photos.slice(0, 20).map(p => p?.url || p).filter(Boolean);
    }

    return {
        // ── Stored in Property table ──────────────────────────
        sourceId: raw.sourceId || (raw.zpid ? `z_${raw.zpid}` : `mock_${Date.now()}`),
        title: raw.title || raw.streetAddress || address || "Unknown Property",
        type: raw.type || raw.homeType || "Single Family",
        status: raw.status || raw.homeStatus || "For Sale",
        price: safeNumber(raw.price) || 0,
        address: address,
        city: raw.city,
        state: raw.state,
        zip: raw.zipcode || raw.zip,
        country: raw.country || "USA",
        geoLocation: raw.latitude && raw.longitude
            ? { lat: raw.latitude, lng: raw.longitude }
            : null,
        sqft: safeNumber(raw.sqft) || safeNumber(raw.livingArea) || safeNumber(raw.area),
        bedrooms: safeNumber(raw.bedrooms) || safeNumber(raw.beds),
        bathrooms: safeNumber(raw.bathrooms) || safeNumber(raw.baths),
        yearBuilt: safeNumber(raw.yearBuilt),
        lotArea: safeNumber(raw.lotAreaValue),
        lotAreaUnit: raw.lotAreaUnit,
        daysOnMarket: safeNumber(raw.daysOnZillow),
        taxAssessedValue: safeNumber(raw.taxAssessedValue),
        zestimate: safeNumber(raw.zestimate),
        detailUrl: raw.detailUrl,
        openHouseInfo: raw.openHouse ? { schedule: raw.openHouse } : null,
        rentEstimate: safeNumber(raw.rentEstimate) || safeNumber(raw.rentZestimate),
        imageUrl: raw.image || raw.imgSrc || (imagesArray.length > 0 ? imagesArray[0] : null),
        images: imagesArray,
        rawData: "(full raw JSON – see SHOW_RAW=true)",

        // ── NOT in DB — drops on the floor ───────────────────
        _NOT_SAVED_description: raw.description || null,
        _NOT_SAVED_amenities: raw.amenities || null,
    };
}

// ── Extract agent details from detail response ────────────────
function extractAgent(detail) {
    const a = detail?.attributionInfo || {};
    return {
        "Agent Name": a.agentName || null,
        "Agent Phone": a.agentPhoneNumber || null,
        "Agent Email": a.agentEmail || null,
        "Agent License #": a.agentLicenseNumber || null,
        "Co-Agent Name": a.coAgentName || null,
        "Broker Name": a.brokerName || null,
        "Broker Phone": a.brokerPhoneNumber || null,
        "Buyer Agent": a.buyerAgentName || null,
        "Buyer Brokerage": a.buyerBrokerageName || null,
        "MLS Name": a.mlsName || null,
        "Listing Agreement": a.listingAgreement || null,
        "Listing Status": a.trueStatus || null,
    };
}

// ── STEP 1: Same search call as scout-agent.ts ────────────────
async function searchProperties() {
    // real-time-real-estate-data uses GET /search
    const params = new URLSearchParams({
        location: LOCATION,
        status_type: STATUS,
        home_type: HOME_TYPE,
        offset: "0",
        limit: String(LIMIT),
    });
    const url = `https://${API_HOST}/search?${params}`;
    console.log(`\n  ${C.d}Endpoint :${C.r} ${C.b}GET /search${C.r}`);
    console.log(`  ${C.d}URL      :${C.r} ${url}`);

    const res = await fetch(url, {
        headers: { "x-rapidapi-key": API_KEY, "x-rapidapi-host": API_HOST },
    });

    console.log(`  ${C.d}HTTP     :${C.r} ${res.status === 200 ? C.g : C.re}${res.status} ${res.statusText}${C.r}`);
    const rl = res.headers.get("x-ratelimit-requests-remaining");
    if (rl) console.log(`  ${C.d}Quota    :${C.r} ${rl} requests remaining this month`);

    if (!res.ok) {
        const body = await res.text();
        console.error(`\n  ${C.re}✖ API Error: ${body.slice(0, 400)}${C.r}`);
        return null;
    }

    const json = await res.json();
    // real-time-real-estate-data returns { status, data: [...] }
    const listings = json.data || json.props || json.results || (Array.isArray(json) ? json : []);
    console.log(`  ${C.g}✔ ${listings.length} properties returned${C.r}`);
    return listings;
}

// ── STEP 2: Fetch full detail for one property (agent data) ───
async function fetchDetail(zpid) {
    if (!zpid) return null;
    const url = `https://${API_HOST}/property-details?zpid=${zpid}`;
    console.log(`  ${C.d}Detail   :${C.r} GET /property-details?zpid=${zpid}`);

    const res = await fetch(url, {
        headers: { "x-rapidapi-key": API_KEY, "x-rapidapi-host": API_HOST },
    });

    if (!res.ok) {
        console.log(`  ${C.y}⚠ Detail endpoint returned ${res.status}${C.r}`);
        return null;
    }
    const json = await res.json();
    return json.data || null;
}

// ── Print one property ────────────────────────────────────────
function printProperty(raw, detail, index) {
    const mapped = mapToLead(raw);
    const agent = extractAgent(detail);

    console.log(`\n${C.m}${C.b}  ╔══ Property #${index + 1} ${raw.streetAddress || ""} ${"═".repeat(Math.max(0, 40 - (raw.streetAddress || "").length))}╗${C.r}`);

    // ── What we ACTUALLY save to DB ──
    h2("💾 SAVED TO DATABASE (Property table)");
    console.log(ln());
    row("sourceId", mapped.sourceId, C.c);
    row("title", mapped.title, C.b);
    row("type", mapped.type);
    row("status", mapped.status);
    row("price", `$${mapped.price.toLocaleString()}`, C.g);
    row("address", mapped.address);
    row("city", mapped.city);
    row("state", mapped.state);
    row("zip", mapped.zip);
    row("geoLocation", mapped.geoLocation ? `lat:${mapped.geoLocation.lat}  lng:${mapped.geoLocation.lng}` : null);
    row("sqft", mapped.sqft ? `${Number(mapped.sqft).toLocaleString()} sqft` : null);
    row("bedrooms", mapped.bedrooms);
    row("bathrooms", mapped.bathrooms);
    row("yearBuilt", mapped.yearBuilt);
    row("lotArea", mapped.lotArea ? `${mapped.lotArea} ${mapped.lotAreaUnit || "sqft"}` : null);
    row("daysOnMarket", mapped.daysOnMarket);
    row("taxAssessedValue", mapped.taxAssessedValue ? `$${Number(mapped.taxAssessedValue).toLocaleString()}` : null);
    row("zestimate", mapped.zestimate ? `$${Number(mapped.zestimate).toLocaleString()}` : null, C.y);
    row("rentEstimate", mapped.rentEstimate ? `$${Number(mapped.rentEstimate).toLocaleString()}/mo` : null, C.c);
    row("imageUrl", mapped.imageUrl ? mapped.imageUrl.slice(0, 70) + "…" : null);
    row("images count", mapped.images.length ? `${mapped.images.length} photos` : null);
    row("detailUrl", mapped.detailUrl ? mapped.detailUrl.slice(0, 70) + "…" : null);
    row("openHouseInfo", mapped.openHouseInfo ? JSON.stringify(mapped.openHouseInfo) : null);

    // ── What is NOT saved ──
    h2("❌ API FIELDS WE RECEIVE BUT DO NOT SAVE");
    console.log(ln());
    row("description", mapped._NOT_SAVED_description || "(not in this response)");
    row("amenities", mapped._NOT_SAVED_amenities || "(not in this response)");
    row("brokerName", "(not in search response—comes from detail)");
    row("agentName", "(not in search response—comes from detail)");
    row("agentPhone", "(not in search response—comes from detail)");

    // ── Agent from detail endpoint ──
    h2("🧑‍💼 AGENT & BROKER (from /property-details)");
    console.log(ln());
    if (!detail) {
        console.log(`  ${C.y}  ⚠ Could not fetch detail (quota or zpid issue)${C.r}`);
    } else {
        const hasAgent = Object.values(agent).some(Boolean);
        if (!hasAgent) {
            console.log(`  ${C.re}  ⚠ No agent fields in detail response${C.r}`);
        } else {
            Object.entries(agent).forEach(([k, v]) => {
                const col = k.includes("Phone") ? C.g : k.includes("Email") ? C.c : k.includes("Name") ? C.b : C.r;
                row(k, v, col);
            });
        }
    }

    // ── Additional detail facts ──
    if (detail) {
        h2("🏡 ADDITIONAL DETAIL (from /property-details only)");
        console.log(ln());
        const rf = detail.resoFacts || {};
        row("Description", detail.description ? detail.description.slice(0, 120) + "…" : null);
        row("Home Type (detail)", detail.homeType || rf.homeType);
        row("Appliances", Array.isArray(rf.appliances) ? rf.appliances.slice(0, 4).join(", ") : null);
        row("Heating", Array.isArray(rf.heating) ? rf.heating.join(", ") : null);
        row("Cooling", Array.isArray(rf.cooling) ? rf.cooling.join(", ") : null);
        row("Flooring", Array.isArray(rf.flooring) ? rf.flooring.join(", ") : null);
        row("Parking", rf.parkingCapacity ? `${rf.parkingCapacity} spaces` : null);
        row("HOA Fee", rf.associationFee ? `$${rf.associationFee}/mo` : null);
        row("Builder Name", rf.builderName || null);
        row("Zestimate (detail)", detail.zestimate ? `$${Number(detail.zestimate).toLocaleString()}` : null, C.y);
        row("Rent Estimate", detail.rentZestimate ? `$${Number(detail.rentZestimate).toLocaleString()}/mo` : null, C.c);
        row("Tax History (last)", detail.taxHistory?.[0] ? `$${detail.taxHistory[0].taxPaid} (${detail.taxHistory[0].time})` : null);
    }

    if (SHOW_RAW) {
        h2("📦 RAW JSON – Search listing");
        console.log(JSON.stringify(raw, null, 2));
        if (detail) {
            h2("📦 RAW JSON – Detail");
            console.log(JSON.stringify(detail, null, 2));
        }
    }

    console.log(`\n${C.m}${C.b}  ╚${"═".repeat(60)}╝${C.r}`);
}

// ── MAIN ──────────────────────────────────────────────────────
async function main() {
    hdr("Haven – Zillow API Tester  (mirrors scout-agent.ts)");

    console.log(`\n  ${C.d}Host     :${C.r} ${C.b}${API_HOST}${C.r}`);
    console.log(`  ${C.d}Key      :${C.r} ${API_KEY.slice(0, 8)}${"•".repeat(18)}${API_KEY.slice(-6)}`);
    console.log(`  ${C.d}Location :${C.r} ${LOCATION}  |  status: ${STATUS}  |  type: ${HOME_TYPE}`);

    // Step 1 – Search (same as app)
    hdr("STEP 1 – Search Properties  (same as scout-agent.ts)");
    const listings = await searchProperties();
    if (!listings || listings.length === 0) process.exit(1);

    // Step 2 – Detail + print full view for first N
    hdr(`STEP 2 – Full Detail View  (first ${Math.min(FULL_PRINT, listings.length)} properties)`);

    for (let i = 0; i < Math.min(FULL_PRINT, listings.length); i++) {
        const raw = listings[i];
        const zpid = raw.zpid;
        console.log(`\n  ${C.y}⏳ Fetching /property-details for zpid ${zpid}…${C.r}`);
        const detail = await fetchDetail(zpid);
        printProperty(raw, detail, i);
        // Small delay to avoid hammering rate limits
        if (i < Math.min(FULL_PRINT, listings.length) - 1) await new Promise(r => setTimeout(r, 800));
    }

    // Step 3 – Quick summary table of ALL results
    hdr(`STEP 3 – All ${listings.length} Properties (Quick Table)`);
    console.log(`\n  ${C.d}${"#".padEnd(4)}${"Address".padEnd(34)}${"Price".padStart(12)}  ${"Bd".padStart(3)}  ${"Ba".padStart(3)}  ${"Sqft".padStart(7)}  ${"ZPID".padStart(10)}${C.r}`);
    console.log(ln());
    listings.forEach((p, i) => {
        const addr = (p.streetAddress || p.address || "-").slice(0, 33).padEnd(34);
        const price = p.price != null ? `$${Number(p.price).toLocaleString()}`.padStart(12) : "       N/A";
        const beds = String(p.bedrooms ?? p.beds ?? "-").padStart(3);
        const baths = String(p.bathrooms ?? p.baths ?? "-").padStart(3);
        const sqft = String(p.livingArea ?? "-").padStart(7);
        const zpid = String(p.zpid ?? "-").padStart(10);
        console.log(`  ${String(i + 1).padEnd(4)}${addr}${C.g}${price}${C.r}  ${beds}  ${baths}  ${sqft}  ${C.d}${zpid}${C.r}`);
    });

    console.log(`\n${C.g}${C.b}  ✔ Done.${C.r}\n`);
}

main().catch(e => { console.error(`${C.re}Fatal: ${e.message}${C.r}`); process.exit(1); });
