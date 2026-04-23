"use client";

import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Shield, Target, Users, Zap } from "lucide-react";

const values = [
    {
        icon: <Shield className="w-6 h-6" />,
        title: "Trust & Transparency",
        description: "We provide verified data and clear insights, ensuring you have the full picture before every investment."
    },
    {
        icon: <Target className="w-6 h-6" />,
        title: "Precision Analytics",
        description: "Our AI models are trained on decades of market data to provide the most accurate ROI projections."
    },
    {
        icon: <Users className="w-6 h-6" />,
        title: "Community First",
        description: "We're building a network of smarter investors, sharing knowledge and growing together."
    },
    {
        icon: <Zap className="w-6 h-6" />,
        title: "Speed of Thought",
        description: "In real estate, timing is everything. Our platform delivers instant analysis so you never miss a deal."
    }
];

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#FDFBF7]">
            <Header />
            
            <section className="pt-32 pb-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-emerald-600 font-bold tracking-widest uppercase text-xs mb-4 block"
                    >
                        Our Mission
                    </motion.span>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-serif text-zinc-900 mb-8 tracking-tight"
                    >
                        Democratizing real estate <span className="italic text-emerald-600">intelligence.</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-zinc-600 font-light leading-relaxed"
                    >
                        We believe that professional-grade market insights shouldn't be reserved for institutional giants. Proptech was born to give every investor the tools to find, analyze, and own their future.
                    </motion.p>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 rounded-3xl bg-zinc-50 border border-zinc-100 hover:border-emerald-200 transition-colors group"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-sm mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-bold text-zinc-900 mb-3">{value.title}</h3>
                                <p className="text-zinc-600 text-sm leading-relaxed">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="rounded-[3rem] bg-zinc-900 p-12 md:p-20 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-600/10 blur-[100px]" />
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Our Story</h2>
                                <p className="text-zinc-400 text-lg leading-relaxed mb-6 font-light">
                                    Founded in 2024 by a team of real estate veterans and data scientists, Proptech started with a simple question: "Why is property investment so opaque?"
                                </p>
                                <p className="text-zinc-400 text-lg leading-relaxed font-light">
                                    We spent two years building the core AI engine that powers our platform today. By combining traditional valuation methods with machine learning, we've created a system that doesn't just look at prices, but understands the lifestyle and growth potential of every neighborhood.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="aspect-square rounded-3xl bg-emerald-600 flex flex-col items-center justify-center text-white text-center p-6">
                                    <span className="text-4xl font-bold mb-2">2.5k+</span>
                                    <span className="text-xs uppercase tracking-widest font-medium opacity-80">Active Investors</span>
                                </div>
                                <div className="aspect-square rounded-3xl bg-zinc-800 flex flex-col items-center justify-center text-white text-center p-6">
                                    <span className="text-4xl font-bold mb-2">$1.2B</span>
                                    <span className="text-xs uppercase tracking-widest font-medium opacity-80">Analyzed Assets</span>
                                </div>
                                <div className="aspect-square rounded-3xl bg-zinc-800 flex flex-col items-center justify-center text-white text-center p-6">
                                    <span className="text-4xl font-bold mb-2">98%</span>
                                    <span className="text-xs uppercase tracking-widest font-medium opacity-80">Accuracy Rate</span>
                                </div>
                                <div className="aspect-square rounded-3xl bg-emerald-900 flex flex-col items-center justify-center text-white text-center p-6">
                                    <span className="text-4xl font-bold mb-2">15+</span>
                                    <span className="text-xs uppercase tracking-widest font-medium opacity-80">Global Markets</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
