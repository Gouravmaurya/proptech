"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Search, Brain, Key, CheckCircle, TrendingUp, MapPin, ShieldCheck, BarChart3 } from "lucide-react";

/* ─── Step Data ─── */
const steps = [
    {
        id: "01",
        label: "Curation",
        heading: "Hand-selected. Not scrolled.",
        description:
            "Our curation isn't just about data — it's about the soul of the space. We surface gems that pass our rigid lifestyle and investment filters.",
        icon: Search,
        accent: "emerald",
    },
    {
        id: "02",
        label: "Analysis",
        heading: "Every data point. Verified.",
        description:
            "Verification that goes beyond the listing. Our AI cross-references the intangible details that matter most to your future.",
        icon: Brain,
        accent: "blue",
    },
    {
        id: "03",
        label: "Acquisition",
        heading: "Negotiate with confidence.",
        description:
            "Enter every negotiation with a data-backed narrative. From first view to final key — a seamless journey home.",
        icon: Key,
        accent: "amber",
    },
];

const accentColors: Record<string, { pill: string; pillText: string; dot: string; glow: string; num: string }> = {
    emerald: { pill: "bg-emerald-500/10 border-emerald-500/20", pillText: "text-emerald-400", dot: "bg-emerald-400", glow: "bg-emerald-500/10", num: "text-emerald-900/30" },
    blue: { pill: "bg-blue-500/10 border-blue-500/20", pillText: "text-blue-400", dot: "bg-blue-400", glow: "bg-blue-500/10", num: "text-blue-900/30" },
    amber: { pill: "bg-amber-500/10 border-amber-500/20", pillText: "text-amber-400", dot: "bg-amber-400", glow: "bg-amber-500/10", num: "text-amber-900/30" },
};

/* ─── Dark UI Mockups ─── */
function SearchMockupDark() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
        >
            <div className="bg-zinc-800 rounded-2xl border border-white/5 shadow-2xl shadow-black/40 overflow-hidden w-full max-w-sm mx-auto">
                <div className="flex items-center gap-1.5 px-4 py-2.5 bg-zinc-900/80 border-b border-white/5">
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                    <div className="w-2 h-2 rounded-full bg-white/10" />
                </div>
                <div className="px-4 py-3 flex gap-1.5 border-b border-white/5 flex-wrap">
                    <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full">Austin, TX</span>
                    <span className="text-[10px] font-medium bg-white/5 text-zinc-400 px-2.5 py-1 rounded-full">ROI &gt; 12%</span>
                    <span className="text-[10px] font-medium bg-white/5 text-zinc-400 px-2.5 py-1 rounded-full">Multi-Family</span>
                </div>
                <div className="p-3 space-y-2">
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="flex gap-3 p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20"
                    >
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center shrink-0">
                            <MapPin className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-[11px] font-semibold text-white">742 Elm St, Austin</div>
                            <div className="text-[9px] text-zinc-500 mt-0.5">Multi-Family · 4 Units</div>
                            <div className="mt-1 inline-flex text-[7px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded">OFF-MARKET</div>
                        </div>
                        <div className="text-right shrink-0">
                            <div className="text-xs font-bold text-emerald-400">14.2%</div>
                            <div className="text-[8px] text-zinc-500">Est. ROI</div>
                        </div>
                    </motion.div>
                    {[0.3, 0.15].map((op, i) => (
                        <div key={i} className="flex gap-3 p-2.5" style={{ opacity: op }}>
                            <div className="w-12 h-12 bg-white/5 rounded-lg shrink-0" />
                            <div className="flex-1 space-y-1.5 pt-1">
                                <div className="h-2 w-24 bg-white/10 rounded-full" />
                                <div className="h-1.5 w-16 bg-white/5 rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute -bottom-3 -right-3 bg-emerald-500 text-white text-[9px] px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 font-bold"
            >
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                3 new deals
            </motion.div>
        </motion.div>
    );
}

function AnalysisMockupDark() {
    const barHeights = [30, 42, 38, 55, 48, 65, 58, 80];
    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
        >
            <div className="bg-zinc-800 rounded-2xl border border-white/5 shadow-2xl shadow-black/40 p-5 w-full max-w-sm mx-auto">
                <div className="flex justify-between items-start mb-5">
                    <div>
                        <div className="text-[9px] text-zinc-500 uppercase tracking-[0.15em] font-semibold">Projected Net</div>
                        <div className="text-3xl font-heading text-white leading-tight">$42.5k</div>
                        <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-0.5 mt-0.5">
                            <TrendingUp className="w-2.5 h-2.5" /> +12% vs Market
                        </div>
                    </div>
                    <div className="p-2 bg-blue-500/10 rounded-xl">
                        <BarChart3 className="w-5 h-5 text-blue-400" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-5">
                    {[{ l: "Cash-on-Cash", v: "8.4%", c: "text-white" }, { l: "Cap Rate", v: "7.2%", c: "text-emerald-400" }].map((m, i) => (
                        <div key={i} className="p-2.5 bg-white/5 rounded-xl text-center">
                            <div className="text-[8px] text-zinc-500 uppercase tracking-wider font-semibold">{m.l}</div>
                            <div className={`text-lg font-bold ${m.c}`}>{m.v}</div>
                        </div>
                    ))}
                </div>
                <div className="flex items-end justify-between h-16 gap-1 mb-1.5">
                    {barHeights.map((h, i) => (
                        <div key={i} className="flex-1 bg-white/5 rounded-t relative overflow-hidden" style={{ height: "100%" }}>
                            <motion.div
                                className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                                initial={{ height: 0 }}
                                whileInView={{ height: `${h}%` }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.6 + i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            />
                        </div>
                    ))}
                </div>
                <div className="flex justify-between text-[7px] text-zinc-600 uppercase tracking-wider font-semibold">
                    <span>Year 1</span><span>Year 5</span><span>Year 10</span>
                </div>
            </div>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.0, duration: 0.4 }}
                className="absolute -top-3 -right-3 bg-zinc-900 border border-blue-500/30 text-blue-400 text-[9px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1"
            >
                <ShieldCheck className="w-3 h-3" /> VERIFIED
            </motion.div>
        </motion.div>
    );
}

