"use client";

import { motion } from "framer-motion";
import { ArrowRight, LayoutDashboard, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";

const VIDEOS = ["/videos/hero1.mp4", "/videos/hero2.mp4"];

export default function SanctuaryHero() {
    // Track which video is "on top". Both are always mounted.
    const [activeIndex, setActiveIndex] = useState(0);
    const [transitioning, setTransitioning] = useState(false);
    const videoRefs = [useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null)];

    // Preload the next video and switch
    const switchVideo = useCallback((nextIndex: number) => {
        if (transitioning) return;
        const nextRef = videoRefs[nextIndex].current;
        if (!nextRef) return;

        setTransitioning(true);
        nextRef.currentTime = 0;
        nextRef.play().catch(() => { });

        // Short delay so next video has started playing before we reveal it
        setTimeout(() => {
            setActiveIndex(nextIndex);
            setTransitioning(false);
        }, 80);
    }, [transitioning, videoRefs]);

    const handleVideoEnd = useCallback(() => {
        const nextIndex = (activeIndex + 1) % VIDEOS.length;
        switchVideo(nextIndex);
    }, [activeIndex, switchVideo]);

    // Start playing video 0 on mount
    useEffect(() => {
        videoRefs[0].current?.play().catch(() => { });
    }, []);

    return (
        <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">

            {/* ──── BOTH VIDEOS ALWAYS MOUNTED — crossfade via opacity ──── */}
            {VIDEOS.map((src, i) => (
                <video
                    key={src}
                    ref={videoRefs[i]}
                    src={src}
                    muted
                    playsInline
                    loop={VIDEOS.length === 1}
                    onEnded={i === activeIndex ? handleVideoEnd : undefined}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                        zIndex: i === activeIndex ? 2 : 1,
                        opacity: i === activeIndex ? 1 : 0,
                        transition: "opacity 1.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                />
            ))}

            {/* ──── OVERLAYS ──── */}
            {/* Main dark vignette — sits above both videos */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ zIndex: 3 }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>

            {/* ──── SMOOTH WHITE FADE INTO NEXT SECTION ──── */}
            <div
                className="absolute bottom-0 left-0 right-0 pointer-events-none"
                style={{
                    zIndex: 4,
                    height: "120px",
                    background: "linear-gradient(to top, #FAFAF8 0%, #fafaf8b8 20%, #fafaf855 50%, transparent 100%)",
                }}
            />

            {/* ──── VIDEO INDICATOR DOTS ──── */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3" style={{ zIndex: 5 }}>
                {VIDEOS.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => switchVideo(i)}
                        className={`transition-all duration-500 rounded-full ${i === activeIndex
                            ? "w-8 h-2 bg-white"
                            : "w-2 h-2 bg-white/40 hover:bg-white/70"
                            }`}
                    />
                ))}
            </div>

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
                    <Link href="/dashboard">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="group flex items-center gap-3 px-9 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-2xl shadow-2xl shadow-emerald-500/30 transition-all duration-300"
                        >
                            <LayoutDashboard size={18} />
                            Open Dashboard
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </Link>

                    <Link href="/test">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="flex items-center gap-3 px-9 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-bold rounded-2xl border border-white/25 transition-all duration-300"
                        >
                            Try AI Agent
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
