"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface PropertyFilters {
    minPrice?: number;
    maxPrice?: number;
    type?: string;
}

interface PropertyContextType {
    cachedProperties: any[];
    lastQuery: string;
    lastFilters: PropertyFilters;
    hasInitialLoaded: boolean;
    setCachedData: (properties: any[], query: string, filters: PropertyFilters) => void;
    setHasInitialLoaded: (loaded: boolean) => void;
    clearCache: () => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export function PropertyProvider({ children }: { children: ReactNode }) {
    const [cachedProperties, setCachedProperties] = useState<any[]>([]);
    const [lastQuery, setLastQuery] = useState<string>("");
    const [lastFilters, setLastFilters] = useState<PropertyFilters>({});
    const [hasInitialLoaded, setHasInitialLoaded] = useState<boolean>(false);

    const setCachedData = useCallback((properties: any[], query: string, filters: PropertyFilters) => {
        setCachedProperties(properties);
        setLastQuery(query);
        setLastFilters(filters);
    }, []);

    const clearCache = useCallback(() => {
        setCachedProperties([]);
        setLastQuery("");
        setLastFilters({});
        setHasInitialLoaded(false);
    }, []);

    return (
        <PropertyContext.Provider
            value={{
                cachedProperties,
                lastQuery,
                lastFilters,
                hasInitialLoaded,
                setCachedData,
                setHasInitialLoaded,
                clearCache,
            }}
        >
            {children}
        </PropertyContext.Provider>
    );
}

export function usePropertyContext() {
    const context = useContext(PropertyContext);
    if (context === undefined) {
        throw new Error("usePropertyContext must be used within a PropertyProvider");
    }
    return context;
}
