import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const [leads, analyses, outreach, goodDeals] = await Promise.all([
            prisma.lead.count(),
            prisma.analysis.count(),
            prisma.outreach.count(),
            prisma.analysis.count({ where: { verdict: 'Good' } }), // or Excellent
        ]);

        const stats = {
            leads,
            analyses,
            outreach,
            goodDeals,
            activeAgents: ['Scout', 'Underwriter', 'Communication', 'Diligence']
        };

        return NextResponse.json({ ok: true, stats });
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
    }
}
