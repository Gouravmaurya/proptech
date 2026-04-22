"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Loader2, MapPin, Sparkles, SearchX, ChevronDown, SlidersHorizontal } from "lucide-react";
import CreativeLoader from "@/components/ui/CreativeLoader";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getRecentLeads, searchProperties, getUserPreferences, triggerBackgroundScout } from "@/app/actions/dashboard";
import { getSavedPropertyIds } from "@/app/actions/user";
import PropertyCard from "@/components/PropertyCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePropertyContext } from "@/components/providers/PropertyProvider";

const PRICE_OPTIONS = [
    { label: "Any Price", min: undefined, max: undefined },
    { label: "Under $300k", min: undefined, max: 300000 },
    { label: "$300k - $500k", min: 300000, max: 500000 },
    { label: "$500k - $800k", min: 500000, max: 800000 },
    { label: "Above $800k", min: 800000, max: undefined }
];

const PROPERTY_TYPES = [
    { label: "Any Type", value: "all" },
    { label: "Single Family", value: "SINGLE_FAMILY" },
    { label: "Condo", value: "CONDO" },
    { label: "Townhouse", value: "TOWNHOUSE" },
    { label: "Multi-Family", value: "MULTI_FAMILY" }
];

const ITEMS_PER_PAGE = 12;

interface PropertyFeedProps {
    searchQuery?: string;
    filters?: { minPrice?: number, maxPrice?: number, type?: string };
    onSearchStart?: () => void;
    onSearchEnd?: () => void;
}