function AcquisitionMockupDark() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
        >
            <div className="absolute top-2 left-2 w-full h-full bg-zinc-800/50 rounded-2xl border border-white/5" />
            <div className="relative bg-zinc-800 rounded-2xl border border-white/5 shadow-2xl shadow-black/40 p-5 w-full max-w-xs mx-auto">
                <div className="mb-5">
                    <div className="text-[9px] text-zinc-500 uppercase tracking-[0.15em] font-semibold mb-2">Offer Strength</div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: "92%" }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        />
                    </div>
                    <div className="flex justify-between text-[8px] mt-1 font-medium">
                        <span className="text-zinc-600">Lowball</span>
                        <span className="text-amber-400 font-bold">Strong</span>
                    </div>
                </div>
                <div className="space-y-2.5 mb-5">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-zinc-400">List Price</span>
                        <span className="text-zinc-600 line-through font-light">$450,000</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-white font-semibold">Your Offer</span>
                        <span className="text-emerald-400 font-bold text-base">$435,000</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-lg">
                        <span>Seller Motivation</span>
                        <span className="font-bold">HIGH</span>
                    </div>
                </div>
                <button className="w-full bg-emerald-500 text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-400 transition-colors">
                    <Key className="w-3.5 h-3.5" /> Execute Offer
                </button>
            </div>
            <motion.div
                initial={{ opacity: 0, scale: 0, y: 10 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.2, duration: 0.5, type: "spring", stiffness: 400, damping: 15 }}
                className="absolute -right-4 top-8 bg-zinc-800 p-2 rounded-xl shadow-lg border border-emerald-500/20 flex flex-col items-center"
            >
                <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center mb-0.5">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                </div>
                <span className="text-[7px] font-bold text-emerald-400">ACCEPTED</span>
            </motion.div>
        </motion.div>
    );
}

const mockups = [SearchMockupDark, AnalysisMockupDark, AcquisitionMockupDark];

/* ═══════════════════════════════════════
   LUXURY PROCESS COMPONENT
   ═══════════════════════════════════════ */
