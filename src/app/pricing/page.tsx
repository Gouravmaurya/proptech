"use client";

import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Check, Info } from "lucide-react";
import Link from "next/link";

const plans = [
    {
        name: "Explorer",
        price: "$0",
        period: "per month",
        description: "Perfect for getting a feel for the market.",
        features: [
            "Basic Property Search",
            "3 AI Analysis Reports / Mo",
            "Market Trend Highlights",
            "Community Forum Access",
            "Standard Support"
        ],
        cta: "Start for Free",
        highlight: false
    },
    {
        name: "Professional",
        price: "$49",
        period: "per month",
        description: "For active investors seeking an edge.",
        features: [
            "Unlimited Property Search",
            "Unlimited AI Analysis",
            "Detailed ROI Projections",
            "Neighborhood Soul Scores",
            "Priority Email Support",
            "Early Access to New Deals"
        ],
        cta: "Go Professional",
        highlight: true
    },
    {
        name: "Institutional",
        price: "Custom",
        period: "contact for pricing",
        description: "Full-scale intelligence for portfolios.",
        features: [
            "White-label Reports",
            "API Access",
            "Dedicated Account Manager",
            "Custom ML Model Training",
            "Bulk Property Ingestion",
            "24/7 Phone Support"
        ],
        cta: "Contact Sales",
        highlight: false
    }
];

export default function PricingPage() {
    return (
        <main className="min-h-screen bg-[#FDFBF7]">
            <Header />
            
            <section className="pt-32 pb-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-serif text-zinc-900 mb-6 tracking-tight"
                    >
                        Invest with <span className="italic text-emerald-600">confidence.</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-zinc-600 font-light max-w-2xl mx-auto"
                    >
                        Choose the plan that fits your investment journey. From first-time buyers to institutional portfolios.
                    </motion.p>
                </div>
            </section>

            <section className="pb-32 px-4">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`relative p-10 rounded-[3rem] ${
                                plan.highlight 
                                ? 'bg-zinc-900 text-white shadow-2xl shadow-emerald-900/20' 
                                : 'bg-white border border-zinc-100 shadow-xl shadow-zinc-200/50'
                            }`}
                        >
                            {plan.highlight && (
                                <div className="absolute top-6 right-6 px-4 py-1 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                                    Most Popular
                                </div>
                            )}
                            
                            <h3 className={`text-2xl font-bold mb-2 ${plan.highlight ? 'text-white' : 'text-zinc-900'}`}>{plan.name}</h3>
                            <p className={`text-sm mb-8 ${plan.highlight ? 'text-zinc-400' : 'text-zinc-500'}`}>{plan.description}</p>
                            
                            <div className="flex items-baseline gap-2 mb-10">
                                <span className="text-5xl font-serif font-bold">{plan.price}</span>
                                <span className={`text-sm ${plan.highlight ? 'text-zinc-400' : 'text-zinc-500'}`}>{plan.period}</span>
                            </div>

                            <div className="space-y-4 mb-12">
                                {plan.features.map((feature, j) => (
                                    <div key={j} className="flex items-start gap-3">
                                        <div className={`mt-1 p-0.5 rounded-full ${plan.highlight ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
                                            <Check className="w-3.5 h-3.5" />
                                        </div>
                                        <span className={`text-sm ${plan.highlight ? 'text-zinc-300' : 'text-zinc-600'}`}>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Link href="/contact" className="block">
                                <button className={`w-full py-4 rounded-2xl font-bold text-sm transition-all duration-300 ${
                                    plan.highlight 
                                    ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20' 
                                    : 'bg-zinc-900 hover:bg-zinc-800 text-white'
                                }`}>
                                    {plan.cta}
                                </button>
                            </Link>
                        </motion.div>
                    ))}
                </div>
                
                <div className="max-w-4xl mx-auto mt-20 p-8 rounded-3xl bg-zinc-100 border border-zinc-200 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-zinc-400">
                            <Info className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-zinc-900">Need a custom solution?</h4>
                            <p className="text-zinc-600 text-sm">We offer tailored data packages for large-scale operations.</p>
                        </div>
                    </div>
                    <Link href="/contact">
                        <button className="px-8 py-3 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-900 font-bold text-sm rounded-xl transition-all">
                            Talk to Us
                        </button>
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}
