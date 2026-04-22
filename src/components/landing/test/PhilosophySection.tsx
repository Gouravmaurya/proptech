"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { MapPin, TrendingUp } from "lucide-react";

const RING_CARDS = [
    {
        img: "https://images.unsplash.com/photo-1600607687940-4e524cb35797?q=80&w=600&auto=format&fit=crop",
        location: "Pacific Palisades, CA",
        price: "$4.2M",
        score: 94,
    },
    {
        img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&auto=format&fit=crop",
        location: "Malibu, CA",
        price: "$3.1M",
        score: 88,
    },
    {
        img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop",
        location: "Bel Air, CA",
        price: "$6.8M",
        score: 96,
    },
    {
        img: "https://images.unsplash.com/photo-1605146769289-440113cc3d00?q=80&w=600&auto=format&fit=crop",
        location: "Beverly Hills, CA",
        price: "$5.5M",
        score: 91,
    },
    {
        img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=600&auto=format&fit=crop",
        location: "Santa Monica, CA",
        price: "$2.9M",
        score: 85,
    },
    {
        img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=600&auto=format&fit=crop",
        location: "Calabasas, CA",
        price: "$3.7M",
        score: 89,
    },
];

// Alternate sizes for a dynamic, editorial feel
const CARD_SIZES = [
    { w: 200, h: 148 },
    { w: 170, h: 128 },
    { w: 200, h: 148 },
    { w: 170, h: 128 },
    { w: 200, h: 148 },
    { w: 170, h: 128 },
];

const RING_RADIUS = 500;

export default function PhilosophySection() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1]);
    const ringRotate = useTransform(scrollYProgress, [0, 1], [0, 40]);
    const counterRotate = useTransform(ringRotate, (r) => -r);

    const TEXT =
        "We believe a home is more than a structure. It's the silent witness to your life's greatest moments. A sanctuary for growth, a canvas for memories, and a haven for the soul.";

    return (
        <section
            ref={containerRef}
            className="py-48 bg-[#FDFBF7] relative overflow-hidden flex items-center justify-center min-h-screen"
        >
            {/* ──── ORBITING PROPERTY CARDS RING ──── */}
            <motion.div
                style={{ rotate: ringRotate }}
                className="absolute inset-0 pointer-events-none flex items-center justify-center"
            >
                <div className="relative" style={{ width: 0, height: 0 }}>
                    {RING_CARDS.map((card, i) => {
                        const angle = (i / RING_CARDS.length) * 360;
                        const rad = (angle * Math.PI) / 180;
                        const x = Math.cos(rad) * RING_RADIUS;
                        const y = Math.sin(rad) * RING_RADIUS;
                        const { w, h } = CARD_SIZES[i];

                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                viewport={{ once: true, margin: "-80px" }}
                                transition={{ delay: i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                style={{
                                    position: "absolute",
                                    left: Math.round(x - w / 2),
                                    top: Math.round(y - h / 2),
                                    width: w,
                                    height: h,
                                    rotate: counterRotate,
                                }}
                            >
                                {/* Card */}
                                <div className="w-full h-full rounded-2xl overflow-hidden bg-white shadow-2xl shadow-stone-300/30 border border-white/80 flex flex-col">
                                    {/* Image */}
                                    <div className="relative flex-1 overflow-hidden">
                                        <img
                                            src={card.img}
                                            alt={card.location}
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Price badge */}
                                        <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-zinc-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                            {card.price}
                                        </span>
                                    </div>
                                    {/* Card footer */}
                                    <div className="px-3 py-2 bg-white flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-1 min-w-0">
                                            <MapPin size={9} className="text-stone-400 shrink-0" />
                                            <span className="text-[10px] text-stone-500 truncate">{card.location}</span>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <TrendingUp size={9} className="text-emerald-500" />
                                            <span className="text-[10px] font-bold text-emerald-600">{card.score}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}

                    {/* Faint dashed orbit ring */}
                    <div
                        className="absolute rounded-full border border-dashed border-stone-200/40"
                        style={{
                            width: RING_RADIUS * 2,
                            height: RING_RADIUS * 2,
                            left: -RING_RADIUS,
                            top: -RING_RADIUS,
                        }}
                    />
                </div>
            </motion.div>

            {/* ──── TEXT (unchanged) ──── */}
            <motion.div
                style={{ opacity, scale }}
                className="relative z-10 max-w-4xl mx-auto px-6 text-center"
            >
                <span className="text-emerald-600 font-bold text-xs uppercase tracking-[0.4em] mb-12 block">
                    Our Philosophy
                </span>

                <h2 className="text-4xl md:text-6xl lg:text-7xl font-heading text-zinc-900 leading-[1.1] tracking-tight">
                    {TEXT.split(" ").map((word, i) => (
                        <motion.span
                            key={i}
                            initial={{ opacity: 0.1, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03, duration: 0.6 }}
                            viewport={{ once: false, margin: "-100px" }}
                            className="inline-block mr-[0.3em]"
                        >
                            {word}
                        </motion.span>
                    ))}
                </h2>

                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100px" }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="h-[1px] bg-emerald-600 mx-auto mt-20"
                />
            </motion.div>

            {/* Background blobs */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-50 rounded-full blur-[140px] opacity-50 pointer-events-none" />
            <div className="absolute bottom-1/2 right-0 translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-stone-100 rounded-full blur-[120px] opacity-40 pointer-events-none" />
        </section>
    );
}
