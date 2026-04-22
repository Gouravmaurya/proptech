"use client";

import { useState } from "react";
import { Search, Filter, Map, List, BedDouble, Bath, Square, ArrowUpRight } from "lucide-react";
import Image from "next/image";

// Placeholder Mock Data
const MOCK_PROPERTIES = [
    {
        id: "1",
        title: "Modern Duplex",
        address: "1243 Maple Ave, Austin, TX",
        price: 450000,
        beds: 4,
        baths: 3,
        sqft: 2200,
        type: "Multi-Family",
        image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80",
        capRate: 7.2,
        roi: 12.5
    },
    {
        id: "2",
        title: "Downtown Condo",
        address: "888 Congress Ave, Austin, TX",
        price: 620000,
        beds: 2,
        baths: 2,
        sqft: 1100,
        type: "Condo",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
        capRate: 5.8,
        roi: 9.1
    },
    {
        id: "3",
        title: "Suburban Fixer-Upper",
        address: "42 Oak Lane, Round Rock, TX",
        price: 285000,
        beds: 3,
        baths: 2,
        sqft: 1800,
        type: "Single Family",
        image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
        capRate: 8.5,
        roi: 18.2
    },
    {
        id: "4",
        title: "Luxury Hillside Estate",
        address: "900 Skyline Dr, West Lake, TX",
        price: 1500000,
        beds: 5,
        baths: 4.5,
        sqft: 4200,
        type: "Single Family",
        image: "https://images.unsplash.com/photo-1600596542815-2495db9dc2c3?auto=format&fit=crop&w=800&q=80",
        capRate: 4.2,
        roi: 6.5
    },
];

export default function PropertiesPage() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    return (
        <div className="space-y-6">

            {/* Header & Search */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Property Search</h1>
                    <p className="text-slate-500 text-sm">Find and analyze potential investment opportunities.</p>
                </div>

                <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
                    >
                        <Map className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by city, zip, or address..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium whitespace-nowrap">
                        <Filter className="w-4 h-4" /> Price Range
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium whitespace-nowrap">
                        Property Type
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium whitespace-nowrap">
                        Beds & Baths
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-sm font-medium shadow-lg shadow-emerald-500/20 whitespace-nowrap ml-auto">
                        Search
                    </button>
                </div>
            </div>

            {/* Results Grid */}
            <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
                {MOCK_PROPERTIES.map((property) => (
                    <div key={property.id} className={`bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group ${viewMode === "list" ? "flex flex-row" : "flex-col"}`}>

                        {/* Image */}
                        <div className={`relative overflow-hidden ${viewMode === "list" ? "w-64 shrink-0" : "aspect-[4/3] w-full"}`}>
                            <Image
                                src={property.image}
                                alt={property.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-slate-900 shadow-sm">
                                {property.type}
                            </div>
                            {/* Floating AI metrics */}
                            <div className="absolute bottom-3 left-3 flex gap-2">
                                <div className="bg-emerald-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm">
                                    {property.capRate}% Cap
                                </div>
                                <div className="bg-slate-900/80 backdrop-blur text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-sm">
                                    {property.roi}% ROI
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 flex flex-col flex-1">
                            <div className="mb-2">
                                <h3 className="font-bold text-slate-900 text-lg group-hover:text-emerald-600 transition-colors truncate">{property.title}</h3>
                                <p className="text-slate-500 text-sm truncate">{property.address}</p>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-slate-600 mb-4 font-medium">
                                <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5" /> {property.beds} Beds</span>
                                <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {property.baths} Baths</span>
                                <span className="flex items-center gap-1"><Square className="w-3.5 h-3.5" /> {property.sqft.toLocaleString()} sqft</span>
                            </div>

                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                                <span className="text-xl font-bold text-slate-900">${property.price.toLocaleString()}</span>
                                <button className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                                    <ArrowUpRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