export default function LuxuryProcess() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
    const lineHeight = useTransform(scrollYProgress, [0.05, 0.95], ["0%", "100%"]);

    return (
        <section ref={containerRef} className="py-32 md:py-40 bg-zinc-900 relative overflow-hidden">
            {/* Background glow decorations */}
            <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-emerald-600/5 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                {/* Header */}
                <div className="text-center mb-24 md:mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6"
                    >
                        <span className="text-[10px] font-semibold text-zinc-400 tracking-[0.2em] uppercase">The Proptech Experience</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1, duration: 0.6 }}
                        className="font-heading text-4xl md:text-6xl lg:text-7xl text-white"
                    >
                        A Journey to{" "}
                        <span className="text-emerald-400 italic font-serif">Belonging</span>
                    </motion.h2>
                </div>

                {/* Steps */}
                <div className="relative">
                    {/* Vertical scroll-driven line */}
                    <div className="absolute left-8 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px hidden md:block">
                        <div className="absolute inset-0 bg-white/5" />
                        <motion.div
                            className="absolute top-0 left-0 right-0 bg-gradient-to-b from-emerald-400 via-blue-400 to-amber-400 origin-top"
                            style={{ height: lineHeight }}
                        />
                    </div>

                    <div className="space-y-28 md:space-y-40">
                        {steps.map((step, index) => {
                            const isEven = index % 2 === 0;
                            const Mockup = mockups[index];
                            const colors = accentColors[step.accent];
                            const Icon = step.icon;

                            // Parallax on mockup
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            const y = useTransform(
                                scrollYProgress,
                                [0.1 + index * 0.2, 0.5 + index * 0.2],
                                [80, -40]
                            );

                            return (
                                <div key={step.id} className="relative">
                                    {/* Timeline dot */}
                                    <div className="absolute left-8 md:left-1/2 top-6 -translate-x-1/2 z-10 hidden md:flex">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            whileInView={{ scale: 1 }}
                                            viewport={{ once: true, margin: "-100px" }}
                                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                            className="w-4 h-4 bg-zinc-900 rounded-full border-[3px] border-zinc-700 shadow-sm flex items-center justify-center will-change-transform"
                                        >
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                whileInView={{ scale: 1 }}
                                                viewport={{ margin: "-100px" }}
                                                className={`w-1.5 h-1.5 rounded-full ${colors.dot}`}
                                            />
                                        </motion.div>
                                    </div>

                                    {/* Content grid */}
                                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center ${isEven ? "" : "md:[direction:rtl]"}`}>
                                        {/* Text side */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 40 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, margin: "-100px" }}
                                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                            className={`${isEven ? "md:text-right md:pr-16" : "md:text-left md:pl-16"} md:[direction:ltr]`}
                                        >
                                            {/* Step num + label */}
                                            <div className="flex items-center gap-3 mb-6" style={{ justifyContent: isEven ? "flex-end" : "flex-start" }}>
                                                <span className="text-6xl md:text-7xl font-heading text-white/5 leading-none select-none">
                                                    {step.id}
                                                </span>
                                                <div className={`${colors.pill} ${colors.pillText} border px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider`}>
                                                    {step.label}
                                                </div>
                                            </div>

                                            {/* Icon */}
                                            <div className={`flex mb-6 ${isEven ? "justify-end" : "justify-start"}`}>
                                                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                                    <Icon className={`w-6 h-6 ${colors.pillText}`} />
                                                </div>
                                            </div>

                                            <h3 className="font-heading text-3xl md:text-4xl lg:text-5xl text-white mb-4 leading-[1.1]">
                                                {step.heading}
                                            </h3>
                                            <p
                                                className="text-base md:text-lg text-zinc-400 font-light leading-relaxed max-w-md"
                                                style={{ marginRight: isEven ? 0 : "auto", marginLeft: isEven ? "auto" : 0 }}
                                            >
                                                {step.description}
                                            </p>
                                        </motion.div>

                                        {/* Visual/mockup side */}
                                        <motion.div style={{ y }} className="md:[direction:ltr] will-change-transform">
                                            <Mockup />
                                        </motion.div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="mt-20 text-center"
                >
                    <div className="inline-flex items-center gap-2 text-zinc-500 text-sm font-light">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span>All data points verified against public records in 200ms.</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
