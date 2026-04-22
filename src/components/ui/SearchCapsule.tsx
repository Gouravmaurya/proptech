"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Check, TrendingUp } from "lucide-react";
import { US_STATES } from "@/lib/constants";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface SearchCapsuleProps {
    onSearch: (city: string, state: string, filters: { minPrice?: number, maxPrice?: number, type?: string }) => void;
    isHeroLayout?: boolean;
}



export default function SearchCapsule({ onSearch, isHeroLayout = true }: SearchCapsuleProps) {
    const [city, setCity] = useState("");
    const [state, setState] = useState("");

    const handleSearch = () => {
        if (city.trim() || state.trim()) {
            onSearch(city.trim(), state.trim(), {});
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
                type: "spring",
                stiffness: 100,
                damping: 20,
                delay: 0.1 
            }}
            className={`relative w-full mx-auto px-4 sm:px-0 transition-all duration-300 ease-in-out ${isHeroLayout ? "max-w-4xl" : "max-w-5xl"}`}
        >
            <div className="relative bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl lg:rounded-full p-2 lg:p-1.5 flex flex-col lg:flex-row items-center transition-shadow hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] gap-1 lg:gap-0">
                
                {/* Location Input Section */}
                <div 
                    onClick={() => document.getElementById("target-market-input")?.focus()}
                    className="flex-[1.5] flex items-center w-full px-6 py-3 lg:py-2 hover:bg-slate-50/80 rounded-2xl lg:rounded-l-full lg:rounded-r-none transition-colors cursor-text"
                >
                    <div className="flex-1">
                        <label className="block text-[11px] font-semibold text-slate-500 tracking-wide mb-0.5">Location</label>
                        <input
                            id="target-market-input"
                            type="text"
                            placeholder="City, neighborhood, or zip"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full bg-transparent text-slate-900 font-medium text-base placeholder:text-slate-400 focus:outline-none selection:bg-slate-100"
                        />
                    </div>
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-[1px] h-10 bg-slate-200" />

                {/* Custom State Dropdown Section */}
                <div className="w-full lg:w-56 px-6 py-2 hover:bg-slate-50/80 rounded-2xl lg:rounded-none transition-colors cursor-pointer relative z-50">
                    <label className="block text-[11px] font-semibold text-slate-500 tracking-wide mb-0.5">State</label>
                    <Select value={state || "all"} onValueChange={(val) => setState(val === "all" ? "" : val)}>
                        <SelectTrigger className="w-full flex items-center justify-between bg-transparent text-slate-900 font-medium text-base focus:outline-none py-1 h-auto border-0 shadow-none px-0 [&>span]:text-slate-900 focus:ring-0">
                            <SelectValue placeholder="All States" />
                        </SelectTrigger>
                        <SelectContent className="max-h-72">
                            <SelectItem value="all">All States</SelectItem>
                            {US_STATES.map((s) => (
                                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Search Button Section */}
                <div className="w-full lg:w-auto p-1 flex items-center">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSearch}
                        className="w-full lg:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-slate-900 text-white font-semibold rounded-2xl lg:rounded-full hover:bg-slate-800 transition-colors shadow-sm"
                    >
                        <Search className="w-4 h-4 text-slate-300" />
                        <span className="tracking-wide text-sm">Search</span>
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
