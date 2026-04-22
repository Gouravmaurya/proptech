"use client";

import { useEffect, useState, use, useMemo } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowLeft, MapPin, BedDouble, Bath, Square, Calendar, DollarSign, TrendingUp,
    Activity, CheckCircle2, XCircle, Sparkles, GraduationCap, Stethoscope, ShieldCheck,
    HeartHandshake, Clock, Ruler, Building2, ExternalLink, Home, Banknote, BarChart3, Tag,
    ChevronLeft, ChevronRight, Images, X, Brain, MessageSquare, AlertTriangle, Target, TrendingDown,
    Phone, Mail, User, RefreshCw, Wand2, Heart, LogIn, History
} from "lucide-react";
import PropertyHistory from '@/components/property/PropertyHistory';
import NearbySchools from '@/components/property/NearbySchools';
import SimilarProperties from '@/components/property/SimilarProperties';
import { parsePriceHistory, parseTaxHistory, parseSchools } from '@/lib/property-parser';
import GatedSection from "@/components/ui/GatedSection";
import AuthRequiredModal from "@/components/ui/AuthRequiredModal";
import { getLead } from "@/app/actions/dashboard";
import { motion, AnimatePresence } from "framer-motion";
import { project10Years } from "@/lib/ai-engine";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Legend
} from "recharts";
import { generatePropertyAnalysis, generatePropertyProjection } from "@/app/actions/ai";
import { togglePropertySave, checkPropertySaved } from "@/app/actions/user";
import VirtualStaging from "@/components/VirtualStaging";
import PropertySkeleton from "@/components/ui/PropertySkeleton";
import AgentCommunication from "@/components/dashboard/AgentCommunication";

