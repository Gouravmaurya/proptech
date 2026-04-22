"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Building2, TrendingUp, Users, MapPin, Search } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const steps = [
    {
        id: "intent",
        title: "What is your primary goal?",
        subtitle: "We'll customize your experience based on your intent.",
        type: "select",
        options: [
            { id: "buy_live", label: "Buying a Home to Live In", icon: HomeIcon },
            { id: "invest", label: "Investing in Property", icon: TrendingUp },
            { id: "rent", label: "Renting a Property", icon: Users },
        ]
    },
    {
        id: "property_type",
        title: "What properties are you interested in?",
        subtitle: "Select all that apply.",
        type: "multiselect",
        options: [
            { id: "SINGLE_FAMILY", label: "Single Family", icon: HomeIcon },
            { id: "CONDO", label: "Condo", icon: Building2 },
            { id: "TOWNHOUSE", label: "Townhouse", icon: Building2 },
            { id: "MULTI_FAMILY", label: "Multi-Family", icon: Users },
        ]
    },
    {
        id: "budget",
        title: "What is your investment budget?",
        subtitle: "Select all ranges that fit your criteria.",
        type: "multiselect",
        options: [
            { id: "under_200k", label: "Under $200k", icon: TrendingUp },
            { id: "200k_500k", label: "$200k - $500k", icon: TrendingUp },
            { id: "500k_1m", label: "$500k - $1M", icon: TrendingUp },
            { id: "over_1m", label: "$1M+", icon: TrendingUp },
        ]
    },
    {
        id: "location",
        title: "Where are you looking?",
        subtitle: "Enter a city, state, or location (e.g., Austin, TX).",
        type: "text"
    }
];

function HomeIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
    )
}

export default function OnboardingPage() {
    const router = useRouter();
    const { update } = useSession();
    const [currentStep, setCurrentStep] = useState(0);
    const [selections, setSelections] = useState<Record<string, any>>({});
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSelect = (optionId: string) => {
        setSelections(prev => ({ ...prev, [steps[currentStep].id]: optionId }));
    };

    const handleToggleMulti = (optionId: string) => {
        setSelections(prev => {
            const stepId = steps[currentStep].id;
            const currentArray = Array.isArray(prev[stepId]) ? prev[stepId] : [];
            const isSelected = currentArray.includes(optionId);

            if (isSelected) {
                return { ...prev, [stepId]: currentArray.filter((id: string) => id !== optionId) };
            } else {
                return { ...prev, [stepId]: [...currentArray, optionId] };
            }
        });
    };

    const isStepComplete = () => {
        const stepData = steps[currentStep];
        if (stepData.type === "predictive_location") {
            return selections["city"]?.trim().length > 0 && selections["state"]?.trim().length > 0;
        }
        if (stepData.type === "multiselect") {
            return Array.isArray(selections[stepData.id]) && selections[stepData.id].length > 0;
        }
        return !!selections[stepData.id];
    };

    const handleNext = async () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            // Finish
            try {
                // 1. Save to DB
                const res = await fetch("/api/onboarding/complete", {
                    method: "POST",
                    body: JSON.stringify(selections)
                });

                if (!res.ok) throw new Error("Failed to save profile");

                // 2. Refresh Session
                await update({ onboardingCompleted: true });

                // 3. Redirect directly to dashboard
                router.push(`/dashboard`);
                router.refresh();
            } catch (err) {
                console.error(err);
                alert("Something went wrong. Please try again.");
            }
        }
    };

    const stepData = steps[currentStep];

    if (!mounted) {
        return <div className="min-h-screen bg-white" />;
    }

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col items-center justify-center p-6 selection:bg-emerald-100 selection:text-emerald-900">

            {/* Progress Bar */}
            <div className="w-full max-w-md mb-12">
                <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-emerald-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
                <div className="flex justify-between items-center mt-2">
                    <button
                        onClick={() => {
                            if (currentStep > 0) setCurrentStep(c => c - 1);
                        }}
                        className={`text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors ${currentStep === 0 ? "opacity-0 pointer-events-none" : ""}`}
                    >
                        Back
                    </button>
                    <p className="text-xs font-semibold text-slate-400">Step {currentStep + 1} of {steps.length}</p>
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-md text-center"
                >
                    <h1 className="text-3xl font-bold mb-3 text-slate-900 tracking-tight">{stepData.title}</h1>
                    <p className="text-slate-500 mb-8 font-medium">{stepData.subtitle}</p>

                    <div className="space-y-3">
                        {stepData.type === "select" && stepData.options?.map((option) => {
                            const isSelected = selections[stepData.id] === option.id;
                            const IconComponent = option.icon;

                            return (
                                <button
                                    key={option.id}
                                    onClick={() => handleSelect(option.id)}
                                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 group ${isSelected
                                        ? "border-emerald-600 bg-emerald-50/50"
                                        : "border-slate-100 hover:border-emerald-200 hover:bg-slate-50"
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isSelected ? "bg-emerald-100" : "bg-white border border-slate-200 group-hover:border-emerald-200"
                                            }`}>
                                            <IconComponent className={`w-5 h-5 ${isSelected ? "text-emerald-600" : "text-slate-400 group-hover:text-emerald-500"}`} />
                                        </div>
                                        <span className={`font-semibold ${isSelected ? "text-slate-900" : "text-slate-600"}`}>
                                            {option.label}
                                        </span>
                                    </div>
                                    {isSelected && (
                                        <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center">
                                            <Check className="w-3.5 h-3.5 text-white" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}

                        {stepData.type === "multiselect" && stepData.options?.map((option) => {
                            const currentArray = Array.isArray(selections[stepData.id]) ? selections[stepData.id] : [];
                            const isSelected = currentArray.includes(option.id);
                            const IconComponent = option.icon;

                            return (
                                <button
                                    key={option.id}
                                    onClick={() => handleToggleMulti(option.id)}
                                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 group ${isSelected
                                        ? "border-emerald-600 bg-emerald-50/50"
                                        : "border-slate-100 hover:border-emerald-200 hover:bg-slate-50"
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isSelected ? "bg-emerald-100" : "bg-white border border-slate-200 group-hover:border-emerald-200"
                                            }`}>
                                            <IconComponent className={`w-5 h-5 ${isSelected ? "text-emerald-600" : "text-slate-400 group-hover:text-emerald-500"}`} />
                                        </div>
                                        <span className={`font-semibold ${isSelected ? "text-slate-900" : "text-slate-600"}`}>
                                            {option.label}
                                        </span>
                                    </div>
                                    <div className={`w-6 h-6 rounded flex items-center justify-center border-2 transition-colors ${isSelected ? "bg-emerald-600 border-emerald-600" : "border-slate-300 group-hover:border-emerald-400"}`}>
                                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                </button>
                            );
                        })}

                        {stepData.type === "text" && (
                            <div className="flex flex-col gap-4 text-left">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={selections[stepData.id] || ""}
                                        onChange={(e) => setSelections(prev => ({ ...prev, [stepData.id]: e.target.value }))}
                                        placeholder="e.g. Austin, TX"
                                        className="w-full pl-11 pr-4 py-4 text-lg font-medium border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none transition-all placeholder:text-slate-300"
                                        autoFocus
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={!isStepComplete()}
                        className="mt-10 inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-slate-900 text-white font-semibold rounded-full hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20 w-full md:w-auto"
                    >
                        {currentStep === steps.length - 1 ? "Complete Setup" : "Continue"}
                        <ArrowRight className="w-4 h-4" />
                    </button>

                </motion.div>
            </AnimatePresence>
        </div>
    );
}
