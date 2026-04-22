"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

export default function CallToAction() {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end end"] });

    const scale = useTransform(scrollYProgress, [0, 1], [0.93, 1]);
    const y = useTransform(scrollYProgress, [0, 1], [40, 0]);
    const blob1Y = useTransform(scrollYProgress, [0, 1], [-60, 60]);
    const blob2Y = useTransform(scrollYProgress, [0, 1], [60, -60]);

    return (
        <section ref={containerRef} className="relative py-24 md:py-32 overflow-hidden bg-white">
            <div className="container max-w-6xl mx-auto px-4">
                <motion.div
                    style={{ scale, y }}
                    className="relative rounded-[3rem] bg-[#022c22] px-6 py-20 md:py-24 text-center overflow-hidden shadow-2xl shadow-emerald-950/20 will-change-transform"
                >
                    {/* Floating Glow Orbs inside the card */}
                    <motion.div 
                        style={{ y: blob1Y }} 
                        className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-emerald-700/15 rounded-full blur-[100px] pointer-events-none will-change-transform" 
                    />
                    <motion.div 
                        style={{ y: blob2Y }} 
                        className="absolute bottom-[-20%] left-[-10%] w-[40vw] h-[40vw] bg-teal-700/15 rounded-full blur-[80px] pointer-events-none will-change-transform" 
                    />

                    <div className="relative z-10 flex flex-col items-center">
                        {/* Eyebrow Pill */}
                        <motion.div 
                            initial={{ opacity: 0, y: 15 }} 
                            whileInView={{ opacity: 1, y: 0 }} 
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 shadow-sm"
                        >
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-md shadow-emerald-400/50" />
                            <span className="text-[10px] font-bold text-emerald-200/90 tracking-[0.15em] uppercase">HAVEN</span>
                        </motion.div>

                        {/* Heading */}
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }} 
                            whileInView={{ opacity: 1, y: 0 }} 
                            viewport={{ once: true }} 
                            transition={{ delay: 0.1, duration: 0.6 }}
                            className="font-serif text-4xl md:text-6xl lg:text-7xl text-white mb-4 tracking-tight"
                        >
                            Begin your story.
                        </motion.h2>

                        {/* Sub-copy */}
                        <motion.p 
                            initial={{ opacity: 0, y: 15 }} 
                            whileInView={{ opacity: 1, y: 0 }} 
                            viewport={{ once: true }} 
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="text-emerald-100/70 text-sm md:text-base font-light max-w-md mx-auto mb-10 leading-relaxed px-4"
                        >
                            Join 2,500+ investors who discovered a smarter way to find and own property.
                        </motion.p>

                        {/* Email Input Capsule */}
                        {/* <motion.div 
                            initial={{ opacity: 0, y: 20 }} 
                            whileInView={{ opacity: 1, y: 0 }} 
                            viewport={{ once: true }} 
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="bg-white rounded-full p-1.5 flex flex-col sm:flex-row items-center w-full max-w-md mx-auto shadow-2xl shadow-emerald-950/40 mb-5 gap-2 sm:gap-0"
                        >
                            <div className="hidden sm:flex pl-4 pr-3 text-slate-400 font-bold border-r border-slate-100 mr-2 h-6 items-center">
                                H
                            </div>
                            <input 
                                type="email" 
                                placeholder="Your email address" 
                                className="w-full sm:flex-1 bg-transparent px-4 sm:px-2 py-3 sm:py-0 text-slate-900 placeholder:text-slate-400 focus:outline-none text-sm font-medium" 
                            />
                            <button 
                                className="w-full sm:w-auto bg-[#022c22] text-white px-7 py-3 rounded-full font-bold text-sm tracking-wide hover:bg-emerald-900 transition-colors whitespace-nowrap shadow-lg shadow-emerald-950/10 flex items-center justify-center gap-1.5 group"
                            >
                                <span>Start Exploring</span>
                            </button>
                        </motion.div> */}

                        {/* Bottom Disclaimer */}
                        <motion.p 
                            initial={{ opacity: 0 }} 
                            whileInView={{ opacity: 1 }} 
                            viewport={{ once: true }} 
                            transition={{ delay: 0.5, duration: 0.6 }}
                            className="text-[9px] md:text-[10px] text-emerald-400/60 font-semibold tracking-widest uppercase flex items-center gap-1.5"
                        >
                            <span>No credit card required</span> 
                            <span className="text-emerald-600/50">•</span> 
                            <span>Cancel anytime</span> 
                            <span className="text-emerald-600/50">•</span> 
                            <span>Full access</span>
                        </motion.p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