export function PropertyFeed({ searchQuery, filters, onSearchStart, onSearchEnd }: PropertyFeedProps) {
    const { 
        cachedProperties, 
        lastQuery, 
        lastFilters, 
        hasInitialLoaded, 
        setCachedData, 
        setHasInitialLoaded
    } = usePropertyContext();


    const [savedIds, setSavedIds] = useState<string[]>([]);
    
    // Check if current search matches cached search
    const isSameSearch = useMemo(() => {
        return searchQuery === lastQuery && JSON.stringify(filters) === JSON.stringify(lastFilters);
    }, [searchQuery, lastQuery, filters, lastFilters]);

    const [loading, setLoading] = useState(!isSameSearch && (!hasInitialLoaded || !!searchQuery));
    const [searching, setSearching] = useState(false);
    // Tracks that a search is queued but the debounce hasn't fired yet.
    // This prevents the brief "no results" flash between query change and fetch start.
    const [pendingSearch, setPendingSearch] = useState(false);
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
    const [sortBy, setSortBy] = useState<string>("location");
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [priceFilter, setPriceFilter] = useState(PRICE_OPTIONS[0]);

    // De-bounce search
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    // Snapshot of cache length at effect-run time (avoids adding cachedProperties.length to deps).
    const cachedLengthRef = useRef(cachedProperties.length);
    cachedLengthRef.current = cachedProperties.length;

    // Reset visible count when properties change (e.g. new search)
    useEffect(() => {
        setVisibleCount(ITEMS_PER_PAGE);
    }, [cachedProperties]);

    const fetchProperties = useCallback(async (query?: string, fltrs?: PropertyFeedProps['filters']) => {
        try {
            if (query || fltrs?.minPrice !== undefined || fltrs?.maxPrice !== undefined || fltrs?.type) {
                setPendingSearch(false);
                setSearching(true);
                onSearchStart?.();

                console.log(`Searching with query "${query}" and filters:`, fltrs);
                const data = await searchProperties(query || "", fltrs);
                setCachedData(data, query || "", fltrs || {});
            } else {
                setLoading(true);
                const data = await getRecentLeads(50);
                setCachedData(data, "", {});
            }
        } catch (error) {
            console.error("Failed to fetch properties:", error);
        } finally {
            setLoading(false);
            setSearching(false);
            onSearchEnd?.();
        }
    }, [onSearchStart, onSearchEnd, setCachedData]);

    // Initial Load & Search Handler
    useEffect(() => {
        getSavedPropertyIds().then(setSavedIds).catch(console.error);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        // If we already have a match in the cache, don't re-fetch
        if (isSameSearch && cachedLengthRef.current > 0) {
            setLoading(false);
            setPendingSearch(false);
            return;
        }

        // Also don't re-fetch initial load if we already did it and there's no specific search
        const hasNoRequest = !searchQuery && !(filters?.minPrice !== undefined || filters?.maxPrice !== undefined || filters?.type);
        if (hasNoRequest && hasInitialLoaded && cachedLengthRef.current > 0) {
            setLoading(false);
            setPendingSearch(false);
            return;
        }

        // Flag immediately — suppresses stale card rendering during the debounce window.
        // Do NOT call clearCache() here: that mutates context and re-triggers this effect.
        if (searchQuery || filters?.minPrice !== undefined || filters?.maxPrice !== undefined || filters?.type) {
            setPendingSearch(true);
        }

        timeoutRef.current = setTimeout(async () => {
            const hasFilters = filters?.minPrice !== undefined || filters?.maxPrice !== undefined || filters?.type;
            if (searchQuery || hasFilters) {
                fetchProperties(searchQuery, filters);
            } else {
                setLoading(true);
                try {
                    const pref = await getUserPreferences();
                    if (pref?.location) {
                        console.log(`Using preferred location: "${pref.location}"`);

                        // Step 1: Search DB for existing data
                        await fetchProperties(pref.location);
                        
                        setHasInitialLoaded(true);

                        // Step 2: Silently trigger a background scout refresh
                        triggerBackgroundScout(pref.location).catch(console.error);
                    } else {
                        // No location preference set
                        setCachedData([], "", {});
                        setHasInitialLoaded(true);
                        setLoading(false);
                    }
                } catch (e) {
                    console.error("Error loading preferences:", e);
                    setCachedData([], "", {});
                    setHasInitialLoaded(true);
                    setLoading(false);
                }
            }
        }, 500);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [searchQuery, filters, fetchProperties, isSameSearch, hasInitialLoaded, setCachedData, setHasInitialLoaded]);

    // Sort and Filter Properties locally
    const sortedProperties = useMemo(() => {
        let items = [...cachedProperties];

        // ── DEDUPLICATION ──────────────────────────────────────────────────
        // Filter duplicates based on address string to ensure one card per house.
        // This addresses issues where the same property might have multiple IDs or source IDs.
        const seen = new Set();
        items = items.filter(p => {
            if (!p.streetAddress) return true;
            const addressKey = `${p.streetAddress}-${p.city}-${p.state}`.toLowerCase().replace(/\s+/g, '');
            if (seen.has(addressKey)) return false;
            seen.add(addressKey);
            return true;
        });
        // ──────────────────────────────────────────────────────────────────
        
        if (typeFilter !== "all" && typeFilter !== "") {
            items = items.filter(p => {
                const type = p.property?.type || p.homeType || "";
                const normalize = (s: string) => s.toLowerCase().replace(/[\s_-]+/g, "");
                return normalize(type) === normalize(typeFilter);
            });
        }
        
        if (priceFilter.min !== undefined) {
            items = items.filter(p => (p.price || 0) >= priceFilter.min!);
        }
        if (priceFilter.max !== undefined) {
            items = items.filter(p => (p.price || 0) <= priceFilter.max!);
        }
        
        return items.sort((a, b) => {
            if (sortBy === "price-asc") return (a.price || 0) - (b.price || 0);
            if (sortBy === "price-desc") return (b.price || 0) - (a.price || 0);
            if (sortBy === "date-desc") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            
            const locA = `${a.city || ''}, ${a.state || ''}`.toLowerCase();
            const locB = `${b.city || ''}, ${b.state || ''}`.toLowerCase();
            return locA.localeCompare(locB);
        });
    }, [cachedProperties, sortBy, typeFilter, priceFilter]);

    const visibleProperties = sortedProperties.slice(0, visibleCount);
    const hasMore = visibleCount < sortedProperties.length;
    const remainingCount = sortedProperties.length - visibleCount;

    const hasFilters = useMemo(() => {
        return filters?.minPrice !== undefined || filters?.maxPrice !== undefined || filters?.type;
    }, [filters]);

    const filterDescription = useMemo(() => {
        const parts = [];
        if (filters?.type) parts.push(filters.type);
        if (filters?.minPrice !== undefined && filters?.maxPrice !== undefined) {
            parts.push(`$${filters.minPrice / 1000}k-$${filters.maxPrice / 1000}k`);
        } else if (filters?.minPrice !== undefined) {
            parts.push(`Above $${filters.minPrice / 1000}k`);
        } else if (filters?.maxPrice !== undefined) {
            parts.push(`Under $${filters.maxPrice / 1000}k`);
        }
        return parts.length > 0 ? ` (${parts.join(", ")})` : "";
    }, [filters]);

    // Show loader on initial load
    if (loading && cachedProperties.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <CreativeLoader type="scout" />
            </div>
        );
    }

    // pendingSearch = debounce window; searching = fetch in-flight.
    // Both suppress stale cards from a previous search without touching the cache.
    if (pendingSearch || searching) {
        return (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <CreativeLoader type="scout" />
            </div>
        );
    }

    // Only show "no results" when we are truly done loading (not pending, not searching)
    if (cachedProperties.length === 0 && (searchQuery || hasFilters) && !pendingSearch && !searching) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <SearchX className="w-8 h-8 text-slate-400 mb-3" />
                <p className="text-sm font-medium text-slate-500">
                    {searchQuery 
                        ? `No properties found for "${searchQuery}"${filterDescription}`
                        : `No properties found matching filters${filterDescription}`
                    }
                </p>
                <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or location</p>
            </div>
        );
    }

    if (cachedProperties.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-28 text-center bg-white rounded-3xl border border-dashed border-stone-200 shadow-sm"
            >
                <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-6">
                    <Sparkles className="w-9 h-9 text-emerald-700" />
                </div>
                <h3 className="font-heading text-2xl text-zinc-900 mb-2">Welcome to Haven!</h3>
                <p className="text-sm text-stone-500 max-w-sm">
                    Begin your property search by entering a <span className="font-semibold text-emerald-800">city</span> and selecting a <span className="font-semibold text-emerald-800">state</span> in the search bar above.
                </p>
            </motion.div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    {searchQuery ? `Results for "${searchQuery}"` : 'Latest Opportunities'}
                    {loading && <Loader2 className="w-4 h-4 animate-spin text-emerald-500 ml-2" />}
                </h3>
                
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    <div className="w-36">
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="h-8 text-xs border-slate-200/50 bg-white/90 shadow-sm rounded-lg hover:bg-slate-50 transition-colors">
                                <SelectValue placeholder="Property Type" />
                            </SelectTrigger>
                            <SelectContent className="backdrop-blur-xl">
                                {PROPERTY_TYPES.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="w-36">
                        <Select value={priceFilter.label} onValueChange={(val) => setPriceFilter(PRICE_OPTIONS.find(o => o.label === val) || PRICE_OPTIONS[0])}>
                            <SelectTrigger className="h-8 text-xs border-slate-200/50 bg-white/90 shadow-sm rounded-lg hover:bg-slate-50 transition-colors">
                                <SelectValue placeholder="Price Range" />
                            </SelectTrigger>
                            <SelectContent className="backdrop-blur-xl">
                                {PRICE_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.label} value={opt.label}>{opt.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="h-4 w-px bg-slate-200 hidden sm:block" />

                    {/* Sorting Select */}
                    <div className="w-44">
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="h-8 text-xs border-slate-200/50 bg-white/90 shadow-sm rounded-lg hover:bg-slate-50 transition-colors">
                                <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                                <SelectValue placeholder="Sort By" />
                            </SelectTrigger>
                            <SelectContent className="backdrop-blur-xl">
                                <SelectItem value="location">Location (A-Z)</SelectItem>
                                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                                <SelectItem value="date-desc">Newest Added</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Masonry Grid */}
            {sortedProperties.length === 0 && cachedProperties.length > 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-slate-400 bg-white rounded-2xl border border-slate-100 shadow-sm mt-8">
                    <SearchX className="w-8 h-8 text-slate-400 mb-3" />
                    <p className="text-sm font-medium text-slate-500">No properties match your selected filters.</p>
                    <button 
                        onClick={() => {
                            setTypeFilter("all");
                            setPriceFilter(PRICE_OPTIONS[0]);
                        }}
                        className="mt-4 px-4 py-2 bg-emerald-50 text-emerald-700 font-semibold text-sm rounded-full hover:bg-emerald-100 transition-colors"
                    >
                        Clear Filters
                    </button>
                </div>
            ) : (
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 px-0 md:px-12 mt-6">
                    <AnimatePresence>
                        {visibleProperties.map((property, index) => (
                            <div
                                key={property.zpid || `property-${index}`}
                                className="break-inside-avoid mb-6"
                            >
                                <PropertyCard
                                    property={property}
                                    index={index}
                                    href={`/properties/${property.zpid}`}
                                    initialSaved={savedIds.includes(property.id)}
                                />
                            </div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Show More Button */}
            {hasMore && (
                <motion.div
                    className="flex justify-center pt-4 pb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <button
                        onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
                        className="group flex items-center gap-2 px-8 py-3.5 bg-white border border-stone-200 text-stone-700 rounded-2xl font-semibold text-sm hover:bg-stone-50 hover:border-emerald-200 hover:text-emerald-800 transition-all duration-300 shadow-sm hover:shadow-md active:scale-[0.98]"
                    >
                        <span>Show More</span>
                        <span className="text-xs font-normal text-stone-400 group-hover:text-emerald-600 transition-colors">
                            ({remainingCount} remaining)
                        </span>
                        <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                    </button>
                </motion.div>
            )}
        </div>
    );
}
