"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 50);
    });

    // Prevent background scrolling when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isMenuOpen]);

    const navLinks = [
        { name: "How it Works", href: "#features" },
        { name: "Why Haven", href: "#why-haven" },
        { name: "Stories", href: "#testimonials" },
        { name: "FAQ", href: "#faq" },
    ];

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 right-0 z-50 px-4 py-3"
        >
            <nav className={`max-w-[1200px] mx-auto flex items-center justify-between px-6 py-3 rounded-2xl transition-all duration-500 ${
                isMenuOpen 
                    ? 'bg-transparent border-transparent shadow-none' 
                    : scrolled
                        ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-stone-200/30 border border-stone-200/50'
                        : 'bg-transparent border border-white/10'
                }`}>
                <Link 
                    href="/" 
                    className={`group flex items-center gap-2 relative z-50 transition-opacity duration-300 ${
                        isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
                    }`}
                >
                    <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center group-hover:bg-emerald-600 transition-colors duration-300">
                        <span className="text-white font-bold text-sm">H</span>
                    </div>
                    <span className="font-heading text-xl tracking-tight text-zinc-900">Haven</span>
                </Link>

                <div className={`hidden md:flex items-center gap-1 transition-opacity duration-300 ${
                    isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`relative text-sm font-medium px-4 py-2 rounded-lg transition-all duration-500 group ${scrolled
                                    ? 'text-stone-600 hover:text-zinc-900 hover:bg-stone-100/60'
                                    : 'text-stone-600 hover:text-zinc-900 hover:bg-stone-100/10'
                                }`}
                        >
                            {link.name}
                            <span className="absolute bottom-1 left-4 right-4 h-px bg-emerald-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                        </Link>
                    ))}
                </div>

                <div className={`hidden md:flex items-center gap-3 transition-opacity duration-300 ${
                    isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}>
                    <Link
                        href="/dashboard"
                        className={`text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-300 ${scrolled
                                ? 'bg-zinc-900 text-white hover:bg-emerald-600'
                                : 'bg-white text-zinc-900 hover:bg-emerald-500 hover:text-white'
                            }`}
                    >
                        Get Started
                    </Link>
                </div>

                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className={`md:hidden relative z-50 p-2 rounded-lg transition-colors ${
                        isMenuOpen || scrolled 
                        ? 'text-zinc-900 hover:bg-stone-100' 
                        : 'text-zinc-900 hover:bg-stone-100/10'
                        }`}
                >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </nav>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="fixed inset-0 bg-white z-40 flex items-center justify-center">
                        <div className="flex flex-col gap-6 text-center">
                            {navLinks.map((link, i) => (
                                <motion.div key={link.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                    <Link href={link.href} onClick={() => setIsMenuOpen(false)} className="font-heading text-3xl text-zinc-900 hover:text-emerald-700 transition-colors">{link.name}</Link>
                                </motion.div>
                            ))}
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="inline-flex mt-4 px-8 py-3 bg-zinc-900 text-white rounded-xl text-lg font-medium">Get Started</Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
