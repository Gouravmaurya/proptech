"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Users, Layout, TrendingUp, Globe } from "lucide-react";

function AnimatedNumber({ value }: { value: number }) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = value;
        const duration = 2000;
        const increment = end / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setDisplayValue(end);
                clearInterval(timer);
            } else {
                setDisplayValue(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [value]);

    return <span>{displayValue.toLocaleString()}</span>;
}

export default function StatsCreative() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 50]);

    const STATS = [
        { label: "Families Found Home", value: 12500, icon: <Users />, color: "bg-emerald-500", suffix: "+" },
        { label: "Premium Properties", value: 3400, icon: <Layout />, color: "bg-zinc-900 dark:bg-white dark:text-zinc-900", suffix: "" },
        { label: "Annual Growth Score", value: 12, icon: <TrendingUp />, color: "bg-orange-400", suffix: "%" },
        { label: "Global Locations", value: 45, icon: <Globe />, color: "bg-blue-500", suffix: "" },
    ];

    return (
        <section ref={containerRef} className="py-32 bg-white dark:bg-zinc-950 relative overflow-hidden">
            {/* Background Image Accent */}
            <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
                <img 
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
                    className="w-full h-full object-cover"
                    alt="background"
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {STATS.map((stat, i) => (
                        <motion.div
                            key={i}
                            style={{ y: i % 2 === 0 ? y1 : y2 }}
                            className="p-10 rounded-[3rem] border border-stone-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-sm shadow-xl shadow-stone-200/20 dark:shadow-black/20 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-700 group h-full flex flex-col justify-between"
                        >
                            <div className={`w-14 h-14 rounded-2xl ${stat.color} text-white flex items-center justify-center mb-8 shadow-lg transition-transform duration-500 group-hover:rotate-12`}>
                                {stat.icon}
                            </div>

                            <div>
                                <h3 className="text-5xl font-heading text-zinc-900 dark:text-white mb-2 flex items-baseline">
                                    <AnimatedNumber value={stat.value} />
                                    <span className="text-emerald-600 dark:text-emerald-400 ml-1">{stat.suffix}</span>
                                </h3>
                                <p className="text-stone-400 dark:text-stone-500 font-medium uppercase tracking-[0.1em] text-xs">
                                    {stat.label}
                                </p>
                            </div>

                            {/* Decorative Line */}
                            <div className="w-12 h-[2px] bg-stone-100 dark:bg-zinc-800 mt-10 group-hover:w-20 group-hover:bg-emerald-500 transition-all duration-500" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
