"use client";

import { motion } from "framer-motion";
import { ArrowRight, LayoutDashboard, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";

export default function SanctuaryHero() {
    return (
        <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">

            {/* ──── Cinematic Background Image ──── */}
            <div className="absolute inset-0 w-full h-full">
                <img 
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop" 
                    alt="Luxury Property"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* ──── OVERLAYS ──── */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ zIndex: 3 }}
            >
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/20" />
            </div>

            {/* ──── SMOOTH FADE INTO NEXT SECTION ──── */}
            <div
                className="absolute bottom-0 left-0 right-0 pointer-events-none"
                style={{
                    zIndex: 4,
                    height: "120px",
                    background: "linear-gradient(to top, var(--color-background) 0%, transparent 100%)",
                }}
            />

            {/* ──── HERO CONTENT ──── */}
            <div className="relative flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto" style={{ zIndex: 5 }}>

                <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/25 mb-10"
                >
                    <Sparkles size={13} className="text-emerald-400" />
                    <span className="text-white/95 text-xs font-bold uppercase tracking-[0.2em]">
                        Human-First Real Estate Intelligence
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-5xl md:text-7xl xl:text-8xl font-heading text-white leading-[0.95] tracking-tight mb-8"
                >
                    Where you belong,
                    <br />
                    <span className="text-emerald-400 italic font-serif">found.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35, duration: 1 }}
                    className="text-lg md:text-xl text-white/75 font-light leading-relaxed max-w-2xl mb-14"
                >
                    Intelligence that understands the soul of a home. Discover the
                    space that truly aligns with your life, not just your search criteria.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.9 }}
                    className="flex flex-col sm:flex-row items-center gap-5"
                >
                    <Link href="#features">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="group flex items-center gap-3 px-9 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-2xl shadow-2xl shadow-emerald-500/30 transition-all duration-300"
                        >
                            <LayoutDashboard size={18} />
                            Get Started
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </Link>

                    <Link href="#why-proptech">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="flex items-center gap-3 px-9 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-bold rounded-2xl border border-white/25 transition-all duration-300"
                        >
                            The Advantage
                        </motion.button>
                    </Link>
                </motion.div>
            </div>

            {/* Scroll hint */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
                style={{ zIndex: 5 }}
            >
                <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent"
                />
            </motion.div>
        </section>
    );
}
