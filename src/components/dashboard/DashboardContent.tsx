"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Activity, Home, TrendingUp } from "lucide-react";
import { useSession } from "next-auth/react";
import SearchCapsule from "@/components/ui/SearchCapsule";

import { PropertyFeed } from "./PropertyFeed";
import { useState, useRef, useEffect } from "react";

// Mock Stats
const stats = [
    { label: "Active Scouts", value: "12", icon: Activity, trend: "+2 this week" },
    { label: "Potential Deals", value: "84", icon: Home, trend: "4 new today" },
    { label: "Avg. Proj. ROI", value: "14.2%", icon: TrendingUp, trend: "+1.2%" },
];

interface DashboardContentProps {
    searchQuery?: string;
}

export default function DashboardContent({ searchQuery: externalQuery }: DashboardContentProps) {
    const { status } = useSession();
    const [searchState, setSearchState] = useState<{ query: string, filters: { minPrice?: number, maxPrice?: number, type?: string } }>({
        query: externalQuery || "",
        filters: {}
    });
    // Sync internal search state with external query changes (URL)
    useEffect(() => {
        setSearchState(prev => ({ ...prev, query: externalQuery || "" }));
    }, [externalQuery]);

    const [showResultsBadge, setShowResultsBadge] = useState(false);
    const findingsRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to results on mobile after search
    useEffect(() => {
        if (searchState.query && window.innerWidth < 768) {
            const timer = setTimeout(() => {
                findingsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                setShowResultsBadge(true);
                // Hide badge after 5 seconds
                setTimeout(() => setShowResultsBadge(false), 5000);
            }, 800); // Wait for results to start loading/rendering
            return () => clearTimeout(timer);
        }
    }, [searchState.query]);

    const hasSearch = !!(searchState.query || searchState.filters.minPrice !== undefined || searchState.filters.maxPrice !== undefined || searchState.filters.type);
    const isHeroLayout = status === "unauthenticated" && !hasSearch;

    if (status === "loading") return null;
    return (
        <div className={isHeroLayout ? "relative" : "space-y-16 pt-4"}>
            <motion.div 
                layout
                className={`transition-all duration-700 ease-in-out relative z-20 ${isHeroLayout ? 'min-h-[56vh] flex flex-col justify-center items-center px-4' : 'w-full'}`}
            >
                <AnimatePresence>
                    {isHeroLayout && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                            className="text-center max-w-3xl mx-auto mb-10"
                        >
                            {/* <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-2xl bg-emerald-50 text-emerald-700 text-xs font-bold tracking-wide uppercase mb-4 border border-emerald-100/50 shadow-sm">
                                <Sparkles className="w-3.5 h-3.5 animate-pulse text-emerald-600" /> Welcome to Haven
                            </span> */}
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-5 bg-gradient-to-r from-emerald-600 via-teal-800 to-emerald-600 bg-clip-text text-transparent">
                                Welcome to Haven
                            </h1>
                            <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
                                Discover off-market gems, analyze smart deals, and visualize interiors with next-gen insights.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

          

                {/* Premium Unified Search Pill */}
                <SearchCapsule 
                    onSearch={(city, state, fltrs) => setSearchState({ query: [city, state].filter(Boolean).join(", "), filters: fltrs })}
                    isHeroLayout={isHeroLayout}
                />
            </motion.div>

            {/* Feed Section */}
            {!hasSearch && status === "unauthenticated" ? null : (

                <div ref={findingsRef} className="pt-8 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-black tracking-tight text-slate-900"> Findings</h3>
                    </div>
                    <PropertyFeed searchQuery={searchState.query} filters={searchState.filters} />
                </div>
            )}

            {/* Results Found Badge (Mobile Only) */}
            <AnimatePresence>
                {showResultsBadge && window.innerWidth < 768 && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        onClick={() => findingsRef.current?.scrollIntoView({ behavior: "smooth" })}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-3 rounded-full shadow-2xl shadow-emerald-500/40 flex items-center gap-2 cursor-pointer font-bold tracking-tight"
                    >
                        <Home className="w-4 h-4" />
                        New Results Found
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
