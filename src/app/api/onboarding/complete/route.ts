import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json(); // { role, strategy, location, ... }

        // Update user
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                onboardingCompleted: true,
                preferences: JSON.stringify(data) // Serialize for SQLite
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Onboarding error:", error);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
