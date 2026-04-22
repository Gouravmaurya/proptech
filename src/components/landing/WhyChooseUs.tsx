"use client";

import { motion } from "framer-motion";
import { Check, X, Shield } from "lucide-react";

const comparisons = [
    { feature: "Market Coverage", haven: "50+ markets, 4,000+ sources", traditional: "Local listings only" },
    { feature: "Speed", haven: "200ms AI analysis", traditional: "Days to weeks" },
    { feature: "Off-Market Access", haven: "Direct pipeline", traditional: "Limited or none" },
    { feature: "Risk Assessment", haven: "847 data points verified", traditional: "Basic inspection" },
    { feature: "Price Prediction", haven: "98% accuracy (10yr model)", traditional: "Agent gut feeling" },
    { feature: "Available", haven: "24/7 always-on", traditional: "Business hours" },
];

export default function WhyChooseUs() {
    return (
        <section id="why-haven" className="py-28 bg-white">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-16">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-50 border border-stone-200 mb-6">
                        <Shield className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-xs font-semibold text-stone-500 tracking-wide uppercase">Why Haven</span>
                    </motion.div>
                    <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                        className="font-heading text-4xl md:text-5xl text-zinc-900">The clear advantage.</motion.h2>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block">
                    <div className="grid grid-cols-3 gap-4 mb-4 px-4">
                        <div /><div className="text-center text-xs font-bold uppercase tracking-widest text-emerald-600">Haven AI</div>
                        <div className="text-center text-xs font-bold uppercase tracking-widest text-stone-400">Traditional</div>
                    </div>
                    {comparisons.map((row, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }} className="grid grid-cols-3 gap-4 py-4 px-4 border-t border-stone-100 hover:bg-emerald-50/30 rounded-xl transition-colors">
                            <div className="font-medium text-sm text-zinc-800">{row.feature}</div>
                            <div className="flex items-center justify-center gap-2"><Check className="w-4 h-4 text-emerald-600 flex-shrink-0" /><span className="text-sm text-stone-600">{row.haven}</span></div>
                            <div className="flex items-center justify-center gap-2"><X className="w-4 h-4 text-stone-300 flex-shrink-0" /><span className="text-sm text-stone-400">{row.traditional}</span></div>
                        </motion.div>
                    ))}
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-3">
                    {comparisons.map((row, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }} className="bg-stone-50 rounded-2xl p-4 border border-stone-100">
                            <p className="font-medium text-sm text-zinc-800 mb-2">{row.feature}</p>
                            <div className="flex items-start gap-2 mb-1.5"><Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5" /><span className="text-xs text-stone-600">{row.haven}</span></div>
                            <div className="flex items-start gap-2"><X className="w-3.5 h-3.5 text-stone-300 mt-0.5" /><span className="text-xs text-stone-400">{row.traditional}</span></div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
