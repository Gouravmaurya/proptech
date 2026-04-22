import { loanPayment, monthlyCashFlow, capRate, dscr, roi5Years, project10Years } from '../lib/ai-engine';

async function runTest() {
    const price = 500000;
    const rentEstimate = 2500;
    const expenses = 1480; // Operating Expenses

    // 1. Calculate Debt service
    const loanAmt = price * 0.80; // 20% down
    const debtService = loanPayment({ principal: loanAmt, annualRatePct: 6.5, termYears: 30 }); // Using 6.5% from code

    console.log("--- Stress Test Verification ---");
    console.log(`Price: $${price}`);
    console.log(`Rent: $${rentEstimate}`);
    console.log(`OpEx: $${expenses}`);
    console.log(`Debt Service (Mortgage): $${debtService.toFixed(2)}`);

    // 2. Calculate Monthly NOI
    const monthlyNoi = monthlyCashFlow({ monthlyRent: rentEstimate, monthlyExpenses: expenses });
    console.log(`Monthly NOI (Rent - OpEx): $${monthlyNoi}`);

    // 3. Calculate Actual Cash Flow
    const mcf = monthlyNoi - debtService;
    console.log(`Actual Monthly Cash Flow (NOI - DebtService): $${mcf.toFixed(2)}`);

    // 4. Annual NOI & Cap Rate
    const noiAnnual = monthlyNoi * 12;
    const cap = capRate({ netOperatingIncome: noiAnnual, propertyValue: price });
    console.log(`Annual NOI: $${noiAnnual}`);
    console.log(`Cap Rate: ${cap.toFixed(2)}%`);

    // 5. DSCR
    const dscrVal = dscr({ annualNOI: noiAnnual, annualDebtService: debtService * 12 });
    console.log(`DSCR: ${dscrVal.toFixed(2)}`);

    // 6. ROI
    const roi = roi5Years({ purchasePrice: price, annualNetCashFlow: mcf * 12, expectedAppreciationPct: 4 });
    console.log(`ROI (5-Year): ${roi.toFixed(2)}%`);

    console.log("\n--- Verification Check ---");
    if (mcf < 0) {
        console.log("✅ Cash Flow is correctly negative for this deal.");
    } else {
        console.log("❌ Cash Flow should be negative.");
    }
    
    if (Math.abs(cap - 2.45) < 0.1) {
        console.log("✅ Cap Rate is correct (~2.45%).");
    } else {
        console.log("❌ Cap Rate Calculation mismatch.");
    }
}

runTest().catch(console.error);
