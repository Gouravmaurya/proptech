"use server";

import prisma from "@/lib/prisma";
import { buildSystemPrompt, buildAnalysisPrompt, generateAIAnalysis, generateProjectionAnalysis } from "@/lib/ai-engine";
import { revalidatePath } from "next/cache";

export async function generatePropertyAnalysis(leadId: string, force: boolean = false) {
    try {
        const lead = await prisma.lead.findUnique({
            where: { id: leadId },
            include: { property: true, analyses: { take: 1, orderBy: { createdAt: 'desc' } } }
        });

        if (!lead || !lead.property) {
            return { ok: false, error: "Lead or Property not found" };
        }

        const p = lead.property;
        const analysis = lead.analyses[0];
        let financials: any = {};

        if (analysis?.financials) {
            try {
                financials = JSON.parse(analysis.financials);
            } catch (e) { }
        }

        // If we already have a detailed AI recommendation, return it to save tokens/time
        // Unless we want to force re-generation
        if (!force && analysis?.aiRecommendation && analysis.aiRecommendation.length > 50) {
            console.log("[AI Action] Returning cached analysis for lead:", leadId);
            return { ok: true, recommendation: analysis.aiRecommendation, cached: true };
        } else {
            console.log("[AI Action] Cache miss or force regen. Analysis exists?", !!analysis, "Has Rec?", !!analysis?.aiRecommendation, "Force?", force);
        }

        console.log(`[AI Action] Generating analysis for ${p.title}...`);

        // Prepare Prompt
        const systemPrompt = buildSystemPrompt('auto');
        const analysisPrompt = buildAnalysisPrompt({
            title: p.title,
            price: p.price,
            location: `${p.city}, ${p.state}`,
            rentalYield: financials.capRate ? `${financials.capRate}%` : "N/A",
            expectedAppreciation: "4% per year",
            type: p.type,
            sqft: p.sqft,
            bedrooms: p.bedrooms,
            bathrooms: p.bathrooms,
            monthlyCashFlow: financials.monthlyCashFlow
        });

        const fullPrompt = `${systemPrompt}\n\n${analysisPrompt}`;
        const aiResult = await generateAIAnalysis(fullPrompt);

        if (!aiResult) {
            return { ok: false, error: "AI Generation Failed" };
        }

        // Determine fields
        const verdict = aiResult.verdict || 'Average';
        const score = typeof aiResult.score === 'number' ? aiResult.score : 5;
        const aiJson = JSON.stringify(aiResult);

        // Update the existing analysis record OR create a new one if none exists
        if (analysis) {
            await prisma.analysis.update({
                where: { id: analysis.id },
                data: {
                    aiRecommendation: aiJson,
                    verdict: verdict,
                    score: score
                }
            });
            console.log("[AI Action] UPDATED existing analysis:", analysis.id);
        } else {
            await prisma.analysis.create({
                data: {
                    leadId: lead.id,
                    verdict: verdict,
                    score: score,
                    financials: JSON.stringify({ aiRecommendation: aiJson }),
                    aiRecommendation: aiJson
                }
            });
            console.log("[AI Action] CREATED new analysis for lead:", lead.id);
        }

        revalidatePath(`/properties/${lead.propertyId}`);
        return { ok: true, recommendation: aiJson, cached: false };

    } catch (error: any) {
        console.error("AI Analysis Action Failed:", error);
        return { ok: false, error: error.message };
    }
}

export async function generatePropertyProjection(leadId: string, force: boolean = false) {
    try {
        const lead = await prisma.lead.findUnique({
            where: { id: leadId },
            include: { property: true, analyses: { take: 1, orderBy: { createdAt: 'desc' } } }
        });

        if (!lead || !lead.property) {
            return { ok: false, error: "Lead or Property not found" };
        }

        const p = lead.property;
        const analysis = lead.analyses[0];
        let financials: any = {};

        if (analysis?.financials) {
            try { financials = JSON.parse(analysis.financials); } catch (e) { }
        }

        // Return cached AI projections if available
        if (!force && financials.aiProjections && financials.aiProjections.projections?.length > 0) {
            console.log("[AI Projection] Returning cached projection for lead:", leadId);
            return { ok: true, data: financials.aiProjections, cached: true };
        }

        console.log(`[AI Projection] Generating Gemini projection for ${p.title}...`);

        const projectionResult = await generateProjectionAnalysis({
            title: p.title,
            price: p.price,
            city: p.city || undefined,
            state: p.state || undefined,
            type: p.type || undefined,
            sqft: p.sqft || undefined,
            bedrooms: p.bedrooms || undefined,
            bathrooms: p.bathrooms || undefined,
            yearBuilt: p.yearBuilt || undefined,
            lotArea: p.lotArea || undefined,
            lotAreaUnit: p.lotAreaUnit || undefined,
            rentEstimate: p.rentEstimate || undefined,
            zestimate: p.zestimate || undefined,
            taxAssessedValue: p.taxAssessedValue || undefined,
            daysOnMarket: p.daysOnMarket || undefined,
            description: p.description || undefined,
            capRate: financials.capRate || undefined,
            expectedAppreciation: financials.expectedAppreciation || undefined,
            annualCashFlow: financials.annualCashFlow || undefined,
        });

        if (!projectionResult || !projectionResult.projections) {
            return { ok: false, error: "AI Projection generation failed" };
        }

        // Save projections into Analysis.financials JSON
        const updatedFinancials = { ...financials, aiProjections: projectionResult };

        if (analysis) {
            await prisma.analysis.update({
                where: { id: analysis.id },
                data: { financials: JSON.stringify(updatedFinancials) }
            });
            console.log("[AI Projection] Saved projection to analysis:", analysis.id);
        } else {
            await prisma.analysis.create({
                data: {
                    leadId: lead.id,
                    financials: JSON.stringify({ aiProjections: projectionResult })
                }
            });
            console.log("[AI Projection] Created new analysis with projection for lead:", lead.id);
        }

        return { ok: true, data: projectionResult, cached: false };

    } catch (error: any) {
        console.error("AI Projection Action Failed:", error);
        return { ok: false, error: error.message };
    }
}
