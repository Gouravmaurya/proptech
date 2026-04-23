"use client";

import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, AlertCircle } from "lucide-react";
import { useState } from "react";
import { contact } from "@/app/actions/contact";

export default function ContactPage() {
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("sending");
        
        const formData = new FormData(e.currentTarget);
        const result = await contact(formData);

        if (result.success) {
            setStatus("success");
        } else {
            setStatus("error");
            setErrorMessage(result.error || "Failed to send message.");
        }
    };

    return (
        <main className="min-h-screen bg-[#FDFBF7]">
            <Header />
            
            <section className="pt-32 pb-20 px-4">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
                    <div>
                        <motion.span 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-emerald-600 font-bold tracking-widest uppercase text-xs mb-4 block"
                        >
                            Get in Touch
                        </motion.span>
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-serif text-zinc-900 mb-8 tracking-tight"
                        >
                            Let's talk about your <span className="italic text-emerald-600">future.</span>
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-zinc-600 font-light leading-relaxed mb-12"
                        >
                            Whether you have a question about our pricing, need a technical demo, or just want to say hi—we're here to help.
                        </motion.p>

                        <div className="space-y-8">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-sm border border-zinc-100">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Email Us</p>
                                    <p className="text-zinc-900 font-medium">hello@proptech.ai</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-sm border border-zinc-100">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Call Us</p>
                                    <p className="text-zinc-900 font-medium">+1 (555) 000-0000</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-sm border border-zinc-100">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">Visit Us</p>
                                    <p className="text-zinc-900 font-medium">San Francisco, CA</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white p-10 md:p-12 rounded-[3rem] shadow-2xl shadow-zinc-200/50 border border-zinc-100"
                    >
                        {status === "success" ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-20">
                                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                                    <Send className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-zinc-900 mb-2">Message Sent!</h3>
                                <p className="text-zinc-500">We'll get back to you within 24 hours.</p>
                                <button 
                                    onClick={() => setStatus("idle")}
                                    className="mt-8 text-emerald-600 font-bold text-sm hover:underline"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">First Name</label>
                                        <input name="firstName" required type="text" placeholder="John" className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-emerald-500 focus:bg-white transition-all outline-none text-zinc-900 font-medium" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Last Name</label>
                                        <input name="lastName" required type="text" placeholder="Doe" className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-emerald-500 focus:bg-white transition-all outline-none text-zinc-900 font-medium" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Work Email</label>
                                    <input name="email" required type="email" placeholder="john@company.com" className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-emerald-500 focus:bg-white transition-all outline-none text-zinc-900 font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Inquiry Type</label>
                                    <select name="inquiryType" className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-emerald-500 focus:bg-white transition-all outline-none text-zinc-900 font-medium appearance-none">
                                        <option>General Inquiry</option>
                                        <option>Sales & Pricing</option>
                                        <option>Technical Support</option>
                                        <option>Press & Media</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Message</label>
                                    <textarea name="message" required rows={4} placeholder="How can we help you?" className="w-full px-6 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:border-emerald-500 focus:bg-white transition-all outline-none text-zinc-900 font-medium resize-none"></textarea>
                                </div>
                                
                                {status === "error" && (
                                    <div className="flex items-center gap-2 text-rose-500 text-sm font-medium bg-rose-50 p-4 rounded-xl border border-rose-100">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>{errorMessage}</span>
                                    </div>
                                )}

                                <button 
                                    disabled={status === "sending"}
                                    className="w-full py-5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-2xl transition-all shadow-xl shadow-zinc-900/10 disabled:opacity-50"
                                >
                                    {status === "sending" ? "Sending..." : "Send Message"}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
