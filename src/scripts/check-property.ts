import prisma from '../lib/prisma';
import { loanPayment, monthlyCashFlow, capRate, dscr, roi5Years, project10Years } from '../lib/ai-engine';

async function checkProperty(propertyId: string) {
    console.log(`\n=== Analyzing Property: ${propertyId} ===`);
    
    // Find lead/analysis
    const lead = await prisma.lead.findFirst({
        where: { propertyId: propertyId },
        include: { property: true, analyses: { orderBy: { createdAt: 'desc' }, take: 1 } }
    });

    if (!lead || !lead.property) {
        // Try finding by sourceId or Lead ID
        const leadById = await prisma.lead.findUnique({
            where: { id: propertyId },
            include: { property: true, analyses: { orderBy: { createdAt: 'desc' }, take: 1 } }
        });
        if (leadById) return runAnalysis(leadById);
        
        console.log("Property or Lead not found in DB.");
        return;
    }

    runAnalysis(lead);
}

function runAnalysis(lead: any) {
    const p = lead.property;
    const price = p.price;
    const rentEstimate = p.rentEstimate || (price * 0.008);
    const taxesMonthly = (p.taxAssessedValue || price) * 0.012 / 12;
    const insuranceMonthly = 100;
    const maintMonthly = rentEstimate * 0.10;
    const expenses = taxesMonthly + insuranceMonthly + maintMonthly;

    const loanAmt = price * 0.80;
    const debtService = loanPayment({ principal: loanAmt, annualRatePct: 6.5, termYears: 30 });

    const monthlyNoi = monthlyCashFlow({ monthlyRent: rentEstimate, monthlyExpenses: expenses });
    const mcf = monthlyNoi - debtService;

    const noiAnnual = monthlyNoi * 12;
    const cap = capRate({ netOperatingIncome: noiAnnual, propertyValue: price });
    const dscrVal = dscr({ annualNOI: noiAnnual, annualDebtService: debtService * 12 });

    const appPct = 4.0;
    const roi5 = roi5Years({ purchasePrice: price, annualNetCashFlow: mcf * 12, expectedAppreciationPct: appPct });

    console.log(`Address: ${p.address}`);
    console.log(`Price: $${price.toLocaleString()}`);
    console.log(`Rent Estimate: $${rentEstimate.toLocaleString()}/mo`);
    console.log(`OpEx: $${expenses.toFixed(2)}/mo`);
    console.log(`Debt Service: $${debtService.toFixed(2)}/mo`);
    console.log(`---`);
    console.log(`Monthly NOI: $${monthlyNoi.toFixed(2)}`);
    console.log(`Monthly Cash Flow (Fixed): $${mcf.toFixed(2)}`);
    console.log(`Cap Rate: ${cap.toFixed(2)}%`);
    console.log(`DSCR: ${dscrVal.toFixed(2)}`);
    console.log(`ROI (5-Year): ${roi5.toFixed(2)}%`);

    console.log("\nVerdict Status:");
    if (mcf > 0) {
        console.log("✅ POSITIVE Cash Flow! This property makes profit after mortgage.");
    } else {
        console.log("❌ NEGATIVE Cash Flow. Mortgage exceeds operating profit.");
    }

    if (dscrVal >= 1.2) {
        console.log("✅ Bankable (DSCR >= 1.2)");
    } else {
        console.log("⚠️ Tight DSCR (< 1.2). Banks might require more down payment.");
    }
}

// The ID from the screenshot URL: cmmsjkq3h003632czxtotbk4d
checkProperty('cmmsjkq3h003632czxtotbk4d').catch(console.error);
