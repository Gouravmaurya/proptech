import { NextResponse } from "next/server";
import { getLead } from "@/app/actions/dashboard";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    // Next.js 15+ async params: must await params otherwise params.id is undefined
    const { id } = await params;
    try {
        console.log(`[API GET] Fetching lead: ${id}`);
        const lead = await getLead(id);
        
        if (!lead) {
            return NextResponse.json({ error: "Lead not found" }, { status: 404 });
        }

        return NextResponse.json(lead);
    } catch (error: any) {
        console.error("[API GET] Error:", error);
        return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 });
    }
}

