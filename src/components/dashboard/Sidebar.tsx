"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Bookmark, Settings, LogOut, ChevronLeft, ChevronRight, Menu, Wand2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { signOut, signIn, useSession } from "next-auth/react";

const navigation = [
    { name: "Overview", href: "/dashboard", icon: Home },
    // { name: "Scout", href: "/dashboard/scout", icon: Compass },
    { name: "Virtual Staging", href: "/dashboard/virtual-staging", icon: Wand2 },
    { name: "Dream House", href: "/dashboard/dream-house", icon: Sparkles },
    { name: "Saved", href: "/dashboard/saved", icon: Bookmark },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const isLoading = status === "loading";
    const isGuest = status === "unauthenticated";

    // Protective filtering of navigation items
    const filteredNavigation = navigation.filter(item => {
        if (!isGuest) return true;
        // Hide these for guests as they are protected routes in auth.config.ts
        const protectedRoutes = ["/dashboard/scout"];
        return !protectedRoutes.includes(item.href);
    });

    const handleLinkClick = () => {
        if (window.innerWidth < 1024 && isOpen) { // Collapse on mobile and tablet only if it's currently open
            onToggle();
        }
    };

    return (
        <motion.aside
            initial={false}
            animate={{
                width: isOpen ? "20rem" : "4.2rem",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-40 bg-[#FDFBF7] border-r border-stone-200/50 flex flex-col pt-8 pb-6 overflow-hidden shadow-sm"
        >
            {/* Header / Toggle */}
            <div className={`flex items-center mb-16 px-6 ${isOpen ? 'justify-between' : 'justify-center'}`}>
                {isOpen && (
                    <Link href="/">
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="font-heading text-3xl font-medium text-zinc-900 tracking-tight whitespace-nowrap"
                        >
                            Haven.
                        </motion.span>
                    </Link>
                )}

                <button
                    onClick={onToggle}
                    className="p-2 hover:bg-stone-100 rounded-lg transition-colors text-stone-400 hover:text-emerald-900"
                >
                    {isOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-4 px-4">
                {filteredNavigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={handleLinkClick}
                            className={`flex items-center gap-4 py-3 rounded-xl transition-all duration-300 relative group
                            ${isOpen ? 'px-4' : 'justify-center px-2'}
                            ${isActive ? "text-emerald-900 bg-stone-100/50" : "text-stone-400 hover:text-stone-600 hover:bg-stone-50"}
                        `}
                            title={!isOpen ? item.name : undefined}
                        >
                            {/* Active Indicator (Only visible when open for cleaner look, or small dot when closed) */}
                            {isActive && isOpen && (
                                <motion.div
                                    layoutId="activeIndicator"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-900 rounded-r-full"
                                />
                            )}

                            <item.icon className={`w-6 h-6 shrink-0 transition-colors ${isActive ? "text-emerald-900" : "text-stone-400 group-hover:text-stone-600"}`} />

                            {isOpen && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="tracking-wide text-lg font-medium whitespace-nowrap"
                                >
                                    {item.name}
                                </motion.span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className={`px-6 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                {isGuest ? (
                    <button
                        onClick={() => signIn()}
                        className={`flex items-center gap-3 text-sm font-medium text-emerald-900 hover:text-emerald-700 transition-colors py-2 w-full rounded-lg hover:bg-emerald-50 ${isOpen ? 'px-2' : 'justify-center'}`}
                        title="Sign In"
                    >
                        <LogOut className="w-4 h-4 shrink-0 rotate-180" />
                        {isOpen && <span className="whitespace-nowrap">Sign In</span>}
                    </button>
                ) : (
                    <button
                        onClick={() => session ? signOut({ callbackUrl: "/" }) : signIn()}
                        className={`flex items-center gap-3 text-sm font-medium text-stone-400 hover:text-red-600 transition-colors py-2 w-full rounded-lg hover:bg-stone-100 ${isOpen ? 'px-2' : 'justify-center'}`}
                        title="Sign Out"
                    >
                        <LogOut className="w-4 h-4 shrink-0" />
                        {isOpen && <span className="whitespace-nowrap">Sign Out</span>}
                    </button>
                )}
            </div>
        </motion.aside >
    );
}
