"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Search, Brain, Key, BarChart3, ShieldCheck, Check, TrendingUp, MapPin } from "lucide-react";

/* ─── Step Data ─── */
const steps = [
    {
        id: "01",
        label: "Discovery",
        heading: "Curated, not cluttered.",
        description: "Tell Haven what you dream of — ROI, location, vibe — and let our agents scour the off-market world for you. Stop scrolling through noise.",
        icon: Search,
        accent: "emerald",
    },
    {
        id: "02",
        label: "Analysis",
        heading: "Deep understanding.",
        description: "Every claim verified. From 10-year appreciation models to neighborhood crime trends, our AI underwriter reveals the truth behind the asking price.",
        icon: Brain,
        accent: "blue",
    },
    {
        id: "03",
        label: "Acquisition",
        heading: "Make it yours.",
        description: "With a data-backed investment thesis, you negotiate from a position of power. Confidence isn't optional — it's built in.",
        icon: Key,
        accent: "amber",
    },
];

/* ─── Individual Mockups ─── */
function SearchMockup() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
        >
            <div className="bg-white rounded-2xl border border-stone-100 shadow-2xl shadow-stone-200/40 overflow-hidden w-full max-w-sm mx-auto">
                {/* Window bar */}
                <div className="flex items-center gap-1.5 px-4 py-2.5 bg-stone-50/80 border-b border-stone-100">
                    <div className="w-2 h-2 rounded-full bg-stone-200" />
                    <div className="w-2 h-2 rounded-full bg-stone-200" />
                    <div className="w-2 h-2 rounded-full bg-stone-200" />
                </div>

                {/* Filter chips */}
                <div className="px-4 py-3 flex gap-1.5 border-b border-stone-50">
                    <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">Austin, TX</span>
                    <span className="text-[10px] font-medium bg-stone-50 text-stone-500 px-2.5 py-1 rounded-full">ROI &gt; 12%</span>
                    <span className="text-[10px] font-medium bg-stone-50 text-stone-500 px-2.5 py-1 rounded-full">Multi-Family</span>
                </div>

                {/* Results */}
                <div className="p-3 space-y-2">
                    {/* Highlighted result */}
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="flex gap-3 p-2.5 bg-emerald-50/50 rounded-xl border border-emerald-100/60"
                    >
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-[11px] font-semibold text-zinc-800">742 Elm St, Austin</div>
                            <div className="text-[9px] text-stone-400 mt-0.5">Multi-Family · 4 Units</div>
                            <div className="mt-1 inline-flex text-[7px] font-bold bg-white text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded">OFF-MARKET</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                            <div className="text-xs font-bold text-emerald-700">14.2%</div>
                            <div className="text-[8px] text-stone-400">Est. ROI</div>
                        </div>
                    </motion.div>

                    {/* Fading results */}
                    {[0.35, 0.15].map((op, i) => (
                        <div key={i} className="flex gap-3 p-2.5" style={{ opacity: op }}>
                            <div className="w-12 h-12 bg-stone-50 rounded-lg flex-shrink-0" />
                            <div className="flex-1 space-y-1.5 pt-1">
                                <div className="h-2 w-24 bg-stone-100 rounded-full" />
                                <div className="h-1.5 w-16 bg-stone-50 rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Floating badge */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -bottom-3 -right-3 md:-right-5 bg-zinc-900 text-white text-[9px] px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 font-medium"
            >
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                3 new deals
            </motion.div>
        </motion.div>
    );
}

function AnalysisMockup() {
    const barHeights = [30, 42, 38, 55, 48, 65, 58, 80];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
        >
            <div className="bg-white rounded-2xl border border-stone-100 shadow-2xl shadow-stone-200/40 p-5 w-full max-w-sm mx-auto">
                {/* Header */}
                <div className="flex justify-between items-start mb-5">
                    <div>
                        <div className="text-[9px] text-stone-400 uppercase tracking-[0.15em] font-semibold">Projected Net</div>
                        <div className="text-3xl font-heading text-zinc-900 leading-tight">$42.5k</div>
                        <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5 mt-0.5">
                            <TrendingUp className="w-2.5 h-2.5" /> +12% vs Market
                        </div>
                    </div>
                    <div className="p-2 bg-blue-50 rounded-xl">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                    </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 mb-5">
                    <div className="p-2.5 bg-stone-50 rounded-xl text-center">
                        <div className="text-[8px] text-stone-400 uppercase tracking-wider font-semibold">Cash-on-Cash</div>
                        <div className="text-lg font-bold text-zinc-800">8.4%</div>
                    </div>

                    <div className="p-2.5 bg-stone-50 rounded-xl text-center">
                        <div className="text-[8px] text-stone-400 uppercase tracking-wider font-semibold">Cap Rate</div>
                        <div className="text-lg font-bold text-emerald-600">7.2%</div>
                    </div>
                </div>

                {/* Chart */}
                <div className="flex items-end justify-between h-16 gap-1 mb-1.5">
                    {barHeights.map((h, i) => (
                        <motion.div
                            key={i}
                            className="flex-1 bg-emerald-50 rounded-t relative overflow-hidden"
                            style={{ height: "100%" }}
                        >
                            <motion.div
                                className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                                initial={{ height: 0 }}
                                whileInView={{ height: `${h}%` }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.6 + i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            />
                        </motion.div>
                    ))}
                </div>
                <div className="flex justify-between text-[7px] text-stone-300 uppercase tracking-wider font-semibold">
                    <span>Year 1</span><span>Year 5</span><span>Year 10</span>
                </div>
            </div>

            {/* Verified badge */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.0, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -top-3 -right-3 bg-white border border-blue-100 text-blue-700 text-[9px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1"
            >
                <ShieldCheck className="w-3 h-3" /> VERIFIED
            </motion.div>
        </motion.div>
    );
}

function AcquisitionMockup() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
        >
            {/* Shadow card behind */}
            <div className="absolute top-2 left-2 w-full h-full bg-stone-50 rounded-2xl border border-stone-100" />

            <div className="relative bg-white rounded-2xl border border-stone-100 shadow-2xl shadow-stone-200/40 p-5 w-full max-w-xs mx-auto">
                {/* Offer strength */}
                <div className="mb-5">
                    <div className="text-[9px] text-stone-400 uppercase tracking-[0.15em] font-semibold mb-2">Offer Strength</div>
                    <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: "92%" }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        />
                    </div>
                    <div className="flex justify-between text-[8px] mt-1 font-medium">
                        <span className="text-stone-300">Lowball</span>
                        <span className="text-amber-600 font-bold">Strong</span>
                    </div>
                </div>

                {/* Price breakdown */}
                <div className="space-y-2.5 mb-5">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-stone-400">List Price</span>
                        <span className="text-stone-300 line-through font-light">$450,000</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-zinc-900 font-semibold">Your Offer</span>
                        <span className="text-emerald-600 font-bold text-base">$435,000</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg">
                        <span>Seller Motivation</span>
                        <span className="font-bold">HIGH</span>
                    </div>
                </div>

                <button className="w-full bg-zinc-900 text-white text-xs font-semibold py-3 rounded-xl flex items-center justify-center gap-2">
                    <Key className="w-3.5 h-3.5" /> Execute Offer
                </button>
            </div>

            {/* Accepted badge */}
            <motion.div
                initial={{ opacity: 0, scale: 0, y: 10 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.2, duration: 0.5, type: "spring", stiffness: 400, damping: 15 }}
                className="absolute -right-4 top-8 bg-white p-2 rounded-xl shadow-lg border border-emerald-100/50 flex flex-col items-center"
            >
                <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center mb-0.5">
                    <Check className="w-3 h-3 text-emerald-600" />
                </div>
                <span className="text-[7px] font-bold text-emerald-700">ACCEPTED</span>
            </motion.div>
        </motion.div>
    );
}

