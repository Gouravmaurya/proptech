"use client";

import { motion } from "framer-motion";
import { Check, X, Shield, Globe, Zap, Key, Activity, BarChart3, Clock } from "lucide-react";

const comparisons = [
    {
        feature: "Market Coverage",
        proptech: "50+ markets, 4,000+ sources",
        traditional: "Local listings only",
        icon: Globe
    },
    {
        feature: "Speed",
        proptech: "200ms AI analysis",
        traditional: "Days to weeks",
        icon: Zap
    },
    {
        feature: "Off-Market Access",
        proptech: "Direct pipeline",
        traditional: "Limited or none",
        icon: Key
    },
    {
        feature: "Risk Assessment",
        proptech: "847 data points verified",
        traditional: "Basic inspection",
        icon: Activity
    },
    {
        feature: "Price Prediction",
        proptech: "98% accuracy (10yr model)",
        traditional: "Agent gut feeling",
        icon: BarChart3
    },
    {
        feature: "Availability",
        proptech: "24/7 always-on",
        traditional: "Business hours",
        icon: Clock
    },
];

export default function WhyProptech() {
    return (
        <section id="why-proptech" className="py-32 bg-[#FDFBF7] relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-5xl relative z-10">

                {/* Header */}
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-stone-200 mb-6 shadow-sm"
                    >
                        <Shield className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-[10px] font-bold text-stone-500 tracking-[0.2em] uppercase">Why Proptech</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="font-heading text-4xl md:text-6xl text-zinc-900 tracking-tight"
                    >
                        The clear <span className="text-emerald-600 italic font-serif">advantage.</span>
                    </motion.h2>
                </div>

                {/* Comparison Table */}
                <div className="relative">
                    {/* Table Headers */}
                    <div className="grid grid-cols-12 gap-4 mb-8 px-6 hidden md:grid">
                        <div className="col-span-4" />
                        <div className="col-span-4 text-center">
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-600">Proptech AI</span>
                        </div>
                        <div className="col-span-4 text-center">
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Traditional</span>
                        </div>
                    </div>

                    {/* Table Body */}
                    <div className="space-y-3">
                        {comparisons.map((row, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: i * 0.08, duration: 0.6 }}
                                className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-6 px-6 bg-white/50 backdrop-blur-sm border border-stone-100 rounded-2xl hover:border-emerald-200/50 hover:bg-white hover:shadow-xl hover:shadow-stone-200/20 transition-all duration-500 group"
                            >
                                {/* Feature and Icon */}
                                <div className="md:col-span-4 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center transition-colors group-hover:bg-emerald-50 group-hover:border-emerald-100">
                                        <row.icon className="w-4 h-4 text-stone-400 transition-colors group-hover:text-emerald-600" />
                                    </div>
                                    <span className="font-heading text-lg text-zinc-900">{row.feature}</span>
                                </div>

                                {/* Proptech Value */}
                                <div className="md:col-span-4 flex items-center justify-center gap-3">
                                    <div className="md:hidden text-[9px] font-bold uppercase tracking-widest text-emerald-600 mb-1 w-full text-center">Proptech AI</div>
                                    <div className="flex items-center gap-2.5 px-4 py-2 bg-emerald-50/50 rounded-full border border-emerald-100/50">
                                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                        <span className="text-sm text-stone-600 font-medium">{row.proptech}</span>
                                    </div>
                                </div>

                                {/* Traditional Value */}
                                <div className="md:col-span-4 flex items-center justify-center gap-3">
                                    <div className="md:hidden text-[9px] font-bold uppercase tracking-widest text-stone-400 mb-1 w-full text-center mt-4">Traditional</div>
                                    <div className="flex items-center gap-2.5 px-4 py-2 bg-stone-50/50 rounded-full border border-stone-100/50 opacity-60">
                                        <X className="w-3.5 h-3.5 text-stone-300 shrink-0" />
                                        <span className="text-sm text-stone-400 font-light">{row.traditional}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Vertical accent */}
                <div className="absolute top-[20%] right-0 w-px h-[60%] bg-gradient-to-b from-transparent via-stone-200 to-transparent hidden md:block" />
            </div>
        </section>
    );
}
