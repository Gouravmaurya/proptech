"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Lock, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AuthRequiredModalProps {
    isOpen: boolean;
    onClose: () => void;
    message?: string;
}

export default function AuthRequiredModal({ isOpen, onClose, message = "Create a free account or log in to unlock Haven's premium features and personalized insights." }: AuthRequiredModalProps) {
    const pathname = usePathname();
    const callbackUrl = encodeURIComponent(pathname);

    // Prevent scrolling when modal is open
    if (typeof window !== "undefined") {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="relative z-[100]">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-md"
                    />

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="relative flex w-full max-w-md transform flex-col overflow-hidden rounded-[2rem] bg-white text-left align-middle shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] ring-1 ring-slate-200 transition-all"
                            >
                                {/* Decorative elements */}
                                <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-emerald-100 blur-3xl opacity-50 pointer-events-none" />
                                <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-teal-50 blur-3xl opacity-50 pointer-events-none" />

                                <div className="relative p-8">
                                    <button
                                        onClick={onClose}
                                        className="absolute right-6 top-6 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors z-10"
                                    >
                                        <X className="h-5 w-5" />
                                        <span className="sr-only">Close</span>
                                    </button>

                                    <div className="flex flex-col items-center text-center mt-4 mb-8">
                                        <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 shadow-inner group">
                                            <div className="absolute inset-0 rounded-2xl bg-emerald-400/20 blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                            <Lock className="relative h-8 w-8 text-emerald-600" strokeWidth={1.5} />
                                        </div>
                                        <h2 className="mb-3 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                                            Premium Feature
                                        </h2>
                                        <p className="mb-6 text-slate-500 leading-relaxed px-2">
                                            {message}
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <Link
                                            href={`/auth/login?callbackUrl=${callbackUrl}`}
                                            onClick={onClose}
                                            className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-slate-900 px-4 py-4 text-sm font-semibold text-white transition-all hover:bg-slate-800 shadow-md hover:shadow-xl active:scale-[0.98]"
                                        >
                                            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-64 group-hover:h-56 opacity-10" />
                                            <span className="relative flex items-center gap-2">
                                                Log In or Sign Up
                                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </span>
                                        </Link>
                                        <button
                                            onClick={onClose}
                                            className="flex w-full items-center justify-center rounded-xl bg-transparent border border-slate-200 px-4 py-4 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100"
                                        >
                                            Maybe Later
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
}