export default function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const pathname = usePathname();
    const [lead, setLead] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeMapLayer, setActiveMapLayer] = useState<string>("property");
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [showGallery, setShowGallery] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isStagingModalOpen, setIsStagingModalOpen] = useState(false);
    const [aiProjections, setAiProjections] = useState<any>(null);
    const [projectionLoading, setProjectionLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const { data: session } = useSession();

    const layers = [
        { id: "property", label: "Home", icon: MapPin },
        { id: "schools", label: "Schools", icon: GraduationCap },
        { id: "hospitals", label: "Medical", icon: Stethoscope },
        { id: "public_safety", label: "Safety", icon: ShieldCheck },
    ];

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 200);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setShowGallery(false);
                setIsStagingModalOpen(false);
            }
            if (e.key === 'ArrowRight') {
                setSelectedImageIndex(prev => (lead?.images && prev < lead.images.length - 1 ? prev + 1 : 0));
            }
            if (e.key === 'ArrowLeft') {
                setSelectedImageIndex(prev => (prev > 0 ? prev - 1 : lead?.images ? lead.images.length - 1 : 0));
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lead]);

    // ... inside component ...

    useEffect(() => {
        fetch(`/api/leads/${id}`)
            .then(res => res.json())
            .then(async (data) => {
                if (data.error) {
                    setLoading(false);
                    return;
                }
                setLead(data);
                setLoading(false);

                if (!data) return;

                // Run analysis + projection in PARALLEL — saves ~2-3 seconds vs sequential
                const [analysisResult, projResult] = await Promise.allSettled([
                    // On-demand AI Analysis (only if not already cached)
                    (!data.analysis?.aiRecommendation)
                        ? generatePropertyAnalysis(data.id)
                        : Promise.resolve(null),
                    // On-demand AI Projection
                    generatePropertyProjection(data.id),
                ]);

                // Apply analysis result
                const analysisValue = analysisResult.status === 'fulfilled' ? analysisResult.value : null;
                if (analysisValue && analysisValue.ok && analysisValue.recommendation) {
                    setLead((prev: any) => ({
                        ...prev,
                        analysis: {
                            ...prev.analysis,
                            aiRecommendation: analysisValue.recommendation
                        }
                    }));
                }

                // Apply projection result
                setProjectionLoading(true);
                if (projResult.status === 'fulfilled' && projResult.value?.ok && projResult.value.data) {
                    setAiProjections(projResult.value.data);
                }
                setProjectionLoading(false);
            })
            .catch(err => {
                console.error("Fetch error:", err);
                setLoading(false);
            });

        // Check if saved (independent — runs in parallel with data load)
        checkPropertySaved(id).then(setIsSaved).catch(console.error);
    }, [id]);

    const handleSave = async () => {
        if (!session?.user) {
            setShowAuthModal(true);
            return;
        }
        setIsSaved(!isSaved); // Optimistic
        try {
            await togglePropertySave(id);
        } catch (error) {
            console.error("Failed to save:", error);
            setIsSaved(!isSaved);
        }
    };

    const handleRefreshAnalysis = async () => {
        setIsRefreshing(true);
        try {
            const result = await generatePropertyAnalysis(id, true);
            if (result.ok && result.recommendation) {
                // Parse once, reuse for both verdict and score
                const parsed = JSON.parse(result.recommendation);
                setLead((prev: any) => ({
                    ...prev,
                    analysis: {
                        ...prev.analysis,
                        aiRecommendation: result.recommendation,
                        verdict: parsed.verdict || prev.analysis?.verdict,
                        score: parsed.score || prev.analysis?.score,
                    }
                }));
            }
        } catch (error) {
            console.error("Failed to refresh analysis:", error);
        } finally {
            setIsRefreshing(false);
        }
    };

    // These hook calculations must come BEFORE any early returns
    const p = lead?.property;
    const a = lead?.analysis;
    const fin = a?.financials;

    // Calculate 10-year price projection (fallback formula)
    const fallbackPredictionData = useMemo(() => {
        if (!p) return [];
        const price = p.price || 500000;
        const appreciation = fin?.expectedAppreciation || 3.5;
        const annualCashFlow = fin?.annualCashFlow || (price * 0.06);

        const projections = project10Years({
            purchasePrice: price,
            expectedAppreciationPct: appreciation,
            annualNetCashFlowYear1: annualCashFlow,
            rentGrowthPct: 3
        });

        return [
            { year: 0, price: price, noi: annualCashFlow, cumulativeReturn: 0 },
            ...projections
        ];
    }, [p?.price, fin]);

    // Use AI projections when available, otherwise use fallback formula
    const predictionData = useMemo(() => {
        if (aiProjections?.projections?.length > 0 && p) {
            const price = p.price || 500000;
            const annualCashFlow = fin?.annualCashFlow || (price * 0.06);
            return [
                { year: 0, price: price, noi: annualCashFlow, cumulativeReturn: 0 },
                ...aiProjections.projections
            ];
        }
        return fallbackPredictionData;
    }, [aiProjections, fallbackPredictionData, p?.price, fin]);

    // Generate AI detailed opinion based on property data
    const generateAIOpinion = useMemo(() => {
        // Try to parse AI JSON result first
        if (a?.aiRecommendation) {
            try {
                const parsed = JSON.parse(a.aiRecommendation);
                return {
                    summary: parsed.summary || "",
                    strengths: parsed.strengths || [],
                    concerns: parsed.concerns || [],
                    recommendation: parsed.verdict || "Analysis Complete",
                    priceAssessment: parsed.priceAssessment || "",
                    score: parsed.score || a.score || 5 // Ensure score is extracted
                };
            } catch (e) {
                // If it's old text format, wrap it
                return {
                    summary: a.aiRecommendation,
                    strengths: [],
                    concerns: [],
                    recommendation: a.verdict || "See Analysis",
                    priceAssessment: "",
                    score: a.score || 5
                };
            }
        }

        // Fallback: Show loading or empty state if no Analysis yet
        return {
            summary: "Analyzing property data...",
            strengths: [],
            concerns: [],
            recommendation: "Pending...",
            priceAssessment: "",
            score: 0
        };
    }, [a]);

    // Format lot area
    const formatLotArea = () => {
        if (!p?.lotArea) return null;
        const unit = p.lotAreaUnit || 'sqft';
        if (unit === 'acres') {
            return `${p.lotArea.toFixed(2)} acres`;
        }
        return `${Math.round(p.lotArea).toLocaleString()} sqft`;
    };

    // Early returns AFTER all hooks
    if (loading) return <PropertySkeleton />;

    // ... [Rest of renders] ...

    if (!lead || !p) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Property Not Found</h1>
                <Link href="/dashboard" className="text-emerald-600 hover:underline">Return to Dashboard</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Auth Required Modal */}
            <AuthRequiredModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                message="Save properties, track your portfolio, and get personalised AI insights by creating a free Haven account."
            />
            {/* Morphing Sticky Navbar */}
            <AnimatePresence>
                {scrolled && (
                    <motion.div
                        initial={{ y: -100, opacity: 0, scale: 0.92 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: -60, opacity: 0, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-6xl"
                    >
                        <div className="relative bg-white/70 backdrop-blur-2xl rounded-2xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
                            {/* Subtle gradient accent line at top */}
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-400 via-indigo-400 to-purple-400 opacity-80" />

                            <div className="px-6 py-4 flex items-center justify-between gap-5">
                                {/* Left: Back + Property Info */}
                                <div className="flex items-center gap-3 min-w-0">
                                    <Link
                                        href="/dashboard"
                                        className="group flex items-center gap-2 text-base font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 px-4 py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 shrink-0"
                                    >
                                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                                        Back
                                    </Link>
                                    <div className="h-10 w-px bg-slate-200/60 shrink-0" />
                                    <div className="min-w-0">
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 }}
                                            className="text-base font-bold text-slate-900 truncate max-w-[220px] md:max-w-[350px]"
                                        >
                                            {lead.title}
                                        </motion.div>
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.15 }}
                                            className="flex items-center gap-1.5 text-sm text-slate-500 truncate"
                                        >
                                            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                            {p.city}, {p.state}
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Right: AI Verdict + Price */}
                                <div className="flex items-center gap-4 shrink-0">
                                    {a && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
                                            className="hidden sm:flex items-center gap-2"
                                        >
                                            {/* AI Score Ring */}
                                            <div className={`relative w-11 h-11 rounded-full flex items-center justify-center ${a.verdict === 'Excellent' ? 'bg-indigo-50' :
                                                a.verdict === 'Good' ? 'bg-emerald-50' :
                                                    'bg-slate-50'
                                                }`}>
                                                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                                                    <circle cx="18" cy="18" r="15" fill="none" stroke="#e2e8f0" strokeWidth="2.5" />
                                                    <circle
                                                        cx="18" cy="18" r="15" fill="none"
                                                        stroke={a.verdict === 'Excellent' ? '#6366f1' : a.verdict === 'Good' ? '#10b981' : '#94a3b8'}
                                                        strokeWidth="2.5"
                                                        strokeDasharray={`${(a.score || 5) * 9.42} 94.2`}
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                                <span className={`text-sm font-black ${a.verdict === 'Excellent' ? 'text-indigo-600' :
                                                    a.verdict === 'Good' ? 'text-emerald-600' :
                                                        'text-slate-600'
                                                    }`}>{a.score || '–'}</span>
                                            </div>
                                            <div className="hidden md:block">
                                                <div className={`text-xs font-bold uppercase tracking-wider ${a.verdict === 'Excellent' ? 'text-indigo-600' :
                                                    a.verdict === 'Good' ? 'text-emerald-600' :
                                                        'text-slate-500'
                                                    }`}>{a.verdict}</div>
                                                <div className="text-xs text-slate-400">Haven AI Verdict</div>
                                            </div>
                                        </motion.div>
                                    )}
                                    <div className="h-10 w-px bg-slate-200/60 hidden sm:block" />
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.25, type: 'spring', stiffness: 400 }}
                                        className="relative"
                                    >
                                        <div className="text-xl font-black text-slate-900 tracking-tight">
                                            ${p.price?.toLocaleString()}
                                        </div>
                                        <div className="text-xs text-slate-400 font-medium text-right">List Price</div>
                                    </motion.div>
                                    {!session?.user && (
                                        <Link
                                            href={`/auth/login?callbackUrl=${encodeURIComponent(pathname)}`}
                                            className="hidden sm:flex items-center gap-1.5 bg-slate-900 hover:bg-emerald-600 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all duration-200 shadow-sm"
                                        >
                                            <LogIn className="w-3.5 h-3.5" />
                                            Log In
                                        </Link>
                                    )}
                                    {session?.user && (
                                        <button
                                            onClick={handleSave}
                                            className={`p-2.5 rounded-xl transition-all duration-200 border ${
                                                isSaved
                                                    ? 'bg-rose-50 border-rose-200 text-rose-500'
                                                    : 'bg-white border-slate-200 text-slate-400 hover:border-rose-200 hover:text-rose-400'
                                            }`}
                                        >
                                            <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Original Back Button (visible at top) */}
            <div className="max-w-7xl mx-auto px-6 pt-6">
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 hover:border-emerald-200">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-6 space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                                {p.status || 'Active'}
                            </span>
                            {a && (
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${a.verdict === 'Excellent' ? 'bg-indigo-100 text-indigo-700' : a.verdict === 'Good' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                                    {a.verdict} Deal
                                </span>
                            )}
                            {p.daysOnMarket !== null && p.daysOnMarket !== undefined && (
                                <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {p.daysOnMarket} days on market
                                </span>
                            )}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                            {lead.title}
                        </h1>
                        <div className="flex items-center gap-2 text-slate-500 font-medium">
                            <MapPin className="w-4 h-4 text-emerald-500" />
                            {p.address}, {p.city}, {p.state} {p.zip}
                        </div>
                        {/* External Source Link Removed */}
                    </div>

                    <div className="flex flex-col md:items-end gap-3">
                        <div className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                            ${p.price?.toLocaleString()}
                        </div>
                        {p.zestimate && (
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-slate-400 font-medium">Est. Value:</span>
                                <span className={`font-bold ${p.zestimate > p.price ? 'text-emerald-600' : 'text-amber-600'}`}>
                                    ${p.zestimate?.toLocaleString()}
                                </span>
                                {p.zestimate > p.price && (
                                    <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                                        Below Market
                                    </span>
                                )}
                            </div>
                        )}
                        <p className="text-sm text-slate-400 font-medium">Listing Price</p>

                        {/* Save / Auth CTA row under price */}
                        <div className="flex items-center gap-3 mt-1">
                            <button
                                onClick={handleSave}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 border shadow-sm ${
                                    isSaved
                                        ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                                        : 'bg-white border-slate-200 text-slate-600 hover:border-rose-300 hover:text-rose-500'
                                }`}
                            >
                                <Heart className={`w-4 h-4 transition-all ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                                {isSaved ? 'Saved' : 'Save Property'}
                            </button>
                            {!session?.user && (
                                <Link
                                    href={`/auth/login?callbackUrl=${encodeURIComponent(pathname)}`}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-slate-900 text-white hover:bg-emerald-600 transition-all duration-200 shadow-sm"
                                >
                                    <LogIn className="w-4 h-4" />
                                    Log in to unlock AI Insights
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Hero Section: Image Gallery + Map */}
                <div className="flex flex-col md:grid md:grid-cols-2 gap-4 h-auto md:h-[400px]">
                    <div className="relative h-[300px] md:h-full rounded-2xl overflow-hidden shadow-sm group">
                        {/* Virtual Stage Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsStagingModalOpen(true);
                            }}
                            className="absolute top-4 right-4 bg-white/90 hover:bg-white text-emerald-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg backdrop-blur-sm transition-all transform hover:scale-105 z-20 opacity-100 md:opacity-0 group-hover:opacity-100"
                        >
                            <Wand2 className="w-3.5 h-3.5" />
                            Virtual Stage
                        </button>

                        {/* Main Image */}
                        <div
                            className="absolute inset-0 z-10 cursor-pointer"
                            onClick={(e) => {
                                if (p.images?.length > 1) {
                                    // Calculate if click was on left or right half
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const clickX = e.clientX - rect.left;
                                    const isRightHalf = clickX > rect.width / 2;

                                    if (isRightHalf) {
                                        setSelectedImageIndex(prev => prev < p.images.length - 1 ? prev + 1 : 0);
                                    } else {
                                        setSelectedImageIndex(prev => prev > 0 ? prev - 1 : p.images.length - 1);
                                    }
                                }
                            }}
                        >
                            <Image
                                src={p.images?.length > 0 ? p.images[selectedImageIndex] : p.mainImage}
                                alt={`Property image ${selectedImageIndex + 1}`}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>

                        {/* Image Navigation Arrows */}
                        {p.images?.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedImageIndex(prev => prev > 0 ? prev - 1 : p.images.length - 1);
                                    }}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-md text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 z-20"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedImageIndex(prev => prev < p.images.length - 1 ? prev + 1 : 0);
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-md text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 z-20"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </>
                        )}

                        {/* Image Counter & Gallery Button */}
                        <div className="absolute bottom-3 left-3 flex items-center gap-2 z-10">
                            <div className="bg-black/50 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5" />
                                {p.address}
                            </div>
                            {p.images?.length > 1 && (
                                <button
                                    onClick={() => setShowGallery(true)}
                                    className="bg-black/50 hover:bg-black/70 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors"
                                >
                                    <Images className="w-3.5 h-3.5" />
                                    {selectedImageIndex + 1} / {p.images.length}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Map Embed & Controls */}
                    <div className="flex flex-col h-[300px] md:h-full gap-3">
                        <div className="relative flex-1 rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-100 group">
                            {/* Floating Map Controls */}
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-full shadow-lg border border-slate-100/50 scale-90 md:scale-100 transition-all opacity-90 hover:opacity-100">
                                {layers.map((layer) => (
                                    <button
                                        key={layer.id}
                                        onClick={() => setActiveMapLayer(layer.id)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${activeMapLayer === layer.id
                                            ? 'bg-slate-900 text-white shadow-md transform scale-105'
                                            : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                                            }`}
                                    >
                                        <layer.icon className={`w-3.5 h-3.5 ${activeMapLayer === layer.id ? 'text-emerald-400' : ''}`} />
                                        {layer.label}
                                    </button>
                                ))}
                            </div>

                            {/* Dynamic Map Iframe */}
                            <iframe
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                loading="lazy"
                                allowFullScreen
                                referrerPolicy="no-referrer-when-downgrade"
                                src={`https://maps.google.com/maps?q=${activeMapLayer === 'property'
                                    ? encodeURIComponent(`${p.address}, ${p.city}, ${p.state}`)
                                    : encodeURIComponent(`${activeMapLayer.replace('public_safety', 'police fire station').replace('_', ' ')} near ${p.address}, ${p.city}, ${p.state}`)
                                    }&t=&z=${activeMapLayer === 'property' ? 15 : 13}&ie=UTF8&iwloc=&output=embed`}
                                className="transition-all duration-700 ease-in-out"
                            />

                            <div className={`absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-medium shadow-sm border border-slate-100 pointer-events-none transition-opacity duration-300 ${activeMapLayer !== 'property' ? 'opacity-0' : 'opacity-100'}`}>
                                <span className="text-slate-400 mr-1">Loc:</span> {p.city}, {p.state}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Thumbnail Strip */}
                {p.images?.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-4 pt-1 px-1 snap-x scroll-smooth overflow-y-hidden"
                        style={{
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#cbd5e1 #f1f5f9'
                        }}>
                        {p.images.map((img: string, idx: number) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedImageIndex(idx)}
                                className={`relative flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden transition-all duration-200 ${selectedImageIndex === idx ? 'ring-2 ring-emerald-500 ring-offset-2' : 'opacity-70 hover:opacity-100'}`}
                            >
                                <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                            </button>
                        ))}
                    </div>
                )}

                {/* Market Data Bar - Updated with Build Year */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {p.daysOnMarket !== null && p.daysOnMarket !== undefined && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm"
                        >
                            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase mb-1">
                                <Clock className="w-4 h-4" /> Days Listed
                            </div>
                            <div className="text-2xl font-bold text-slate-900">{p.daysOnMarket}</div>
                        </motion.div>
                    )}

                    {p.taxAssessedValue && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 }}
                            className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm"
                        >
                            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase mb-1">
                                <Banknote className="w-4 h-4" /> Tax Assessed
                            </div>
                            <div className="text-2xl font-bold text-slate-900">${(p.taxAssessedValue / 1000).toFixed(0)}k</div>
                        </motion.div>
                    )}

                    {p.zestimate && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm"
                        >
                            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase mb-1">
                                <BarChart3 className="w-4 h-4" /> Market Value
                            </div>
                            <div className="text-2xl font-bold text-slate-900">${(p.zestimate / 1000).toFixed(0)}k</div>
                        </motion.div>
                    )}

                    {formatLotArea() && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm"
                        >
                            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase mb-1">
                                <Ruler className="w-4 h-4" /> Lot Size
                            </div>
                            <div className="text-2xl font-bold text-slate-900">{formatLotArea()}</div>
                        </motion.div>
                    )}

                    {p.rentEstimate && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-sm"
                        >
                            <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold uppercase mb-1">
                                <DollarSign className="w-4 h-4" /> Rent Estimate
                            </div>
                            <div className="text-2xl font-bold text-emerald-700">${p.rentEstimate?.toLocaleString()}<span className="text-sm font-medium">/mo</span></div>
                        </motion.div>
                    )}

                    {p.type && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm"
                        >
                            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase mb-1">
                                <Home className="w-4 h-4" /> Type
                            </div>
                            <div className="text-lg font-bold text-slate-900 capitalize">{p.type?.replace(/_/g, ' ').toLowerCase()}</div>
                        </motion.div>
                    )}
                </div>

                {/* We Care Section */}
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl border border-indigo-100 p-8 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                    <div className="bg-white p-6 rounded-full shadow-xl shadow-indigo-100 shrink-0">
                        <HeartHandshake className="w-12 h-12 text-indigo-500" />
                    </div>
                    <div className="max-w-2xl">
                        <h3 className="text-2xl font-bold text-indigo-900 mb-2">More Than Just a Property</h3>
                        <p className="text-indigo-800/80 leading-relaxed text-lg">
                            We believe a home extends beyond its walls. That's why we help you explore the pulse of the community—from top-rated schools to essential emergency services. Your safety, well-being, and connection to the neighborhood matter to us.
                        </p>
                    </div>
                    <div className="md:ml-auto flex justify-center gap-6 shrink-0 mt-2 md:mt-0">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-indigo-900">4.9</div>
                            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Safety Score</div>
                        </div>
                        <div className="w-px bg-indigo-200"></div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-indigo-900">A+</div>
                            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Schools</div>
                        </div>
                    </div>
                </div>
                
                {/* Schools Section Moved After We Care - Conditional Render */}
                {parseSchools(p.rawData).length > 0 && (
                    <section className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-indigo-50 rounded-xl">
                                <GraduationCap className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Nearby Schools</h2>
                                <p className="text-slate-500 text-sm">Educational options and performance ratings in the area.</p>
                            </div>
                        </div>
                        <NearbySchools 
                            schools={parseSchools(p.rawData)} 
                        />
                    </section>
                )}

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Left Column: Deep Dive */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* Description */}
                        <div className="prose prose-slate max-w-none">
                            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-emerald-500" />
                                Property Overview
                            </h3>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                {p.description || "A stunning investment opportunity in a prime location. This property features modern amenities, spacious living areas, and strong rental potential. Perfect for investors seeking both cash flow and appreciation."}
                            </p>
                        </div>

                        {/* Amenities */}
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-6">Features & Amenities</h3>
                            <div className="flex flex-wrap gap-3">
                                {["Open Floor Plan", "Hardwood Floors", "Modern Kitchen", "Stainless Steel Appliances", "Central Heat/Air", "Large Backyard", "Parking", "Near Transit"].map((item, i) => (
                                    <span key={i} className="px-4 py-2 rounded-xl bg-slate-100/50 border border-slate-200 text-slate-600 text-sm font-medium hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors cursor-default">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <GatedSection
                            title="Haven AI Verdict Locked"
                            description="Sign in to access Haven's full AI investment analysis, cap rate, ROI, cash flow metrics and expert recommendations."
                        >
                        {/* AI Deep Analysis Card - Now First */}
                        <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-2xl">
                            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>

                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                    <Activity className="w-6 h-6 text-emerald-400" />
                                    Haven AI Verdict
                                </h3>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                                            <div className="text-sm text-emerald-400 font-bold uppercase tracking-widest mb-2">Recommendation</div>
                                            <div className="text-4xl font-black tracking-tight mb-2">
                                                {generateAIOpinion.recommendation || 'Running Analysis...'}
                                            </div>
                                            <div className="flex items-center gap-2 text-white/60 text-sm">
                                                <div className={`w-2 h-2 rounded-full ${generateAIOpinion.score >= 7 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                Confidence Score: <span className="text-white font-bold">{generateAIOpinion.score}/10</span>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            {generateAIOpinion.score >= 7 ? (
                                                <>
                                                    <div className="flex items-start gap-2 text-sm text-emerald-100/80">
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                                                        <span>Strong rental demand expected in this area (98% occupancy rate).</span>
                                                    </div>
                                                    <div className="flex items-start gap-2 text-sm text-emerald-100/80">
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                                                        <span>Turnkey property requiring minimal initial CapEx.</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex items-start gap-2 text-sm text-amber-100/80">
                                                    <Activity className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                                                    <span>Exercise caution due to potential market volatility.</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                            <div className="text-xs text-white/40 uppercase tracking-wider font-bold mb-1">Cap Rate</div>
                                            <div className="text-2xl font-bold text-emerald-400">{fin?.capRate?.toFixed(2)}%</div>
                                        </div>
                                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                            <div className="text-xs text-white/40 uppercase tracking-wider font-bold mb-1">Total ROI</div>
                                            <div className="text-2xl font-bold text-emerald-400">{fin?.roi5?.toFixed(1)}%</div>
                                        </div>
                                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                            <div className="text-xs text-white/40 uppercase tracking-wider font-bold mb-1">Cash Flow</div>
                                            <div className="text-xl font-bold text-white">${Math.round(fin?.monthlyCashFlow || 0).toLocaleString()}/mo</div>
                                        </div>
                                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                            <div className="text-xs text-white/40 uppercase tracking-wider font-bold mb-1">DSCR</div>
                                            {fin?.dscr != null ? (
                                                <>
                                                    <div className={`text-xl font-bold ${fin.dscr >= 1.25 ? 'text-emerald-400' : fin.dscr >= 1.0 ? 'text-amber-400' : 'text-red-400'}`}>
                                                        {fin.dscr.toFixed(2)}
                                                    </div>
                                                    <div className={`text-[10px] font-bold mt-1 uppercase tracking-wider ${fin.dscr >= 1.25 ? 'text-emerald-500/70' : fin.dscr >= 1.0 ? 'text-amber-500/70' : 'text-red-500/70'}`}>
                                                        {fin.dscr >= 1.25 ? 'Bankable' : fin.dscr >= 1.0 ? 'Tight' : 'High Risk'}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-xl font-bold text-white/40">N/A</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="mt-6 pt-4 border-t border-white/10 text-center">
                                <p className="text-[11px] text-white/40 leading-relaxed">
                                    Data provided by Haven AI.{" "}
                                    <a
                                        href="/terms"
                                        className="underline underline-offset-2 text-white/50 hover:text-white/70 transition-colors"
                                    >
                                        See our Disclaimer
                                    </a>{" "}
                                    for more info.
                                </p>
                            </div>
                        </div>
                        </GatedSection>

                        <GatedSection
                            title="Haven AI Locked"
                            description="Log in to view Haven AI's complete property analysis including strengths, concerns, price assessment and personalised investment recommendation."
                        >
                        {/* AI Detailed Opinion Section - Now Before Chart */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl border border-indigo-100 p-6 shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <Brain className="w-5 h-5 text-indigo-500" />
                                    Haven AI
                                </h3>
                                <button
                                    onClick={handleRefreshAnalysis}
                                    disabled={isRefreshing}
                                    className={`p-2 rounded-full transition-all ${isRefreshing ? 'bg-indigo-100 text-indigo-400' : 'bg-white hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 shadow-sm border border-slate-100'}`}
                                    title="Refresh Analysis"
                                >
                                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                                </button>
                            </div>

                            {/* Summary */}
                            <div className="bg-white/70 rounded-2xl p-5 mb-6 backdrop-blur-sm border border-white/50">
                                <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                                    {generateAIOpinion.summary}
                                </p>
                            </div>

                            {/* Price Assessment */}
                            {generateAIOpinion.priceAssessment && (
                                <div className="flex items-start gap-3 mb-6 bg-white/50 rounded-xl p-4 border border-indigo-100">
                                    <Target className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                                    <div>
                                        <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">Price Assessment</div>
                                        <div className="text-slate-700 font-medium">{generateAIOpinion.priceAssessment}</div>
                                    </div>
                                </div>
                            )}

                            <div className="grid md:grid-cols-2 gap-4 mb-6">
                                {/* Strengths */}
                                {generateAIOpinion.strengths.length > 0 && (
                                    <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100">
                                        <div className="flex items-center gap-2 mb-3">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                            <span className="text-sm font-bold text-emerald-700 uppercase tracking-wider">Strengths</span>
                                        </div>
                                        <ul className="space-y-2">
                                            {generateAIOpinion.strengths.map((strength: string, idx: number) => (
                                                <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                                                    <span className="text-emerald-500 mt-1">•</span>
                                                    {strength}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Concerns */}
                                {generateAIOpinion.concerns.length > 0 && (
                                    <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-100">
                                        <div className="flex items-center gap-2 mb-3">
                                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                                            <span className="text-sm font-bold text-amber-700 uppercase tracking-wider">Considerations</span>
                                        </div>
                                        <ul className="space-y-2">
                                            {generateAIOpinion.concerns.map((concern: string, idx: number) => (
                                                <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                                                    <span className="text-amber-500 mt-1">•</span>
                                                    {concern}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Recommendation Badge */}
                            <div className={`rounded-2xl p-4 border ${generateAIOpinion.score >= 7 ? 'bg-emerald-600 border-emerald-500' :
                                generateAIOpinion.score >= 5 ? 'bg-blue-600 border-blue-500' :
                                    generateAIOpinion.score >= 3 ? 'bg-amber-600 border-amber-500' :
                                        'bg-red-600 border-red-500'
                                }`}>
                                <div className="flex items-center gap-3">
                                    <MessageSquare className="w-6 h-6 text-white/80" />
                                    <div>
                                        <div className="text-xs font-bold text-white/70 uppercase tracking-wider">Haven AI Recommendation</div>
                                        <div className="text-white font-bold text-lg">{generateAIOpinion.recommendation}</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        </GatedSection>

                        {/* 10-Year Price Prediction Chart - Gemini Powered */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                                    10-Year Price Projection
                                </h3>
                                <div className="flex items-center gap-2">
                                    {aiProjections?.confidence && (
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${aiProjections.confidence === 'high' ? 'bg-emerald-100 text-emerald-700' :
                                            aiProjections.confidence === 'medium' ? 'bg-amber-100 text-amber-700' :
                                                'bg-slate-100 text-slate-600'
                                            }`}>
                                            {aiProjections.confidence} confidence
                                        </span>
                                    )}
                                    {aiProjections && (
                                        <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-indigo-50 text-indigo-600 uppercase tracking-wider">
                                            <Sparkles className="w-3 h-3" />
                                            Haven AI
                                        </span>
                                    )}
                                </div>
                            </div>
                            <p className="text-sm text-slate-500 mb-6">
                                {projectionLoading
                                    ? "Haven AI is generating predictions..."
                                    : aiProjections?.methodology
                                        ? aiProjections.methodology
                                        : `Estimated property value growth based on ${fin?.expectedAppreciation || 3.5}% annual appreciation`
                                }
                            </p>

                            <div className="h-[300px] w-full relative">
                                {projectionLoading && (
                                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-2xl">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="relative">
                                                <Sparkles className="w-8 h-8 text-indigo-500 animate-pulse" />
                                            </div>
                                            <span className="text-sm font-medium text-slate-500">Haven AI is analyzing market data...</span>
                                        </div>
                                    </div>
                                )}
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={predictionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={aiProjections ? "#6366f1" : "#10b981"} stopOpacity={0.3} />
                                                <stop offset="95%" stopColor={aiProjections ? "#6366f1" : "#10b981"} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis
                                            dataKey="year"
                                            stroke="#94a3b8"
                                            fontSize={12}
                                            tickFormatter={(value) => `Year ${value}`}
                                        />
                                        <YAxis
                                            stroke="#94a3b8"
                                            fontSize={12}
                                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#1e293b',
                                                border: 'none',
                                                borderRadius: '12px',
                                                color: 'white'
                                            }}
                                            formatter={(value) => [`$${Number(value || 0).toLocaleString()}`, aiProjections ? 'AI Predicted Value' : 'Projected Value']}
                                            labelFormatter={(label) => `Year ${label}`}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="price"
                                            stroke={aiProjections ? "#6366f1" : "#10b981"}
                                            strokeWidth={3}
                                            fill="url(#priceGradient)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 mt-6 pt-6 border-t border-slate-100 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                                <div className="text-center pt-4 sm:pt-0">
                                    <div className="text-2xl font-bold text-slate-900">
                                        ${(predictionData[5]?.price || 0).toLocaleString()}
                                    </div>
                                    <div className="text-xs text-slate-500 font-medium">5-Year Value</div>
                                </div>
                                <div className="text-center pt-4 sm:pt-0">
                                    <div className="text-2xl font-bold text-slate-900">
                                        ${(predictionData[10]?.price || 0).toLocaleString()}
                                    </div>
                                    <div className="text-xs text-slate-500 font-medium">10-Year Value</div>
                                </div>
                                <div className="text-center pt-4 sm:pt-0">
                                    <div className="text-2xl font-bold text-emerald-600">
                                        +{(predictionData[10]?.cumulativeReturn || 0).toFixed(1)}%
                                    </div>
                                    <div className="text-xs text-slate-500 font-medium">Total Return</div>
                                </div>
                            </div>

                            {aiProjections?.avgAppreciation && (
                                <div className="mt-4 text-center text-xs text-slate-400">
                                    Avg. predicted appreciation: <span className="font-semibold text-indigo-600">{aiProjections.avgAppreciation.toFixed(1)}%/yr</span>
                                </div>
                            )}
                        </motion.div>

                        {/* Property History & Schools Sections */}
                        <div className="space-y-12 pt-8">
                            <div className="grid grid-cols-1 gap-12">
                                {/* History Section - Conditional Render */}
                                {(parsePriceHistory(p.rawData).length > 0 || parseTaxHistory(p.rawData).length > 0) && (
                                    <section>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-slate-100 rounded-xl">
                                                <History className="w-6 h-6 text-slate-600" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-slate-900">Price & Tax History</h2>
                                                <p className="text-slate-500 text-sm">Review the financial trajectory and tax assessments.</p>
                                            </div>
                                        </div>
                                        <PropertyHistory 
                                            priceHistory={parsePriceHistory(p.rawData)} 
                                            taxHistory={parseTaxHistory(p.rawData)} 
                                        />
                                    </section>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Stats & Action */}
                    <div className="space-y-8 lg:sticky lg:top-24 h-fit">

                        {/* Contact Listing Agent / Broker - Dynamic */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-3xl p-6 text-white shadow-xl shadow-emerald-500/20"
                        >
                            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                                <HeartHandshake className="w-4 h-4" />
                                Pricing & Listing Details
                            </h4>

                            <div className="flex items-center gap-4 mb-5">
                                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                    <Building2 className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <div className="font-bold text-lg">{p.brokerName || "Listing Agent"}</div>
                                    <div className="text-emerald-100 text-sm">Listed by Broker</div>
                                    <div className="text-emerald-200/80 text-xs mt-0.5">Verified Source</div>
                                </div>
                            </div>

                            <div className="space-y-3 mb-5">
                                <a href="#" className="flex items-center gap-3 bg-white/10 hover:bg-white/20 rounded-xl p-3 transition-colors group cursor-not-allowed opacity-80">
                                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-emerald-200 uppercase tracking-wider">Contact</div>
                                        <div className="font-semibold text-sm">See Listing</div>
                                    </div>
                                </a>
                            </div>

                            {/* External Button Removed */}
                        </motion.div>

                        {/* Key Stats Card */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-6">
                            <h4 className="text-slate-900 font-bold mb-6 text-sm uppercase tracking-wider border-b border-slate-100 pb-4">Property Specs</h4>
                            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase">
                                        <BedDouble className="w-4 h-4" /> Bedrooms
                                    </div>
                                    <div className="text-2xl font-bold text-slate-900">{p.bedrooms}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase">
                                        <Bath className="w-4 h-4" /> Bathrooms
                                    </div>
                                    <div className="text-2xl font-bold text-slate-900">{p.bathrooms}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase">
                                        <Square className="w-4 h-4" /> Sq Ft
                                    </div>
                                    <div className="text-2xl font-bold text-slate-900">{p.sqft?.toLocaleString()}</div>
                                </div>
                                {p.yearBuilt && p.yearBuilt !== 'N/A' && (
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase">
                                            <Calendar className="w-4 h-4" /> Built
                                        </div>
                                        <div className="text-2xl font-bold text-slate-900">{p.yearBuilt}</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Financial Snapshot */}
                        <div className="bg-white rounded-3xl border border-emerald-100 shadow-xl shadow-emerald-500/5 p-6 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

                            <h4 className="text-emerald-900 font-bold mb-6 text-sm uppercase tracking-wider relative z-10">Projected Returns</h4>

                            <div className="space-y-4 relative z-10">
                                <div className="flex justify-between items-center p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100/50">
                                    <span className="text-sm font-medium text-emerald-800">Monthly Cash Flow</span>
                                    <span className="text-lg font-bold text-emerald-600">${Math.round(fin?.monthlyCashFlow || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100/50">
                                    <span className="text-sm font-medium text-emerald-800">Annual NOI</span>
                                    <span className="text-lg font-bold text-emerald-600">${Math.round(fin?.noiAnnual || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100/50">
                                    <span className="text-sm font-medium text-emerald-800">5-Year Appreciation</span>
                                    <span className="text-lg font-bold text-emerald-600">~{((1.04 ** 5 - 1) * 100).toFixed(0)}%</span>
                                </div>
                                {p.rentEstimate && (
                                    <div className="flex justify-between items-center p-3 rounded-2xl bg-blue-50/50 border border-blue-100/50">
                                        <span className="text-sm font-medium text-blue-800">Est. Market Rent</span>
                                        <span className="text-lg font-bold text-blue-600">${p.rentEstimate?.toLocaleString()}/mo</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Communication Agent - Restored functional integration */}
                        <AgentCommunication
                            leadId={lead.id}
                            title={p.streetAddress || p.address || lead.title}
                            price={p.price || lead.price || 0}
                            analysisId={lead.analysis?.id}
                        />

                    </div>
                </div>

                {/* Similar Properties Section at the end */}
                <SimilarProperties city={p.city} currentId={lead.id} />
            </div>

            {/* Fullscreen Gallery Modal */}
            {showGallery && p.images?.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                    onClick={() => setShowGallery(false)}
                >
                    {/* Close Button */}
                    <button
                        onClick={() => setShowGallery(false)}
                        className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    {/* Navigation Arrows */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImageIndex(prev => prev > 0 ? prev - 1 : p.images.length - 1);
                        }}
                        className="absolute left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <ChevronLeft className="w-10 h-10" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImageIndex(prev => prev < p.images.length - 1 ? prev + 1 : 0);
                        }}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <ChevronRight className="w-10 h-10" />
                    </button>

                    {/* Main Image */}
                    <div className="relative w-full max-w-5xl h-[80vh] mx-6" onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={p.images[selectedImageIndex]}
                            alt={`Gallery image ${selectedImageIndex + 1}`}
                            fill
                            className="object-contain"
                        />
                    </div>

                    {/* Thumbnail Strip */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto pb-2">
                        {p.images.map((img: string, idx: number) => (
                            <button
                                key={idx}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedImageIndex(idx);
                                }}
                                className={`relative flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden transition-all duration-200 ${selectedImageIndex === idx ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : 'opacity-50 hover:opacity-100'}`}
                            >
                                <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                            </button>
                        ))}
                    </div>

                    {/* Image Counter */}
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium">
                        {selectedImageIndex + 1} / {p.images.length}
                    </div>
                </motion.div>
            )}

            {/* Virtual Staging Modal */}
            <AnimatePresence>
                {isStagingModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setIsStagingModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-[#FDFBF7] rounded-3xl p-6 shadow-2xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <VirtualStaging
                                initialImage={p.images?.length > 0 ? p.images[selectedImageIndex] : p.mainImage}
                                onClose={() => setIsStagingModalOpen(false)}
                                propertyId={p.id}
                                leadId={lead.id}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}
