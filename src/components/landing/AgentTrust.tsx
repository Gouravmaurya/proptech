"use client";

import { motion } from "framer-motion";
import { Search, FileText, Target, CheckCircle, Zap } from "lucide-react";

const agents = [
    { id: "scout", icon: Search, title: "The Scout", badge: "Discovery Engine", description: "Scans 4,000+ markets daily. Analyzing zoning laws, demographic shifts, and rental yields to find the 0.1% of deals that matter.", gradient: "from-emerald-500 to-teal-500", bgGlow: "bg-emerald-500/10", iconBg: "bg-emerald-50", iconColor: "text-emerald-600", badgeBg: "bg-emerald-50", badgeText: "text-emerald-700", metric: "4,000+", metricLabel: "markets scanned daily" },
    { id: "auditor", icon: FileText, title: "The Auditor", badge: "Risk Verification", description: "Cross-references municipal permits, crime data, and foundation reports. If the heater is 15 years old, The Auditor knows—and deducts it.", gradient: "from-blue-500 to-indigo-500", bgGlow: "bg-blue-500/10", iconBg: "bg-blue-50", iconColor: "text-blue-600", badgeBg: "bg-blue-50", badgeText: "text-blue-700", metric: "847", metricLabel: "data points per property" },
    { id: "predictor", icon: Target, title: "The Predictor", badge: "Growth Modeling", description: "Simulates 10,000 future scenarios. We show you the Likely, Bear, and Bull Case based on real economic indicators.", gradient: "from-amber-500 to-orange-500", bgGlow: "bg-amber-500/10", iconBg: "bg-amber-50", iconColor: "text-amber-600", badgeBg: "bg-amber-50", badgeText: "text-amber-700", metric: "10,000", metricLabel: "scenarios simulated" },
];

export default function AgentTrust() {
    return (
        <section className="py-32 bg-stone-50 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-20">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-stone-200 shadow-sm mb-6">
                        <Zap className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-xs font-semibold text-stone-600 tracking-wide uppercase">The Neural Core</span>
                    </motion.div>
                    <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                        className="font-heading text-4xl md:text-5xl lg:text-6xl text-zinc-900 mb-6">Three agents. <br className="md:hidden" /><span className="italic text-stone-400">One mission.</span></motion.h2>
                    <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                        className="text-lg text-stone-500 font-light max-w-lg mx-auto leading-relaxed">We replaced the middleman with mathematics.</motion.p>
                </div>

                <div className="max-w-6xl mx-auto">
                    {/* Parallax connector line */}
                    <div className="relative">
                        <motion.div
                            initial={{ scaleX: 0, opacity: 0 }}
                            whileInView={{ scaleX: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className="absolute top-[60px] left-[15%] right-[15%] h-px bg-gradient-to-r from-emerald-200 via-blue-200 to-amber-200 hidden lg:block origin-left"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative z-10">
                        {agents.map((agent, index) => (
                            <motion.div key={agent.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                                transition={{ delay: index * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                className="group h-full"
                            >
                                <motion.div
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className="relative p-8 rounded-3xl bg-white border border-stone-100 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden h-full will-change-transform"
                                >
                                    <div className={`absolute -top-20 -right-20 w-40 h-40 ${agent.bgGlow} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                                    <div className="absolute -top-[28px] left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white border-[3px] border-stone-200 rounded-full hidden lg:flex items-center justify-center z-20">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            whileInView={{ scale: 1 }}
                                            transition={{ delay: 0.5 + index * 0.2 }}
                                            className={`w-full h-full rounded-full bg-gradient-to-r ${agent.gradient}`}
                                        />
                                    </div>

                                    <div className="relative mb-6">
                                        <div className={`w-14 h-14 rounded-2xl ${agent.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                                            <agent.icon className={`w-6 h-6 ${agent.iconColor}`} />
                                        </div>
                                    </div>

                                    <div className={`inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${agent.badgeText} ${agent.badgeBg} mb-4`}>{agent.badge}</div>
                                    <h3 className="font-heading text-2xl text-zinc-900 mb-3">{agent.title}</h3>
                                    <p className="text-sm text-stone-500 leading-relaxed mb-6">{agent.description}</p>

                                    <div className="pt-4 border-t border-stone-100 flex items-baseline">
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 + index * 0.1 }}
                                            className="text-2xl font-heading text-zinc-900"
                                        >
                                            {agent.metric}
                                        </motion.span>
                                        <span className="text-xs text-stone-400 ml-2">{agent.metricLabel}</span>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }} className="mt-16 text-center">
                    <div className="inline-flex items-center gap-2 text-stone-400 text-sm font-light">
                        <CheckCircle className="w-4 h-4 text-emerald-500" /><span>All data points verified against public records in 200ms.</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