const mockups = [SearchMockup, AnalysisMockup, AcquisitionMockup];
const accentColors: Record<string, { bg: string; text: string; dot: string }> = {
    emerald: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
    blue: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400" },
    amber: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
};

/* ═══════════════════════════════════════
   FEATURES COMPONENT
   ═══════════════════════════════════════ */
/* ═══════════════════════════════════════
   FEATURES COMPONENT
   ═══════════════════════════════════════ */
export default function Features() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
    const lineHeight = useTransform(scrollYProgress, [0.05, 0.95], ["0%", "100%"]);

    return (
        <section id="features" ref={containerRef} className="py-32 md:py-40 relative bg-white overflow-hidden">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <div className="text-center mb-24 md:mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-50 border border-stone-100 mb-6"
                    >
                        <span className="text-[10px] font-semibold text-stone-400 tracking-[0.2em] uppercase">Your Journey</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1, duration: 0.6 }}
                        className="font-heading text-4xl md:text-6xl lg:text-7xl text-zinc-900"
                    >
                        How it unfolds
                    </motion.h2>
                </div>

                {/* Steps */}
                <div className="relative">
                    {/* Vertical line — desktop */}
                    <div className="absolute left-8 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px hidden md:block">
                        <div className="absolute inset-0 bg-stone-100" />
                        <motion.div
                            className="absolute top-0 left-0 right-0 bg-gradient-to-b from-emerald-300 via-blue-300 to-amber-300 origin-top"
                            style={{ height: lineHeight }}
                        />
                    </div>

                    {/* Step rows */}
                    <div className="space-y-28 md:space-y-40">
                        {steps.map((step, index) => {
                            const isEven = index % 2 === 0;
                            const Mockup = mockups[index];
                            const colors = accentColors[step.accent];

                            // Parallax effect for mockup
                            const y = useTransform(scrollYProgress,
                                [0.1 + index * 0.2, 0.5 + index * 0.2],
                                [100, -50]
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
                                            className="w-4 h-4 bg-white rounded-full border-[3px] border-stone-200 shadow-sm flex items-center justify-center will-change-transform"
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
                                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center ${isEven ? '' : 'md:[direction:rtl]'}`}>
                                        {/* Text side */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 40 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, margin: "-100px" }}
                                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                            className={`${isEven ? 'md:text-right md:pr-16' : 'md:text-left md:pl-16'} md:[direction:ltr]`}
                                        >
                                            {/* Step number + label */}
                                            <div className="flex items-center gap-3 mb-6" style={{ justifyContent: isEven ? 'flex-end' : 'flex-start' }}>
                                                <span className="text-6xl md:text-7xl font-heading text-stone-100 leading-none select-none">{step.id}</span>
                                                <div className={`${colors.bg} ${colors.text} px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider`}>
                                                    {step.label}
                                                </div>
                                            </div>

                                            <h3 className="font-heading text-3xl md:text-4xl lg:text-5xl text-zinc-900 mb-4 leading-[1.1]">
                                                {step.heading}
                                            </h3>
                                            <p className="text-base md:text-lg text-stone-400 font-light leading-relaxed max-w-md ml-auto md:ml-0" style={{ marginRight: isEven ? 0 : 'auto', marginLeft: isEven ? 'auto' : 0 }}>
                                                {step.description}
                                            </p>
                                        </motion.div>

                                        {/* Visual side */}
                                        <motion.div
                                            style={{ y }}
                                            className="md:[direction:ltr] will-change-transform"
                                        >
                                            <Mockup />
                                        </motion.div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
