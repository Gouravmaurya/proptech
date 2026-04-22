import { NextResponse } from 'next/server';
import { runScout } from '@/lib/scout-agent';

export const dynamic = 'force-dynamic';

/**
 * POST /api/agents/scout
 *
 * Delegates entirely to runScout() in scout-agent.ts which:
 * - Has a 6-hour deduplication gate
 * - Uses fast math-only analyzeLeadFast() in parallel batches of 5
 * - Upserts properties and creates leads without AI blocking
 *
 * Previously this route had ~380 lines of duplicated logic including
 * a sequential AI-per-property loop (same bug fixed in scout-agent.ts).
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { location = 'Austin, TX', limit = 50, userId } = body;

        const result = await runScout(location, limit, userId);

        if (!result.ok) {
            return NextResponse.json(result, { status: 500 });
        }

        return NextResponse.json(result);

    } catch (e: any) {
        console.error('[Scout Route] Error:', e);
        return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
    }
}
