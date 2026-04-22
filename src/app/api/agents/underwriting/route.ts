import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { capRate, monthlyCashFlow, project10Years, dscr, roi5Years, loanPayment } from '@/lib/ai-engine';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => ({}));
        const { limit = 20 } = body;

        // 1. Fetch unanalyzed leads
        // We want leads that DO NOT have an analysis yet.
        const leads = await prisma.lead.findMany({
            where: {
                analyses: {
                    none: {}
                }
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: { property: true } // Need property details 
        });

        let saved = 0;

        for (const lead of leads) {
            // Use property data if available, fallback to lead snapshot (which is a bit sparse in our schema, stored in propertyData json)
            // Ideally we rely on connected Property model
            const p = lead.property;
            // Or parse the snapshot
            const snapshot = lead.propertyData ? JSON.parse(lead.propertyData) : {};

            const price = p?.price || snapshot.price || 0;
            const rentEstimate = p?.rentEstimate || snapshot.rentEstimate || (price * 0.008);

            const taxesMonthly = (price * 0.012) / 12; // 1.2% tax rule of thumb
            const insuranceMonthly = 100; // assumption
            const hoaMonthly = 0;
            const maintMonthly = rentEstimate * 0.10; // 10% maintenance

            const expenses = taxesMonthly + insuranceMonthly + hoaMonthly + maintMonthly;
            
            // Calculate Debt Service early
            const loanAmt = price * 0.80; // 20% down
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

            // Score
            let score = 0;
            if (dscrVal >= 1.2) score += 3;
            if (cap >= 5.0) score += 3;
            if (roi5 >= 20) score += 4;

            const verdict = score >= 8 ? 'Excellent' : score >= 5 ? 'Good' : score >= 3 ? 'Neutral' : 'Risky';

            const financials = {
                monthlyRent: rentEstimate,
                monthlyExpenses: expenses,
                monthlyCashFlow: mcf,
                noiAnnual,
                capRate: cap,
                dscr: dscrVal,
                roi5,
                projections
            };

            // Save Analysis
            await prisma.analysis.create({
                data: {
                    leadId: lead.id,
                    verdict,
                    score,
                    financials: JSON.stringify(financials)
                }
            });

            // Update Lead Status
            await prisma.lead.update({
                where: { id: lead.id },
                data: {
                    status: 'analyzed',
                    score,
                    tier: verdict === 'Excellent' || verdict === 'Good' ? 'hot' : 'cold'
                }
            });

            saved++;
        }

        return NextResponse.json({ ok: true, analyzed: saved });

    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
    }
}
