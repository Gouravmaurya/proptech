"use client";

import { useSession } from "next-auth/react";
import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { Lock, Sparkles, ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";

interface GatedSectionProps {
    children: ReactNode;
    title?: string;
    description?: string;
    blurIntensity?: "light" | "medium" | "heavy";
}

export default function GatedSection({
    children,
    title = "Haven AI Insights Locked",
    description = "Create a free account or log in to securely access full property analysis, 10-year projections, and complete investment breakdown.",
    blurIntensity = "heavy"
}: GatedSectionProps) {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    // Prevent hydration mismatch by not rendering the gate until mounted
    if (!mounted || status === "loading") {
        return (
            <div className="relative overflow-hidden rounded-[2rem] bg-slate-50 border border-slate-100 min-h-[400px]">
                <div className="absolute inset-0 pointer-events-none select-none transition-all duration-700 z-0 overflow-hidden" style={{ maskImage: 'linear-gradient(to bottom, black 15%, transparent 60%)', WebkitMaskImage: 'linear-gradient(to bottom, black 15%, transparent 60%)' }}>
                    <div className="w-full h-full opacity-30 filter blur-[3px]">
                        {children}
                    </div>
                </div>
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                    <div className="animate-pulse flex items-center gap-3 text-emerald-700 bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-emerald-100 shadow-sm">
                        <div className="w-5 h-5 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                        <span className="text-sm font-semibold tracking-wide">Checking Access...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (session?.user) {
        return <>{children}</>;
    }

    return (
        <div className="relative overflow-hidden rounded-[2rem] bg-white border border-slate-200 min-h-[440px] shadow-sm flex flex-col justify-end group">

            {/* The faded content underneath - Much less blur, using gradient mask for tease effect */}
            <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden"
                style={{
                    maskImage: 'linear-gradient(to bottom, black 15%, transparent 65%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 15%, transparent 65%)',
                }}>
                <div className="w-full h-full opacity-[0.4] filter blur-[3px] transition-all duration-700">
                    <div className="w-full h-full pb-32">
                        {children}
                    </div>
                </div>
            </div>

            {/* AI/Premium Overlay Panel - Docked to bottom with glass effect */}
            <div className="relative z-10 w-full bg-white/70 backdrop-blur-2xl border-t border-slate-200/50 pt-10 pb-12 px-6 sm:px-12 flex flex-col items-center text-center translate-y-0 transition-all duration-500 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.05)]">

                {/* Glowing top accent line */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-70"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[15px] bg-emerald-400/20 blur-xl"></div>

                {/* AI / Lock Icon */}
                <div className="relative flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100/50 shadow-sm z-10 group-hover:scale-105 transition-transform duration-500">
                    <div className="absolute inset-0 rounded-2xl bg-emerald-400/20 blur-xl transition-opacity duration-500 opacity-60 group-hover:opacity-100 animate-pulse" />
                    <Lock className="w-7 h-7 text-emerald-600 relative z-10" strokeWidth={1.5} />
                    <Sparkles className="w-5 h-5 text-emerald-400 absolute -top-1.5 -right-1.5 z-10 animate-pulse" style={{ animationDuration: '2s' }} />
                </div>

                {/* Title & Description */}
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-3">
                    {title}
                </h3>

                <p className="text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
                    {description}
                </p>

                {/* Primary CTA */}
                <Link
                    href={`/auth/login?callbackUrl=${encodeURIComponent(pathname)}`}
                    className="relative inline-flex items-center justify-center w-full sm:w-auto px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 bg-slate-900 border border-slate-800 rounded-2xl hover:bg-emerald-600 hover:border-emerald-600 shadow-md hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 group/btn overflow-hidden"
                >
                    <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover/btn:w-[350px] group-hover/btn:h-[350px] opacity-10" />
                    <span className="relative flex items-center gap-2">
                        View Full AI Analysis
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                </Link>

                {/* Secondary Link */}
                <div className="mt-6 text-sm font-medium flex items-center justify-center gap-1.5 text-slate-500">
                    <span>New to Haven?</span>
                    <Link href="/onboarding" className="text-emerald-600 hover:text-emerald-700 hover:underline transition-colors font-semibold">
                        Create an account
                    </Link>
                </div>

            </div>
        </div>
    );
}
