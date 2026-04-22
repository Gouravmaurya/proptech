"use client";

import { useState, useActionState, useEffect } from "react";
import { User } from "next-auth";
import { updateUserPreferences } from "@/app/actions/user";
import { motion, AnimatePresence } from "framer-motion";
import {
    User as UserIcon,
    MapPin,
    Bell,
    Shield,
    CreditCard,
    LogOut,
    Camera,
    Loader2,
    CheckCircle2,
    Zap,
    Target,
    Settings as SettingsIcon
} from "lucide-react";

interface SettingsClientProps {
    user: User & { preferences?: string | null };
}

export default function SettingsClient({ user }: SettingsClientProps) {
    const [activeTab, setActiveTab] = useState("profile");
    const [isUploading, setIsUploading] = useState(false);

    // Parse initial preferences
    const initialPrefs = (() => {
        try {
            return user?.preferences ? JSON.parse(user.preferences) : {};
        } catch {
            return {};
        }
    })();

    const [state, formAction, isPending] = useActionState(updateUserPreferences, null);

    // Track location locally to fix the "previous location" showing bug
    const [locationInput, setLocationInput] = useState(initialPrefs.location || "");

    // Sync local state when user prop updates (after server action revalidation)
    useEffect(() => {
        if (user.preferences) {
            try {
                const updatedPrefs = JSON.parse(user.preferences);
                if (updatedPrefs.location) {
                    setLocationInput(updatedPrefs.location);
                }
            } catch (e) {
                console.error("Failed to parse updated preferences", e);
            }
        }
    }, [user.preferences]);

    const tabs = [
        { id: "profile", label: "Profile", icon: UserIcon },
        { id: "preferences", label: "Preferences", icon: Target },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "security", label: "Security", icon: Shield },
    ];

    return (
        <div className="relative min-h-[calc(100vh-100px)] p-6 md:p-10 overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto relative z-10"
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex items-center gap-3 text-emerald-600 font-medium mb-2"
                        >
                            <SettingsIcon className="w-4 h-4" />
                            <span className="text-sm uppercase tracking-wider">Account Settings</span>
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 tracking-tight">
                            Personalize Your <span className="text-emerald-700 italic">Haven</span>
                        </h1>
                        <p className="text-slate-500 mt-2 text-lg">Manage your identity, preferences, and data security.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 items-start">
                    {/* Glass Side Nav */}
                    <div className="flex flex-col gap-2 p-2 bg-white/40 backdrop-blur-xl rounded-3xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.05)] sticky top-24">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group
                                        ${isActive
                                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                                            : "text-slate-600 hover:bg-white/60 hover:text-emerald-700"}
                                    `}
                                >
                                    <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? "" : "group-hover:scale-110"}`} />
                                    <span className="font-medium">{tab.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTabIndicator"
                                            className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                                        />
                                    )}
                                </button>
                            );
                        })}

                        <div className="mt-6 pt-6 border-t border-slate-200/50">
                            <form action={async () => {
                                const { signOut } = await import("@/auth");
                                await signOut({ redirectTo: "/login" });
                            }}>
                                <button
                                    type="submit"
                                    className="flex items-center gap-3 px-4 py-3 rounded-2xl w-full text-red-500 hover:bg-red-50 transition-colors group"
                                >
                                    <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    <span className="font-medium">Sign Out</span>
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="min-h-[500px]">
                        <AnimatePresence mode="wait">
                            {activeTab === "profile" && (
                                <motion.div
                                    key="profile"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    {/* Profile Banner/Card */}
                                    <div className="relative group overflow-hidden bg-white/60 backdrop-blur-xl rounded-[32px] border border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8">
                                        <div className="absolute top-0 right-0 p-8">
                                            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                                                <Zap className="w-6 h-6 fill-current" />
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:flex-row items-center gap-8">
                                            <div className="relative">
                                                <div className="h-32 w-32 rounded-[40px] overflow-hidden bg-emerald-50 border-4 border-white shadow-2xl relative group-hover:scale-105 transition-transform duration-500">
                                                    {user?.image ? (
                                                        <img src={user.image} alt={user.name || "User"} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-4xl font-serif text-emerald-700">
                                                            {user?.name?.[0] || user?.email?.[0] || "?"}
                                                        </div>
                                                    )}

                                                    {isUploading && (
                                                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                                                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                                                        </div>
                                                    )}
                                                </div>

                                                <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 p-3 bg-white rounded-2xl shadow-xl border border-slate-100 cursor-pointer text-slate-600 hover:text-emerald-600 transition-colors hover:scale-110 active:scale-95 duration-200">
                                                    <Camera className="w-5 h-5" />
                                                    <input
                                                        type="file"
                                                        id="avatar-upload"
                                                        className="hidden"
                                                        accept="image/*"
                                                        disabled={isUploading}
                                                        onChange={async (e) => {
                                                            const file = e.target.files?.[0];
                                                            if (!file) return;
                                                            setIsUploading(true);
                                                            const formData = new FormData();
                                                            formData.append("image", file);
                                                            const { uploadProfileImage } = await import("@/app/actions/user");
                                                            await uploadProfileImage(formData);
                                                            window.location.reload();
                                                        }}
                                                    />
                                                </label>
                                            </div>

                                            <div className="text-center md:text-left">
                                                <h2 className="text-3xl font-serif font-bold text-slate-900 mb-1">{user?.name || "Member"}</h2>
                                                <p className="text-slate-500 font-medium mb-4">{user?.email}</p>
                                                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                                    <span className="px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold border border-emerald-100/50">Beta Collector</span>
                                                    <span className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold border border-blue-100/50">Verified Investor</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Personal Info Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/50 shadow-sm space-y-4">
                                            <div className="flex items-center gap-3 text-slate-900 font-semibold">
                                                <UserIcon className="w-5 h-5 text-emerald-600" />
                                                Full Name
                                            </div>
                                            <input disabled value={user?.name || ""} className="w-full h-12 px-4 bg-white/50 border border-slate-200 rounded-2xl text-slate-500 cursor-not-allowed" />
                                        </div>
                                        <div className="bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/50 shadow-sm space-y-4">
                                            <div className="flex items-center gap-3 text-slate-900 font-semibold">
                                                <Bell className="w-5 h-5 text-emerald-600" />
                                                Primary Email
                                            </div>
                                            <input disabled value={user?.email || ""} className="w-full h-12 px-4 bg-white/50 border border-slate-200 rounded-2xl text-slate-500 cursor-not-allowed" />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "preferences" && (
                                <motion.div
                                    key="preferences"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="bg-white/60 backdrop-blur-xl rounded-[32px] border border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-6 md:p-10 mt-2">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                                                <Target className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-serif font-bold text-slate-900">Search Preferences</h3>
                                                <p className="text-slate-500">Fine-tune how Haven finds properties for you.</p>
                                            </div>
                                        </div>

                                        <form action={formAction} className="space-y-8">
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <label htmlFor="location" className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                                        <MapPin className="w-5 h-5 text-emerald-600" />
                                                        Preferred Location
                                                    </label>
                                                    {state?.success && (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium"
                                                        >
                                                            <CheckCircle2 className="w-4 h-4" />
                                                            Saved successfully
                                                        </motion.div>
                                                    )}
                                                </div>

                                                <div className="relative group">
                                                    <input
                                                        type="text"
                                                        id="location"
                                                        name="location"
                                                        value={locationInput}
                                                        onChange={(e) => setLocationInput(e.target.value)}
                                                        placeholder="City, State or Region"
                                                        className="w-full h-16 pl-6 pr-16 bg-white border border-slate-200 rounded-3xl text-lg font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm group-hover:border-emerald-300"
                                                    />
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                                                        <MapPin className="w-5 h-5" />
                                                    </div>
                                                </div>
                                                <p className="text-sm text-slate-500 leading-relaxed px-2">
                                                    This location serves as the default anchor for our AI agents when searching for new off-market opportunities. Use broad regions like "Austin, TX" or specific neighborhoods.
                                                </p>
                                            </div>

                                            <div className="pt-4">
                                                <button
                                                    type="submit"
                                                    disabled={isPending}
                                                    className="relative overflow-hidden group w-full md:w-auto px-10 py-4 bg-slate-900 text-white rounded-[24px] font-bold text-lg hover:shadow-2xl hover:shadow-slate-200 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3"
                                                >
                                                    {isPending ? (
                                                        <>
                                                            <Loader2 className="w-5 h-5 animate-spin" />
                                                            <span>Saving Preferences...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>Save Preferences</span>
                                                            <CheckCircle2 className="w-5 h-5 scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all" />
                                                        </>
                                                    )}
                                                </button>
                                            </div>

                                            {state?.message && !state.success && (
                                                <motion.p
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="text-red-500 text-center font-medium"
                                                >
                                                    {state.message}
                                                </motion.p>
                                            )}
                                        </form>
                                    </div>
                                </motion.div>
                            )}

                            {(activeTab === "notifications" || activeTab === "security") && (
                                <motion.div
                                    key="placeholder"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col items-center justify-center h-full p-12 bg-white/40 backdrop-blur-md rounded-[32px] border border-white/50 border-dashed"
                                >
                                    <div className="w-20 h-20 rounded-[28px] bg-slate-50 flex items-center justify-center text-slate-300 mb-4">
                                        <SettingsIcon className="w-10 h-10" />
                                    </div>
                                    <h4 className="text-xl font-serif font-bold text-slate-900">Coming Soon</h4>
                                    <p className="text-slate-500 text-center max-w-xs mt-2">Enhanced {activeTab} controls are being developed for the next major haven update.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
