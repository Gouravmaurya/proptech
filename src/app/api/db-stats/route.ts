import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const properties = await prisma.property.findMany({
            include: { leads: true }
        });

        const stats: Record<string, Record<string, { properties: number, leads: number }>> = {};

        properties.forEach(prop => {
            const state = prop.state || 'Unknown State';
            const city = prop.city || 'Unknown City';

            if (!stats[state]) stats[state] = {};
            if (!stats[state][city]) stats[state][city] = { properties: 0, leads: 0 };

            stats[state][city].properties += 1;
            if (prop.leads && prop.leads.length > 0) {
                stats[state][city].leads += prop.leads.length;
            }
        });

        let output = "=========================================\n";
        output += "🏙️ HAVEN DATABASE INVENTORY REPORT\n";
        output += "=========================================\n\n";

        let totalProps = 0;
        let totalLeads = 0;

        for (const [state, cities] of Object.entries(stats).sort()) {
            output += `📍 State: ${state}\n`;
            output += `-----------------------------------------\n`;
            for (const [city, counts] of Object.entries(cities).sort()) {
                const pend = counts.properties - counts.leads;
                output += `   🔸 ${city}\n`;
                output += `      Found ${counts.properties} total properties.\n`;
                output += `      ✅ ${counts.leads} of them are analyzed and will show up in search.\n`;
                if (pend > 0) {
                    output += `      ⏳ ${pend} are waiting in the background queue.\n`;
                }
                output += '\n';
                totalProps += counts.properties;
                totalLeads += counts.leads;
            }
        }

        output += "=========================================\n";
        output += "📈 OVERALL TOTALS:\n";
        output += `Total Properties in Database: ${totalProps}\n`;
        output += `Total Fully Analyzed Leads:   ${totalLeads}\n`;
        output += "=========================================\n";

        return new NextResponse(output, { headers: { 'Content-Type': 'text/plain' } });
    } catch (e: any) {
        return new NextResponse("Error: " + e.message, { status: 500 });
    }
}
