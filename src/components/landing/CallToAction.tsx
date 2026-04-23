"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { subscribe } from "@/app/actions/subscribe";

export default function CallToAction() {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end end"] });
    
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const scale = useTransform(scrollYProgress, [0, 1], [0.93, 1]);
    const y = useTransform(scrollYProgress, [0, 1], [40, 0]);
    const blob1Y = useTransform(scrollYProgress, [0, 1], [-60, 60]);
    const blob2Y = useTransform(scrollYProgress, [0, 1], [60, -60]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!email) return;

        setStatus("loading");
        const formData = new FormData();
        formData.append("email", email);

        const result = await subscribe(formData);

        if (result.success) {
            setStatus("success");
            setEmail("");
            setMessage("Thank you! You've been added to our list.");
        } else {
            setStatus("error");
            setMessage(result.error || "Something went wrong.");
        }
    }

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
                            <span className="text-[10px] font-bold text-emerald-200/90 tracking-[0.15em] uppercase">PROPTECH</span>
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
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} 
                            whileInView={{ opacity: 1, y: 0 }} 
                            viewport={{ once: true }} 
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="w-full max-w-md mx-auto mb-5"
                        >
                            {status === "success" ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl py-4 px-6 flex items-center gap-3 text-emerald-300"
                                >
                                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                                    <span className="text-sm font-medium">{message}</span>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="bg-white rounded-full p-1.5 flex flex-col sm:flex-row items-center shadow-2xl shadow-emerald-950/40 gap-2 sm:gap-0">
                                    <div className="hidden sm:flex pl-4 pr-3 text-slate-400 font-bold border-r border-slate-100 mr-2 h-6 items-center">
                                        P
                                    </div>
                                    <input 
                                        type="email" 
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Your email address" 
                                        className="w-full sm:flex-1 bg-transparent px-4 sm:px-2 py-3 sm:py-0 text-slate-900 placeholder:text-slate-400 focus:outline-none text-sm font-medium" 
                                    />
                                    <button 
                                        type="submit"
                                        disabled={status === "loading"}
                                        className="w-full sm:w-auto bg-[#022c22] text-white px-7 py-3 rounded-full font-bold text-sm tracking-wide hover:bg-emerald-900 transition-all whitespace-nowrap shadow-lg shadow-emerald-950/10 flex items-center justify-center gap-1.5 group disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span>{status === "loading" ? "Subscribing..." : "Start Exploring"}</span>
                                        {status !== "loading" && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />}
                                    </button>
                                </form>
                            )}
                            {status === "error" && (
                                <p className="text-rose-400 text-[10px] mt-3 font-medium uppercase tracking-wider">{message}</p>
                            )}
                        </motion.div>

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
