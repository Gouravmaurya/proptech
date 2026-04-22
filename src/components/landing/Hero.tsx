"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowDown, TrendingUp, Shield, Sparkles, BarChart3, MapPin, Activity } from "lucide-react";

/* ─── Mouse-tracking spotlight ─── */
function useMouseGlow(containerRef: React.RefObject<HTMLDivElement | null>) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const smoothX = useSpring(x, { stiffness: 150, damping: 30 });
    const smoothY = useSpring(y, { stiffness: 150, damping: 30 });

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const handleMove = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            x.set(e.clientX - rect.left);
            y.set(e.clientY - rect.top);
        };
        el.addEventListener("mousemove", handleMove);
        return () => el.removeEventListener("mousemove", handleMove);
    }, [containerRef, x, y]);

    return { smoothX, smoothY };
}

/* ─── Floating Geometric Shapes ─── */
function FloatingShapes() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Rings */}
            <motion.div
                animate={{ y: [-20, 20, -20], rotate: [0, 90, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[15%] left-[8%] w-16 h-16 border border-emerald-300/20 rounded-full will-change-transform"
            />
            <motion.div
                animate={{ y: [15, -25, 15], rotate: [0, -45, 0] }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[25%] right-[12%] w-24 h-24 border border-emerald-200/15 rounded-2xl will-change-transform"
            />
            {/* Dots */}
            <motion.div
                animate={{ y: [0, -30, 0], scale: [1, 1.3, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[30%] left-[15%] w-2 h-2 bg-emerald-400/30 rounded-full will-change-transform"
            />
            <motion.div
                animate={{ y: [0, 20, 0], scale: [1, 0.8, 1] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[40%] right-[20%] w-3 h-3 bg-teal-400/20 rounded-full will-change-transform"
            />
            <motion.div
                animate={{ y: [10, -15, 10] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[20%] right-[8%] w-1.5 h-1.5 bg-amber-400/25 rounded-full will-change-transform"
            />
            {/* Cross */}
            <motion.div
                animate={{ rotate: [0, 180, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-[60%] left-[5%] text-emerald-300/10 text-2xl font-light select-none will-change-transform"
            >✦</motion.div>
        </div>
    );
}

/* ─── Cycling status line ─── */
function StatusTicker() {
    const items = [
        { icon: TrendingUp, text: "12 new off-market deals found", color: "text-emerald-400" },
        { icon: Shield, text: "847 data points verified", color: "text-blue-400" },
        { icon: Activity, text: "Markets: Austin · Nashville · Phoenix", color: "text-amber-400" },
        { icon: Sparkles, text: "98% prediction accuracy", color: "text-purple-400" },
    ];
    const [idx, setIdx] = useState(0);
    useEffect(() => { const t = setInterval(() => setIdx(i => (i + 1) % items.length), 3500); return () => clearInterval(t); }, []);
    const item = items[idx];

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-2"
            >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                <span className="text-xs text-stone-400 font-light">{item.text}</span>
            </motion.div>
        </AnimatePresence>
    );
}

/* ─── Dashboard Mockup ─── */
function DashboardMockup() {
    return (
        <div className="relative w-full max-w-4xl mx-auto">
            {/* Glow behind - Reduced blur for performance */}
            <div className="absolute -inset-12 bg-gradient-to-t from-emerald-400/20 via-emerald-500/10 to-teal-400/5 blur-[40px] rounded-[40px] pointer-events-none" />
            <div className="absolute -inset-6 bg-gradient-to-b from-emerald-300/10 to-transparent blur-2xl rounded-3xl pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 60, rotateX: 8 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 1.2, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
                className="relative will-change-transform"
                style={{ perspective: "1200px" }}
            >
                <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xl shadow-stone-300/30 overflow-hidden">
                    {/* Window chrome */}
                    <div className="flex items-center gap-2 px-4 py-3 bg-stone-50 border-b border-stone-100">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-300" />
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
                        </div>
                        <div className="flex-1 flex justify-center">
                            <div className="bg-white rounded-lg border border-stone-200 px-4 py-1 text-[10px] text-stone-400 font-medium">
                                haven.ai/dashboard
                            </div>
                        </div>
                    </div>

                    {/* Dashboard body */}
                    <div className="p-5 bg-[#FAFAF8]">
                        <div className="grid grid-cols-12 gap-3">
                            {/* Sidebar skeleton */}
                            <div className="col-span-2 space-y-3 hidden md:block">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-6 h-6 rounded-lg bg-emerald-600" />
                                    <div className="h-2 w-12 bg-stone-200 rounded" />
                                </div>
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className={`h-7 rounded-lg flex items-center px-2 gap-2 ${i === 0 ? 'bg-emerald-50 border border-emerald-100' : ''}`}>
                                        <div className={`w-3 h-3 rounded ${i === 0 ? 'bg-emerald-300' : 'bg-stone-200'}`} />
                                        <div className={`h-1.5 rounded ${i === 0 ? 'w-14 bg-emerald-200' : 'w-10 bg-stone-100'}`} />
                                    </div>
                                ))}
                            </div>

                            {/* Main content */}
                            <div className="col-span-12 md:col-span-10 space-y-3">
                                {/* Stat cards row */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                                    {[
                                        { label: "Portfolio", value: "$2.4M", change: "+12.3%", color: "text-emerald-600" },
                                        { label: "ROI", value: "14.2%", change: "+2.1%", color: "text-emerald-600" },
                                        { label: "Properties", value: "12", change: "+3", color: "text-blue-600" },
                                        { label: "Score", value: "94", change: "A+", color: "text-amber-600" },
                                    ].map((stat, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 1.8 + i * 0.1 }}
                                            className="bg-white rounded-xl border border-stone-100 p-3"
                                        >
                                            <div className="text-[8px] text-stone-400 uppercase tracking-wider font-semibold">{stat.label}</div>
                                            <div className="text-lg font-heading text-zinc-900 leading-tight">{stat.value}</div>
                                            <div className={`text-[9px] font-semibold ${stat.color}`}>{stat.change}</div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Chart + List Row */}
                                <div className="flex flex-col md:grid md:grid-cols-5 gap-2.5">
                                    {/* Chart area */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 2.2 }}
                                        className="md:col-span-3 bg-white rounded-xl border border-stone-100 p-4"
                                    >
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Growth Trend</div>
                                            <div className="flex gap-1">
                                                {["1M", "6M", "1Y"].map((p, i) => (
                                                    <span key={i} className={`text-[8px] px-1.5 py-0.5 rounded ${i === 2 ? 'bg-emerald-50 text-emerald-600 font-bold' : 'text-stone-400'}`}>{p}</span>
                                                ))}
                                            </div>
                                        </div>
                                        {/* SVG chart line */}
                                        <svg viewBox="0 0 300 80" className="w-full h-16">
                                            <defs>
                                                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#059669" stopOpacity="0.15" />
                                                    <stop offset="100%" stopColor="#059669" stopOpacity="0" />
                                                </linearGradient>
                                            </defs>
                                            <motion.path
                                                d="M0,60 C30,55 50,50 80,42 C110,34 130,38 160,30 C190,22 210,28 240,18 C260,12 280,8 300,5"
                                                fill="none" stroke="#059669" strokeWidth="2"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 2, delay: 2.4, ease: "easeInOut" }}
                                            />
                                            <path d="M0,60 C30,55 50,50 80,42 C110,34 130,38 160,30 C190,22 210,28 240,18 C260,12 280,8 300,5 L300,80 L0,80 Z" fill="url(#chartGrad)" opacity="0.5" />
                                        </svg>
                                    </motion.div>

                                    {/* Property list */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 2.4 }}
                                        className="md:col-span-2 bg-white rounded-xl border border-stone-100 p-3 space-y-2"
                                    >
                                        <div className="text-[9px] font-bold uppercase tracking-widest text-stone-400 mb-2">Top Deals</div>
                                        {[
                                            { addr: "742 Elm St, Austin", roi: "14.2%", tag: "HOT" },
                                            { addr: "1891 Oak Ave, Nash", roi: "11.8%", tag: "" },
                                            { addr: "305 Pine Dr, PHX", roi: "13.5%", tag: "NEW" },
                                        ].map((p, i) => (
                                            <div key={i} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-stone-50 transition-colors">
                                                <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                                    <MapPin className="w-3 h-3 text-emerald-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-[9px] font-medium text-zinc-800 truncate">{p.addr}</div>
                                                    <div className="text-[8px] text-emerald-600 font-bold">{p.roi} ROI</div>
                                                </div>
                                                {p.tag && (
                                                    <span className="text-[7px] font-bold bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded">{p.tag}</span>
                                                )}
                                            </div>
                                        ))}
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reflection effect */}
                <div className="absolute -bottom-4 left-4 right-4 h-8 bg-gradient-to-b from-stone-200/20 to-transparent blur-sm rounded-b-3xl" />
            </motion.div>
        </div>
    );
}


/* ═══════════════════════════════════════
   HERO COMPONENT
   ═══════════════════════════════════════ */
export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });

    // Text: pushes back in 3D + blurs
    const textY = useTransform(scrollYProgress, [0, 0.6], [0, -120]);
    const textRotateX = useTransform(scrollYProgress, [0, 0.5], [0, 12]);
    const textScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.88]);

    // Dashboard: zooms toward viewer
    const mockupScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.20]);
    const mockupY = useTransform(scrollYProgress, [0, 0.6], [0, -60]);
    const { smoothX, smoothY } = useMouseGlow(containerRef);

    const words = ["Find", "your", "piece", "of", "the", "world."];

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#FDFBF7]"
        >
            {/* ── Aurora Background ── */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{ scale: [1, 1.1, 1], x: [0, 50, 0], y: [0, -30, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-30%] left-[-20%] w-[80vw] h-[80vw] bg-gradient-to-br from-emerald-100/15 via-teal-50/10 to-transparent rounded-full blur-[60px] will-change-transform"
                />
                <motion.div
                    animate={{ scale: [1, 1.15, 1], x: [0, -40, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 5 }}
                    className="absolute top-[-10%] right-[-25%] w-[70vw] h-[70vw] bg-gradient-to-bl from-white/20 via-stone-50/10 to-transparent rounded-full blur-[80px] will-change-transform"
                />
                <motion.div
                    animate={{ scale: [1, 1.08, 1], y: [0, 40, 0] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 8 }}
                    className="absolute bottom-[-20%] left-[10%] w-[50vw] h-[50vw] bg-gradient-to-tr from-emerald-50/10 to-transparent rounded-full blur-[60px] will-change-transform"
                />
            </div>

            {/* ── Mouse-following spotlight ── */}
            <motion.div
                className="absolute w-[500px] h-[500px] rounded-full pointer-events-none will-change-transform"
                style={{
                    x: smoothX,
                    y: smoothY,
                    translateX: "-50%",
                    translateY: "-50%",
                    background: "radial-gradient(circle, rgba(5,150,105,0.06) 0%, transparent 70%)",
                }}
            />

            <FloatingShapes />

            {/* ── Content ── */}
            <div className="relative z-10 w-full" style={{ perspective: "1200px" }}>
                {/* Text area */}
                <motion.div
                    style={{ y: textY, rotateX: textRotateX, scale: textScale, transformOrigin: "center bottom" }}
                    className="text-center px-4 pt-28 pb-8 md:pt-32 md:pb-12 max-w-4xl mx-auto will-change-transform"
                >
                    {/* Eyebrow */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="flex items-center justify-center gap-2 mb-8"
                    >
                        <div className="h-px w-6 bg-emerald-400" />
                        <span className="text-emerald-700 font-semibold tracking-[0.2em] text-[10px] uppercase">
                            Human-First Real Estate Intelligence
                        </span>
                        <div className="h-px w-6 bg-emerald-400" />
                    </motion.div>

                    {/* Main Heading — word-by-word cinematic reveal */}
                    <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.9] text-zinc-900 mb-8 will-change-transform">
                        {words.map((word, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                transition={{
                                    duration: 0.8,
                                    delay: 0.4 + i * 0.12,
                                    ease: [0.16, 1, 0.3, 1],
                                }}
                                className={`inline-block mr-[0.2em] ${i >= 3 ? 'text-emerald-600' : ''}`}
                            >
                                {/* line break before "of" on all screens */}
                                {i === 3 && <br />}
                                {word}
                            </motion.span>
                        ))}
                    </h1>

                    {/* Sub-copy */}
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1, duration: 0.8 }}
                        className="text-base md:text-xl text-stone-500/80 font-light max-w-2xl mx-auto leading-relaxed mb-10 will-change-transform"
                    >
                        Advanced intelligence that understands the human side of home.
                        Discover spaces that align with your life, effortlessly.
                    </motion.p>

                    {/* CTA Row */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.5 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6"
                    >
                        <Link
                            href="/dashboard"
                            className="group inline-flex items-center gap-2.5 px-8 py-4 bg-zinc-900 text-white rounded-2xl font-semibold text-sm hover:bg-emerald-700 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-600/20 hover:scale-[1.02]"
                        >
                            Get Started
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                        {/* <Link
                            href="#features"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-stone-500 border border-stone-200 hover:border-stone-300 hover:bg-white/60 backdrop-blur-sm transition-all duration-300 text-sm font-medium"
                        >
                            Watch Demo
                        </Link> */}
                    </motion.div>

                    {/* Trust bar */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-stone-400"
                    >
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-1.5">
                                {["bg-emerald-300", "bg-blue-300", "bg-amber-300", "bg-rose-300", "bg-purple-300"].map((bg, i) => (
                                    <div key={i} className={`w-5 h-5 rounded-full ${bg} border-2 border-[#FDFBF7]`} />
                                ))}
                            </div>
                            <span>2,500+ investors</span>
                        </div>
                        <span className="hidden sm:inline text-stone-200">|</span>
                        <StatusTicker />
                    </motion.div>
                </motion.div>

                {/* ── Dashboard Mockup ── */}
                <motion.div style={{ scale: mockupScale, y: mockupY }} className="px-4 md:px-8 pb-8 will-change-transform">
                    <DashboardMockup />
                </motion.div>
            </div>

            {/* Scroll hint */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3, duration: 1 }}
                className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-20"
            >
                <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                    <ArrowDown className="w-4 h-4 text-stone-300" />
                </motion.div>
            </motion.div>
        </section >
    );
}
