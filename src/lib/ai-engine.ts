export function parsePercent(p: number | string | undefined | null): number {
    if (typeof p === "number") return p;
    if (!p) return 0;
    const n = parseFloat(String(p).replace(/%/g, ""));
    return isNaN(n) ? 0 : n;
}

export function capRate({ netOperatingIncome, propertyValue }: { netOperatingIncome: number; propertyValue: number }) {
    if (!propertyValue) return 0;
    return (netOperatingIncome / propertyValue) * 100;
}

export function monthlyCashFlow({ monthlyRent, monthlyExpenses }: { monthlyRent: number; monthlyExpenses: number }) {
    return (monthlyRent || 0) - (monthlyExpenses || 0);
}

export function roi5Years({
    purchasePrice,
    annualNetCashFlow,
    expectedAppreciationPct,
}: {
    purchasePrice: number;
    annualNetCashFlow: number;
    expectedAppreciationPct: number | string;
}) {
    const pp = Number(purchasePrice) || 0;
    const appPct = parsePercent(expectedAppreciationPct);
    const appreciation = pp * (appPct / 100) * 5;
    const totalNetCashFlow = (Number(annualNetCashFlow) || 0) * 5;
    const profit = appreciation + totalNetCashFlow;
    if (!pp) return 0;
    return (profit / pp) * 100;
}

export function loanPayment({ principal, annualRatePct, termYears }: { principal: number; annualRatePct: number; termYears: number }) {
    const r = annualRatePct / 100 / 12;
    const n = termYears * 12;
    if (r === 0) return principal / n;
    return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function dscr({ annualNOI, annualDebtService }: { annualNOI: number; annualDebtService: number }) {
    if (!annualDebtService) return 0;
    return annualNOI / annualDebtService;
}

export function project10Years({
    purchasePrice,
    expectedAppreciationPct,
    annualNetCashFlowYear1,
    rentGrowthPct = 3,
}: {
    purchasePrice: number;
    expectedAppreciationPct: number | string;
    annualNetCashFlowYear1: number;
    rentGrowthPct?: number | string;
}) {
    const results = [];
    const startPrice = Number(purchasePrice) || 0;
    const appRate = parsePercent(expectedAppreciationPct) / 100;
    const rentGrowth = parsePercent(rentGrowthPct) / 100;
    let currentNOI = Number(annualNetCashFlowYear1) || 0;
    let currentPrice = startPrice;

    for (let year = 1; year <= 10; year++) {
        currentPrice = currentPrice * (1 + appRate);
        currentNOI = currentNOI * (1 + rentGrowth);
        const cumulativeReturn = startPrice > 0 ? ((currentPrice - startPrice) / startPrice) * 100 : 0;

        results.push({
            year,
            price: Math.round(currentPrice),
            noi: Math.round(currentNOI),
            cumulativeReturn: Number(cumulativeReturn.toFixed(2)),
        });
    }
    return results;
}
// ... existing exports ...

import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;
let genAIFallback: GoogleGenerativeAI | null = null;

if (process.env.GOOGLE_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
}
if (process.env.GOOGLE_API_KEY1) {
    genAIFallback = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY1);
}

/** Returns primary client; falls back to secondary if rate-limited (429). */
async function generateWithFallback(promptContents: any[], modelConfig: any): Promise<string> {
    const tryGenerate = async (client: GoogleGenerativeAI) => {
        const model = client.getGenerativeModel(modelConfig);
        const result = await model.generateContent({ contents: promptContents });
        return result.response.text();
    };

    try {
        if (!genAI) throw new Error("No primary API key configured");
        return await tryGenerate(genAI);
    } catch (e: any) {
        const is429 = e?.status === 429 || e?.message?.includes("429") || e?.message?.includes("quota");
        if (is429 && genAIFallback) {
            console.warn("[AI] Primary key rate-limited (429). Switching to fallback key...");
            return await tryGenerate(genAIFallback);
        }
        throw e;
    }
}

export function buildAnalysisPrompt(input: any) {
    const { title, price, location, rentalYield, expectedAppreciation, type, sqft, bedrooms, bathrooms, monthlyCashFlow } = input;
    return `You are Haven AI, a conservative US real-estate investment analyst.
Property: ${title || "Unknown"}
Type: ${type || "Unknown"}
Location: ${location || "Unknown"}
Specs: ${bedrooms || '?'} Beds, ${bathrooms || '?'} Baths, ${sqft || '?'} sqft
Price: $${price?.toLocaleString?.("en-US") || price}
Rental Yield: ${rentalYield}
Expected Appreciation: ${expectedAppreciation}
${monthlyCashFlow !== undefined ? `Monthly Cash Flow: $${Number(monthlyCashFlow).toLocaleString("en-US")}/mo` : ""}

Analyze this property and return a valid JSON object with the following structure (do NOT return markdown, just the JSON):
{
  "score": <number 1-10 based on risk/reward>,
  "verdict": "<"Excellent" | "Good" | "Average" | "Risky">",
  "summary": "<80-120 word detailed analysis. Be conservative but realistic. Explicitly address the cash flow data and explain its impact on the investment verdict.>",
  "strengths": ["<strength 1>", "<strength 2>", ...],
  "concerns": ["<concern 1>", "<concern 2>", ...]
}`;
}

