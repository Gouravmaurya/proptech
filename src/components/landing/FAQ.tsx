"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
    { q: "How is Proptech different from Zillow or Redfin?", a: "Traditional platforms show what's already on the market. Proptech finds off-market opportunities, runs AI-powered due diligence, and provides predictive analytics — think of it as a private fund analyst that works 24/7." },
    { q: "How accurate are your predictive models?", a: "Our models maintain 98% accuracy on 12-month projections, verified against historical outcomes. We use 847 data points per property and simulate 10,000 scenarios to give you Likely, Bear, and Bull case projections." },
    { q: "What markets do you cover?", a: "We currently cover 50+ high-growth markets across the US, with new markets added monthly. Our agents scan 4,000+ sources daily to identify emerging opportunities before they become mainstream." },
    { q: "Do I need real estate experience?", a: "Not at all. Proptech was designed to make institutional-grade analysis accessible to everyone. Our AI explains every metric in plain language and flags exactly what you need to know before making a decision." },
    { q: "What does it cost?", a: "Proptech offers a free 14-day trial with full access. After that, plans start at $49/month for individual investors. We never charge commissions or take a cut of your deals." },
];

export default function FAQ() {
    const [open, setOpen] = useState<number | null>(null);

    return (
        <section id="faq" className="py-28 bg-white">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-16">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-50 border border-stone-200 mb-6">
                        <HelpCircle className="w-3.5 h-3.5 text-stone-500" />
                        <span className="text-xs font-semibold text-stone-500 tracking-wide uppercase">FAQ</span>
                    </motion.div>
                    <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                        className="font-heading text-4xl md:text-5xl text-zinc-900">Questions? Answered.</motion.h2>
                </div>
                <div className="space-y-3">
                    {faqs.map((faq, index) => {
                        const isOpen = open === index;
                        return (
                            <motion.div key={index} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen ? 'border-emerald-200 bg-emerald-50/30 shadow-sm' : 'border-stone-100 bg-white hover:border-stone-200 hover:shadow-sm'}`}>
                                <button onClick={() => setOpen(isOpen ? null : index)} className="w-full flex items-center justify-between p-5 text-left gap-4">
                                    <span className={`font-medium text-sm transition-colors ${isOpen ? 'text-emerald-800' : 'text-zinc-800'}`}>{faq.q}</span>
                                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }} className="flex-shrink-0">
                                        <ChevronDown className={`w-4 h-4 transition-colors ${isOpen ? 'text-emerald-600' : 'text-stone-400'}`} />
                                    </motion.div>
                                </button>
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
                                            <div className="px-5 pb-5 text-sm text-stone-600 leading-relaxed font-light border-t border-emerald-100/50 pt-4">{faq.a}</div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
