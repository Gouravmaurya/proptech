"use client";

import { motion } from "framer-motion";
import { Brain, Shield, Zap, TrendingUp, Sparkles } from "lucide-react";

export default function BentoFeatures() {
    return (
        <section className="py-32 bg-[#FDFBF7] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col items-center text-center mb-20">
                    <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-6 border border-emerald-100">
                        <Sparkles size={12} />
                        Advanced Intelligence
                    </span>
                    <h2 className="text-5xl md:text-6xl font-heading text-zinc-900 mb-6 leading-tight">
                        Intelligence Meets <br />
                        <span className="text-emerald-600 italic font-serif">Intuition</span>
                    </h2>
                    <p className="text-stone-500 text-xl max-w-2xl font-light">
                        Our technology works silently in the background, making complex real estate decisions feel like second nature.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                    {/* Main AI Feature */}
                    <div className="md:col-span-2 md:row-span-2 relative p-12 rounded-[3.5rem] bg-white border border-stone-100 shadow-2xl shadow-stone-200/40 overflow-hidden group">
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div className="max-w-md">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center mb-8 shadow-lg shadow-emerald-500/20">
                                    <Brain className="text-white" size={28} />
                                </div>
                                <h3 className="text-4xl font-heading text-zinc-900 mb-6">AI Deep Analysis</h3>
                                <p className="text-stone-500 text-xl leading-relaxed font-light mb-8">
                                    Every property is analyzed by our proprietary AI to give you a score on <span className="text-zinc-900 font-medium">investment</span>, <span className="text-zinc-900 font-medium">livability</span>, and <span className="text-zinc-900 font-medium">future value</span>.
                                </p>
                                <div className="flex items-center gap-6">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-12 h-12 rounded-full border-2 border-white bg-stone-100 overflow-hidden shadow-sm">
                                                <img src={`https://i.pravatar.cc/100?u=${i + 10}`} alt="user" />
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-stone-400 text-sm font-medium tracking-tight italic">Trusted by 2,000+ investors</span>
                                </div>
                            </div>
                        </div>
                        {/* Soft Ambient decoration */}
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-50/50 to-transparent pointer-events-none" />
                        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-emerald-100/30 blur-[100px] rounded-full pointer-events-none group-hover:bg-emerald-100/50 transition-colors duration-1000" />
                    </div>

                    {/* Virtual Staging */}
                    <div className="p-10 rounded-[3.5rem] bg-white border border-stone-100 shadow-xl shadow-stone-200/30 flex flex-col justify-between group hover:border-emerald-200 transition-all duration-500">
                        <div className="w-14 h-14 rounded-2xl bg-stone-50 flex items-center justify-center group-hover:bg-emerald-50 group-hover:scale-110 transition-all duration-500">
                            <Zap className="text-emerald-600 transition-colors" size={24} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-heading text-zinc-900 mb-3">Virtual Staging</h3>
                            <p className="text-stone-500 font-light leading-relaxed">Visualize the true potential of any space, instantly styled to your preference.</p>
                        </div>
                    </div>

                    {/* Secure Proptech */}
                    <div className="p-10 rounded-[3.5rem] bg-white border border-stone-100 shadow-xl shadow-stone-200/30 flex flex-col justify-between group hover:border-emerald-200 transition-all duration-500">
                        <div className="w-14 h-14 rounded-2xl bg-stone-50 flex items-center justify-center group-hover:bg-emerald-50 group-hover:scale-110 transition-all duration-500">
                            <Shield className="text-emerald-600 transition-colors" size={24} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-heading text-zinc-900 mb-3">Secure Records</h3>
                            <p className="text-stone-500 font-light leading-relaxed">Blockchain-verified ownership history for unparalleled transparency.</p>
                        </div>
                    </div>

                    {/* Market Trends */}
                    <div className="md:col-span-3 h-auto p-12 mt-4 rounded-[3.5rem] bg-zinc-900 border border-zinc-800 shadow-2xl flex flex-col md:flex-row items-center gap-12 group overflow-hidden relative">
                        <div className="flex-1 relative z-10">
                            <h3 className="text-3xl font-heading text-white mb-4">Predictive Market Trends</h3>
                            <p className="text-stone-400 text-lg mb-8 max-w-md font-light leading-relaxed">
                                Our algorithm predicts neighborhood growth up to <span className="text-white font-medium">10 years</span> in advance, ensuring your home is always a solid asset.
                            </p>
                            <div className="flex gap-4">
                                <div className="px-5 py-2 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold tracking-widest uppercase">+12.5% Forecasted</div>
                                <div className="px-5 py-2 rounded-full bg-white/5 text-stone-500 text-xs font-bold tracking-widest uppercase">Target Area</div>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 h-64 bg-white/5 rounded-[2.5rem] border border-white/5 overflow-hidden flex items-end px-12 relative z-10 self-stretch">
                            {/* Refined Chart Visualization */}
                            <div className="flex items-end gap-3 w-full h-full pb-10">
                                {[30, 50, 40, 75, 50, 85, 70, 95].map((h, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ height: 0 }}
                                        whileInView={{ height: `${h}%` }}
                                        transition={{ delay: i * 0.08, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                        className="flex-1 bg-emerald-500/40 rounded-t-xl relative group/bar"
                                    >
                                        <div className="absolute inset-0 bg-emerald-500 scale-y-0 origin-bottom group-hover/bar:scale-y-100 transition-transform duration-500 rounded-t-xl" />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                        {/* Background Accent */}
                        <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none" />
                    </div>
                </div>
            </div>
        </section>
    );
}
