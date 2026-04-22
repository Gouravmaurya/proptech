"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
    Twitter,
    Linkedin,
    Github,
    ArrowUp,
    Sparkles,
    MapPin,
    Shield,
    TrendingUp,
    Brain,
    ArrowRight,
} from "lucide-react";

/* ── Nav columns — only real existing routes ── */
const navColumns = [
    {
        label: "Platform",
        links: [
            { name: "Dashboard",       href: "/dashboard" },
            { name: "Browse Properties", href: "/properties" },
            { name: "Get Started",     href: "/onboarding" },
        ],
    },
    {
        label: "Legal",
        links: [
            { name: "Terms & Conditions", href: "/terms" },
            { name: "Privacy Policy",     href: "/privacy" },
            { name: "Cookie Policy",      href: "/privacy#cookies" },
        ],
    },
];

const socialLinks = [
    { icon: Twitter,  href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Github,   href: "#", label: "GitHub" },
];

/* ── Live stat pills ── */
const stats = [
    { icon: TrendingUp, label: "Avg. ROI tracked",   value: "14.2%" },
    { icon: MapPin,     label: "Markets covered",    value: "120+"  },
    { icon: Brain,      label: "AI deals surfaced",  value: "8,400+" },
    { icon: Shield,     label: "Data points/listing", value: "847"  },
];

/* ── Stagger helpers ── */
const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
};
const itemVariants: Variants = {
    hidden:  { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function Footer() {
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    return (
        <footer className="relative bg-zinc-950 overflow-hidden">

            {/* Top glow line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-emerald-600/5 blur-[80px] rounded-full pointer-events-none" />

            {/* Dot-grid texture */}
            <div
                className="absolute inset-0 opacity-[0.025] pointer-events-none"
                style={{
                    backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                }}
            />

            <div className="relative max-w-7xl mx-auto px-6">

                {/* ── Stats strip ── */}
                {/* <div className="grid grid-cols-2 md:grid-cols-4 border-b border-zinc-800/60">
                    {stats.map(({ icon: Icon, label, value }, i) => (
                        <motion.div
                            key={label}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08, duration: 0.5 }}
                            className="flex flex-col items-center justify-center gap-1.5 py-7 hover:bg-zinc-900/50 transition-colors duration-300 group border-r border-zinc-800/40 last:border-r-0"
                        >
                            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/15 transition-colors">
                                <Icon className="w-3.5 h-3.5 text-emerald-500" />
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">{value}</span>
                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium text-center px-2">{label}</span>
                        </motion.div>
                    ))}
                </div> */}

                {/* ── Main body ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 py-16 border-b border-zinc-800/60">

                    {/* Brand column */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-5"
                    >
                        {/* Logo */}
                        <Link href="/" className="inline-flex items-center gap-3 group mb-5">
                            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/20 group-hover:bg-emerald-500 transition-colors duration-300">
                                <span className="text-white font-bold text-sm">H</span>
                            </div>
                            <span className="font-heading text-2xl text-white tracking-tight">Haven</span>
                            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20 tracking-widest">
                                BETA
                            </span>
                        </Link>

                        <p className="text-zinc-400 text-sm font-light leading-relaxed max-w-xs mb-8">
                            AI-powered real estate intelligence for the modern investor. Find your piece of the world — with clarity, confidence, and data.
                        </p>

                        {/* CTA */}
                        {/* <div className="mb-8">
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500 mb-3">
                                Ready to invest smarter?
                            </p>
                            <Link
                                href="/dashboard"
                                className="group inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-600/20"
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                Start for free
                                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                            <p className="text-[10px] text-zinc-600 mt-2 font-light">
                                No credit card · Cancel anytime
                            </p>
                        </div> */}

                        {/* Socials */}
                        {/* <div className="flex items-center gap-2">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 hover:border-emerald-500/30 hover:shadow-md hover:shadow-emerald-500/5 transition-all duration-300 group"
                                >
                                    <social.icon className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                                </a>
                            ))}
                        </div> */}
                    </motion.div>

                    {/* Nav columns */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-60px" }}
                        className="lg:col-span-7 grid grid-cols-2 gap-10"
                    >
                        {navColumns.map((col) => (
                            <motion.div key={col.label} variants={itemVariants}>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-5">
                                    {col.label}
                                </p>
                                <ul className="space-y-3.5">
                                    {col.links.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                href={link.href}
                                                className="group inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors duration-200"
                                            >
                                                <span className="w-0 group-hover:w-3 h-px bg-emerald-500 transition-all duration-300 flex-shrink-0" />
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* ── Bottom bar ── */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-col md:flex-row items-center justify-between gap-4 py-6"
                >
                    {/* Left: copyright + status */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-1.5 text-[11px] text-zinc-600 font-light">
                        <span>© {new Date().getFullYear()} Haven. All rights reserved.</span>
                        <span className="hidden md:inline w-px h-3 bg-zinc-800" />
                        <span className="inline-flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            All systems operational
                        </span>
                    </div>

                    {/* Right: legal links + scroll-to-top */}
                    <div className="flex items-center gap-5">
                        <div className="flex items-center gap-4 text-[11px] text-zinc-500">
                            <Link href="/terms"   className="hover:text-emerald-400 transition-colors">Terms</Link>
                            <span className="w-px h-3 bg-zinc-800" />
                            <Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy</Link>
                            <span className="hidden md:inline w-px h-3 bg-zinc-800" />
                            <span className="hidden md:inline text-zinc-600">Made with ♥ for investors</span>
                        </div>
                        <button
                            onClick={scrollToTop}
                            aria-label="Scroll to top"
                            className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-emerald-600 hover:border-emerald-600 transition-all duration-300 group flex-shrink-0"
                        >
                            <ArrowUp className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
                        </button>
                    </div>
                </motion.div>

            </div>
        </footer>
    );
}
