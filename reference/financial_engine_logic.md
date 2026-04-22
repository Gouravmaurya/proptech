# Financial Engine Logic

The application relies on `lib/ai.js` for deterministic financial modeling. This ensures that investment metrics are calculated mathematically rather than hallucinated by an LLM.

## Core Metrics

### Net Present Value (NPV)
Calculates the value of future cash flows in today's dollars.
- **Formula**: `NPV = -InitialInvestment + Σ (CashFlow_t / (1+r)^t) + (TerminalValue / (1+r)^10)`
- **Horizon**: 10 Years
- **Inputs**: Purchase Price, Discount Rate (%), Annual Cash Flows, Terminal Value.

### Payback Period
Determines the year when cumulative NOI exceeds the purchase price.
- **Logic**: Iterates through projected annual NOIs. Returns the year where `Cumulative NOI >= Purchase Price`.

### Cap Rate (Capitalization Rate)
Measures the unleveraged return on asset.
- **Formula**: `(Net Operating Income / Property Value) * 100`

### Monthly Cash Flow
- **Formula**: `Monthly Rent - Monthly Expenses`

### ROI (5-Year)
Total return including appreciation and cash flow over 5 years.
- **Formula**: `((Appreciation + Total 5y CashFlow) / Purchase Price) * 100`
- **Appreciation**: `Purchase Price * (AppreciationRate * 5)` (Simplified linear approximation in current logic, though compounding is used in projections).

### Debt Service Coverage Ratio (DSCR)
Measure of cash flow available to pay current debt obligations.
- **Formula**: `Annual NOI / Annual Debt Service`
- **Target**: Typically > 1.20 or 1.25 for safe investments.

### Internal Rate of Return (IRR)
The discount rate that makes the NPV of all cash flows equal to zero.
- **Method**: Newton-Raphson approximation, with a Bisection fallback if it fails to converge.
- **Cashflows**: Year 0 is negative (Initial Investment). Years 1-10 are positive cash flows.

## Financing Calculations

### Loan Payment (Amortized)
Standard monthly mortgage payment calculation.
- **Formula**: `(P * r) / (1 - (1+r)^-n)`
  - `P`: Principal
  - `r`: Monthly Interest Rate
  - `n`: Total number of months (Term Years * 12)

### Remaining Balance
Calculates loan balance after `m` months.
- **Formula**: `P*(1+r)^m - pmt * [((1+r)^m - 1)/r]`

## Projections & Scenarios
The engine generates 10-year projections for three scenarios: **Bear**, **Base**, and **Bull**.

e.g.
- **Base**: User inputs.
- **Bear**: Appreciation -2%, Rent Growth -1%.
- **Bull**: Appreciation +2%, Rent Growth +1%.

**Projection Logic**:
- **Price**: `Price_prev * (1 + AppreciationRate)`
- **NOI**: `NOI_prev * (1 + RentGrowthRate)`
- **Cumulative Return**: `(CumulativeNOI / Purchase Price) * 100`
