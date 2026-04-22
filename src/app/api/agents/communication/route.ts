import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => ({}));
        const { limit = 20 } = body || {};

        // Fetch analyses that are "Excellent" or "Good" and haven't been outreached
        const analyses = await prisma.analysis.findMany({
            where: {
                OR: [
                    { verdict: 'Excellent' },
                    { verdict: 'Good' }
                ],
                // ensure no outreach for this lead? 
                // We can check lead.outreach
                lead: {
                    outreach: {
                        none: {}
                    }
                }
            },
            include: { lead: true },
            take: limit
        });

        let drafted = 0;

        for (const analysis of analyses) {
            const lead = analysis.lead;
            if (!lead) continue;

            // Draft email
            const subject = `Inquiry regarding ${lead.title}`;
            const bodyContent = `Hello,\n\nI am interested in ${lead.title} listed at $${lead.price?.toLocaleString()}. It fits our investment criteria.\n\nCould you please share more details regarding the current lease terms and any recent capex?\n\nBest,\n[Your Name]`;

            await prisma.outreach.create({
                data: {
                    leadId: lead.id,
                    analysisId: analysis.id,
                    subject,
                    body: bodyContent,
                    status: 'drafted',
                    channel: 'email'
                }
            });

            // Update lead status
            await prisma.lead.update({
                where: { id: lead.id },
                data: { status: 'contacted' }
            });

            drafted++;
        }

        return NextResponse.json({ ok: true, drafted });
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
    }
}
