"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Sparkles, Home, ArrowRight, Loader2, Image as ImageIcon, X, Info, Lock } from "lucide-react";
import CreativeLoader from "@/components/ui/CreativeLoader";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { matchDreamHouse } from "@/app/actions/dream-house";
import PropertyCard from "@/components/PropertyCard";
import { cn } from "@/lib/utils";

export default function DreamHouseMatcher() {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [keywords, setKeywords] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { status } = useSession();
    const router = useRouter();
    const isGuest = status === "unauthenticated";

    const fileInputRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);
    const [showResultsBadge, setShowResultsBadge] = useState(false);
    const resultsCount = results.length;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            setPreviewUrl(URL.createObjectURL(selected));
            setResults([]);
            setKeywords([]);
            setError(null);
            setShowResultsBadge(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const selected = e.dataTransfer.files?.[0];
        if (selected && selected.type.startsWith("image/")) {
            setFile(selected);
            setPreviewUrl(URL.createObjectURL(selected));
            setResults([]);
            setKeywords([]);
            setError(null);
            setShowResultsBadge(false);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const clearSelection = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFile(null);
        setPreviewUrl(null);
        setResults([]);
        setKeywords([]);
        setError(null);
        setShowResultsBadge(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const analyzeImage = async () => {
        if (!file) return;

        setIsAnalyzing(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("image", file);

            const response = await matchDreamHouse(formData);

            if (response.ok) {
                setResults(response.results || []);
                setKeywords(response.keywords || []);
            } else {
                setError(response.error || "Failed to analyze image.");
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="font-sans text-slate-900 relative">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 mb-4 transition-colors hover:bg-slate-200">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[11px] font-semibold tracking-wide uppercase">AI Vision Matcher</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
                    Dream House Matcher
                </h1>
                <p className="text-base md:text-lg text-slate-500 max-w-2xl leading-relaxed">
                    Show us your inspiration. Upload a photo of your dream home, and our intelligence engine will analyze the architecture, vibe, and features to find the closest matches in our active inventory.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Uploader */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-4 space-y-6"
                >
                    {/* Upload Card */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            className={cn(
                                "group relative border-2 border-dashed border-slate-200 rounded-2xl p-8 transition-all duration-300 overflow-hidden bg-slate-50/50 hover:bg-slate-100/50 hover:border-emerald-300 cursor-pointer",
                                previewUrl ? "border-transparent p-0 border-solid" : ""
                            )}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />

                            {previewUrl ? (
                                <div className="relative aspect-[4/3] w-full group/preview">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-full h-full object-cover rounded-2xl"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center rounded-2xl backdrop-blur-sm">
                                        <div className="flex flex-col items-center text-white">
                                            <Upload className="w-8 h-8 mb-2" />
                                            <span className="font-semibold">Change Photo</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={clearSelection}
                                        className="absolute top-3 right-3 bg-white hover:bg-slate-100 text-slate-500 hover:text-rose-500 w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm z-10"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-slate-400 py-8">
                                    <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300 border border-slate-100">
                                        <ImageIcon className="w-6 h-6 text-slate-400" />
                                    </div>
                                    <p className="text-sm font-semibold text-slate-600">Upload Inspiration</p>
                                    <p className="text-xs mt-1 text-slate-400">JPG/PNG only</p>
                                </div>
                            )}
                        </div>

                        {/* Explicit Upload Button */}
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-sm font-semibold transition-colors shadow-sm"
                        >
                            <Upload className="w-4 h-4" />
                            {previewUrl ? "Change Required Image" : "Select Image File"}
                        </button>
                    </div>

                    {/* Actions Card */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
                        <button
                            onClick={() => {
                                if (isGuest) {
                                    router.push(`/auth/login?callbackUrl=${encodeURIComponent(window.location.href)}`);
                                    return;
                                }
                                analyzeImage();
                            }}
                            disabled={!isGuest && (!file || isAnalyzing)}
                            className={cn(
                                "w-full py-3.5 text-sm font-bold rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center gap-2",
                                isGuest 
                                    ? "bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200 cursor-pointer"
                                    : "bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed",
                                !isAnalyzing && file && !isGuest ? "hover:-translate-y-0.5 hover:shadow-md" : ""
                            )}
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin text-slate-300" />
                                    <span>Scanning Inventory...</span>
                                </>
                            ) : isGuest ? (
                                <>
                                    <Lock className="w-4 h-4" />
                                    <span>Sign in to Match</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 text-emerald-400" />
                                    <span>Find Matches</span>
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </>
                            )}
                        </button>
                        {isGuest && (
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-400 justify-center">
                                <Info className="w-3 h-3" />
                                <span>Please sign in to use Haven AI</span>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-medium flex items-start gap-3">
                            <Info className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
                            <p>{error}</p>
                        </div>
                    )}
                </motion.div>

                {/* Right Column: Results */}
                <div className="lg:col-span-8">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="h-full"
                    >
                        {!isAnalyzing && results.length === 0 && !error ? (
                            <div className="h-full min-h-[500px] flex items-center justify-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400">
                                <div className="text-center p-8 max-w-md">
                                    <div className="w-20 h-20 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-5 border border-slate-100">
                                        <Home className="w-8 h-8 text-slate-300" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-700 mb-2">Awaiting Inspiration</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">
                                        Upload an inspiration photo to discover visually similar properties actively listed on the market.
                                    </p>
                                </div>
                            </div>
                        ) : null}

                        {isAnalyzing ? (
                            <div className="h-full bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center p-12 text-center min-h-[500px]">
                                <CreativeLoader type="dream" />
                            </div>
                        ) : null}

                        {!isAnalyzing && results.length > 0 && (
                            <div ref={resultsRef} className="space-y-6">
                                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <div className="p-2 bg-emerald-50 rounded-xl">
                                                    <Sparkles className="w-5 h-5 text-emerald-600" />
                                                </div>
                                                <h3 className="text-xl font-bold text-slate-900">Analysis Results</h3>
                                            </div>
                                            <p className="text-sm font-medium text-slate-500 mt-2">
                                                Matched <span className="font-bold text-slate-900">{results.length} properties</span> based on identified features
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-2 max-w-md justify-end">
                                            {keywords.slice(0, 5).map((kw, i) => (
                                                <span key={i} className="text-[11px] font-bold px-2.5 py-1.5 bg-slate-100 text-slate-600 rounded-lg border border-slate-200 uppercase tracking-wider">
                                                    {kw}
                                                </span>
                                            ))}
                                            {keywords.length > 5 && (
                                                <span className="text-[11px] font-bold px-2.5 py-1.5 bg-slate-50 border border-slate-100 text-slate-400 rounded-lg uppercase tracking-wider">
                                                    +{keywords.length - 5}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <AnimatePresence>
                                        {results.map((prop, idx) => (
                                            <div key={prop.id} className="relative group/card-wrapper h-[400px]">
                                                <div className="absolute inset-0">
                                                    <div className="[&>div]:h-full h-full">
                                                        <PropertyCard property={prop} index={0} />
                                                    </div>
                                                </div>
                                                {prop.matchScore > 0 && (
                                                    <div className="absolute top-4 left-[90px] z-10 pointer-events-none">
                                                        <div className="bg-emerald-900/95 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl shadow-sm border border-emerald-800/50 flex items-center gap-1">
                                                            <Sparkles className="w-3 h-3 text-emerald-200" />
                                                            {prop.matchScore} pts Match
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Results Found Badge (Mobile Only) */}
            <AnimatePresence>
                {showResultsBadge && results.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className="fixed bottom-6 left-0 right-0 z-[60] flex justify-center px-4 md:hidden pointer-events-none"
                    >
                        <button
                            onClick={() => {
                                resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                                setShowResultsBadge(false);
                            }}
                            className="bg-slate-900 text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 border border-slate-800 pointer-events-auto active:scale-95 transition-transform"
                        >
                            <div className="bg-emerald-500 rounded-full p-1">
                                <Sparkles size={14} className="text-white" />
                            </div>
                            <span className="font-bold text-sm tracking-tight">{results.length} Matches Found! View Results</span>
                            <Info size={14} className="text-slate-400" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
