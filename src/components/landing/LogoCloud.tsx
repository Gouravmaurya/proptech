"use client";

import { motion } from "framer-motion";

const logos = ["Forbes", "TechCrunch", "Bloomberg", "Wall Street Journal", "Y Combinator", "Product Hunt", "AngelList", "Crunchbase"];

export default function LogoCloud() {
    return (
        <section className="py-12 bg-white border-y border-stone-100 overflow-hidden">
            <div className="container mx-auto px-4">
                <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                    className="text-center text-xs uppercase tracking-[0.3em] text-stone-400 font-medium mb-8">As featured in</motion.p>
            </div>
            <div className="relative mask-marquee">
                <div className="flex animate-marquee">
                    {[...logos, ...logos].map((name, i) => (
                        <div key={i} className="flex-shrink-0 px-10 flex items-center">
                            <span className="text-lg font-heading text-stone-300 whitespace-nowrap tracking-wide select-none">{name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
