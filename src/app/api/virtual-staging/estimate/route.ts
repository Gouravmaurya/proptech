
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { originalImage, stagedImage, style, propertyId, leadId } = body;

        console.log("[Estimation API] Request received:", {
            hasOriginal: !!originalImage,
            hasStaged: !!stagedImage,
            style,
            propertyId,
            leadId
        });

        if (!originalImage || !stagedImage) {
            console.error("[Estimation API] Missing images");
            return NextResponse.json({ error: "Missing images" }, { status: 400 });
        }

        // Fetch property details for real-world context if IDs are provided
        let propertyData = null;
        try {
            if (propertyId || leadId) {
                console.log("[Estimation API] Fetching property context...");
                propertyData = await prisma.property.findFirst({
                    where: {
                        OR: [
                            { id: propertyId || "non-existent" },
                            { leads: { some: { id: leadId || "non-existent" } } }
                        ]
                    }
                });
            }
        } catch (dbError) {
            console.error("[Estimation API] DB Fetch Error (ignoring):", dbError);
        }

        const sqft = propertyData?.sqft || 1500;
        const location = propertyData ? `${propertyData.city}, ${propertyData.state}` : "Unknown Location";

        console.log("[Estimation API] Property context resolved:", { location, sqft });

        const apiKey = process.env.GEMINI_API_KEY1 || process.env.GOOGLE_API_KEY || "";

        if (!apiKey) {
            console.error("[Estimation API] Missing API Key");
            return NextResponse.json({ error: "Server configuration error: Missing API Key" }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        const getBase64 = async (input: string) => {
            if (input.startsWith("http")) {
                try {
                    const res = await fetch(input);
                    if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
                    const arrayBuffer = await res.arrayBuffer();
                    return Buffer.from(arrayBuffer).toString("base64");
                } catch (e) {
                    console.error("[Estimation API] Remote Image Fetch Error:", e);
                    return null;
                }
            }
            return input.includes(",") ? input.split(",")[1] : input;
        };

        const originalBase64 = await getBase64(originalImage);
        const stagedBase64 = await getBase64(stagedImage);

        if (!originalBase64 || !stagedBase64) {
            console.error("[Estimation API] Image processing failed");
            return NextResponse.json({ error: "Failed to process images" }, { status: 400 });
        }

        // Using gemini-flash-lite-latest which was confirmed working in previous versions
        const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

        const prompt = `
        You are an Investor-Focused Residential Contractor analyzing room changes.
        
        CONTEXT: 
        - Property Location: ${location}
        - Total Property Size: ${sqft} sq ft
        - Proposed Style: "${style}"

        TASK:
        Compare the 'Before' and 'After' images. Identify visible changes.
        Provide PRACTICAL, budget-conscious costs for these changes in ${location}.
        
        INVESTOR-GRADE PRICING RULES (AGGRESSIVE ECONOMY):
        - Flooring: $3-$4/sqft installed (Entry-level LVP or peel-and-stick).
        - Interior Paint: $500-$1,000 (DIY-friendly or economy professional refresh).
        - Lighting: $50-$150 per fixture (Modern budget fixtures).
        - Kitchen Refresh: Cabinet paint/refacing ($1,000-$2,000), Laminate counters ($1,000-$2,000).
        - Furniture: Global Value/IKEA Grade (Sofa: $400-$700, Rug: $100-$200).
        
        Calculations must be proportional to the visible room size relative to a ${sqft} sq ft property.
        MANDATORY: Prioritize DIY-friendly or ultra-budget solutions to aim for a total renovation budget between $5,000 and $7,000 where visually possible.

        Output strictly in this JSON format:
        {
            "renovationItems": [
                { "item": "string", "description": "Visual change - assume DIY/Budget grade", "costRange": "$X,XXX - $X,XXX" }
            ],
            "furnitureItems": [
                { "item": "string", "description": "Value furniture item", "costRange": "$XXX - $XXX" }
            ],
            "totalCost": "$X,XXX - $X,XXX",
            "summary": "Explain how ultra-budget choices for this ${sqft} sq ft house kept it under $7k."
        }
        `;

        console.log("[Estimation API] Calling Gemini...");
        const result = await model.generateContent([
            prompt,
            { inlineData: { data: originalBase64, mimeType: "image/jpeg" } },
            { inlineData: { data: stagedBase64, mimeType: "image/jpeg" } },
        ]);

        const responseText = result.response.text();
        console.log("[Estimation API] Gemini raw response received");

        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error("[Estimation API] JSON match failed. Response:", responseText);
            throw new Error("Failed to parse JSON from Gemini response");
        }

        const estimationData = JSON.parse(jsonMatch[0]);
        console.log("[Estimation API] Success");

        return NextResponse.json(estimationData);

    } catch (error) {
        console.error("[Estimation API] Error:", error);
        return NextResponse.json(
            { error: "Failed to generate estimate", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
