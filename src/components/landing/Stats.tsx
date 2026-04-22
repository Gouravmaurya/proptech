"use client";

import { motion, useSpring, useMotionValue, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { BarChart3, Target, Zap, Globe, Clock } from "lucide-react";

const stats = [
    { value: 2500, suffix: "+", label: "Deals Analyzed", icon: BarChart3 },
    { value: 98, suffix: "%", label: "Prediction Accuracy", icon: Target },
    { value: 15, prefix: "$", suffix: "M", label: "Deal Volume", icon: Zap },
    { value: 200, suffix: "ms", label: "Analysis Speed", icon: Clock },
    { value: 50, suffix: "+", label: "Markets Covered", icon: Globe },
];

function AnimatedCounter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { stiffness: 50, damping: 20 });
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => { if (isInView) motionValue.set(value); }, [isInView, motionValue, value]);
    useEffect(() => {
        const unsubscribe = springValue.on("change", (latest) => { if (ref.current) ref.current.textContent = `${prefix}${Math.round(latest).toLocaleString()}${suffix}`; });
        return unsubscribe;
    }, [springValue, prefix, suffix]);

    return <span ref={ref}>{prefix}0{suffix}</span>;
}

export default function Stats() {
    return (
        <section className="py-24 bg-stone-50 border-y border-stone-100 relative overflow-hidden">
            {/* Background Parallax Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-0 left-[10%] w-64 h-64 bg-emerald-100/30 rounded-full blur-3xl will-change-transform"
                />
                <motion.div
                    animate={{ y: [15, -15, 15], x: [10, -10, 10] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-0 right-[10%] w-80 h-80 bg-blue-100/30 rounded-full blur-3xl will-change-transform"
                />
            </div>

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-4">
                    {stats.map((stat, index) => (
                        <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }} className="text-center group">
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center mx-auto mb-3 group-hover:border-emerald-200 group-hover:shadow-md transition-all duration-300 will-change-transform"
                            >
                                <stat.icon className="w-4 h-4 text-stone-400 group-hover:text-emerald-600 transition-colors" />
                            </motion.div>
                            <span className="font-heading text-3xl md:text-4xl text-zinc-900 block mb-1">
                                <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                            </span>
                            <span className="text-[11px] font-medium tracking-widest uppercase text-stone-400">{stat.label}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
