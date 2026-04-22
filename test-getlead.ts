import { getLead } from './src/app/actions/dashboard';

async function run() {
    const targetId = 'cmm4buwnz004a42eb6sl9vu1j';
    console.log(`Calling getLead for ${targetId}...`);
    try {
        const lead = await getLead(targetId);
        if (!lead) {
            console.log("getLead returned null!");
            return;
        }

        console.log("\n--- Verification Result ---");
        console.log("- Title:", lead.title);
        console.log("- rawData present:", !!lead.property?.rawData);
        
        if (lead.property?.rawData) {
            try {
                // Notice: getLead output spreads property, preserving the rawData string
                const raw = typeof lead.property.rawData === 'string' 
                    ? JSON.parse(lead.property.rawData) 
                    : lead.property.rawData;
                
                console.log("- taxHistory:", !!raw.taxHistory && raw.taxHistory.length > 0);
                if (raw.taxHistory) {
                    console.log(`- taxHistory length: ${raw.taxHistory.length} records`);
                    console.log("- taxHistory sample:", JSON.stringify(raw.taxHistory).slice(0, 150));
                }
            } catch (e: any) {
                console.error("- Failed to parse rawData inside verification:", e.message);
            }
        }
    } catch (e) {
        console.error("Error invoking getLead:", e);
    }
}

run();
