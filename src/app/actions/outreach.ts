"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Fetches the latest outreach record for a specific lead.
 */
export async function getOutreachForLead(leadId: string) {
    try {
        return await prisma.outreach.findFirst({
            where: { leadId },
            orderBy: { createdAt: "desc" }
        });
    } catch (error) {
        console.error("Failed to fetch outreach:", error);
        return null;
    }
}

/**
 * Generates a draft outreach email for a property.
 */
export async function generateOutreachDraft({
    leadId,
    title,
    price,
    analysisId
}: {
    leadId: string;
    title: string;
    price: number;
    analysisId?: string;
}) {
    try {
        // Draft content (Premium template)
        const subject = `Inquiry: Investment Opportunity - ${title}`;
        const bodyContent = `Dear listing representative,\n\nI am reaching out regarding ${title} ($${price.toLocaleString()}). Based on our platform's AI analysis, this property aligns well with our investment criteria.\n\nCould you please provide the following details:\n1. T12 financial records and current rent roll.\n2. Details on any major capital expenditures in the last 24 months.\n3. Seller's timeline and any current offers on the table.\n\nLooking forward to hearing from you.\n\nBest regards,\nProptech Acquisition Team`;

        const [outreach] = await Promise.all([
            prisma.outreach.create({
                data: {
                    leadId,
                    analysisId,
                    subject,
                    body: bodyContent,
                    status: 'drafted',
                    channel: 'email'
                }
            }),
            prisma.lead.update({
                where: { id: leadId },
                data: { status: 'outreach_drafted' }
            }),
        ]);

        revalidatePath(`/properties/${leadId}`);
        return { ok: true, outreach };
    } catch (error: any) {
        console.error("Failed to generate outreach:", error);
        return { ok: false, error: error.message };
    }
}

/**
 * Updates the status of an outreach record.
 */
export async function updateOutreachStatus(outreachId: string, status: string, leadId: string) {
    try {
        const updateOps: Promise<any>[] = [
            prisma.outreach.update({
                where: { id: outreachId },
                data: { status }
            })
        ];

        if (status === 'sent') {
            updateOps.push(
                prisma.lead.update({
                    where: { id: leadId },
                    data: { status: 'contacted' }
                })
            );
        }

        await Promise.all(updateOps);

        revalidatePath(`/properties/${leadId}`);
        return { ok: true };
    } catch (error: any) {
        console.error("Failed to update outreach status:", error);
        return { ok: false, error: error.message };
    }
}
