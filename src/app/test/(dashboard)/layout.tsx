import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { Bell, Menu } from "lucide-react";
import SidebarWrapper from "@/components/dashboard/SidebarWrapper";

export default async function TestLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session) {
        redirect("/auth/login");
    }

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
            {/* SIDEBAR (Collapsible Client Component) */}
            <div className="hidden md:block sticky top-0 h-screen z-50">
                <SidebarWrapper />
            </div>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col min-w-0 bg-slate-50 relative">

                {/* HEADER */}
                <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40 w-full">
                    <div className="md:hidden flex items-center gap-3">
                        <button className="p-2 -ml-2 text-slate-500">
                            <Menu className="w-5 h-5" />
                        </button>
                        <span className="text-emerald-700 font-bold">Haven</span>
                    </div>

                    {/* Breadcrumb Placeholder on Desktop */}
                    <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">
                        <span className="text-slate-400">Test</span>
                        <span className="text-slate-300">/</span>
                        <span className="font-medium text-slate-800">Properties</span>
                    </div>

                    <div className="flex items-center gap-4 ml-auto">
                        <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600">
                            <Bell className="w-5 h-5" />
                        </button>
                        <div className="h-6 w-px bg-slate-200" />
                        <form action={async () => {
                            "use server"
                            await signOut({ redirectTo: "/" });
                        }}>
                            <button className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">Sign Out</button>
                        </form>
                    </div>
                </header>

                {/* CONTENT SCROLL */}
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
