"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
    { name: "Sarah Chen", role: "First-Time Investor", quote: "Haven showed me deals my agent had no idea existed. I bought my first rental unit with 14% ROI within 2 months.", initial: "S", color: "bg-emerald-100 text-emerald-700" },
    { name: "Marcus Rivera", role: "Portfolio Manager", quote: "The risk analysis is superb. We've cut due-diligence time by 80% while improving accuracy. Game changer.", initial: "M", color: "bg-blue-100 text-blue-700" },
    { name: "Aanya Patel", role: "Real Estate Fund", quote: "Haven's predictive models have outperformed our internal analyst team for 3 quarters straight. Remarkable.", initial: "A", color: "bg-amber-100 text-amber-700" },
    { name: "James O'Brien", role: "REIT Director", quote: "The speed at which Haven surfaces off-market opportunities is unlike anything we've worked with before.", initial: "J", color: "bg-rose-100 text-rose-700" },
    { name: "Elena Kowalski", role: "Angel Investor", quote: "Switched from two other platforms. Haven's depth of analysis made the others feel like toy products.", initial: "E", color: "bg-purple-100 text-purple-700" },
    { name: "David Nakamura", role: "Property Developer", quote: "The acquisition workflow alone saves us 40 hours per deal. The ROI predictions are scary accurate.", initial: "D", color: "bg-teal-100 text-teal-700" },
];

const row1 = testimonials.slice(0, 3);
const row2 = testimonials.slice(3);

function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
    return (
        <div className="flex-shrink-0 w-[340px] mx-3">
            <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm h-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-400">
                <Quote className="w-5 h-5 text-stone-200 mb-3" />
                <div className="flex mb-3 gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />)}</div>
                <p className="text-sm text-stone-600 leading-relaxed mb-5 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3 pt-3 border-t border-stone-50">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${t.color}`}>{t.initial}</div>
                    <div><p className="text-sm font-semibold text-zinc-800">{t.name}</p><p className="text-[11px] text-stone-400">{t.role}</p></div>
                </div>
            </div>
        </div>
    );
}

export default function Testimonials() {
    return (
        <section id="testimonials" className="py-28 bg-stone-50 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-stone-200 shadow-sm mb-6">
                        <span className="text-xs font-semibold text-stone-500 tracking-wide uppercase">Testimonials</span>
                    </motion.div>
                    <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                        className="font-heading text-4xl md:text-5xl text-zinc-900">Real stories. Real returns.</motion.h2>
                </div>
            </div>

            <div className="space-y-6 relative">
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-stone-50 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-stone-50 to-transparent z-10 pointer-events-none" />
                <div className="flex animate-marquee">{[...row1, ...row1, ...row1].map((t, i) => <TestimonialCard key={i} t={t} />)}</div>
                <div className="flex animate-marquee-reverse">{[...row2, ...row2, ...row2].map((t, i) => <TestimonialCard key={i} t={t} />)}</div>
            </div>
        </section>
    );
}
