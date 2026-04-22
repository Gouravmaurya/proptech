import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { leadId, textContent, title = "Document Scan" } = body;

        if (!leadId || !textContent) {
            return NextResponse.json({ ok: false, error: "Missing leadId or textContent" }, { status: 400 });
        }

        const lower = String(textContent).toLowerCase();
        const flags = [];

        if (lower.includes('lien')) flags.push('Potential Lien');
        if (lower.includes('flood')) flags.push('Flood Zone Risk');
        if (lower.includes('permit')) flags.push('Permit Issue');
        if (lower.includes('as-is')) flags.push('Sold As-Is');
        if (lower.includes('foreclosure')) flags.push('Foreclosure Risk');

        const summary = flags.length
            ? `Flags detected: ${flags.join(', ')}`
            : "No red flags detected in this document.";

        const report = await prisma.diligenceReport.create({
            data: {
                leadId,
                title,
                summary,
                flags: JSON.stringify(flags)
            }
        });

        return NextResponse.json({ ok: true, reportId: report.id, flags });

    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
    }
}
