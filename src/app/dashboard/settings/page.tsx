import { auth } from "@/auth";
import { User } from "next-auth";
import SettingsClient from "@/components/dashboard/SettingsClient";
import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export default async function SettingsPage() {
    const session = await auth();
    console.log("Settings Page Session:", session);

    if (!session?.user?.id) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-slate-500 font-semibold">Please sign in to view settings.</p>
            </div>
        );
    }

    const getCachedUser = unstable_cache(
        async (userId: string) => {
            return await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    preferences: true,
                },
            });
        },
        [`settings-user-${session.user.id}`],
        { tags: [`settings-user-${session.user.id}`, 'settings-user'] }
    );

    const userData = await getCachedUser(session.user.id);

    console.log("Settings Page UserData for ID:", session.user.id, userData);

    if (!userData) {
        return (
            <div className="flex h-screen items-center justify-center flex-col gap-4">
                <p className="text-red-500 font-semibold">Error loading user data.</p>
                <div className="text-center space-y-2">
                    <p className="text-xs text-slate-400">User ID: {session.user.id} not found in database.</p>
                    <form action={async () => {
                        "use server";
                        const { signOut } = await import("@/auth");
                        await signOut({ redirectTo: "/login" });
                    }}>
                        <button type="submit" className="text-sm text-emerald-600 hover:underline font-medium">
                            Sign Out & Retry
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Ensure type compatibility with SettingsClient props
    const settingsUser = {
        ...userData,
        // Ensure emailVerified is compatible (Date | null) -> (string | null) if needed by NextAuth User type, 
        // but typically Prisma returns Date objects which are fine for server components, 
        // passing to Client Component might need serialization if direct Date object causes issues.
        // For now, let's just pass preferences as-is since SettingsClient expects string | null.
    };

    return <SettingsClient user={settingsUser} />;
}
