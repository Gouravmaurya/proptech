import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function testApi() {
    const host = 'real-time-real-estate-data.p.rapidapi.com';
    const apiKey = process.env.ZILLOW_RAPIDAPI_KEY;

    // Test 1: Omitting home_type
    const params1 = new URLSearchParams({
        location: "Austin, TX",
        status_type: "ForSale",
        offset: "0",
        limit: "5"
    });
    
    console.log("Testing with NO home_type...");
    const res1 = await fetch(`https://${host}/search?${params1}`, {
        headers: { 'x-rapidapi-host': host, 'x-rapidapi-key': apiKey! }
    });
    const data1 = await res1.json();
    console.log("No home_type status:", res1.status);
    console.log("Types returned:", data1.data?.map((d: any) => d.home_type || d.type) || "Error:", data1);

    // Test 2: Comma separated
    const params2 = new URLSearchParams({
        location: "Austin, TX",
        status_type: "ForSale",
        home_type: "Houses,Apartments,Townhomes,Multi_family",
        offset: "0",
        limit: "5"
    });
    console.log("\nTesting with COMMA SEPARATED home_type...");
    const res2 = await fetch(`https://${host}/search?${params2}`, {
        headers: { 'x-rapidapi-host': host, 'x-rapidapi-key': apiKey! }
    });
    const data2 = await res2.json();
    console.log("Comma separated status:", res2.status);
    console.log("Types returned:", data2.data?.map((d: any) => d.home_type || d.type) || "Error:", data2);
}

testApi();
