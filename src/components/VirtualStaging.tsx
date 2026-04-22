"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Wand2, Image as ImageIcon, Loader2, Info, X, Lock, Sparkles } from "lucide-react";
import CreativeLoader from "@/components/ui/CreativeLoader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import Image from "next/image";

interface VirtualStagingProps {
    initialImage?: string;
    onClose?: () => void;
    propertyId?: string;
    leadId?: string;
}

export default function VirtualStaging({ initialImage, onClose, propertyId, leadId }: VirtualStagingProps) {
    const [originalImage, setOriginalImage] = useState<string | null>(initialImage || null);
    const [stagedImage, setStagedImage] = useState<string | null>(null);
    const [stylePrompt, setStylePrompt] = useState("");
    const [creativity, setCreativity] = useState(0.5);
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);
    const [showResultsBadge, setShowResultsBadge] = useState(false);
    const { status } = useSession();
    const router = useRouter();
    const isGuest = status === "unauthenticated";

    const [estimation, setEstimation] = useState<{
        renovationItems: { item: string; description: string; costRange: string }[];
        furnitureItems: { item: string; description: string; costRange: string }[];
        totalCost: string;
        summary: string;
    } | null>(null);
    const [isEstimating, setIsEstimating] = useState(false);

    useEffect(() => {
        if (initialImage) {
            setOriginalImage(initialImage);
            setStagedImage(null);
            setAnalysis(null);
            setError(null);
            setEstimation(null);
            setShowResultsBadge(false);
        }
    }, [initialImage]);

    // Scroll to results on mobile after generation
    useEffect(() => {
        if (stagedImage && typeof window !== "undefined" && window.innerWidth < 768) {
            const timer = setTimeout(() => {
                resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                setShowResultsBadge(true);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [stagedImage]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setError("File size too large. Please upload an image under 5MB.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setOriginalImage(event.target?.result as string);
            setStagedImage(null);
            setAnalysis(null);
            setError(null);
            setEstimation(null);
        };
        reader.readAsDataURL(file);
    };

    const handleGenerate = async () => {
        if (!originalImage || !stylePrompt) return;

        setIsLoading(true);
        setError(null);
        setAnalysis(null);

        try {
            const response = await fetch("/api/virtual-staging", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: originalImage, style: stylePrompt, creativity }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate image");
            }

            const data = await response.json();

            if (data.generationError) {
                setError(data.generationError);
            }

            if (data.stagedImage) {
                setStagedImage(data.stagedImage);
                // Auto-trigger estimation with the new image
                handleEstimate(originalImage, data.stagedImage);
            }

            if (data.analysis) {
                setAnalysis(data.analysis);
            } else if (data.stagedImage) {
                setAnalysis("Analysis data unavailable, but image generation succeeded.");
            } else if (!data.generationError) {
                console.error("Missing data in response:", data);
                throw new Error("Invalid response from API");
            }
        } catch (err) {
            setError("Failed to process image. Please try again.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEstimate = async (imgOriginal: string | null = originalImage, imgStaged: string | null = stagedImage) => {
        if (!imgOriginal || !imgStaged) return;

        setIsEstimating(true);
        setError(null);

        try {
            const response = await fetch("/api/virtual-staging/estimate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    originalImage: imgOriginal,
                    stagedImage: imgStaged,
                    style: stylePrompt,
                    propertyId,
                    leadId
                }),
            });

            if (!response.ok) throw new Error("Failed to generate estimate");

            const data = await response.json();
            setEstimation(data);
        } catch (err) {
            console.error(err);
            // We don't want to show a main error if just estimation fails, maybe just log it
            // or show a subtle notification. For now, we'll leave the existing error state but it might overwrite generation error?
            // Actually, handleGenerate clears error. 
        } finally {
            setIsEstimating(false);
        }
    };

    return (
        <div className="font-sans text-zinc-900 relative">
            {onClose && (
                <button
                    onClick={onClose}
                    className="absolute -top-2 -right-2 p-2 bg-white rounded-full shadow-lg hover:bg-stone-50 transition-colors z-50 text-stone-500 hover:text-stone-800"
                >
                    <X size={20} />
                </button>
            )}
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <h1 className="text-3xl md:text-4xl font-heading font-medium text-emerald-900 mb-3 tracking-tight">
                    Virtual Staging
                </h1>
                <p className="text-base md:text-lg text-stone-500 max-w-2xl">
                    Reimagine spaces with AI. Upload a photo, choose a style, and let our engine redesign the room while preserving its structure.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Controls Area (Left Column) */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-4 space-y-6"
                >
                    {/* Upload Card */}
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200/60">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={cn(
                                "group relative border-2 border-dashed border-stone-200 rounded-2xl p-8 transition-all duration-300 cursor-pointer overflow-hidden bg-stone-50/50 hover:bg-stone-100 hover:border-emerald-200",
                                originalImage ? "border-transparent p-0" : ""
                            )}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />

                            {originalImage ? (
                                <div className="relative aspect-[4/3] w-full">
                                    <Image
                                        src={originalImage}
                                        alt="Original"
                                        fill
                                        className="object-cover rounded-2xl"
                                        unoptimized
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl backdrop-blur-sm">
                                        <div className="flex flex-col items-center text-white">
                                            <Upload className="w-8 h-8 mb-2" />
                                            <span className="font-medium">Change Photo</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-stone-400 py-8">
                                    <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300 border border-stone-100">
                                        <ImageIcon className="w-6 h-6 text-emerald-900/60" />
                                    </div>
                                    <p className="text-sm font-medium text-stone-600">Upload Image</p>
                                    <p className="text-xs mt-1 text-stone-400">JPG/PNG · Max 5MB</p>
                                </div>
                            )}
                        </div>

                        {/* Explicit Upload Button */}
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 hover:border-emerald-300 text-stone-600 hover:text-emerald-900 text-sm font-medium transition-all duration-200"
                        >
                            <Upload className="w-4 h-4" />
                            {originalImage ? "Change Photo" : "Upload Photo"}
                        </button>
                    </div>

                    {/* Inputs Card */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/60 space-y-6">

                        {/* Creativity Slider */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                                    <Wand2 className="w-3.5 h-3.5" /> Mode
                                </label>
                                <span className={cn(
                                    "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide",
                                    creativity < 0.6 ? "bg-emerald-100 text-emerald-800" : "bg-purple-100 text-purple-800"
                                )}>
                                    {creativity < 0.6 ? "Structure Preservation" : "Creative Redesign"}
                                </span>
                            </div>

                            <input
                                type="range"
                                min="0.1"
                                max="1.0"
                                step="0.1"
                                value={creativity}
                                onChange={(e) => setCreativity(parseFloat(e.target.value))}
                                className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                            />
                            <div className="flex justify-between text-[10px] uppercase font-medium text-stone-400 tracking-wide">
                                <span>Subtle Edit</span>
                                <span>Total Makeover</span>
                            </div>
                        </div>

                        {/* Style Prompt */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                                Desired Style
                            </label>
                            <textarea
                                value={stylePrompt}
                                onChange={(e) => setStylePrompt(e.target.value)}
                                placeholder="Describe the look (e.g., 'Modern Scandinavian with light oak wood, white walls, and soft beige textiles')."
                                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-zinc-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all min-h-[100px] resize-none text-sm leading-relaxed"
                            />
                        </div>

                        {/* Generate Button */}
                        <button
                            onClick={() => {
                                if (isGuest) {
                                    router.push(`/auth/login?callbackUrl=${encodeURIComponent(window.location.href)}`);
                                    return;
                                }
                                handleGenerate();
                            }}
                            disabled={!isGuest && (!originalImage || !stylePrompt || isLoading)}
                            className={cn(
                                "w-full py-3.5 text-sm font-semibold rounded-xl transition-all duration-300 transform shadow-sm flex items-center justify-center gap-2",
                                isGuest 
                                    ? "bg-stone-200 text-stone-600 hover:bg-stone-300 border border-stone-300"
                                    : "bg-emerald-900 text-white hover:bg-emerald-800",
                                !isLoading && originalImage && stylePrompt ? "hover:translate-y-[-1px] hover:shadow-md" : ""
                            )}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin text-emerald-200" />
                                    <span>Designing...</span>
                                </>
                            ) : isGuest ? (
                                <>
                                    <Lock className="w-4 h-4" />
                                    <span>Login to Design</span>
                                </>
                            ) : (
                                <>
                                    <Wand2 className="w-4 h-4" />
                                    <span>Generate Design</span>
                                </>
                            )}
                        </button>
                        {isGuest && (
                            <div className="flex items-center gap-2 text-[10px] text-stone-400 justify-center">
                                <Info className="w-3 h-3" />
                                <span>Please log in to use AI features</span>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-start gap-3">
                            <Info className="w-5 h-5 shrink-0 mt-0.5" />
                            <p>{error}</p>
                        </div>
                    )}
                </motion.div>

                <div className="lg:col-span-8 space-y-6">
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="h-full min-h-[500px] flex items-center justify-center bg-white rounded-3xl border border-dashed border-stone-200/80 shadow-sm"
                            >
                                <CreativeLoader type="staging" />
                            </motion.div>
                        ) : stagedImage ? (
                            <motion.div
                                ref={resultsRef}
                                key="result"
                                initial={{ opacity: 0, scale: 0.99 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6"
                            >
                                <div className="relative aspect-video w-full rounded-3xl overflow-hidden shadow-lg border border-stone-200 bg-stone-100 group">
                                    <BeforeAfterSlider
                                        beforeImage={originalImage || ""}
                                        afterImage={stagedImage}
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-stone-700 px-3 py-1.5 rounded-full text-xs font-bold pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 shadow-sm">
                                        <span>↔ Drag to compare</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Analysis Card */}
                                    {analysis && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 }}
                                            className="bg-white rounded-3xl p-6 border border-stone-200/60 shadow-sm"
                                        >
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 bg-emerald-50 rounded-lg">
                                                    <Wand2 className="w-5 h-5 text-emerald-900" />
                                                </div>
                                                <h3 className="text-lg font-heading font-medium text-emerald-900">Design Analysis</h3>
                                            </div>
                                            <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-line">
                                                {analysis}
                                            </p>
                                        </motion.div>
                                    )}

                                    {/* Estimation Card */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="bg-white rounded-3xl p-6 border border-stone-200/60 shadow-sm"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-50 rounded-lg">
                                                    <Info className="w-5 h-5 text-blue-900" />
                                                </div>
                                                <h3 className="text-lg font-heading font-medium text-emerald-900">Renovation Estimate</h3>
                                            </div>
                                            {!estimation && (
                                                <button
                                                    onClick={() => {
                                                        if (isGuest) {
                                                            router.push(`/auth/login?callbackUrl=${encodeURIComponent(window.location.href)}`);
                                                            return;
                                                        }
                                                        handleEstimate();
                                                    }}
                                                    disabled={!isGuest && isEstimating}
                                                    className={cn(
                                                        "px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2",
                                                        isGuest 
                                                            ? "bg-stone-100 text-stone-600 hover:bg-stone-200"
                                                            : "bg-stone-100 hover:bg-stone-200 text-stone-700"
                                                    )}
                                                >
                                                    {isGuest ? <Lock size={12} /> : null}
                                                    {isEstimating ? "Calculating..." : "Recalculate Estimate"}
                                                </button>
                                            )}
                                        </div>

                                        {estimation ? (
                                            <div className="space-y-4">
                                                <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                                                    <p className="text-xs text-emerald-800 font-bold uppercase tracking-wide mb-1">Estimated Total Cost</p>
                                                    <p className="text-2xl font-bold text-emerald-900">{estimation.totalCost}</p>
                                                </div>

                                                <div className="space-y-2">
                                                    <p className="text-xs font-bold text-stone-400 uppercase tracking-wide">Renovation Details</p>
                                                    {(estimation.renovationItems || []).map((item, idx) => (
                                                        <div key={idx} className="flex justify-between text-sm py-1 border-b border-stone-100 last:border-0">
                                                            <span className="text-stone-700">{item.item}</span>
                                                            <span className="font-medium text-stone-900">{item.costRange}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {(estimation.furnitureItems || []).length > 0 && (
                                                    <div className="space-y-2 pt-2">
                                                        <p className="text-xs font-bold text-stone-400 uppercase tracking-wide">Furniture & Decor</p>
                                                        {(estimation.furnitureItems || []).map((item, idx) => (
                                                            <div key={idx} className="flex justify-between text-sm py-1 border-b border-stone-100 last:border-0">
                                                                <span className="text-stone-700">{item.item}</span>
                                                                <span className="font-medium text-stone-900">{item.costRange}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                <p className="text-xs text-stone-400 italic pt-2">
                                                    *Estimates are based on average market rates and may vary by location.
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-stone-500 text-sm">
                                                Wondering how much this renovation would cost? Click above to get an AI-powered estimation based on the changes.
                                            </p>
                                        )}
                                    </motion.div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="placeholder"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full min-h-[500px] flex items-center justify-center bg-white rounded-3xl border border-dashed border-stone-200 text-stone-400"
                            >
                                <div className="text-center p-8 max-w-md">
                                    <div className="w-20 h-20 mx-auto bg-stone-50 rounded-full flex items-center justify-center mb-5 border border-stone-100">
                                        <Wand2 className="w-8 h-8 text-stone-300" />
                                    </div>
                                    <h3 className="text-xl font-heading font-medium text-stone-700 mb-2">Ready to Design</h3>
                                    <p className="text-stone-500 text-sm">
                                        Select your photo and style preferences from the panel to start the transformation engine.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Results Found Badge (Mobile Only) */}
            <AnimatePresence>
                {showResultsBadge && stagedImage && (
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
                            className="bg-emerald-900 text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 border border-emerald-800 pointer-events-auto active:scale-95 transition-transform"
                        >
                            <div className="bg-emerald-500 rounded-full p-1">
                                <Sparkles size={14} className="text-white" />
                            </div>
                            <span className="font-bold text-sm tracking-tight">Design Ready! View Results</span>
                            <Info size={14} className="text-emerald-400" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