export const buildSystemPrompt = (goal: string = "auto") => {
    return `You are an expert real estate investment analyst. Output ONLY valid JSON. Focus on cash flow, cap rate, and location specifics. Be conservative.`;
};

export async function generateAIAnalysis(prompt: string) {
    if (!genAI && !genAIFallback) return null;
    try {
        const modelConfig = { model: "gemini-flash-latest", generationConfig: { responseMimeType: "application/json" } };
        const text = await generateWithFallback(
            [{ role: "user", parts: [{ text: prompt }] }],
            modelConfig
        );
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanText);
    } catch (e) {
        console.error("Gemini Generation Failed:", e);
        return null;
    }
}

export async function generateProjectionAnalysis(propertyData: {
    title?: string;
    price?: number;
    city?: string;
    state?: string;
    type?: string;
    sqft?: number;
    bedrooms?: number;
    bathrooms?: number;
    yearBuilt?: number;
    lotArea?: number;
    lotAreaUnit?: string;
    rentEstimate?: number;
    zestimate?: number;
    taxAssessedValue?: number;
    daysOnMarket?: number;
    description?: string;
    capRate?: number;
    expectedAppreciation?: number;
    annualCashFlow?: number;
}) {
    if (!genAI && !genAIFallback) return null;

    const p = propertyData;
    const prompt = `You are Haven AI, an expert US real-estate market analyst specializing in property price forecasting.

Given the following property details, predict the year-by-year price trajectory for the next 10 years. Consider ALL factors: location trends, property type, current market conditions, age of property, lot size, rental income potential, and comparable market data.

PROPERTY DETAILS:
- Name: ${p.title || "Unknown"}
- Current Price: $${p.price?.toLocaleString?.("en-US") || 0}
- Location: ${p.city || "Unknown"}, ${p.state || "Unknown"}
- Type: ${p.type || "Unknown"}
- Specs: ${p.bedrooms || "?"} beds, ${p.bathrooms || "?"} baths, ${p.sqft || "?"} sqft
- Year Built: ${p.yearBuilt || "Unknown"}
- Lot Size: ${p.lotArea || "Unknown"} ${p.lotAreaUnit || "sqft"}
- Monthly Rent Estimate: $${p.rentEstimate?.toLocaleString?.("en-US") || "Unknown"}
- Zestimate (Market Value): $${p.zestimate?.toLocaleString?.("en-US") || "Unknown"}
- Tax Assessed Value: $${p.taxAssessedValue?.toLocaleString?.("en-US") || "Unknown"}
- Days on Market: ${p.daysOnMarket ?? "Unknown"}
- Cap Rate: ${p.capRate ? p.capRate.toFixed(2) + "%" : "Unknown"}
- Current Annual Cash Flow: $${p.annualCashFlow?.toLocaleString?.("en-US") || "Unknown"}
- Description: ${p.description?.slice(0, 300) || "N/A"}

Return a JSON object with this exact structure:
{
  "projections": [
    { "year": 1, "price": <predicted price year 1>, "noi": <predicted net operating income year 1>, "cumulativeReturn": <cumulative % return from purchase price> },
    { "year": 2, "price": ..., "noi": ..., "cumulativeReturn": ... },
    ... up to year 10
  ],
  "methodology": "<1-2 sentence explanation of key factors driving this prediction>",
  "confidence": "<high | medium | low>",
  "avgAppreciation": <average annual appreciation % predicted>
}

Be realistic and conservative. Factor in the property's specific location, age, and market segment. Do NOT use a flat appreciation rate — vary each year based on realistic market cycles.`;

    try {
        const text = await generateWithFallback(
            [{ role: "user", parts: [{ text: prompt }] }],
            { model: "gemini-flash-latest", generationConfig: { responseMimeType: "application/json" } }
        );
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanText);
    } catch (e) {
        console.error("Gemini Projection Failed:", e);
        return null;
    }
}

export async function analyzeDreamHouseImage(base64Image: string, mimeType: string): Promise<{ keywords: string[] } | null> {
    if (!genAI && !genAIFallback) return null;

    const prompt = `You are a real estate expert analyzing a photo of a house or property.
Extract a list of descriptive keywords that capture the architectural style, key features, and notable characteristics of this property.

Focus on: architectural style (modern, colonial, craftsman, ranch, etc.), exterior materials (brick, stucco, wood, etc.), notable features (pool, garage, large yard, balcony, etc.), landscape details, and general vibe (luxury, cozy, minimalist, etc.).

Return ONLY a JSON object in this format (no markdown, no explanation):
{ "keywords": ["keyword1", "keyword2", "keyword3", ...] }

Provide 8-15 relevant keywords.`;

    try {
        const client = genAI ?? genAIFallback;
        if (!client) return null;
        const model = client.getGenerativeModel({ model: "gemini-2.0-flash", generationConfig: { responseMimeType: "application/json" } });
        const result = await model.generateContent({
            contents: [{
                role: "user",
                parts: [
                    { inlineData: { mimeType: mimeType as any, data: base64Image } },
                    { text: prompt }
                ]
            }]
        });
        const text = result.response.text();
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanText);
    } catch (e) {
        console.error("Dream House Image Analysis Failed:", e);
        return null;
    }
}
